"""
Test Fixed Audio Generation

Generate one sample audio file to verify SSML is fixed.
"""

import asyncio
import sys
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from app.services.audio_service import get_audio_service

async def test_fixed_audio():
    print("\nTesting Fixed Audio Generation...")
    print("="*60)
    
    sample_text = """The palace was quiet. Too quiet.

Inside his chamber, the king sat alone, hands folded, staring at the flame of a single oil lamp."""
    
    audio_service = get_audio_service()
    
    # Test shanta (peace) emotion
    print("\nGenerating with 'shanta' (peace) emotion...")
    audio_path = await audio_service.generate_audio(
        text=sample_text,
        scene_id=9999,
        emotion='shanta',
        voice='female'
    )
    
    print(f"Generated: {audio_path}")
    print("\nCheck static/audio/ directory and test playback!")
    print("Audio should have natural voice without reading SSML tags.")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(test_fixed_audio())
