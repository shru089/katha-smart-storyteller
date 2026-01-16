"""
List Available ElevenLabs Voices
"""
import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

api_key = os.getenv("ELEVENLABS_API_KEY")

if not api_key:
    print("❌ No API key")
    exit(1)

try:
    client = ElevenLabs(api_key=api_key)
    
    print("=" * 60)
    print("AVAILABLE ELEVENLABS VOICES")
    print("=" * 60)
    
    voices = client.voices.get_all()
    
    for voice in voices.voices:
        print(f"\n🎙️  Name: {voice.name}")
        print(f"   ID: {voice.voice_id}")
        print(f"   Category: {voice.category if hasattr(voice, 'category') else 'N/A'}")
        
        # Highlight recommended voices
        if voice.name.lower() in ['onyx', 'adam', 'nova', 'shimmer']:
            print(f"   ⭐ RECOMMENDED for storytelling")
    
    print("\n" + "=" * 60)
    print(f"Total voices: {len(voices.voices)}")
    
except Exception as e:
    print(f"❌ Error: {e}")
