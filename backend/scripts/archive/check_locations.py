"""
Check Locations in Database
Verify coordinates and data for the map feature
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlmodel import Session, select
from app.db import engine
from app.models import Location, Story, Chapter

def check_locations():
    """List all locations and their associated stories/chapters"""
    
    with Session(engine) as session:
        locations = session.exec(select(Location)).all()
        
        print(f"\n🗺️ Found {len(locations)} locations:\n")
        
        for loc in locations:
            print(f"📍 {loc.name}")
            print(f"   Coords: {loc.lat}, {loc.lon}")
            print(f"   Description: {loc.description[:50]}...")
            print("")

if __name__ == "__main__":
    check_locations()
