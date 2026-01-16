"""
Chapters API Routes
Provides endpoints for chapter details and fetching scenes within a chapter
Directly uses Pydantic validation for cleaner code.
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session, select
from app.db import get_session
from app.models import Chapter, Scene
from app.schemas import ChapterOut, SceneOut

router = APIRouter()


@router.get("/{chapter_id}", response_model=ChapterOut)
def get_chapter(chapter_id: int, session: Session = Depends(get_session)):
    """
    Get detailed information about a single chapter.
    """
    chapter = session.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    # Fetch scenes for this chapter
    scenes_db = session.exec(
        select(Scene)
        .where(Scene.chapter_id == chapter_id)
        .order_by(Scene.index)
    ).all()
    
    scenes_out = [SceneOut.model_validate(s) for s in scenes_db]
    
    # Find next chapter in the same story
    next_chapter = session.exec(
        select(Chapter)
        .where(Chapter.story_id == chapter.story_id)
        .where(Chapter.index == chapter.index + 1)
    ).first()

    return ChapterOut(
        id=chapter.id,
        story_id=chapter.story_id,
        index=chapter.index,
        title=chapter.title,
        next_chapter_id=next_chapter.id if next_chapter else None,
        short_summary=chapter.short_summary,
        cover_image_url=chapter.cover_image_url,
        scenes=scenes_out
    )


@router.get("/{chapter_id}/scenes", response_model=List[SceneOut])
def get_scenes_for_chapter(chapter_id: int, session: Session = Depends(get_session)):
    """
    Fetch all scenes belonging to a specific chapter.
    Ordered by scene index.
    """
    chapter = session.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
        
    scenes = session.exec(
        select(Scene)
        .where(Scene.chapter_id == chapter_id)
        .order_by(Scene.index)
    ).all()
    
    return [SceneOut.model_validate(s) for s in scenes]
