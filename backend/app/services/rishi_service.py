"""
Rishi AI Service - Powered by Google Gemini
Rishi is Katha's wise cultural sage, guiding readers through mythological stories.
"""

import os
import json
import logging
import httpx
from typing import Dict, List, Optional

logger = logging.getLogger("katha.rishi")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-1.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

RISHI_PERSONA = """You are 'Rishi', a wise ancient sage and cultural guide within the Katha storytelling app.
Your tone is calm, philosophical, poetic, and deeply knowledgeable about Indian epics (Ramayana, Mahabharata),
Puranas, folklore, Sanskrit, and Hindu philosophy. Answer the user's question based on the provided story context,
expanding with broader cultural wisdom when helpful. Keep answers concise (under 150 words) unless asked for detail.
Do not break character. Never say you are an AI — you are Rishi the sage."""


async def _call_gemini(prompt: str) -> str:
    """
    Calls the Gemini API with a given prompt.
    Falls back to a mock response if the API key is not configured.
    """
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set — returning mock Rishi response")
        return None  # Caller handles fallback

    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 600,
        }
    }
    url = f"{GEMINI_URL}?key={GEMINI_API_KEY}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        candidates = data.get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            if parts:
                return parts[0].get("text", "")
    return ""


async def chat_with_rishi(query: str, context: str) -> str:
    """
    Rishi answers a reader's question about a story scene.
    """
    prompt = f"""{RISHI_PERSONA}

Story Context:
{context}

Reader's Question:
{query}

Answer as Rishi (wise, poetic, under 150 words):"""

    result = await _call_gemini(prompt)
    if result is None:
        return (
            f"Ah, dear seeker — the cosmic threads are quiet today (configure GEMINI_API_KEY to awaken me). "
            f"Yet I sense your question about: \"{query}\". "
            f"The scriptures say: patience and contemplation reveal all truths. "
            f"Return when the stars align."
        )
    return result


async def explain_term_glossary(text: str) -> List[Dict[str, str]]:
    """
    Extracts 1–3 difficult cultural/Sanskrit terms from text and defines them simply.
    Returns list of {term, definition}.
    """
    prompt = f"""You are a cultural glossary engine for Katha, an Indian mythology app.
Identify 1 to 3 complex cultural, Sanskrit, or English terms in the text below.
Return ONLY a valid JSON array of objects with keys: "term" and "definition".
Definitions must be simple, one sentence each.
If there are no difficult terms, return an empty array [].

Text:
{text}

JSON Array:"""

    result = await _call_gemini(prompt)
    if result is None:
        return [{"term": "Dharma", "definition": "The cosmic law and moral order that governs the universe and one's duty within it."}]

    try:
        clean = result.strip()
        if clean.startswith("```json"):
            clean = clean[7:]
        if clean.startswith("```"):
            clean = clean[3:]
        if clean.endswith("```"):
            clean = clean[:-3]
        return json.loads(clean.strip())
    except Exception as e:
        logger.error(f"Glossary JSON parse error: {e} | Raw: {result[:200]}")
        return []


async def generate_dharma_dilemma(scene_text: str) -> Dict[str, str]:
    """
    Generates an interactive moral dilemma based on a scene.
    Returns {question, option_a, result_a, option_b, result_b}.
    """
    prompt = f"""You are a creative cultural writer for Katha, an Indian mythology app.
Based on the scene below, create a short moral dilemma for the reader to engage with.
Return ONLY a valid JSON object with these keys:
- "question": The dilemma question (1 sentence)
- "option_a": Choice A label (2-4 words, e.g. "Uphold Dharma")
- "result_a": Short philosophical consequence of A (1 sentence)
- "option_b": Choice B label (2-4 words, e.g. "Follow Your Heart")
- "result_b": Short philosophical consequence of B (1 sentence)

Scene:
{scene_text}

JSON:"""

    result = await _call_gemini(prompt)
    if result is None:
        return {
            "question": "A great dilemma unfolds — what is the righteous path?",
            "option_a": "Uphold Dharma",
            "result_a": "Order is preserved, but personal sacrifice is demanded.",
            "option_b": "Follow compassion",
            "result_b": "Love prevails, but the cosmic order is tested.",
        }

    try:
        clean = result.strip()
        if clean.startswith("```json"):
            clean = clean[7:]
        if clean.startswith("```"):
            clean = clean[3:]
        if clean.endswith("```"):
            clean = clean[:-3]
        return json.loads(clean.strip())
    except Exception as e:
        logger.error(f"Dilemma JSON parse error: {e} | Raw: {result[:200]}")
        return {
            "question": "The path is shrouded in mist.",
            "option_a": "Act with courage",
            "result_a": "Consequences follow swiftly.",
            "option_b": "Wait and observe",
            "result_b": "Time reveals what haste cannot.",
        }
