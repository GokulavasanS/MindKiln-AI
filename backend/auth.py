"""JWT-based authentication helpers and routes."""

import os
from datetime import datetime, timedelta, timezone
from typing import Annotated

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import bcrypt
from pymongo.database import Database

from database import get_db
from models.schemas import Token, UserCreate, UserRead

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY must be set in environment variables.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # default 7 days


def _get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def _create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Database, Depends(get_db)],
) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    try:
        oid = ObjectId(user_id)
    except Exception:
        raise credentials_exception

    user = db["users"].find_one({"_id": oid})
    if user is None:
        raise credentials_exception
    return user


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Database = Depends(get_db)) -> UserRead:
    try:
        existing = db["users"].find_one({"email": user_in.email.lower()})
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        now = datetime.now(timezone.utc)
        doc = {
            "email": user_in.email.lower(),
            "password_hash": _get_password_hash(user_in.password),
            "created_at": now,
        }
        result = db["users"].insert_one(doc)
        user_id = str(result.inserted_id)
        return UserRead(id=user_id, email=doc["email"], created_at=now)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Check that MongoDB is running and reachable.",
        ) from e


@router.post("/login", response_model=Token)
def login(user_in: UserCreate, db: Database = Depends(get_db)) -> Token:
    try:
        user = db["users"].find_one({"email": user_in.email.lower()})
        if not user or not _verify_password(user_in.password, user["password_hash"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

        access_token = _create_access_token({"sub": str(user["_id"])})
        return Token(access_token=access_token)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Check that MongoDB is running and reachable.",
        ) from e


@router.get("/me", response_model=UserRead)
def me(current_user: dict = Depends(get_current_user)) -> UserRead:
    """Return the currently authenticated user. Used by the frontend to validate a stored token."""
    return UserRead(
        id=str(current_user["_id"]),
        email=current_user["email"],
        created_at=current_user.get("created_at"),
    )

