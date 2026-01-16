"""
Fix Chapter Cover Image Mapping
Correctly assign Ramayana covers to Ramayana chapters and Mahabharata covers to Mahabharata chapters
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlmodel import Session, select
from app.db import engine
from app.models import Chapter

def fix_cover_mapping():
    """Correctly map cover images to chapters"""
    
    # Correct mappings
    ramayana_covers = {
        1: "/static/images/covers/ramayana_ch1_cover_1768400432141.png",
        2: "/static/images/covers/ramayana_ch2_cover_1768400453006.png",
        3: "/static/images/covers/ramayana_ch3_cover_1768400484155.png",
        4: "/static/images/covers/ramayana_ch4_cover_1768400506893.png",
        5: "/static/images/covers/ramayana_ch5_cover_1768400537992.png",
        6: "/static/images/covers/ramayana_ch6_cover_1768400595479.png",
        7: "/static/images/covers/ramayana_ch7_cover_1768400620203.png",
    }
    
    mahabharata_covers = {
        1: "/static/images/covers/mahabharata_ch1_cover_1768400641463.png",
        2: "/static/images/covers/mahabharata_ch2_cover_1768400668953.png",
        3: "/static/images/covers/mahabharata_ch3_cover_1768400693784.png",
        4: "/static/images/covers/mahabharata_ch4_cover_1768400741974.png",
        5: "/static/images/covers/mahabharata_ch5_cover_1768400771808.png",
        6: "/static/images/covers/mahabharata_ch6_cover_1768400805126.png",
        7: "/static/images/covers/mahabharata_ch7_cover_1768400830726.png",
    }
    
    with Session(engine) as session:
        # Update Ramayana chapters (Story ID: 3)
        print("=" * 80)
        print("UPDATING RAMAYANA CHAPTERS (Story ID: 3)")
        print("=" * 80)
        ramayana_chapters = session.exec(
            select(Chapter).where(Chapter.story_id == 3).order_by(Chapter.index)
        ).all()
        
        for chapter in ramayana_chapters:
            cover_url = ramayana_covers.get(chapter.index)
            if cover_url:
                old_cover = chapter.cover_image_url
                chapter.cover_image_url = cover_url
                print(f"✅ Chapter {chapter.index}: {chapter.title[:50]}")
                print(f"   OLD: {old_cover}")
                print(f"   NEW: {cover_url}")
                print()
            else:
                print(f"⚠️  No cover found for Chapter {chapter.index}")
        
        # Update Mahabharata chapters (Story ID: 4)
        print("=" * 80)
        print("UPDATING MAHABHARATA CHAPTERS (Story ID: 4)")
        print("=" * 80)
        mahabharata_chapters = session.exec(
            select(Chapter).where(Chapter.story_id == 4).order_by(Chapter.index)
        ).all()
        
        for chapter in mahabharata_chapters:
            cover_url = mahabharata_covers.get(chapter.index)
            if cover_url:
                old_cover = chapter.cover_image_url
                chapter.cover_image_url = cover_url
                print(f"✅ Chapter {chapter.index}: {chapter.title[:50]}")
                print(f"   OLD: {old_cover}")
                print(f"   NEW: {cover_url}")
                print()
            else:
                print(f"⚠️  No cover found for Chapter {chapter.index}")
        
        # Commit changes
        session.commit()
        print("=" * 80)
        print("✅ ALL MAPPINGS UPDATED SUCCESSFULLY!")
        print("=" * 80)
        
        # Verify
        print("\n" + "=" * 80)
        print("VERIFICATION - FINAL MAPPINGS")
        print("=" * 80)
        
        all_chapters = session.exec(
            select(Chapter).where(Chapter.story_id.in_([3, 4])).order_by(Chapter.story_id, Chapter.index)
        ).all()
        
        print("\n📖 RAMAYANA:")
        for ch in all_chapters:
            if ch.story_id == 3:
                print(f"  Ch{ch.index}: {ch.title[:40]}")
                print(f"       → {ch.cover_image_url}")
        
        print("\n⚔️  MAHABHARATA:")
        for ch in all_chapters:
            if ch.story_id == 4:
                print(f"  Ch{ch.index}: {ch.title[:40]}")
                print(f"       → {ch.cover_image_url}")

if __name__ == "__main__":
    fix_cover_mapping()
