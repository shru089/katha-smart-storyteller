"""
Quick script to check all chapters and scenes in the database
"""
from sqlmodel import Session, select
from app.db import engine
from app.models import Story, Chapter, Scene

with Session(engine) as session:
    stories = session.exec(select(Story)).all()
    
    total_chapters = 0
    total_scenes = 0
    
    print("\n" + "="*80)
    print("📚 DATABASE CONTENT OVERVIEW")
    print("="*80 + "\n")
    
    for story in stories:
        print(f"\n📖 {story.title} (slug: {story.slug})")
        print("-" * 80)
        
        chapters = session.exec(
            select(Chapter)
            .where(Chapter.story_id == story.id)
            .order_by(Chapter.index)
        ).all()
        
        total_chapters += len(chapters)
        
        for chapter in chapters:
            scenes = session.exec(
                select(Scene)
                .where(Scene.chapter_id == chapter.id)
            ).all()
            
            total_scenes += len(scenes)
            
            print(f"   Ch{chapter.index}: {chapter.title}")
            print(f"           └─ {len(scenes)} scenes")
    
    print("\n" + "="*80)
    print(f"📊 TOTALS:")
    print(f"   Stories: {len(stories)}")
    print(f"   Chapters: {total_chapters}")
    print(f"   Scenes: {total_scenes}")
    print("="*80 + "\n")
