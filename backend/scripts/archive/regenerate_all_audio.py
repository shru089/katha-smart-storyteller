"""
Complete Audio Regeneration for ALL Stories

Regenerates audio for ALL chapters in:
- Ramayana (7 chapters, multiple scenes each)
- Mahabharata (1 chapter currently)

Applies ALL enhancements:
- Multi-voice system (male/female characters)
- Volume-based emotions (louder for joy/anger, quieter for sadness)
- Enhanced emotion parameters
- Complete character mapping (20+ characters)
"""

import asyncio
import sys
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from sqlmodel import Session, select
from app.db import engine
from app.models import Story, Chapter, Scene
from app.services.enhanced_audio_service import get_enhanced_audio_service
from datetime import datetime

async def regenerate_all_audio():
    print("\n" + "="*80)
    print("🎙️  COMPLETE AUDIO REGENERATION FOR ALL STORIES")
    print("   Multi-Voice + Volume Adjustments + 20+ Character Mapping")
    print("="*80 + "\n")
    
    start_time = datetime.now()
    audio_service = get_enhanced_audio_service()
    
    # Statistics
    total_stories = 0
    total_chapters = 0
    total_scenes = 0
    total_generated = 0
    total_failed = 0
    
    with Session(engine) as session:
        # Get all stories
        stories = session.exec(select(Story)).all()
        
        if not stories:
            print("❌ No stories found in database!")
            return
        
        print(f"📚 Found {len(stories)} stor{'y' if len(stories) == 1 else 'ies'}\n")
        
        for story in stories:
            total_stories += 1
            print(f"\n{'='*80}")
            print(f"📖 Story {total_stories}: {story.title}")
            print(f"   Slug: {story.slug}")
            print(f"{'='*80}\n")
            
            # Get all chapters for this story
            chapters = session.exec(
                select(Chapter)
                .where(Chapter.story_id == story.id)
                .order_by(Chapter.index)
            ).all()
            
            if not chapters:
                print(f"   ⚠️  No chapters found for {story.title}\n")
                continue
            
            print(f"   Chapters: {len(chapters)}\n")
            
            for chapter in chapters:
                total_chapters += 1
                print(f"\n   {'-'*76}")
                print(f"   📚 Chapter {chapter.index}: {chapter.title}")
                print(f"   {'-'*76}\n")
                
                # Get all scenes in this chapter
                scenes = session.exec(
                    select(Scene)
                    .where(Scene.chapter_id == chapter.id)
                    .order_by(Scene.index)
                ).all()
                
                if not scenes:
                    print(f"      ⚠️  No scenes in this chapter\n")
                    continue
                
                total_scenes += len(scenes)
                
                for scene in scenes:
                    emotion = scene.ai_emotion or 'narrative'
                    
                    # Show progress
                    print(f"      🎬 Scene {scene.index}: {emotion}")
                    if scene.ai_symbolism:
                        # Truncate long symbolism
                        symbolism = scene.ai_symbolism[:60] + "..." if len(scene.ai_symbolism) > 60 else scene.ai_symbolism
                        print(f"         💫 {symbolism}")
                    
                    try:
                        # Generate new audio with ALL enhancements
                        audio_path = await audio_service.generate_audio_for_scene(
                            scene_text=scene.raw_text,
                            scene_id=scene.id,
                            scene_emotion=emotion
                        )
                        
                        # Update database
                        scene.ai_audio_url = audio_path
                        session.add(scene)
                        session.commit()
                        
                        total_generated += 1
                        
                        # Show volume info
                        volume_mult = audio_service.VOLUME_MAPPING.get(emotion, 1.0)
                        if volume_mult > 1.0:
                            volume_desc = f"📢 +{int((volume_mult-1)*100)}% louder"
                        elif volume_mult < 1.0:
                            volume_desc = f"🔉 {int((volume_mult-1)*100)}% quieter"
                        else:
                            volume_desc = "🔊 baseline"
                        
                        print(f"         ✅ {audio_path}")
                        print(f"         {volume_desc}\n")
                        
                    except Exception as e:
                        total_failed += 1
                        print(f"         ❌ Error: {str(e)[:100]}\n")
    
    # Final summary
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    print("\n" + "="*80)
    print("🎉 REGENERATION COMPLETE!")
    print("="*80)
    print(f"\n📊 Summary:")
    print(f"   Stories processed: {total_stories}")
    print(f"   Chapters processed: {total_chapters}")
    print(f"   Total scenes: {total_scenes}")
    print(f"   ✅ Successfully generated: {total_generated}")
    print(f"   ❌ Failed: {total_failed}")
    print(f"   Success rate: {(total_generated/total_scenes*100) if total_scenes > 0 else 0:.1f}%")
    print(f"   ⏱️  Time taken: {duration:.1f}s ({duration/60:.1f} minutes)")
    
    if total_scenes > 0:
        print(f"   ⚡ Average: {duration/total_scenes:.2f}s per scene")
    
    print(f"\n✨ Features applied:")
    print(f"   • Multi-voice system (male/female characters)")
    print(f"   • Volume adjustments (louder for joy/anger, quieter for sadness)")
    print(f"   • Enhanced emotion parameters (9 rasas)")
    print(f"   • 20+ character voice mappings")
    print(f"   • Gender-appropriate voice selection")
    
    print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    print("\n⚠️  This will regenerate audio for ALL chapters in ALL stories.")
    print("   This may take several minutes depending on the number of scenes.\n")
    
    asyncio.run(regenerate_all_audio())
