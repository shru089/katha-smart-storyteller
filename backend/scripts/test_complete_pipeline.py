"""
Complete AI Pipeline Test
Tests both SVD video and ElevenLabs audio generation
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.svd_video_service import svd_video_service
from app.services.elevenlabs_service import elevenlabs_service
from app.db import get_session
from app.models import Scene
from sqlmodel import select

def test_complete_pipeline():
    """Test the full AI generation pipeline"""
    
    print("=" * 70)
    print("KATHA AI PIPELINE - COMPLETE TEST")
    print("Testing: SVD Video + ElevenLabs Audio")
    print("=" * 70)
    
    # Get a scene
    with next(get_session()) as session:
        stmt = select(Scene).where(Scene.ai_emotion != None).limit(1)
        scene = session.exec(stmt).first()
        
        if not scene:
            print("\n❌ No scenes with emotions found")
            print("Run emotion extraction first")
            return
        
        print(f"\n📖 Testing Scene ID: {scene.id}")
        print(f"📝 Text: {scene.raw_text[:100]}...")
        print(f"😊 Emotion: {scene.ai_emotion}")
        print(f"\n" + "─" * 70)
        
        # Test 1: Audio Generation
        print("\n🎙️ TEST 1: ELEVENLABS AUDIO")
        print("─" * 70)
        try:
            print("Generating emotion-aware narration...")
            audio_url = elevenlabs_service.generate_narration(
                text=scene.raw_text[:400],  # Limit for test
                emotion=scene.ai_emotion,
                scene_id=scene.id
            )
            print(f"✅ Audio generated: {audio_url}")
            print(f"🎧 Listen at: http://localhost:8000{audio_url}")
        except Exception as e:
            print(f"❌ Audio failed: {e}")
            audio_url = None
        
        # Test 2: Video Generation
        print(f"\n🎬 TEST 2: SVD VIDEO")
        print("─" * 70)
        try:
            print("Step 1: Generating cinematic image...")
            print("Step 2: Animating with SVD (1-3 minutes)...")
            video_url = svd_video_service.generate_scene_video(
                scene_text=scene.raw_text,
                emotion=scene.ai_emotion,
                scene_id=scene.id
            )
            print(f"✅ Video generated: {video_url}")
            print(f"📹 Watch at: http://localhost:8000{video_url}")
        except Exception as e:
            print(f"❌ Video failed: {e}")
            video_url = None
        
        # Summary
        print(f"\n" + "=" * 70)
        print("PIPELINE TEST COMPLETE")
        print("=" * 70)
        
        if audio_url and video_url:
            print("🎉 ALL SYSTEMS FUNCTIONAL!")
            print(f"\n✅ Audio: http://localhost:8000{audio_url}")
            print(f"✅ Video: http://localhost:8000{video_url}")
            print("\n🚀 Ready for production demo!")
        elif audio_url:
            print("⚠️ Audio works, video needs attention")
        elif video_url:
            print("⚠️ Video works, audio needs attention")
        else:
            print("❌ Both services need configuration")
            print("\nCheck:")
            print("1. HF_API_KEY in .env")
            print("2. ELEVENLABS_API_KEY in .env")

if __name__ == "__main__":
    test_complete_pipeline()
