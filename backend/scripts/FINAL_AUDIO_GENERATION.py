"""
FINAL Audio Regeneration - All 85 Scenes with Character Voices

Run this in a NEW terminal after installing ffmpeg.
This will generate all audio with proper character emotions:
- Ram: Calm, soothing, bold
- Sita: Firm, unapologetic, strong
- King: Commanding, authoritative
- etc.
"""

import asyncio
import sys
import os
from pathlib import Path

# Ensure we're in the right directory
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from sqlmodel import Session, select
from app.db import engine
from app.models import Story, Chapter, Scene
from app.services.enhanced_audio_service import get_enhanced_audio_service


async def main():
    print("\n" + "="*80)
    print("KATHA AUDIO GENERATION - Final Character Voice Edition")
    print("="*80)
    print("\nCharacter Voice Profiles:")
    print("  • Ram: Calm, soothing, makes you feel safe (shanta)")
    print("  • Sita: Firm, unapologetic, bold (veera)")
    print("  • King: Commanding, authoritative (raudra)")
    print("  • Lakshman & Hanuman: Heroic, protective (veera)")
    print("  • Narrator: Smooth, neutral (narrative)")
    print("\n" + "="*80 + "\n")
    
    # Delete old audio files
    audio_dir = Path("static/audio")
    if audio_dir.exists():
        old_files = list(audio_dir.glob("scene_*.mp3"))
        if old_files:
            print(f"🗑️  Deleting {len(old_files)} old audio files...")
            for f in old_files:
                try:
                    f.unlink()
                except Exception as e:
                    print(f"    Warning: Could not delete {f.name}: {e}")
            print("    Cleanup complete.\n")
    
    # Initialize service
    audio_service = get_enhanced_audio_service()
    
    with Session(engine) as session:
        # Get both stories
        stories = session.exec(
            select(Story).where(Story.slug.in_(["ramayana", "mahabharata"]))
        ).all()
        
        if not stories:
            print("❌ No stories found! Make sure database is set up.")
            return
        
        total_generated = 0
        total_errors = 0
        
        for story in stories:
            print(f"\n{'='*80}")
            print(f"📖 Story: {story.title}")
            print(f"{'='*80}\n")
            
            # Get all chapters
            chapters = session.exec(
                select(Chapter)
                .where(Chapter.story_id == story.id)
                .order_by(Chapter.index)
            ).all()
            
            for chapter in chapters:
                print(f"  📜 Chapter {chapter.index}: {chapter.title}")
                
                # Get all scenes
                scenes = session.exec(
                    select(Scene)
                    .where(Scene.chapter_id == chapter.id)
                    .order_by(Scene.index)
                ).all()
                
                chapter_generated = 0
                chapter_errors = 0
                
                for scene in scenes:
                    try:
                        # Generate enhanced audio with dialogue emotions
                        print(f"     Scene {scene.index}... ", end='', flush=True)
                        
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
                        
                        print("✅")
                        
                    except Exception as e:
                        chapter_errors += 1
                        total_errors += 1
                        print(f"❌ Error: {str(e)[:50]}")
                
                print(f"     Summary: {chapter_generated}/{len(scenes)} generated")
                if chapter_errors > 0:
                    print(f"     Errors: {chapter_errors}")
                print()
        
        print("\n" + "="*80)
        print("REGENERATION COMPLETE!")
        print("="*80)
        print(f"\n📊 Final Statistics:")
        print(f"   ✅ Successfully Generated: {total_generated} files")
        if total_errors > 0:
            print(f"   ❌ Errors: {total_errors} files")
        print(f"   📁 Location: static/audio/")
        print(f"\n🎧 Audio Features:")
        print(f"   • Character-specific emotions")
        print(f"   • Natural dialogue flow")
        print(f"   • Instant playback (no delays)")
        print(f"   • Full controls (play/pause/seek)")
        print(f"\n✨ Ready for storytelling!\n")


if __name__ == "__main__":
    print("\n🚀 Starting audio generation...")
    print("📌 This may take 10-15 minutes for all 85 scenes.\n")
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user. Audio generation stopped.\n")
    except Exception as e:
        print(f"\n\n❌ Fatal error: {e}\n")
        import traceback
        traceback.print_exc()
