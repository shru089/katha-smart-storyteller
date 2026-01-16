"""
Batch Demo Video Generator
Pre-generates videos for key scenes to enable instant playback during demos
"""

import sys
import os
from typing import Optional

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.svd_video_service import svd_video_service
from app.services.elevenlabs_service import elevenlabs_service
from app.db import get_session
from app.models import Scene
from sqlmodel import select
import argparse

def batch_generate_demo_videos(limit: int = 10, chapter_id: Optional[int] = None):
    """
    Pre-generate videos for demo scenes
    
    Args:
        limit: Number of scenes to generate
        chapter_id: If specified, only generate for this chapter
    """
    
    print("=" * 70)
    print("KATHA DEMO VIDEO BATCH GENERATOR")
    print("=" * 70)
    print(f"\n🎯 Target: {limit} scenes")
    if chapter_id:
        print(f"📖 Chapter: {chapter_id}")
    
    with next(get_session()) as session:
        # Get scenes with emotions (better for demo)
        query = select(Scene).where(Scene.ai_emotion != None)
        
        if chapter_id:
            query = query.where(Scene.chapter_id == chapter_id)
        
        # Prioritize scenes without videos
        query = query.order_by(Scene.ai_video_url == None)
        query = query.limit(limit)
        
        scenes = session.exec(query).all()
        
        if not scenes:
            print("\n❌ No scenes found")
            return
        
        print(f"\n✅ Found {len(scenes)} scenes to process\n")
        
        successful = 0
        failed = 0
        skipped = 0
        
        for i, scene in enumerate(scenes, 1):
            print(f"\n{'─' * 70}")
            print(f"Scene {i}/{len(scenes)}: ID {scene.id}")
            print(f"Text: {scene.raw_text[:80]}...")
            print(f"Emotion: {scene.ai_emotion or 'None'}")
            
            # Skip if already has video
            if scene.ai_video_url:
                print("⏭️  Already has video, skipping...")
                skipped += 1
                continue
            
            try:
                # Generate video
                print("\n🎬 Generating SVD video (1-3 min)...")
                video_url = svd_video_service.generate_scene_video(
                    scene_text=scene.raw_text,
                    emotion=scene.ai_emotion,
                    scene_id=scene.id
                )
                
                # Update scene
                scene.ai_video_url = video_url
                session.add(scene)
                session.commit()
                
                print(f"✅ Video saved: {video_url}")
                successful += 1
                
                # Optional: Also generate audio
                if not scene.ai_audio_url:
                    try:
                        print("🎙️ Generating audio...")
                        audio_url = elevenlabs_service.generate_narration(
                            text=scene.raw_text[:500],  # Limit length
                            emotion=scene.ai_emotion,
                            scene_id=scene.id
                        )
                        scene.ai_audio_url = audio_url
                        session.add(scene)
                        session.commit()
                        print(f"✅ Audio saved: {audio_url}")
                    except Exception as e:
                        print(f"⚠️  Audio failed: {e}")
                
            except Exception as e:
                print(f"❌ Failed: {e}")
                failed += 1
                continue
        
        # Summary
        print("\n" + "=" * 70)
        print("BATCH GENERATION COMPLETE")
        print("=" * 70)
        print(f"✅ Successful: {successful}")
        print(f"⏭️  Skipped: {skipped}")
        print(f"❌ Failed: {failed}")
        print(f"\n🎉 {successful} scenes ready for instant demo playback!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Batch generate demo videos')
    parser.add_argument('--limit', type=int, default=10, help='Number of scenes to generate')
    parser.add_argument('--chapter', type=int, help='Specific chapter ID')
    
    args = parser.parse_args()
    
    batch_generate_demo_videos(limit=args.limit, chapter_id=args.chapter)
