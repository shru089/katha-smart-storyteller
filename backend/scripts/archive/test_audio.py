"""
Test Edge TTS Audio Generation

Quick test script to generate audio for a sample scene.
"""

import asyncio
import sys
sys.path.insert(0, '.')

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from app.services.audio_service import get_audio_service

async def test_audio():
    print("\n" + "="*60)
    print("TESTING Edge TTS Audio Generation")
    print("="*60 + "\n")
    
    # Sample text from Ramayana Chapter 1
    sample_text = """The palace was quiet. Too quiet.

    Inside his chamber, the king sat alone, hands folded, staring at the flame of a single oil lamp. The light danced across his face, catching the edges of gray in his beard, the lines carved by decades of rule.
    
    He had everything a man could want. A kingdom that stretched across fertile lands. Wealth beyond measure. The respect of his people. Three wives who loved him.
    
    But no son."""
    
    audio_service = get_audio_service()
    
    print("📝 Sample Text:")
    print(f"   '{sample_text[:100]}...'\n")
    
    print("🎭 Testing different emotions:\n")
    
    # Test different emotions
    emotions_to_test = [
        ('shanta', 'Peace/Calm - for contemplative scenes'),
        ('karuna', 'Sadness/Compassion - for emotional scenes'),
        ('veera', 'Heroism - for action scenes')
    ]
    
    for emotion, description in emotions_to_test:
        print(f"   Generating: {emotion} ({description})")
        
        audio_path = await audio_service.generate_audio(
            text=sample_text,
            scene_id=999,  # Test scene ID
            emotion=emotion,
            voice='female'  # Using Indian female voice
        )
        
        print(f"   ✅ Generated: {audio_path}\n")
    
    print("="*60)
    print("✨ Audio generation test complete!")
    print("="*60)
    print("\n📂 Check static/audio/ directory for generated files")
    print("🎧 Listen to the files to compare emotional delivery\n")

if __name__ == "__main__":
    asyncio.run(test_audio())
