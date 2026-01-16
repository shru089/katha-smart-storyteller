from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db import get_session, engine
from app.models import Location
from app.schemas import LocationOut
from typing import List

router = APIRouter()

@router.on_event("startup")
def on_startup():
    # Seed initial location data
    with Session(engine) as session:
        if not session.exec(select(Location)).first():
            locations = [
                Location(name='Kurukshetra', description='The epic culmination of the Mahabharata...', lat=29.9695, lon=76.8783, epoch='Mahabharata', region='Northern India', era='3102 BCE'),
                Location(name='Ayodhya', description='The capital of the Kosala Kingdom...', lat=26.7956, lon=82.1942, epoch='Ramayana', region='Northern India', era='5114 BCE'),
                Location(name='Hampi', description='Believed to be the site of Kishkindha...', lat=15.3350, lon=76.4600, epoch='Ramayana', region='Southern India', era='Unknown'),
            ]
            for loc in locations:
                session.add(loc)
            session.commit()

@router.get("/", response_model=List[LocationOut])
def get_locations(session: Session = Depends(get_session)):
    locations = session.exec(select(Location)).all()
    return locations
