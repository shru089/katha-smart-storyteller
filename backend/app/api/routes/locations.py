from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db import get_session
from app.models import Location
from app.schemas import LocationOut
from typing import List

router = APIRouter()

# Location seeding is handled in main.py lifespan to avoid deprecated @router.on_event

@router.get("/", response_model=List[LocationOut])
def get_locations(session: Session = Depends(get_session)):
    """Return all sacred geographic locations for the interactive map."""
    locations = session.exec(select(Location)).all()
    return locations
