"""
Generate Videos for ALL Scenes
Runs in background to process all scenes without video
"""
import sys
import os
import time
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlmodel import Session, select
from app.db import engine
from app.models import Scene
from app.services.video_service import video_service

def generate_all_videos():
    """Generate videos for all scenes that are missing them"""
    
    with Session(engine) as session:
        # Get scenes without video/image
        scenes = session.exec(
            select(Scene).where(Scene.ai_video_url == None).where(Scene.raw_text != "")
        ).all()
        
        print(f"🎬 Found {len(scenes)} scenes needing videos...")
        
        count = 0
        errors = 0
        
        for i, scene in enumerate(scenes, 1):
            print(f"\n[{i}/{len(scenes)}] Processing Scene {scene.id} (Chapter {scene.chapter_id})...")
            
            try:
                # Use ai_emotion if available, else default
                emotion = getattr(scene, 'ai_emotion', None) or getattr(scene, 'emotion', 'cinematic')
                
                # Generate video
                video_path = video_service.generate_scene_video(
                    scene_text=scene.raw_text,
                    emotion=emotion,
                    scene_id=scene.id
                )
                
                # Update DB
                scene.ai_video_url = video_path
                session.add(scene)
                session.commit()
                print(f"✅ Generated: {video_path}")
                count += 1
                
                # Rate limit (be nice to API)
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ Failed processing scene {scene.id}: {e}")
                errors += 1
                session.rollback()
        
        print(f"\n\n✨ Batch Complete!")
        print(f"✅ Successful: {count}")
        print(f"❌ Failed: {errors}")

if __name__ == "__main__":
    generate_all_videos()
