"""SQLAlchemy ORM models for users, goals, and plans."""

from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    goals: Mapped[list["Goal"]] = relationship("Goal", back_populates="user", cascade="all, delete-orphan")


class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    goal_text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    user: Mapped[User] = relationship("User", back_populates="goals")
    plan: Mapped["Plan"] = relationship("Plan", back_populates="goal", uselist=False, cascade="all, delete-orphan")


class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    goal_id: Mapped[int] = mapped_column(ForeignKey("goals.id", ondelete="CASCADE"), nullable=False, index=True)

    goal_summary: Mapped[str] = mapped_column(Text, nullable=False)
    reality_check: Mapped[str] = mapped_column(Text, nullable=False)
    reframe: Mapped[str] = mapped_column(Text, nullable=False)
    priority_level: Mapped[str] = mapped_column(String(50), nullable=False)
    estimated_total_time: Mapped[str] = mapped_column(String(100), nullable=False)

    # Stored as list[ExecutionStep] with step_id + completed flags.
    execution_plan: Mapped[list] = mapped_column(JSON, nullable=False)

    first_action_to_take_now: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    goal: Mapped[Goal] = relationship("Goal", back_populates="plan")

