"""
Test Enhanced Audio Service with Real Ramayana Scene

Generate audio with emotional dialogue for one scene.
"""

import asyncio
import sys
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from sqlmodel import Session, select
from app.db import engine
from app.models import Scene
from app.services.enhanced_audio_service import get_enhanced_audio_service

async def test_enhanced_audio():
    print("\n" + "="*70)
    print("TESTING ENHANCED AUDIO SERVICE")
    print("Dialogue Emotion-Based Voice Modulation")
    print("="*70 + "\n")
    
    with Session(engine) as session:
        # Get first Ramayana scene with dialogue
        # Scene 16 is in Chapter 2 which has lots of king dialogue
        scene = session.get(Scene, 16)
        
        if not scene:
            print("Scene not found!")
            return
        
        print(f"Scene {scene.id}: {scene.raw_text[:100]}...")
        print(f"\nEmotion Tag: {scene.ai_emotion}")
        print("\n" + "-"*70)
        
        # Generate enhanced audio
        print("\nGenerating multi-emotion audio...")
        
        audio_service = get_enhanced_audio_service()
        audio_path = await audio_service.generate_audio_for_scene(
            scene_text=scene.raw_text,
            scene_id=scene.id,
            scene_emotion=scene.ai_emotion
        )
        
        print(f"\n✓ Audio generated: {audio_path}")
        print("\n" + "="*70)
        print("SUCCESS!")
        print("="*70)
        print("\nTest the audio file:")
        print(f"  Path: static/audio/{audio_path.split('/')[-1]}")
        print("\nWhat to listen for:")
        print("  • King's dialogue: Bold, commanding tone (raudra)")
        print("  • Narrator: Neutral, smooth (narrative)")
        print("  • Whispers: Soft, gentle (shanta)")
        print("\nIf it sounds good, we'll regenerate all 85 scenes!\n")

if __name__ == "__main__":
    asyncio.run(test_enhanced_audio())
