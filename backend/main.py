"""MindKiln AI – FastAPI backend. Single endpoint: POST /generate-plan."""

import os
import uvicorn
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

# Robust CORS configuration
# Defaults to localhost for dev, but can be overridden by CORS_ORIGINS env var.
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
)

@app.get("/health")
def health():
    # Return more info to help debug
    return {
        "status": "ok", 
        "message": "MindKiln AI Backend is running",
        "api_key_configured": bool(os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY"))
    }


@app.post("/generate-plan", response_model=ExecutionPlan)
def generate_plan_endpoint(body: GoalRequest):
    try:
        # Check API key early
        if not (os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")):
            raise ValueError("API Key is missing in Railway Variables")
            
        plan = generate_plan(body.goal.strip())
        return plan
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        print(f"Error generating plan: {e}")
        raise HTTPException(status_code=500, detail=f"Backend Error: {str(e)}")

# This block is for local development (run with: python main.py)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port)
