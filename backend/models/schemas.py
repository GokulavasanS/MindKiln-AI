"""Pydantic schemas for requests, responses, and auth/data models."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, constr, EmailStr, Field


class GoalRequest(BaseModel):
    goal: str = Field(..., min_length=1, max_length=2000)

class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=8, max_length=128)

class ExecutionStep(BaseModel):
    # Internal identifier used for PATCH /steps/{id}
    step_id: str | None = None
    step_number: int
    title: str
    description: str
    estimated_time: str
    priority: Literal["High", "Medium", "Low"]
    # Progress tracking
    completed: bool = False


class ExecutionPlan(BaseModel):
    goal_summary: str
    reality_check: str
    reframe: str
    priority_level: Literal["High", "Medium", "Low"]
    estimated_total_time: str
    execution_plan: list[ExecutionStep]
    first_action_to_take_now: str


# ---------- Auth schemas ----------


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserRead(UserBase):
    id: str
    created_at: datetime


# ---------- Goal / plan schemas ----------


class PlanSummary(BaseModel):
    id: str
    goal_text: str
    goal_summary: str
    created_at: datetime


class PlanDetail(BaseModel):
    id: str
    goal_text: str
    goal_summary: str
    reality_check: str
    reframe: str
    priority_level: Literal["High", "Medium", "Low"]
    estimated_total_time: str
    execution_plan: list[ExecutionStep]
    first_action_to_take_now: str
    created_at: datetime


class StepUpdateRequest(BaseModel):
    completed: bool = True
