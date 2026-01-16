"""
Batch Audio Generation for All Stories

Generates podcast audio for all scenes in Ramayana and Mahabharata using Edge TTS.
"""

import asyncio
import sys
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from sqlmodel import Session, select
from app.db import engine
from app.models import Story, Chapter, Scene
from app.services.audio_service import get_audio_service


async def generate_all_audio():
    print("\\n" + "="*70)
    print("BATCH AUDIO GENERATION - Ramayana & Mahabharata")
    print("="*70 + "\\n")
    
    audio_service = get_audio_service()
    
    with Session(engine) as session:
        # Get both stories
        stories = session.exec(
            select(Story).where(
                Story.slug.in_(["ramayana", "mahabharata"])
            )
        ).all()
        
        if not stories:
            print("No stories found!")
            return
        
        total_generated = 0
        total_skipped = 0
        
        for story in stories:
            print(f"\\n{'='*70}")
            print(f"Story: {story.title}")
            print(f"{'='*70}\\n")
            
            # Get all chapters
            chapters = session.exec(
                select(Chapter)
                .where(Chapter.story_id == story.id)
                .order_by(Chapter.index)
            ).all()
            
            for chapter in chapters:
                print(f"  Chapter {chapter.index}: {chapter.title}")
                
                # Get all scenes
                scenes = session.exec(
                    select(Scene)
                    .where(Scene.chapter_id == chapter.id)
                    .order_by(Scene.index)
                ).all()
                
                chapter_generated = 0
                chapter_skipped = 0
                
                for scene in scenes:
                    # Skip if audio already exists
                    if scene.ai_audio_url:
                        chapter_skipped += 1
                        continue
                    
                    # Generate audio
                    try:
                        audio_path = await audio_service.generate_audio_for_scene(
                            scene_text=scene.raw_text,
                            scene_id=scene.id,
                            scene_emotion=scene.ai_emotion
                        )
                        
                        # Update scene
                        scene.ai_audio_url = audio_path
                        session.add(scene)
                        session.commit()
                        
                        chapter_generated += 1
                        total_generated += 1
                        
                        print(f"    Scene {scene.index}: Generated ({scene.ai_emotion or 'narrative'})")
                        
                    except Exception as e:
                        print(f"    Scene {scene.index}: ERROR - {e}")
                
                total_skipped += chapter_skipped
                print(f"    Summary: {chapter_generated} generated, {chapter_skipped} skipped\\n")
        
        print("\\n" + "="*70)
        print("BATCH GENERATION COMPLETE!")
        print("="*70)
        print(f"\\nTotal Scenes Generated: {total_generated}")
        print(f"Total Scenes Skipped: {total_skipped}")
        print(f"Total Audio Files: {total_generated + total_skipped}")
        print(f"\\nAudio files saved to: static/audio/")
        print("\\nReady for podcast playback in frontend!\\n")


if __name__ == "__main__":
    asyncio.run(generate_all_audio())
