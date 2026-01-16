"""
Generate audio for a sample Ramayana scene to test emotional depth

This will generate audio with different emotions to demonstrate Edge TTS quality.
"""

import asyncio
import sys
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from sqlmodel import Session, select
from app.db import engine
from app.models import Scene, Chapter
from app.services.audio_service import get_audio_service

async def test_emotional_audio():
    print("\n" + "="*60)
    print("TESTING Edge TTS Emotional Audio Generation")
    print("="*60 + "\n")
    
    with Session(engine) as session:
        # Get first scene from Ramayana Chapter 1 (should be emotional/contemplative)
        print("Fetching sample scenes from database...\n")
        
        scenes = session.exec(
            select(Scene)
            .join(Chapter)
            .where(Chapter.id == 9)  # Ramayana Chapter 1
            .order_by(Scene.index)
            .limit(3)
        ).all()
        
        if not scenes:
            print("No scenes found! Make sure Ramayana is in database.")
            return
        
        audio_service = get_audio_service()
        
        for scene in scenes:
            print(f"Scene {scene.index}: {scene.raw_text[:60]}...")
            print(f"Emotion: {scene.ai_emotion or 'narrative'}")
            
            # Generate audio
            audio_path = await audio_service.generate_audio_for_scene(
                scene_text=scene.raw_text,
                scene_id=scene.id,
                scene_emotion=scene.ai_emotion
            )
            
            # Update scene in database
            scene.ai_audio_url = audio_path
            session.add(scene)
            
            print(f"Generated: {audio_path}")
            print()
        
        session.commit()
        
        print("="*60)
        print("AUDIO GENERATION TEST COMPLETE!")
        print("="*60)
        print(f"\nGenerated {len(scenes)} audio files")
        print("Check static/audio/ directory to listen")
        print("\nTo test in frontend:")
        print("1. Go to Ramayana story")
        print("2. Open Chapter 1")
        print("3. Audio should now be available for scenes\n")

if __name__ == "__main__":
    asyncio.run(test_emotional_audio())
