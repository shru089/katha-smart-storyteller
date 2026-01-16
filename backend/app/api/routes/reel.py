from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import get_session
from app.models import Chapter, Scene
# OLD VIDEO SERVICE REMOVED
# from app.services.video_service import generate_chapter_reel
import logging

logger = logging.getLogger("katha.reel")
router = APIRouter()

# OLD REEL GENERATION ENDPOINT - DISABLED
# Video reel generation has been removed
# Use new audio podcast generation at /api/audio/ instead
@router.post("/chapter/{chapter_id}")
async def create_chapter_movie_reel(chapter_id: int, session: Session = Depends(get_session)):
    """
    OLD: Movie reel generation - currently disabled
    Use /api/audio/generate-chapter/{chapter_id} for audio podcasts
    """
    raise HTTPException(
        status_code=501,
        detail="Reel generation temporarily disabled. Use /api/audio/generate-chapter/{id} for audio podcasts."
    )
