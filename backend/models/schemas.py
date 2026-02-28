"""Request/response and execution plan schemas."""

from typing import Literal

from pydantic import BaseModel, Field


class GoalRequest(BaseModel):
    goal: str = Field(..., min_length=1, max_length=2000)


class ExecutionStep(BaseModel):
    step_number: int
    title: str
    description: str
    estimated_time: str
    priority: Literal["High", "Medium", "Low"]


class ExecutionPlan(BaseModel):
    goal_summary: str
    priority_level: Literal["High", "Medium", "Low"]
    estimated_total_time: str
    execution_plan: list[ExecutionStep]
    first_action_to_take_now: str
