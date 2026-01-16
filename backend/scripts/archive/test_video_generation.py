"""
Test video generation with 3 sample scenes
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlmodel import Session, select
from app.db import engine
from app.models import Scene
from app.services.video_service import video_service

def test_video_generation():
    """Test video generation with first 3 scenes"""
    
    with Session(engine) as session:
        # Get first 3 scenes with text
        scenes = session.exec(
            select(Scene).where(Scene.raw_text != "").limit(3)
        ).all()
        
        if not scenes:
            print("❌ No scenes found in database")
            return
        
        print(f"🎬 Testing video generation with {len(scenes)} scenes...\n")
        
        for i, scene in enumerate(scenes, 1):
            print(f"\n{'='*60}")
            print(f"Scene {i}/{len(scenes)}: ID={scene.id}")
            print(f"Chapter: {scene.chapter_id}")
            print(f"Text: {scene.raw_text[:100]}...")
            print(f"Emotion: {scene.ai_emotion}")
            print(f"{'='*60}")
            
            try:
                # Generate video (image for MVP)
                video_path = video_service.generate_scene_video(
                    scene_text=scene.raw_text,
                    emotion=scene.ai_emotion,
                    scene_id=scene.id
                )
                
                # Update database
                scene.ai_video_url = video_path
                session.add(scene)
                session.commit()
                
                print(f"✅ SUCCESS! Video saved to: {video_path}")
                
            except Exception as e:
                print(f"❌ FAILED: {e}")
                session.rollback()
        
        print(f"\n\n🎉 Test complete! Check static/videos/scenes/ folder")

if __name__ == "__main__":
    test_video_generation()
