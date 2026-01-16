"""
Scenes API Routes
Provides endpoints for individual scene details and completion tracking
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from app.db import get_session
from app.models import Scene
from app.schemas import SceneOut
# Old AI service imports removed - functionality moved to new audio routes
# from app.services.ai_service import generate_scene_ai_metadata
# from app.services.image_service import generate_image_from_prompt
from app.services.gamification_service import complete_scene
# from app.services.voice_service import generate_voice, generate_movie_dialogue
# from app.services.video_service import generate_single_scene_video
from datetime import datetime
import logging

logger = logging.getLogger("katha.scenes")
router = APIRouter()


@router.get("/", response_model=List[SceneOut])
def get_scenes(
    skip: int = 0,
    limit: int = 100,
    has_video: bool = False,
    session: Session = Depends(get_session)
):
    """Get all scenes, optionally filtering for those with video reels"""
    query = select(Scene)
    if has_video:
        query = query.where(Scene.ai_video_url != None)
    
    # Sort by most recently generated if filtering by video
    if has_video:
        query = query.order_by(Scene.generated_at.desc())
        
    return session.exec(query.offset(skip).limit(limit)).all()


@router.get("/{scene_id}", response_model=SceneOut)
def get_scene(scene_id: int, session: Session = Depends(get_session)):
    """Get a specific scene by ID."""
    scene = session.get(Scene, scene_id)
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    return SceneOut.model_validate(scene)


@router.post("/{scene_id}/generate", response_model=SceneOut)
async def generate_scene_assets(
    scene_id: int, 
    fast_mode: bool = Query(default=True, description="Use fast animated video (5-10s) instead of SVD (1-3min)"),
    session: Session = Depends(get_session)
):
    """
    Generate AI video reel for a scene
    
    Modes:
    - fast_mode=True: Fast animated image with Ken Burns (5-10 seconds)
    - fast_mode=False: SVD video generation (1-3 minutes, higher quality)
    
    Pipeline:
    1. Generate cinematic image with Pollinations
    2. Fast mode: Apply Ken Burns animation
    3. SVD mode: Animate with Stable Video Diffusion
    """
    scene = session.get(Scene, scene_id)
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    logger.info(f"Generating {'fast' if fast_mode else 'SVD'} video for scene {scene_id}...")
    
    try:
        if fast_mode:
            # FAST MODE: Animated image with Ken Burns (5-10 seconds)
            from app.services.fast_video_service import fast_video_service
            video_url = fast_video_service.generate_fast_video(
                scene_text=scene.raw_text,
                emotion=scene.ai_emotion,
                scene_id=scene.id
            )
            logger.info(f"✅ Fast video generated: {video_url}")
        else:
            # SVD MODE: Full video generation (1-3 minutes)
            from app.services.svd_video_service import svd_video_service
            video_url = svd_video_service.generate_scene_video(
                scene_text=scene.raw_text,
                emotion=scene.ai_emotion,
                scene_id=scene.id
            )
            logger.info(f"✅ SVD video generated: {video_url}")
        
        # Update scene with video URL
        scene.ai_video_url = video_url
        scene.generated_at = datetime.utcnow()
        
        session.add(scene)
        session.commit()
        session.refresh(scene)
        
        return SceneOut.model_validate(scene)
        
    except Exception as e:
        logger.error(f"Video generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Video generation failed: {str(e)}")


@router.post("/{scene_id}/complete")
def mark_scene_complete(
    scene_id: int, 
    user_id: int = Query(...), 
    session: Session = Depends(get_session)
):
    try:
        return complete_scene(session=session, user_id=user_id, scene_id=scene_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
