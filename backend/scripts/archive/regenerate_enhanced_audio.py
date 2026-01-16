"""
Regenerate ALL Audio with Enhanced Dialogue Emotions

Uses the new EnhancedAudioService to generate audio with
character-specific emotional tones for dialogue.
"""

import asyncio
import sys
import os
from pathlib import Path
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from sqlmodel import Session, select
from app.db import engine
from app.models import Story, Chapter, Scene
from app.services.enhanced_audio_service import get_enhanced_audio_service


async def regenerate_all_enhanced_audio():
    print("\n" + "="*70)
    print("REGENERATING ALL AUDIO - Enhanced Dialogue Emotions")
    print("="*70 + "\n")
    
    # Delete old audio files
    audio_dir = Path("static/audio")
    if audio_dir.exists():
        old_files = list(audio_dir.glob("scene_*.mp3"))
        print(f"Deleting {len(old_files)} old audio files...")
        for f in old_files:
            f.unlink()
        print("Old files deleted.\n")
    
    audio_service = get_enhanced_audio_service()
    
    with Session(engine) as session:
        # Get both stories
        stories = session.exec(
            select(Story).where(Story.slug.in_(["ramayana", "mahabharata"]))
        ).all()
        
        total_generated = 0
        
        for story in stories:
            print(f"\n{'='*70}")
            print(f"Story: {story.title} ")
            print(f"{'='*70}\n")
            
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
                
                for scene in scenes:
                    try:
                        # Generate enhanced audio with dialogue emotions
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
                        
                        print(f"    Scene {scene.index}: ✓")
                        
                    except Exception as e:
                        print(f"    Scene {scene.index}: ERROR - {e}")
                
                print(f"    Generated: {chapter_generated}/{len(scenes)}\n")
        
        print("\n" + "="*70)
        print("REGENERATION COMPLETE!")
        print("="*70)
        print(f"\nTotal Audio Files Generated: {total_generated}")
        print(f"\nAll files now have:")
        print("  ✓ Clean natural voice (no SSML tags)")
        print("  ✓ Dialogue emotion support")
        print("  ✓ King's lines: Bold, commanding (raudra)")
        print("  ✓ Ram's lines: Calm, firm (shanta)")
        print("  ✓ Sita's lines: Firm, strong (shanta)")
        print("  ✓ Whispers: Soft, gentle (shanta)")
        print("  ✓ Shouts: Loud, intense (raudra)")
        print("\nReady for playback!\n")


if __name__ == "__main__":
    asyncio.run(regenerate_all_enhanced_audio())
