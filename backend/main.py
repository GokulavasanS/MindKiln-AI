"""MindKiln AI – FastAPI backend. Single endpoint: POST /generate-plan."""

import os
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from models.schemas import ExecutionPlan, GoalRequest
from services.ai_service import generate_plan

app = FastAPI(
    title="MindKiln AI",
    description="Turn messy thoughts into structured execution.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/generate-plan", response_model=ExecutionPlan)
def generate_plan_endpoint(body: GoalRequest):
    try:
        plan = generate_plan(body.goal.strip())
        return plan
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate plan. Please try again.")
