"""
Regenerate Audio for Ramayana Chapters 1-3

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

async def regenerate_chapters_1_to_3():
    print("\n" + "="*70)
    print("🎙️  REGENERATING AUDIO FOR CHAPTERS 1-3")
    print("   Multi-Voice + Volume Adjustments + Character Mapping")
    print("="*70 + "\n")
    
    audio_service = get_enhanced_audio_service()
    
    with Session(engine) as session:
        # Get Ramayana story
        story = session.exec(
            select(Story).where(Story.slug == "ramayana")
        ).first()
        
        if not story:
            print("❌ Ramayana story not found!")
            print("   Available stories:")
            stories = session.exec(select(Story)).all()
            for s in stories:
                print(f"   - {s.slug}")
            return
        
        print(f"📖 Story: {story.title}")
        print(f"   ID: {story.id}\n")
        
        total_generated = 0
        total_scenes = 0
        
        # Process chapters 1, 2, 3
        for chapter_index in [1, 2, 3]:
            chapter = session.exec(
                select(Chapter)
                .where(Chapter.story_id == story.id)
                .where(Chapter.index == chapter_index)
            ).first()
            
            if not chapter:
                print(f"⚠️  Chapter {chapter_index} not found, skipping...\n")
                continue
            
            print(f"\n{'='*70}")
            print(f"📚 Chapter {chapter.index}: {chapter.title}")
            print(f"{'='*70}\n")
            
            # Get all scenes in this chapter
            scenes = session.exec(
                select(Scene)
                .where(Scene.chapter_id == chapter.id)
                .order_by(Scene.index)
            ).all()
            
            total_scenes += len(scenes)
            
            for scene in scenes:
                emotion = scene.ai_emotion or 'narrative'
                
                print(f"  🎬 Scene {scene.index}: {emotion}")
                print(f"     Symbolism: {scene.ai_symbolism or 'N/A'}")
                
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
                    volume_desc = ""
                    if volume_mult > 1.0:
                        volume_desc = f"+{int((volume_mult-1)*100)}% louder"
                    elif volume_mult < 1.0:
                        volume_desc = f"{int((volume_mult-1)*100)}% quieter"
                    else:
                        volume_desc = "baseline"
                    
                    print(f"     ✅ Generated: {audio_path}")
                    print(f"     🔊 Volume: {volume_desc}\n")
                    
                except Exception as e:
                    print(f"     ❌ Error: {e}\n")
        
        print("\n" + "="*70)
        print("🎉 REGENERATION COMPLETE!")
        print("="*70)
        print(f"\n📊 Summary:")
        print(f"   Total scenes processed: {total_scenes}")
        print(f"   Successfully generated: {total_generated}")
        print(f"   Success rate: {(total_generated/total_scenes*100) if total_scenes > 0 else 0:.1f}%")
        print(f"\n✨ Features applied:")
        print(f"   • Multi-voice (male/female characters)")
        print(f"   • Volume adjustments (louder for joy/anger, quieter for sadness)")
        print(f"   • Enhanced emotion parameters")
        print(f"   • 20+ character mappings\n")

if __name__ == "__main__":
    asyncio.run(regenerate_chapters_1_to_3())
