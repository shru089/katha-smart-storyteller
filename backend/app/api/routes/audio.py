"""
Audio Generation API Routes

Endpoints for generating podcast-style audio narration for story scenes.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlmodel import Session, select
from app.db import engine
from app.models import Scene
from app.services.enhanced_audio_service import get_enhanced_audio_service

router = APIRouter(prefix="/audio", tags=["audio"])


class AudioGenerateRequest(BaseModel):
    """Request body for audio generation"""
    scene_id: int
    voice: Optional[str] = "female"  # female, male, narrator_male, narrator_female
    regenerate: Optional[bool] = False  # Force regenerate even if exists


class AudioGenerateResponse(BaseModel):
    """Response for audio generation"""
    success: bool
    audio_url: Optional[str] = None
    message: str


@router.post("/generate", response_model=AudioGenerateResponse)
async def generate_scene_audio(request: AudioGenerateRequest):
    """
    Generate audio podcast narration for a scene
    
    Uses Edge TTS with SSML emotion mapping based on the scene's rasa.
    """
    try:
        # Get scene from database
        with Session(engine) as session:
            scene = session.get(Scene, request.scene_id)
            
            if not scene:
                raise HTTPException(status_code=404, detail="Scene not found")
            
            # Check if audio already exists
            if scene.ai_audio_url and not request.regenerate:
                return AudioGenerateResponse(
                    success=True,
                    audio_url=scene.ai_audio_url,
                    message="Using existing audio"
                )
            
            # Generate audio
            audio_service = get_enhanced_audio_service()
            audio_path = await audio_service.generate_audio_for_scene(
                scene_text=scene.raw_text,
                scene_id=scene.id,
                scene_emotion=scene.ai_emotion
            )
            
            # Update scene with audio URL
            scene.ai_audio_url = audio_path
            session.add(scene)
            session.commit()
            
            return AudioGenerateResponse(
                success=True,
                audio_url=audio_path,
                message="Audio generated successfully"
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio generation failed: {str(e)}")


@router.post("/generate-chapter/{chapter_id}")
async def generate_chapter_audio(chapter_id: int, voice: str = "female"):
    """
    Generate audio for all scenes in a chapter
    
    Useful for batch generation of podcast episodes.
    """
    try:
        with Session(engine) as session:
            from app.models import Chapter
            
            chapter = session.get(Chapter, chapter_id)
            if not chapter:
                raise HTTPException(status_code=404, detail="Chapter not found")
            
            # Get all scenes for this chapter
            scenes = session.exec(
                select(Scene).where(Scene.chapter_id == chapter_id).order_by(Scene.index)
            ).all()
            
            if not scenes:
                return {
                    "success": False,
                    "message": "No scenes found in chapter"
                }
            
            audio_service = get_enhanced_audio_service()
            generated_count = 0
            
            # Generate audio for each scene
            for scene in scenes:
                if not scene.ai_audio_url:  # Only generate if doesn't exist
                    audio_path = await audio_service.generate_audio_for_scene(
                        scene_text=scene.raw_text,
                        scene_id=scene.id,
                        scene_emotion=scene.ai_emotion
                    )
                    scene.ai_audio_url = audio_path
                    session.add(scene)
                    generated_count += 1
            
            session.commit()
            
            return {
                "success": True,
                "message": f"Generated audio for {generated_count}/{len(scenes)} scenes",
                "chapter_title": chapter.title,
                "total_scenes": len(scenes),
                "generated": generated_count
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chapter audio generation failed: {str(e)}")


@router.get("/voices")
async def list_voices():
    """List available voices and their descriptions"""
    return {
        "voices": {
            "female": {
                "name": "en-IN-NeerjaNeural",
                "description": "Indian female - warm and expressive, perfect for storytelling",
                "recommended": True
            },
            "male": {
                "name": "en-IN-PrabhatNeural",
                "description": "Indian male - authoritative and deep"
            },
            "narrator_male": {
                "name": "en-US-GuyNeural",
                "description": "American male - professional narrator voice"
            },
            "narrator_female": {
                "name": "en-US-AriaNeural",
                "description": "American female - engaging and natural"
            }
        },
        "emotions": [
            "shanta (peace/calm)",
            "hasya (joy/humor)",
            "karuna (sadness/compassion)",
            "raudra (anger/rage)",
            "bhayanaka (fear/terror)",
            "shringara (love/beauty)",
            "adbhuta (wonder/awe)",
            "veera (heroism/courage)",
            "bibhatsa (disgust)",
            "narrative (default)"
        ]
    }
