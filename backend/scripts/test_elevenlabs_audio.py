"""
Test ElevenLabs Audio Generation
Verify the audio service works with your API key
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.elevenlabs_service import elevenlabs_service
from app.db import get_session
from app.models import Scene
from sqlmodel import select

def test_elevenlabs():
    """Test audio generation on a real scene"""
    
    print("=" * 60)
    print("TESTING ELEVENLABS AUDIO GENERATION")
    print("=" * 60)
    
    # Get a scene from database
    with next(get_session()) as session:
        stmt = select(Scene).limit(1)
        scene = session.exec(stmt).first()
        
        if not scene:
            print("❌ No scenes found in database")
            return
        
        print(f"\n📖 Scene ID: {scene.id}")
        print(f"📝 Text: {scene.raw_text[:150]}...")
        print(f"😊 Emotion: {scene.ai_emotion or 'None'}")
        
        print("\n🎙️ Generating audio with ElevenLabs...")
        print("   Using voice: 'Onyx' (Deep storyteller)")
        print("   Emotion settings: Based on Rasa")
        print("   (This may take 10-30 seconds)\n")
        
        try:
            audio_url = elevenlabs_service.generate_narration(
                text=scene.raw_text[:500],  # Limit to 500 chars for test
                emotion=scene.ai_emotion,
                scene_id=scene.id
            )
            
            print("✅ AUDIO GENERATED SUCCESSFULLY!")
            print(f"🎧 Audio URL: {audio_url}")
            print(f"\n🎯 Test complete! Listen to your audio at:")
            print(f"   http://localhost:8000{audio_url}")
            
        except Exception as e:
            print(f"❌ Generation failed: {e}")
            print("\nTroubleshooting:")
            print("1. Ensure ELEVENLABS_API_KEY is set in .env")
            print("2. Check your API key at: https://elevenlabs.io/app/settings/api-keys")
            print("3. Verify you have characters remaining in your free tier")
            return

if __name__ == "__main__":
    test_elevenlabs()
