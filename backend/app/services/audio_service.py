"""
Edge TTS Audio Generation Service

Generates natural-sounding audio podcasts for story scenes using Microsoft Edge TTS.
Includes SSML (Speech Synthesis Markup Language) emotion mapping based on the 9 rasas.
"""

import edge_tts
import asyncio
from pathlib import Path
from typing import Optional
import uuid
from pydub import AudioSegment
import math


class AudioService:
    """Service for generating audio using Edge TTS with emotion mapping"""
    
    # Emotion to parameter mapping (based on 9 Rasas)
    # Edge TTS supports: rate (percentage like +10%), pitch (in Hz like +50Hz)
    EMOTION_MAPPING = {
        # Shanta (Peace/Calm) - slow, soft, peaceful
        'shanta': {
            'rate': '-20%',
            'pitch': '-10Hz'
        },
        # Hasya (Joy/Humor) - upbeat, light
        'hasya': {
            'rate': '+15%',
            'pitch': '+25Hz'
        },
        # Karuna (Sadness/Compassion) - slow, low, gentle, deeper
        'karuna': {
            'rate': '-25%',
            'pitch': '-25Hz'
        },
        # Raudra (Anger/Rage) - fast, loud, intense
        'raudra': {
            'rate': '+20%',
            'pitch': '+15Hz'
        },
        # Bhayanaka (Fear/Terror) - trembling, fast, tense, higher
        'bhayanaka': {
            'rate': '+15%',
            'pitch': '+35Hz'
        },
        # Shringara (Love/Beauty) - warm, gentle, flowing
        'shringara': {
            'rate': '-12%',
            'pitch': '+8Hz'
        },
        # Adbhuta (Wonder/Awe) - slow, rising, reverent
        'adbhuta': {
            'rate': '-18%',
            'pitch': '+20Hz'
        },
        # Veera (Heroism/Courage) - strong, steady, powerful, lower
        'veera': {
            'rate': '+5%',
            'pitch': '-20Hz'
        },
        # Bibhatsa (Disgust) - sharp, cutting, deeper
        'bibhatsa': {
            'rate': '+8%',
            'pitch': '-25Hz'
        },
        # Default narrative
        'narrative': {
            'rate': '+0%',
            'pitch': '+0Hz'
        }
    }
    
    # Best voices for Indian storytelling
    VOICES = {
        'female': 'en-IN-NeerjaNeural',  # Indian female - warm, expressive
        'male': 'en-IN-PrabhatNeural',    # Indian male - authoritative, deep
        'narrator_male': 'en-US-GuyNeural',  # American male - professional narrator
        'narrator_female': 'en-US-AriaNeural'  # American female - engaging
    }
    
    # Volume mapping for emotions (same as enhanced_audio_service)
    VOLUME_MAPPING = {
        'hasya': 1.10,      # +10% louder
        'raudra': 1.15,     # +15% louder
        'veera': 1.08,      # +8% louder
        'adbhuta': 1.00,    # Baseline
        'shanta': 0.90,     # -10% quieter
        'karuna': 0.85,     # -15% quieter
        'shringara': 0.92,  # -8% quieter
        'bhayanaka': 1.05,  # +5% louder
        'bibhatsa': 0.95,   # -5% quieter
        'narrative': 1.00   # Baseline
    }
    
    def __init__(self, output_dir: str = "static/audio"):
        """Initialize audio service"""
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    async def generate_audio(
        self,
        text: str,
        scene_id: int,
        emotion: str = 'narrative',
        voice: str = 'narrator_male'
    ) -> str:
        """
        Generate audio file for a scene
        
        Args:
            text: Scene narration text
            scene_id: ID of the scene (for filename)
            emotion: Rasa/emotion for delivery
            voice: Voice to use (female, male, narrator_male, narrator_female)
        
        Returns:
            Relative path to generated audio file
        """
        # Get voice name
        voice_name = self.VOICES.get(voice, self.VOICES['narrator_male'])
        
        # Get emotion parameters
        params = self.EMOTION_MAPPING.get(emotion.lower(), self.EMOTION_MAPPING['narrative'])
        
        # Edge TTS doesn't support SSML - use rate and pitch parameters directly
        # Rate: -50% to +100%, Pitch: -50Hz to +50Hz
        rate_value = params['rate']  # e.g., "+10%"
        pitch_value = params['pitch']  # e.g., "+5%"
        
        # Generate unique filename
        filename = f"scene_{scene_id}_{uuid.uuid4().hex[:8]}.mp3"
        filepath = self.output_dir / filename
        
        # Create communicate object with rate and pitch
        communicate = edge_tts.Communicate(
            text,
            voice_name,
            rate=rate_value,
            pitch=pitch_value
        )
        
        # Generate and save audio
        await communicate.save(str(filepath))
        
        # Apply volume adjustment based on emotion
        volume_multiplier = self.VOLUME_MAPPING.get(emotion.lower(), 1.0)
        if volume_multiplier != 1.0:
            try:
                audio = AudioSegment.from_mp3(str(filepath))
                db_change = 20 * math.log10(volume_multiplier)
                adjusted_audio = audio + db_change
                adjusted_audio.export(str(filepath), format="mp3", bitrate="128k")
            except Exception as e:
                pass  # Silently continue if volume adjustment fails
        
        # Return relative path for database storage
        return f"/static/audio/{filename}"
    
    async def generate_audio_for_scene(
        self,
        scene_text: str,
        scene_id: int,
        scene_emotion: Optional[str] = None
    ) -> str:
        """
        Convenience method to generate audio for a scene using its emotion
        
        Args:
            scene_text: The raw_text from the scene
            scene_id: Scene ID
            scene_emotion: The ai_emotion field from scene
        
        Returns:
            Path to generated audio file
        """
        emotion = scene_emotion or 'narrative'
        
        # Use Indian female voice for storytelling by default
        return await self.generate_audio(
            text=scene_text,
            scene_id=scene_id,
            emotion=emotion,
            voice='female'
        )


# Singleton instance
_audio_service = None

def get_audio_service() -> AudioService:
    """Get or create audio service singleton"""
    global _audio_service
    if _audio_service is None:
        _audio_service = AudioService()
    return _audio_service
