"""
Complete Ramayana Audio Generation

Generate audio for remaining Ramayana scenes (Chapters 5, 6, 7).
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

async def complete_ramayana_audio():
    print("\n" + "="*70)
    print("COMPLETING RAMAYANA AUDIO GENERATION")
    print("="*70 + "\n")
    
    audio_service = get_audio_service()
    
    with Session(engine) as session:
        # Get Ramayana story
        story = session.exec(
            select(Story).where(Story.slug == "ramayana")
        ).first()
        
        if not story:
            print("Ramayana not found!")
            return
        
        # Get chapters 5, 6, 7
        chapters = session.exec(
            select(Chapter)
            .where(Chapter.story_id == story.id)
            .where(Chapter.index >= 5)
            .order_by(Chapter.index)
        ).all()
        
        total_generated = 0
        
        for chapter in chapters:
            print(f"\nChapter {chapter.index}: {chapter.title}")
            print("-" * 70)
            
            # Get scenes without audio
            scenes = session.exec(
                select(Scene)
                .where(Scene.chapter_id == chapter.id)
                .order_by(Scene.index)
            ).all()
            
            for scene in scenes:
                if scene.ai_audio_url:
                    print(f"  Scene {scene.index}: Skipped (already has audio)")
                    continue
                
                try:
                    audio_path = await audio_service.generate_audio_for_scene(
                        scene_text=scene.raw_text,
                        scene_id=scene.id,
                        scene_emotion=scene.ai_emotion
                    )
                    
                    scene.ai_audio_url = audio_path
                    session.add(scene)
                    session.commit()
                    
                    total_generated += 1
                    print(f"  Scene {scene.index}: Generated ({scene.ai_emotion or 'narrative'})")
                    
                except Exception as e:
                    print(f"  Scene {scene.index}: ERROR - {e}")
        
        print("\n" + "="*70)
        print(f"COMPLETE! Generated {total_generated} additional audio files")
        print("="*70 + "\n")

if __name__ == "__main__":
    asyncio.run(complete_ramayana_audio())
