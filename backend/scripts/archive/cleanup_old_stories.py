"""
Clean up old story IDs 1 and 2 from database

This removes the old test/seed Ramayana and Mahabharata stories,
keeping only the new cinematic versions (IDs 3 and 4).
"""

import sys
from sqlmodel import Session, select
from app.db import engine
from app.models import Story, Chapter, Scene

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

def cleanup_old_stories():
    print("\n" + "="*60)
    print("🧹 CLEANUP: Removing Old Story Versions")
    print("="*60 + "\n")
    
    with Session(engine) as session:
        # Get stories to delete (IDs 1 and 2)
        story_1 = session.get(Story, 1)
        story_2 = session.get(Story, 2)
        
        for story_id, story in [(1, story_1), (2, story_2)]:
            if not story:
                print(f"Story ID {story_id}: Not found (already deleted)")
                continue
            
            print(f"Deleting Story ID {story_id}: {story.title}")
            print(f"   Slug: {story.slug}")
            print(f"   Chapters: {story.total_chapters}, Scenes: {story.total_scenes}")
            
            # Get all chapters for this story
            chapters = session.exec(select(Chapter).where(Chapter.story_id == story_id)).all()
            scene_count = 0
            progress_count = 0
            
            # Delete all user progress and scenes
            for chapter in chapters:
                scenes = session.exec(select(Scene).where(Scene.chapter_id == chapter.id)).all()
                for scene in scenes:
                    # First delete any user progress for this scene
                    from app.models import UserSceneProgress
                    progress_records = session.exec(
                        select(UserSceneProgress).where(UserSceneProgress.scene_id == scene.id)
                    ).all()
                    for progress in progress_records:
                        session.delete(progress)
                        progress_count += 1
                    
                    # Then delete the scene
                    session.delete(scene)
                    scene_count += 1
            
            # Commit after deleting scenes and progress
            session.commit()
            
            # Delete all chapters
            for chapter in chapters:
                session.delete(chapter)
            
            # Delete story
            session.delete(story)
            session.commit()
            
            print(f"   ✅ Deleted {len(chapters)} chapters, {scene_count} scenes, {progress_count} progress records\n")
        
        # Verify remaining stories
        print("="*60)
        print("Remaining Stories in Database:")
        print("="*60 + "\n")
        
        remaining = session.exec(select(Story)).all()
        for s in remaining:
            print(f"✅ ID {s.id}: {s.title} ({s.slug})")
            print(f"   {s.total_chapters} chapters, {s.total_scenes} scenes\n")
        
        print("="*60)
        print("✨ CLEANUP COMPLETE!")
        print("="*60)
        print(f"\nDatabase now contains only the new cinematic versions")
        print(f"Ready for production! 🎉\n")

if __name__ == "__main__":
    try:
        cleanup_old_stories()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
