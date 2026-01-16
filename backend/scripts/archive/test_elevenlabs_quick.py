"""
Quick ElevenLabs Test with dotenv
"""
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

print("=" * 60)
print("ELEVENLABS QUICK TEST")
print("=" * 60)

api_key = os.getenv("ELEVENLABS_API_KEY", "")
print(f"\nAPI Key loaded: {api_key[:10]}..." if api_key else "❌ No API key found")

if not api_key or api_key == "your_elevenlabs_api_key_here":
    print("\n❌ Please update ELEVENLABS_API_KEY in .env file")
    exit(1)

print("\n🎙️ Testing ElevenLabs connection...")

try:
    from elevenlabs.client import ElevenLabs
    
    client = ElevenLabs(api_key=api_key)
    print("✅ Client initialized successfully!")
    
    # Test with short text
    print("\n🎬 Generating test audio...")
    audio_generator = client.text_to_speech.convert(
        voice_id="vwBefY64eQagfC7319O7",  # User's voice
        text="The sun rose over the golden spires of Ayodhya.",
        model_id="eleven_multilingual_v2"
    )
    
    # Save test file
    with open("static/audio/test_elevenlabs.mp3", "wb") as f:
        for chunk in audio_generator:
            f.write(chunk)
    
    print("✅ SUCCESS! Audio generated!")
    print("🎧 Listen at: http://localhost:8000/static/audio/test_elevenlabs.mp3")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nCheck:")
    print("1. API key format (should start with 'sk_')")
    print("2. Free tier characters remaining")
    print("3. Internet connection")
