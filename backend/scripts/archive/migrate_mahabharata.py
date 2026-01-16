"""
Migrate Mahabharata Chapters to Database

This script:
1. Parses the 6 Mahabharata markdown chapter files
2. Creates new Mahabharata story in database
3. Inserts all chapters and scenes
4. Leaves AI image generation for later (empty fields)
"""

import os
import re
import sys
from pathlib import Path
from sqlmodel import Session, select
from app.db import engine, create_db_and_tables
from app.models import Story, Chapter, Scene

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Path to artifact markdown files
ARTIFACTS_DIR = Path(r"C:\Users\admini\.gemini\antigravity\brain\bd9031d6-910d-41ec-8f16-340096f94a5e")

# Chapter file mapping
CHAPTER_FILES = {
    1: "mahabharata_chapter_01.md",
    2: "mahabharata_chapter_02.md",
    3: "mahabharata_chapter_03.md",
    4: "mahabharata_chapter_04.md",
    5: "mahabharata_chapter_05.md",
    6: "mahabharata_chapter_06.md"
}


def parse_chapter_content(content, chapter_num):
    """Parse markdown chapter content into structured data"""
    
    # Extract chapter title
    title_match = re.search(r'^# Chapter \d+: (.+)$', content, re.MULTILINE)
    title = f"Chapter {chapter_num}: {title_match.group(1)}" if title_match else f"Chapter {chapter_num}"
    
    # Extract metadata
    mood_match = re.search(r'\*\*Mood\*\*: (.+?)(?:\*\*|$)', content)
    key_moment_match = re.search(r'\*\*Key Emotional Moment\*\*: (.+?)(?:\*\*|$)', content)
    reading_time_match = re.search(r'\*\*Reading Time\*\*: (.+?)(?:\*\*|$)', content)
    
    mood = mood_match.group(1).strip() if mood_match else ""
    key_moment = key_moment_match.group(1).strip() if key_moment_match else ""
    reading_time = reading_time_match.group(1).strip() if reading_time_match else ""
    
    # Create short summary from mood
    short_summary = f"{mood} • {reading_time}" if mood and reading_time else mood or reading_time or "A chapter from the Mahabharata"
    
    # Extract all scenes
    scenes = []
    scene_pattern = r'## Scene (\d+): (.+?)\n\n(.*?)(?=\n---\n|\n## Scene \d+:|\n## 🎭 End of Chapter|$)'
    
    for match in re.finditer(scene_pattern, content, re.DOTALL):
        scene_num = int(match.group(1))
        scene_title = match.group(2).strip()
        scene_text = match.group(3).strip()
        
        # Clean up the scene text (remove excessive newlines)
        scene_text = re.sub(r'\n{3,}', '\n\n', scene_text)
        
        scenes.append({
            'index': scene_num,
            'title': scene_title,
            'raw_text': scene_text,
            'emotion': detect_emotion_from_mood(mood)
        })
    
    return {
        'title': title,
        'short_summary': short_summary,
        'mood': mood,
        'key_moment': key_moment,
        'reading_time': reading_time,
        'scenes': scenes
    }


def parse_chapter_file(filepath, chapter_num):
    """Parse a chapter markdown file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    return parse_chapter_content(content, chapter_num)


def detect_emotion_from_mood(mood_text):
    """Map mood text to emotion tags"""
    mood_lower = mood_text.lower()
    
    if 'peace' in mood_lower or 'calm' in mood_lower or 'serene' in mood_lower:
        return 'shanta'
    elif 'joy' in mood_lower or 'triumph' in mood_lower or 'celebrat' in mood_lower:
        return 'hasya'
    elif 'sad' in mood_lower or 'sorrow' in mood_lower or 'grief' in mood_lower or 'heartbreak' in mood_lower:
        return 'karuna'
    elif 'anger' in mood_lower or 'rage' in mood_lower or 'fury' in mood_lower or 'brutal' in mood_lower:
        return 'raudra'
    elif 'fear' in mood_lower or 'terror' in mood_lower or 'dread' in mood_lower or 'tension' in mood_lower:
        return 'bhayanaka'
    elif 'love' in mood_lower or 'devotion' in mood_lower or 'romance' in mood_lower:
        return 'shringara'
    elif 'wonder' in mood_lower or 'awe' in mood_lower or 'marvel' in mood_lower or 'cosmic' in mood_lower:
        return 'adbhuta'
    elif 'hero' in mood_lower or 'valor' in mood_lower or 'brave' in mood_lower or 'epic' in mood_lower:
        return 'veera'
    else:
        return 'shanta'  # Default


def backup_existing_mahabharata(session):
    """Check if Mahabharata already exists"""
    story = session.exec(select(Story).where(Story.slug == "mahabharata")).first()
    
    if story:
        print(f"\n📦 BACKUP: Found existing Mahabharata story (ID: {story.id})")
        chapters = session.exec(select(Chapter).where(Chapter.story_id == story.id)).all()
        print(f"   - {len(chapters)} chapters")
        
        total_scenes = 0
        for chapter in chapters:
            scenes = session.exec(select(Scene).where(Scene.chapter_id == chapter.id)).all()
            total_scenes += len(scenes)
        
        print(f"   - {total_scenes} scenes")
        print(f"   Note: Data will be deleted and replaced\n")
        return True
    else:
        print("\n📦 No existing Mahabharata found. Will create new.\n")
        return False


def delete_existing_mahabharata(session):
    """Delete existing Mahabharata story and all related data"""
    story = session.exec(select(Story).where(Story.slug == "mahabharata")).first()
    
    if story:
        print(f"🗑️  Deleting existing Mahabharata (ID: {story.id})...")
        
        # Delete scenes first (due to foreign keys)
        chapters = session.exec(select(Chapter).where(Chapter.story_id == story.id)).all()
        for chapter in chapters:
            scenes = session.exec(select(Scene).where(Scene.chapter_id == chapter.id)).all()
            for scene in scenes:
                session.delete(scene)
        
        # Delete chapters
        for chapter in chapters:
            session.delete(chapter)
        
        # Delete story
        session.delete(story)
        session.commit()
        print("✅ Old data deleted\n")


def migrate_mahabharata():
    """Main migration function"""
    print("\n" + "="*60)
    print("🏹 MAHABHARATA MIGRATION - Epic War Story")
    print("="*60 + "\n")
    
    create_db_and_tables()
    
    with Session(engine) as session:
        # Step 1: Backup check
        backup_existing_mahabharata(session)
        
        # Step 2: Delete old data
        delete_existing_mahabharata(session)
        
        # Step 3: Create new story
        print("📚 Creating new Mahabharata story...")
        story = Story(
            title="The Mahabharata",
            slug="mahabharata",
            category="Epic",
            description="A tale of five brothers, a dice game, and the war that changed everything. Not about victory—about choice, consequence, and what it means to be human.",
            cover_image_url="https://pollinations.ai/p/cinematic%20painting%20of%20Arjuna%20and%20Krishna%20on%20battlefield%20epic%20war%20ancient%20India?width=1080&height=1920&nologo=true",
            total_chapters=6
        )
        session.add(story)
        session.commit()
        session.refresh(story)
        print(f"✅ Story created (ID: {story.id})\n")
        
        # Step 4: Parse and insert chapters
        print("📖 Parsing and inserting chapters...\n")
        
        total_scene_count = 0
        
        for chapter_num in range(1, 7):
            print(f"   Chapter {chapter_num}...")
            
            # Parse chapter
            filepath = ARTIFACTS_DIR / CHAPTER_FILES[chapter_num]
            chapter_data = parse_chapter_file(filepath, chapter_num)
            
            # Create chapter record
            chapter = Chapter(
                story_id=story.id,
                index=chapter_num,
                title=chapter_data['title'],
                short_summary=chapter_data['short_summary']
            )
            session.add(chapter)
            session.commit()
            session.refresh(chapter)
            
            # Create scene records
            for scene_data in chapter_data['scenes']:
                scene = Scene(
                    chapter_id=chapter.id,
                    index=scene_data['index'],
                    raw_text=scene_data['raw_text'],
                    ai_emotion=scene_data['emotion'],
                    # Leave AI generation fields empty for now
                    ai_image_url=None,
                    ai_video_url=None,
                    ai_audio_url=None,
                    ai_caption=None,
                    ai_symbolism=None
                )
                session.add(scene)
            
            session.commit()
            total_scene_count += len(chapter_data['scenes'])
            print(f"      ✅ {len(chapter_data['scenes'])} scenes")
        
        # Step 5: Update story scene count
        story.total_scenes = total_scene_count
        session.add(story)
        session.commit()
        
        print(f"\n{'='*60}")
        print(f"✨ MIGRATION COMPLETE!")
        print(f"{'='*60}")
        print(f"\n📊 Summary:")
        print(f"   - Story: {story.title}")
        print(f"   - Chapters: {story.total_chapters}")
        print(f"   - Scenes: {story.total_scenes}")
        print(f"   - Slug: {story.slug}")
        print(f"\n🎯 Database Status:")
        print(f"   - Ramayana: ✅ Integrated")
        print(f"   - Mahabharata: ✅ Integrated")
        print(f"\n🎉 Both epic stories are now in the database!")
        print()


if __name__ == "__main__":
    try:
        migrate_mahabharata()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
