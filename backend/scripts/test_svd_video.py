"""
Test SVD Video Generation
Run this to verify Hugging Face SVD integration works
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.svd_video_service import svd_video_service
from app.db import get_session
from app.models import Scene
from sqlmodel import select

def test_svd_video_generation():
    """Test video generation on a real scene"""
    
    print("=" * 60)
    print("TESTING SVD VIDEO GENERATION")
    print("=" * 60)
    
    # Get a scene from database
    with next(get_session()) as session:
        stmt = select(Scene).limit(1)
        scene = session.exec(stmt).first()
        
        if not scene:
            print("❌ No scenes found in database")
            return
        
        print(f"\n📖 Scene ID: {scene.id}")
        print(f"📝 Text: {scene.raw_text[:100]}...")
        print(f"😊 Emotion: {scene.ai_emotion or 'None'}")
        
        print("\n🎬 Generating video...")
        print("   Step 1: Creating cinematic image...")
        print("   Step 2: Animating with Stable Video Diffusion...")
        print("   (This may take 1-3 minutes)\n")
        
        try:
            video_url = svd_video_service.generate_scene_video(
                scene_text=scene.raw_text,
                emotion=scene.ai_emotion,
                scene_id=scene.id
            )
            
            print("✅ VIDEO GENERATED SUCCESSFULLY!")
            print(f"📹 Video URL: {video_url}")
            print(f"\n🎯 Test complete! Check your video at:")
            print(f"   http://localhost:8000{video_url}")
            
        except Exception as e:
            print(f"❌ Generation failed: {e}")
            print("\nTroubleshooting:")
            print("1. Ensure HUGGINGFACE_API_KEY is set in .env")
            print("2. Get free token from: https://huggingface.co/settings/tokens")
            print("3. Check internet connection")
            return

if __name__ == "__main__":
    test_svd_video_generation()
