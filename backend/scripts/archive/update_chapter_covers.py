"""
Update Chapter Cover Images in Database
Maps generated cover images to their respective chapters
"""

import sys
sys.path.insert(0, '.')

from sqlmodel import Session, select
from app.db import engine
from app.models import Chapter, Story

# Mapping of chapter IDs to cover image filenames
CHAPTER_COVER_MAPPING = {
    # Ramayana chapters
    1: "ramayana_ch1_cover_1768400432141.png",
    2: "ramayana_ch2_cover_1768400453006.png",
    3: "ramayana_ch3_cover_1768400484155.png",
    4: "ramayana_ch4_cover_1768400506893.png",
    5: "ramayana_ch5_cover_1768400537992.png",
    6: "ramayana_ch6_cover_1768400595479.png",
    7: "ramayana_ch7_cover_1768400620203.png",
    
    # Mahabharata chapters
    8: "mahabharata_ch1_cover_1768400641463.png",
    9: "mahabharata_ch2_cover_1768400668953.png",
    10: "mahabharata_ch3_cover_1768400693784.png",
    11: "mahabharata_ch4_cover_1768400741974.png",
    12: "mahabharata_ch5_cover_1768400771808.png",
    13: "mahabharata_ch6_cover_1768400805126.png",
    14: "mahabharata_ch7_cover_1768400830726.png",
}

def update_chapter_covers():
    """Update all chapter records with cover image URLs"""
    
    print("\n" + "="*80)
    print("📸 UPDATING CHAPTER COVER IMAGES")
    print("="*80 + "\n")
    
    with Session(engine) as session:
        updated_count = 0
        
        for chapter_id, filename in CHAPTER_COVER_MAPPING.items():
            # Get chapter
            chapter = session.exec(
                select(Chapter).where(Chapter.id == chapter_id)
            ).first()
            
            if not chapter:
                print(f"⚠️  Chapter ID {chapter_id} not found, skipping...")
                continue
            
            # Get story for display
            story = session.exec(
                select(Story).where(Story.id == chapter.story_id)
            ).first()
            
            # Update cover image URL
            # Note: For Chapter model, we need to add a cover_image_url field first
            # For now, let's check if the field exists
            if not hasattr(chapter, 'cover_image_url'):
                print(f"⚠️  Chapter model doesn't have cover_image_url field yet")
                print(f"   We'll need to add this field to the Chapter model first")
                break
            
            chapter.cover_image_url = f"/static/images/covers/{filename}"
            session.add(chapter)
            
            print(f"✅ Chapter {chapter.index}: {chapter.title}")
            print(f"   Story: {story.title}")
            print(f"   Image: {filename}")
            print()
            
            updated_count += 1
        
        session.commit()
        
        print("="*80)
        print(f"✨ Updated {updated_count} chapters with cover images")
        print("="*80 + "\n")

if __name__ == "__main__":
    update_chapter_covers()
