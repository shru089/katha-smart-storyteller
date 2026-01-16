"""
Update Story Cover Images in Database
Adds the beautiful AI-generated covers to Ramayana and Mahabharata stories
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlmodel import Session, select
from app.db import engine
from app.models import Story

def update_story_covers():
    """Update story cover images"""
    
    with Session(engine) as session:
        # Update Ramayana (Story ID: 3)
        ramayana = session.exec(select(Story).where(Story.id == 3)).first()
        if ramayana:
            ramayana.cover_image_url = "/static/images/stories/ramayana_cover.png"
            print(f"✅ Updated Ramayana cover: {ramayana.title}")
        
        # Update Mahabharata (Story ID: 4)
        mahabharata = session.exec(select(Story).where(Story.id == 4)).first()
        if mahabharata:
            mahabharata.cover_image_url = "/static/images/stories/mahabharata_cover.png"
            print(f"✅ Updated Mahabharata cover: {mahabharata.title}")
        
        session.commit()
        print("\n🎨 Story covers updated successfully!")
        
        # Verify
        print("\n📊 Current Story Covers:")
        all_stories = session.exec(select(Story)).all()
        for story in all_stories:
            print(f"  {story.title}: {story.cover_image_url}")

if __name__ == "__main__":
    update_story_covers()
