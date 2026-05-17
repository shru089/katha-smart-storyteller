"""
Rishi AI Routes — powered by Google Gemini
Provides: chat, glossary extraction, and dharma dilemma generation.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.rishi_service import (
    chat_with_rishi,
    explain_term_glossary,
    generate_dharma_dilemma,
)
import logging

logger = logging.getLogger("katha.rishi_route")
router = APIRouter()


class ChatRequest(BaseModel):
    query: str
    context: str


class GlossaryRequest(BaseModel):
    text: str


class DilemmaRequest(BaseModel):
    scene_text: str


@router.post("/ask")
async def rishi_ask(req: ChatRequest):
    """Ask Rishi a question about the current story scene."""
    try:
        response = await chat_with_rishi(req.query, req.context)
        return {"response": response}
    except Exception as e:
        logger.error(f"Rishi chat error: {e}")
        raise HTTPException(status_code=500, detail="Rishi is meditating. Please try again.")


@router.post("/chat")
async def rishi_chat(req: ChatRequest):
    """Alias for /ask — maintained for backward compatibility."""
    return await rishi_ask(req)


@router.post("/glossary")
async def glossary_explain(req: GlossaryRequest):
    """Extract and explain difficult cultural/Sanskrit terms from text."""
    try:
        terms = await explain_term_glossary(req.text)
        return {"terms": terms}
    except Exception as e:
        logger.error(f"Glossary error: {e}")
        raise HTTPException(status_code=500, detail="Glossary generation failed.")


@router.post("/explain")
async def explain_compat(req: GlossaryRequest):
    """Alias for /glossary — maintained for backward compatibility."""
    return await glossary_explain(req)


@router.post("/dilemma")
async def get_dilemma(req: DilemmaRequest):
    """Generate a dharma dilemma for reader engagement."""
    try:
        dilemma = await generate_dharma_dilemma(req.scene_text)
        return dilemma
    except Exception as e:
        logger.error(f"Dilemma error: {e}")
        raise HTTPException(status_code=500, detail="Dilemma generation failed.")
