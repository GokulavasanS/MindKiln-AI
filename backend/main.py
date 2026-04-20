"""MindKiln AI – FastAPI backend.

Stage 2: AI Execution Coach with auth, MongoDB, and plan tracking.
"""

import os
from datetime import datetime, timezone

import uvicorn
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Path, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.database import Database

from auth import get_current_user, router as auth_router
from database import _ensure_indexes, get_db
from models.schemas import (
    ExecutionPlan,
    GoalRequest,
    PlanDetail,
    PlanSummary,
    StepUpdateRequest,
)
from services.ai_service import generate_plan

load_dotenv()

app = FastAPI(
    title="MindKiln AI",
    description="Turn messy thoughts into clear execution.",
    version="2.0.0",
)

# CORS must be added first so it wraps all responses (including errors)
cors_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
if cors_origins_raw == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    _ensure_indexes()


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch unhandled errors; HTTPException is handled by FastAPI separately."""
    from fastapi import HTTPException as FastAPIHTTPException
    if isinstance(exc, FastAPIHTTPException):
        raise exc
    print(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error. Check server logs."},
    )

# Auth routes
app.include_router(auth_router)


@app.get("/health")
def health():
    # Return more info to help debug
    return {
        "status": "ok",
        "message": "MindKiln AI Backend is running",
        "api_key_configured": bool(os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")),
    }


@app.post("/generate-plan", response_model=ExecutionPlan, status_code=status.HTTP_201_CREATED)
def generate_plan_endpoint(
    body: GoalRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> ExecutionPlan:
    """Generate a plan, persist it, and return the execution structure."""
    try:
        # Check API key early
        if not (os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")):
            raise ValueError("API Key is missing in environment variables")

        goal_text = body.goal.strip()
        if not goal_text:
            raise ValueError("Goal cannot be empty")

        plan_struct = generate_plan(goal_text)

        # Persist goal and plan in MongoDB
        now = datetime.now(timezone.utc)
        goal_doc = {"user_id": current_user["_id"], "goal_text": goal_text, "created_at": now}
        goal_result = db["goals"].insert_one(goal_doc)

        plan_doc = {
            "goal_id": goal_result.inserted_id,
            "user_id": current_user["_id"],
            "goal_text": goal_text,
            "goal_summary": plan_struct.goal_summary,
            "reality_check": plan_struct.reality_check,
            "reframe": plan_struct.reframe,
            "priority_level": plan_struct.priority_level,
            "estimated_total_time": plan_struct.estimated_total_time,
            "execution_plan": [step.model_dump() for step in plan_struct.execution_plan],
            "first_action_to_take_now": plan_struct.first_action_to_take_now,
            "created_at": now,
        }
        db["plans"].insert_one(plan_doc)

        return plan_struct
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        print(f"Error generating plan: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Backend Error: {str(e)}")


@app.get("/plans", response_model=list[PlanSummary])
def list_plans(
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> list[PlanSummary]:
    """Return all plans for the authenticated user (most recent first)."""
    cursor = (
        db["plans"]
        .find({"user_id": current_user["_id"]})
        .sort("created_at", -1)
    )

    summaries: list[PlanSummary] = []
    for doc in cursor:
        summaries.append(
            PlanSummary(
                id=str(doc["_id"]),
                goal_text=doc.get("goal_text", ""),
                goal_summary=doc.get("goal_summary", ""),
                created_at=doc.get("created_at"),
            )
        )
    return summaries


@app.get("/plans/{plan_id}", response_model=PlanDetail)
def get_plan(
    plan_id: str = Path(...),
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> PlanDetail:
    """Return a single plan with full execution details."""
    try:
        oid = ObjectId(plan_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")

    doc = db["plans"].find_one({"_id": oid, "user_id": current_user["_id"]})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")

    return PlanDetail(
        id=str(doc["_id"]),
        goal_text=doc.get("goal_text", ""),
        goal_summary=doc.get("goal_summary", ""),
        reality_check=doc.get("reality_check", ""),
        reframe=doc.get("reframe", ""),
        priority_level=doc.get("priority_level", ""),
        estimated_total_time=doc.get("estimated_total_time", ""),
        execution_plan=doc.get("execution_plan", []),
        first_action_to_take_now=doc.get("first_action_to_take_now", ""),
        created_at=doc.get("created_at"),
    )


@app.patch("/steps/{step_id}", status_code=status.HTTP_204_NO_CONTENT)
def mark_step_completed(
    step_id: str,
    body: StepUpdateRequest,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> None:
    """Mark a single step as completed (or not) by step_id."""
    # Find the plan that owns this step for the current user.
    plans = list(db["plans"].find({"user_id": current_user["_id"]}).sort("created_at", -1))

    target_plan: dict | None = None
    for plan in plans:
        steps = plan.get("execution_plan") or []
        for step in steps:
            if step.get("step_id") == step_id:
                target_plan = plan
                break
        if target_plan:
            break

    if not target_plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Step not found")

    updated_steps: list[dict] = []
    for step in target_plan.get("execution_plan", []):
        if step.get("step_id") == step_id:
            step = {**step, "completed": bool(body.completed)}
        updated_steps.append(step)

    db["plans"].update_one(
        {"_id": target_plan["_id"]},
        {"$set": {"execution_plan": updated_steps}},
    )


# This block is for local development (run with: python main.py)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port)
