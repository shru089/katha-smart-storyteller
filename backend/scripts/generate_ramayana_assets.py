"""
Auto-generate all AI assets (image + video + voice) 
for the first 2 chapters of Ramayana – Sita Haran Arc (MVP).

This script:
1. Pulls scenes from database
2. Sends prompt + narration → AI pipeline
3. Saves image/video/audio
4. Updates DB with paths
"""

import requests
from sqlmodel import Session, select
from app.db import engine
from app.models import Scene  # Fixed import path

API_URL = "http://127.0.0.1:8000/api/ai/pipeline/generate-all/"


# ------------------------------------------------------------
# SCENE CONFIGURATION — fill narration + visual prompts
# ------------------------------------------------------------
SCENE_DATA = {
    1: {
        "prompt": (
            "dense golden forest, Rama Sita Lakshmana walking, "
            "soft divine light, spiritual, cinematic, warm tones"
        ),
        "narration": (
            "Rama, Sita, and Lakshmana enter the forest. "
            "A divine calm surrounds them as they begin their exile."
        )
    },
    2: {
        "prompt": (
            "dark forest, Ravana in disguise approaching Sita, "
            "tension, mythological drama, epic lighting"
        ),
        "narration": (
            "Ravana approaches Sita in disguise, setting in motion "
            "a plan that would change the destiny of kingdoms."
        )
    }
}


# ------------------------------------------------------------
# Send a request to your AI pipeline
# ------------------------------------------------------------
def generate_assets(scene_id: int, prompt: str, narration: str):
    print(f"\n🎨 Generating for Scene {scene_id}...")

    payload = {
        "scene_id": scene_id,
        "prompt": prompt,
        "narration": narration
    }

    try:
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()
        data = response.json()

        print("✔ AI generation complete.")
        return data

    except Exception as e:
        print(f"❌ Failed for scene {scene_id}: {e}")
        return None


# ------------------------------------------------------------
# Update Scene row in DB
# ------------------------------------------------------------
def update_scene(scene_id: int, paths: dict):
    with Session(engine) as session:
        scene = session.exec(select(Scene).where(Scene.id == scene_id)).first()
        if not scene:
            print(f"⚠ Scene {scene_id} not found in DB.")
            return

        # Backend returns paths like "/static/..." or "static/..." 
        # depending on implementation.
        # My implementation returns "/static/..." so we can save directly.
        
        scene.ai_image_url = paths["image"]["image_path"]
        scene.ai_video_url = paths["video"]["video_path"]
        scene.ai_audio_url = paths["audio"]["audio_path"]

        session.add(scene)
        session.commit()

        print(f"✔ Scene {scene_id} updated in database.")


# ------------------------------------------------------------
# MAIN SCRIPT
# ------------------------------------------------------------
def run():
    print("\n⚡ Starting Ramayana AI Asset Generation...")
    print("--------------------------------------------------")

    for scene_id, cfg in SCENE_DATA.items():
        prompt = cfg["prompt"]
        narration = cfg["narration"]

        result = generate_assets(scene_id, prompt, narration)
        if result:
            update_scene(scene_id, result)

    print("\n✨ DONE: All assets generated!")
    print("You can view them at:")
    print(" → /static/images/")
    print(" → /static/videos/")
    print(" → /static/audio/")
    print("\nRestart the frontend to load new media.")


if __name__ == "__main__":
    run()
