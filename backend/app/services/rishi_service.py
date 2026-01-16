import os
import httpx
import json
from typing import Dict, List, Optional

# Re-use existing ENV vars or default to mock
LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_API_BASE_URL = os.getenv("LLM_API_BASE_URL")

async def chat_with_rishi(query: str, context: str) -> str:
    """
    Rishi personality: Wise, patient, culturally deep.
    Returns plain text response.
    """
    if not (LLM_API_KEY and LLM_API_BASE_URL):
        return f"Child, the stars are silent (Mock: LLM not configured). You asked: {query}. The context was: {context[:50]}..."

    system_prompt = """You are 'Rishi', a wise ancient sage and cultural guide. 
    Your tone is calm, philosophical, and deeply knowledgeable about Indian epics (Ramayana, Mahabharata), folklore, and history. 
    Answer the user's question based on the provided story context, but feel free to expand with external cultural wisdom. 
    Keep answers concise (under 150 words) unless asked for detail. 
    Do not break character. 
    """

    user_prompt = f"Context: {context}\n\nUser Question: {query}"

    return await _call_llm(system_prompt, user_prompt)

async def explain_term_glossary(text: str) -> List[Dict[str, str]]:
    """
    Extracts difficult cultural terms and provides definitions.
    Returns list of {term, definition}.
    """
    if not (LLM_API_KEY and LLM_API_BASE_URL):
        return [{"term": "Dharma", "definition": "Cosmic law and order (Mock)"}]

    system_prompt = """Identify 1-3 complex cultural, english or sanskrit terms in the text provided. 
    Return ONLY a JSON array of objects with keys: 'term', 'definition'. 
    Definitions should be simple, 1 sentence. 
    If no difficult terms, return empty array []."""

    user_prompt = f"Text: {text}"

    try:
        resp = await _call_llm(system_prompt, user_prompt)
        # cleanup json
        valid_json = resp.strip()
        if valid_json.startswith("```json"):
            valid_json = valid_json[7:-3]
        return json.loads(valid_json)
    except Exception as e:
        print(f"Glossary parse error: {e}")
        return []

async def generate_dharma_dilemma(scene_text: str) -> Dict[str, str]:
    """
    Returns {question, option_a, result_a, option_b, result_b}
    """
    if not (LLM_API_KEY and LLM_API_BASE_URL):
        return {
            "question": "A generic dilemma appears (Mock). What do you do?",
            "option_a": "Follow the rules",
            "result_a": "Order is maintained.",
            "option_b": "Follow your heart",
            "result_b": "Chaos ensues but you are free."
        }

    system_prompt = """Analyze the scene. Identify a moral or practical dilemma a character faces (or could face). 
    Create an interactive question for the proper. 
    Return JSON with:
    'question': The dilemma question.
    'option_a': Choice A (e.g. Duty).
    'result_a': Short philosophical outcome of A.
    'option_b': Choice B (e.g. Love/Gain).
    'result_b': Short philosophical outcome of B.
    """

    user_prompt = f"Scene: {scene_text}"
    
    try:
        resp = await _call_llm(system_prompt, user_prompt)
        valid_json = resp.strip()
        if valid_json.startswith("```json"):
             valid_json = valid_json[7:-3]
        elif valid_json.startswith("```"):
             valid_json = valid_json[3:-3]
        return json.loads(valid_json)
    except Exception as e:
        print(f"Dilemma gen error: {e}")
        return {
             "question": "The path is unclear.",
             "option_a": "Wait",
             "result_a": "Time passes.",
             "option_b": "Act",
             "result_b": "Consequences follow."
        }


async def _call_llm(system: str, user: str) -> str:
    headers = {"Authorization": f"Bearer {LLM_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini", # Adapter for whatever API is behind BASE_URL
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(LLM_API_BASE_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        choices = data.get("choices")
        if choices:
            return choices[0].get("message", {}).get("content") or choices[0].get("text")
        return ""
