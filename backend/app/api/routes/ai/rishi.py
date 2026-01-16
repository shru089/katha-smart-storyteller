from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.services.rishi_service import chat_with_rishi, explain_term_glossary, generate_dharma_dilemma

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    context: str

class GlossaryRequest(BaseModel):
    text: str

class DilemmaRequest(BaseModel):
    scene_text: str

@router.post("/chat")
async def rishi_chat(req: ChatRequest):
    response = await chat_with_rishi(req.query, req.context)
    return {"response": response}

@router.post("/explain")
async def glossary_explain(req: GlossaryRequest):
    terms = await explain_term_glossary(req.text)
    return terms

@router.post("/dilemma")
async def get_dilemma(req: DilemmaRequest):
    dilemma = await generate_dharma_dilemma(req.scene_text)
    return dilemma
