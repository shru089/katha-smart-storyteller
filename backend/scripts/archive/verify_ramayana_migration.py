"""
Verify Ramayana Migration

This script verifies that the new Ramayana chapters were correctly migrated to the database.
"""

import sys
from sqlmodel import Session, select
from app.db import engine
from app.models import Story, Chapter, Scene


def verify_migration():
    """Verify the Ramayana migration"""
    print("\n" + "="*60)
    print("🔍 RAMAYANA MIGRATION VERIFICATION")
    print("="*60 + "\n")
    
    with Session(engine) as session:
        # Check story exists
        print("1️⃣  Checking story...")
        story = session.exec(select(Story).where(Story.slug == "ramayana")).first()
        
        if not story:
            print("   ❌ FAILED: Story not found with slug 'ramayana'")
            return False
        
        print(f"   ✅ Story found: {story.title}")
        print(f"      - ID: {story.id}")
        print(f"      - Slug: {story.slug}")
        print(f"      - Total Chapters: {story.total_chapters}")
        print(f"      - Total Scenes: {story.total_scenes}")
        
        # Check chapters
        print(f"\n2️⃣  Checking chapters...")
        chapters = session.exec(
            select(Chapter).where(Chapter.story_id == story.id).order_by(Chapter.index)
        ).all()
        
        if len(chapters) != 7:
            print(f"   ❌ FAILED: Expected 7 chapters, found {len(chapters)}")
            return False
        
        print(f"   ✅ Found {len(chapters)} chapters:\n")
        
        total_scene_count = 0
        expected_first_scene_text = "The palace was quiet"
        
        for chapter in chapters:
            scenes = session.exec(
                select(Scene).where(Scene.chapter_id == chapter.id).order_by(Scene.index)
            ).all()
            
            total_scene_count += len(scenes)
            
            print(f"      Chapter {chapter.index}: {chapter.title}")
            print(f"         - Scenes: {len(scenes)}")
            print(f"         - Summary: {chapter.short_summary[:50]}...")
            
            # Verify scenes have content
            if not scenes:
                print(f"         ❌ FAILED: No scenes found")
                return False
            
            for scene in scenes:
                if not scene.raw_text or len(scene.raw_text) < 10:
                    print(f"         ❌ FAILED: Scene {scene.index} has no/invalid content")
                    return False
            
            # Special check for Chapter 1, Scene 1
            if chapter.index == 1:
                first_scene = scenes[0]
                if expected_first_scene_text not in first_scene.raw_text:
                    print(f"         ⚠️  WARNING: First scene doesn't start with expected text")
                else:
                    print(f"         ✅ First scene content verified")
        
        # Verify total scene count
        print(f"\n3️⃣  Verifying scene count...")
        if total_scene_count != story.total_scenes:
            print(f"   ⚠️  WARNING: Mismatch - Story says {story.total_scenes}, counted {total_scene_count}")
        else:
            print(f"   ✅ Scene count matches: {total_scene_count}")
        
        # Check scene content quality
        print(f"\n4️⃣  Checking scene quality...")
        sample_scene = session.exec(
            select(Scene).join(Chapter).where(Chapter.story_id == story.id).limit(1)
        ).first()
        
        if sample_scene:
            print(f"   Sample scene length: {len(sample_scene.raw_text)} characters")
            print(f"   Emotion tag: {sample_scene.ai_emotion or 'None'}")
            print(f"   AI fields (should be empty for now):")
            print(f"      - Image URL: {sample_scene.ai_image_url or 'Empty ✅'}")
            print(f"      - Video URL: {sample_scene.ai_video_url or 'Empty ✅'}")
            print(f"      - Audio URL: {sample_scene.ai_audio_url or 'Empty ✅'}")
        
        # Final summary
        print(f"\n{'='*60}")
        print(f"✅ VERIFICATION PASSED!")
        print(f"{'='*60}")
        print(f"\n📊 Final Stats:")
        print(f"   - Chapters: {len(chapters)}")
        print(f"   - Total Scenes: {total_scene_count}")
        print(f"   - Average scenes per chapter: {total_scene_count / len(chapters):.1f}")
        print(f"\n🎉 Migration successful! New Ramayana is ready.")
        print()
        
        return True


if __name__ == "__main__":
    try:
        success = verify_migration()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ VERIFICATION ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
