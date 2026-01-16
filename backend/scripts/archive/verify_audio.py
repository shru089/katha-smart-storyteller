"""
Verify Audio Generation Results

Check how many scenes have audio URLs in the database.
"""

import sys
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from sqlmodel import Session, select
from app.db import engine
from app.models import Story, Chapter, Scene

with Session(engine) as session:
    print("\n" + "="*70)
    print("AUDIO GENERATION VERIFICATION")
    print("="*70 + "\n")
    
    # Get both stories
    stories = session.exec(
        select(Story).where(Story.slug.in_(["ramayana", "mahabharata"]))
    ).all()
    
    for story in stories:
        print(f"\n{story.title}")
        print("-" * 70)
        
        chapters = session.exec(
            select(Chapter)
            .where(Chapter.story_id == story.id)
            .order_by(Chapter.index)
        ).all()
        
        total_scenes = 0
        audio_scenes = 0
        
        for chapter in chapters:
            scenes = session.exec(
                select(Scene)
                .where(Scene.chapter_id == chapter.id)
                .order_by(Scene.index)
            ).all()
            
            chapter_audio = sum(1 for s in scenes if s.ai_audio_url)
            total_scenes += len(scenes)
            audio_scenes += chapter_audio
            
            status = "COMPLETE" if chapter_audio == len(scenes) else f"{chapter_audio}/{len(scenes)}"
            print(f"  Chapter {chapter.index}: {status}")
        
        print(f"\nTotal: {audio_scenes}/{total_scenes} scenes with audio")
        
        if audio_scenes == total_scenes:
            print("STATUS: ALL AUDIO GENERATED")
        else:
            print(f"STATUS: {total_scenes - audio_scenes} scenes missing audio")
    
    print("\n" + "="*70 + "\n")
