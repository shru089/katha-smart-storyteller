"""
Seed Service - Populates database with story content
Updates rich story structures including movie-style reel scripts.
"""

import json
import os
import glob
import logging
from typing import Optional
from sqlmodel import Session, select

from app.models import Story, Chapter, Scene, Badge

logger = logging.getLogger("katha.seed")

# Default badges for gamification
DEFAULT_BADGES = [
    {
        "code": "story_explorer",
        "name": "Story Explorer",
        "description": "Read your first story",
        "unlock_condition": "Complete 1 story",
        "icon_url": "book"
    },
    {
        "code": "devoted_reader",
        "name": "Devoted Reader",
        "description": "Read 5 stories",
        "unlock_condition": "Complete 5 stories",
        "icon_url": "favorite"
    },
    {
        "code": "cultural_scholar",
        "name": "Cultural Scholar",
        "description": "Complete 10 stories",
        "unlock_condition": "Complete 10 stories",
        "icon_url": "psychology"
    },
    {
        "code": "master_storyteller",
        "name": "Master Storyteller",
        "description": "Complete all stories",
        "unlock_condition": "Complete all stories",
        "icon_url": "auto_awesome"
    }
]


def get_stories_json_path() -> str:
    """Find the stories.json file."""
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "../data/stories.json"),
        os.path.join(os.path.dirname(__file__), "data/stories.json"),
        "backend/app/data/stories.json",
        "app/data/stories.json",
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            return path
    
    return possible_paths[0]


def seed_badges(session: Session) -> int:
    """Seed default badges."""
    created = 0
    for badge_data in DEFAULT_BADGES:
        existing = session.exec(
            select(Badge).where(Badge.code == badge_data["code"])
        ).first()
        
        if not existing:
            badge = Badge(**badge_data)
            session.add(badge)
            created += 1
    
    session.commit()
    return created


def seed_stories(session: Session) -> dict:
    """
    Seed stories from stories.json.
    Includes movie-style reel scripts.
    """
    data_path = get_stories_json_path()
    
    if not os.path.exists(data_path):
        logger.error(f"Stories data file not found: {data_path}")
        return {"status": "error", "message": "stories.json not found"}
    
    with open(data_path, "r", encoding="utf-8") as f:
        stories_data = json.load(f)
    
    results = {
        "stories_created": 0,
        "stories_updated": 0,
        "chapters_created": 0,
        "scenes_created": 0,
        "stories": []
    }
    
    for story_data in stories_data:
        # Check if story exists
        existing_story = session.exec(
            select(Story).where(Story.slug == story_data["slug"])
        ).first()
        
        # If exists, we'll update it instead of skipping, to ensure new fields are added
        story = existing_story if existing_story else Story(slug=story_data["slug"], title=story_data["title"])
        
        story.title = story_data["title"]
        story.description = story_data.get("description", "")
        story.category = story_data.get("category", "Folklore")
        
        # Handle Cover Image - prioritize local offline assets for 100% reliability
        cover_image = story_data.get("cover_image_url", "")
        if "ramayana" in story.slug:
            cover_image = "/static/images/stories/ramayana_cover.png"
        elif "mahabharata" in story.slug:
            cover_image = "/static/images/stories/mahabharata_cover.png"
        elif "gita" in story.slug:
            cover_image = "/static/images/stories/mahabharata_cover.png"
        
        if not cover_image:
            prompt = f"cinematic high quality painting of {story.title} indian mythology style 8k"
            cover_image = f"https://pollinations.ai/p/{prompt.replace(' ', '%20')}?width=800&height=1200&nologo=true"
        
        story.cover_image_url = cover_image
        
        session.add(story)
        session.commit()
        session.refresh(story)
        
        # Clear existing chapters to avoid duplicates on update
        if existing_story:
            from sqlmodel import delete
            session.exec(delete(Scene).where(Scene.chapter_id.in_(
                select(Chapter.id).where(Chapter.story_id == story.id)
            )))
            session.exec(delete(Chapter).where(Chapter.story_id == story.id))
            session.commit()
            results["stories_updated"] += 1
        else:
            results["stories_created"] += 1
        
        total_scenes = 0
        
        # Create chapters
        for chapter_data in story_data.get("chapters", []):
            # Dynamically resolve matching offline timestamped chapter cover
            prefix = "ramayana" if "ramayana" in story.slug else "mahabharata"
            search_pattern = f"static/images/covers/{prefix}_ch{chapter_data['index']}_cover_*.png"
            files = glob.glob(search_pattern) or glob.glob(f"backend/{search_pattern}")
            ch_cover = ""
            if files:
                ch_cover = f"/static/images/covers/{os.path.basename(files[0])}"
            else:
                ch_cover = "/static/images/stories/ramayana_cover.png" if prefix == "ramayana" else "/static/images/stories/mahabharata_cover.png"

            chapter = Chapter(
                story_id=story.id,
                index=chapter_data["index"],
                title=chapter_data["title"],
                short_summary=chapter_data.get("short_summary", ""),
                cover_image_url=ch_cover
            )
            session.add(chapter)
            session.commit()
            session.refresh(chapter)
            results["chapters_created"] += 1
            
            # Create scenes
            for scene_data in chapter_data.get("scenes", []):
                scene = Scene(
                    chapter_id=chapter.id,
                    index=scene_data["index"],
                    raw_text=scene_data["raw_text"],
                    reel_script=scene_data.get("reel_script", ""),
                    ai_emotion=scene_data.get("emotion", "shanta"),
                    ai_symbolism=scene_data.get("symbolism", "")
                )
                session.add(scene)
                total_scenes += 1
                results["scenes_created"] += 1
            
            session.commit()
        
        # Update story totals
        story.total_chapters = len(story_data.get("chapters", []))
        story.total_scenes = total_scenes
        session.add(story)
        session.commit()
        
        results["stories"].append({
            "title": story_data["title"],
            "status": "synchronized",
            "chapters": story.total_chapters,
            "scenes": story.total_scenes
        })
    
    return results


def seed_all(session: Session) -> dict:
    """Seed all data."""
    try:
        badges_created = seed_badges(session)
        story_results = seed_stories(session)
        return {
            "status": "ok",
            "message": f"Synchronized {len(story_results['stories'])} stories",
            "badges_created": badges_created,
            "details": story_results
        }
    except Exception as e:
        logger.error(f"Seed error: {e}")
        return {"status": "error", "message": str(e)}


def reset_and_seed(session: Session) -> dict:
    """Reset and reseed."""
    try:
        from sqlmodel import delete
        session.exec(delete(Scene))
        session.exec(delete(Chapter))
        session.exec(delete(Story))
        session.commit()
        return seed_all(session)
    except Exception as e:
        logger.error(f"Reset and seed error: {e}")
        return {"status": "error", "message": str(e)}
