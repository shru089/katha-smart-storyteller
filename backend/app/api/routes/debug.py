"""
Debug API Routes
Utility endpoints for development and seeding data
"""

from fastapi import APIRouter, Depends, Query
from app.services.seed_service import seed_all, reset_and_seed
from app.db import get_session
from sqlmodel import Session
import logging

logger = logging.getLogger("katha.debug")
router = APIRouter()


@router.post("/seed-data")
def seed_data(
    reset: bool = Query(False, description="If true, deletes all existing story data before seeding"),
    session: Session = Depends(get_session)
):
    """
    Seeds the database with stories from stories.json and default badges.
    """
    if reset:
        logger.warning("Resetting database and seeding fresh data...")
        return reset_and_seed(session)
    
    return seed_all(session)


@router.get("/health")
def health_check():
    """
    Simple health check for the backend API.
    """
    return {"status": "ok", "service": "katha-backend"}
