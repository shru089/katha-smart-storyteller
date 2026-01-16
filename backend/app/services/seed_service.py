"""
Seed Service - Populates database with story content
Updates rich story structures including movie-style reel scripts.
"""

import json
import os
import logging
from typing import Optional
from sqlmodel import Session, select

from app.models import Story, Chapter, Scene, Badge

logger = logging.getLogger("katha.seed")

# Default badges for gamification
DEFAULT_BADGES = [
    {
        "code": "FIRST_SCENE",
        "name": "First Step",
        "description": "Complete your first scene",
        "unlock_condition": "Complete 1 scene",
        "icon_url": "🌱"
    },
    {
        "code": "RAMAYANA_COMPLETE",
        "name": "Ramayana Voyager",
        "description": "Complete the entire Ramayana epic",
        "unlock_condition": "Complete all scenes in 'Ramayana'",
        "icon_url": "🏹"
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
        
        # Handle Cover Image - use AI generation prompt if needed
        cover_image = story_data.get("cover_image_url", "")
        if not cover_image or "unsplash" in cover_image:
            # Fallback to a better AI generated prompt link
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
            chapter = Chapter(
                story_id=story.id,
                index=chapter_data["index"],
                title=chapter_data["title"],
                short_summary=chapter_data.get("short_summary", "")
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
