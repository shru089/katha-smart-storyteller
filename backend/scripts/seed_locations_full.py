"""
Seed Locations
Populate the database with key locations from Ramayana and Mahabharata
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlmodel import Session, select
from app.db import engine
from app.models import Location 

KEY_LOCATIONS = [
    {
        "name": "Ayodhya",
        "description": "The capital of the Kosala Kingdom and the birthplace of Lord Rama. A city of splendor and righteousness on the banks of the Saryu river.",
        "lat": 26.7924,
        "lon": 82.1998,
        "region": "Uttar Pradesh",
        "era": "Ramayana"
    },
    {
        "name": "Lanka",
        "description": "The island kingdom of the demon king Ravana. A golden city of immense wealth and power, where Sita was held captive.",
        "lat": 7.8731,
        "lon": 80.7718,
        "region": "Sri Lanka",
        "era": "Ramayana"
    },
    {
        "name": "Kishkindha",
        "description": "The kingdom of the Vanaras (monkeys), ruled by Vali and later Sugriva. Located near present-day Hampi, it is where Rama met Hanuman.",
        "lat": 15.3350,
        "lon": 76.4600,
        "region": "Karnataka",
        "era": "Ramayana"
    },
    {
        "name": "Chitrakoot",
        "description": "A holy forest region where Rama, Sita, and Lakshmana spent the initial years of their exile. A place of great natural beauty and spiritual significance.",
        "lat": 25.1767,
        "lon": 80.8647,
        "region": "Madhya Pradesh",
        "era": "Ramayana"
    },
    {
        "name": "Dandakaranya",
        "description": "A vast, dense forest home to sages and demons alike. It was here that Shurpanakha met Rama, leading to the abduction of Sita.",
        "lat": 18.8000,
        "lon": 80.0000,
        "region": "Central India",
        "era": "Ramayana"
    },
    {
        "name": "Janakpur",
        "description": "The capital of the Videha Kingdom and the birthplace of Sita. It is where Rama broke Shiva's bow to win Sita's hand in marriage.",
        "lat": 26.7271,
        "lon": 85.9407,
        "region": "Nepal",
        "era": "Ramayana"
    },
    {
        "name": "Kurukshetra",
        "description": "The battlefield of the great Mahabharata war. It is here that the Bhagavad Gita was spoken by Krishna to Arjuna.",
        "lat": 29.9695,
        "lon": 76.8783,
        "region": "Haryana",
        "era": "Mahabharata"
    },
    {
        "name": "Hastinapur",
        "description": "The capital of the Kuru Kingdom, the prize for which the Mahabharata war was fought. Home to the Pandavas and Kauravas.",
        "lat": 29.1352,
        "lon": 78.0256,
        "region": "Uttar Pradesh",
        "era": "Mahabharata"
    },
    {
        "name": "Indraprastha",
        "description": "The magnificent capital city built by the Pandavas on the banks of the Yamuna. Known for its optical illusions and architectural brilliance (Maya Sabha).",
        "lat": 28.6139,
        "lon": 77.2090,
        "region": "Delhi",
        "era": "Mahabharata"
    },
    {
        "name": "Dwaraka",
        "description": "The golden city of Lord Krishna, built on the western coast of India. A fortress city claimed by the sea after Krishna's departure.",
        "lat": 22.2442,
        "lon": 68.9685,
        "region": "Gujarat",
        "era": "Mahabharata"
    }
]

def seed_locations():
    """Add key locations if they don't exist"""
    
    with Session(engine) as session:
        count = 0
        for loc_data in KEY_LOCATIONS:
            # Check if exists
            existing = session.exec(select(Location).where(Location.name == loc_data["name"])).first()
            
            if not existing:
                loc = Location(**loc_data)
                session.add(loc)
                count += 1
                print(f"✅ Added {loc_data['name']}")
            else:
                # Update existing if needed
                existing.lat = loc_data["lat"]
                existing.lon = loc_data["lon"]
                existing.description = loc_data["description"]
                existing.region = loc_data["region"]
                existing.era = loc_data["era"]
                session.add(existing)
                print(f"🔄 Updated {loc_data['name']}")
                
        session.commit()
        print(f"\n✨ Seeding Complete! Added {count} new locations.")

if __name__ == "__main__":
    seed_locations()
