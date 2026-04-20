"""MongoDB database setup for MindKiln AI."""

import os
from typing import Generator

from dotenv import load_dotenv
from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.database import Database

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI") or os.getenv("DATABASE_URL")
DB_NAME = os.getenv("MONGODB_DB_NAME", "mindkiln")

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI (or DATABASE_URL) is not set. "
        "Set it to your MongoDB connection string, e.g. "
        '"mongodb://localhost:27017".'
    )

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
_db: Database = client[DB_NAME]


def _ensure_indexes() -> None:
    """Create indexes on startup. Non-fatal if MongoDB is temporarily unavailable."""
    try:
        _db["users"].create_index("email", unique=True)
        _db["goals"].create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
        _db["plans"].create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
    except Exception as e:
        print(f"Warning: Could not create MongoDB indexes (MongoDB may be starting): {e}")


def get_db() -> Generator[Database, None, None]:
    """FastAPI dependency returning the MongoDB database handle."""
    yield _db

