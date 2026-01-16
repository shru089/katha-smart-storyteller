"""
Stories API Routes
Provides endpoints for listing stories, getting story details with chapters and scenes
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlmodel import Session, select
from app.db import get_session
from app.models import Story, Chapter, Scene
from app.schemas import StoryOut, ChapterOut, SceneOut

router = APIRouter()


@router.get("/", response_model=List[StoryOut])
def list_stories(
    session: Session = Depends(get_session),
    q: Optional[str] = Query(None, description="Search query for story title"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of stories to return"),
    include_chapters: bool = Query(False, description="Include chapter details in response")
):
    """
    List all stories with optional filtering.
    For performance, chapters are not included by default.
    """
    query = select(Story)
    
    if q:
        query = query.where(Story.title.ilike(f"%{q}%"))
    if category and category.lower() != "all":
        query = query.where(Story.category.ilike(category))
    
    query = query.limit(limit)
    stories = session.exec(query).all()
    
    result = []
    for story in stories:
        chapters_out = []
        
        if include_chapters:
            chapters = session.exec(
                select(Chapter)
                .where(Chapter.story_id == story.id)
                .order_by(Chapter.index)
            ).all()
            
            for chapter in chapters:
                chapters_out.append(ChapterOut(
                    id=chapter.id,
                    story_id=chapter.story_id,
                    index=chapter.index,
                    title=chapter.title,
                    short_summary=chapter.short_summary,
                    scenes=[]  # Don't include scenes in list view
                ))
        
        result.append(StoryOut(
            id=story.id,
            title=story.title,
            slug=story.slug,
            description=story.description,
            category=story.category,
            cover_image_url=story.cover_image_url,
            total_chapters=story.total_chapters,
            total_scenes=story.total_scenes,
            chapters=chapters_out
        ))
    
    return result


@router.get("/{story_id}", response_model=StoryOut)
def get_story(
    story_id: int, 
    session: Session = Depends(get_session),
    include_scenes: bool = Query(True, description="Include scene details in chapters")
):
    """
    Get a single story with all chapters and optionally scenes.
    """
    story = session.get(Story, story_id)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Get chapters
    chapters_db = session.exec(
        select(Chapter)
        .where(Chapter.story_id == story.id)
        .order_by(Chapter.index)
    ).all()
    
    chapters_out = []
    for chapter in chapters_db:
        scenes_out = []
        
        if include_scenes:
            scenes_db = session.exec(
                select(Scene)
                .where(Scene.chapter_id == chapter.id)
                .order_by(Scene.index)
            ).all()
            
            for scene in scenes_db:
                scenes_out.append(SceneOut(
                    id=scene.id,
                    chapter_id=scene.chapter_id,
                    index=scene.index,
                    raw_text=scene.raw_text,
                    caption=scene.ai_caption,
                    symbolism=scene.ai_symbolism,
                    emotion=scene.ai_emotion,
                    music_tag=scene.ai_background_music_tag,
                    image_prompt=scene.ai_image_prompt,
                    image_url=scene.ai_image_url,
                    ai_image_url=scene.ai_image_url,
                    ai_video_url=scene.ai_video_url,
                    ai_audio_url=scene.ai_audio_url,
                    audio_url=scene.ai_audio_url
                ))
        
        chapters_out.append(ChapterOut(
            id=chapter.id,
            story_id=chapter.story_id,
            index=chapter.index,
            title=chapter.title,
            short_summary=chapter.short_summary,
            scenes=scenes_out
        ))
    
    return StoryOut(
        id=story.id,
        title=story.title,
        slug=story.slug,
        description=story.description,
        category=story.category,
        cover_image_url=story.cover_image_url,
        total_chapters=story.total_chapters,
        total_scenes=story.total_scenes,
        chapters=chapters_out
    )


@router.get("/slug/{slug}", response_model=StoryOut)
def get_story_by_slug(slug: str, session: Session = Depends(get_session)):
    """
    Get a story by its slug (URL-friendly identifier).
    """
    story = session.exec(
        select(Story).where(Story.slug == slug)
    ).first()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Reuse the get_story logic
    return get_story(story.id, session)


@router.get("/{story_id}/chapters", response_model=List[ChapterOut])
def get_story_chapters(story_id: int, session: Session = Depends(get_session)):
    """
    Get all chapters for a story (without scenes for lighter response).
    """
    story = session.get(Story, story_id)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    chapters = session.exec(
        select(Chapter)
        .where(Chapter.story_id == story_id)
        .order_by(Chapter.index)
    ).all()
    
    return [
        ChapterOut(
            id=c.id,
            story_id=c.story_id,
            index=c.index,
            title=c.title,
            short_summary=c.short_summary,
            scenes=[]
        )
        for c in chapters
    ]


@router.get("/categories/list")
def list_categories(session: Session = Depends(get_session)):
    """
    Get all unique story categories.
    """
    stories = session.exec(select(Story)).all()
    categories = list(set([s.category for s in stories if s.category]))
    return {"categories": sorted(categories)}
