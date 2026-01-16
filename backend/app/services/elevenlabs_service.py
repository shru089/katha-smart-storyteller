"""
ElevenLabs Audio Service
High-quality emotion-aware narration for Katha stories
Supports English, Hindi, and Sanskrit
"""

import os
import logging
from typing import Optional
from elevenlabs.client import ElevenLabs
from elevenlabs import VoiceSettings

logger = logging.getLogger(__name__)

class ElevenLabsAudioService:
    """Generate premium narration using ElevenLabs TTS"""
    
    def __init__(self):
        self.api_key = os.getenv("ELEVENLABS_API_KEY", "")
        if self.api_key:
            self.client = ElevenLabs(api_key=self.api_key)
            logger.info("✅ ElevenLabs initialized")
        else:
            self.client = None
            logger.warning("⚠️ ELEVENLABS_API_KEY not set - audio generation will fail")
        
        self.audio_dir = "static/audio/narration"
        os.makedirs(self.audio_dir, exist_ok=True)
        
        # Voice configuration - User's preferred voice
        self.narrator_voice_id = "vwBefY64eQagfC7319O7"  # User's selected voice
    
    def generate_narration(
        self,
        text: str,
        emotion: Optional[str] = None,
        scene_id: Optional[int] = None,
        language: str = "english"
    ) -> str:
        """
        Generate emotion-aware narration
        
        Args:
            text: Story text to narrate
            emotion: Emotional tone (maps to voice settings)
            scene_id: Scene ID for filename
            language: Language hint (english/hindi/sanskrit)
            
        Returns:
            Path to generated MP3 file
        """
        
        if not self.client:
            raise ValueError("ElevenLabs API key not configured")
        
        try:
            logger.info(f"Generating ElevenLabs audio for scene {scene_id} ({emotion})")
            
            # Get emotion-based voice settings
            settings = self._get_voice_settings(emotion)
            
            # Generate audio using v2 API
            audio_generator = self.client.text_to_speech.convert(
                voice_id=self.narrator_voice_id,
                text=text,
                model_id="eleven_multilingual_v2",  # Best for Hindi/Sanskrit
                voice_settings=settings
            )
            
            # Save to file
            filename = f"scene_{scene_id or 'temp'}_{emotion or 'neutral'}.mp3"
            filepath = os.path.join(self.audio_dir, filename)
            
            # audio_generator is an iterator, write chunks
            with open(filepath, "wb") as f:
                for chunk in audio_generator:
                    f.write(chunk)
            
            logger.info(f"✅ Audio generated: {filepath}")
            return f"/static/audio/narration/{filename}"
            
        except Exception as e:
            logger.error(f"❌ ElevenLabs generation failed: {e}")
            raise
    
    def _get_voice_settings(self, emotion: Optional[str]) -> VoiceSettings:
        """
        Map story emotions (Rasa) to ElevenLabs voice parameters
        
        Rasa emotions from Indian aesthetics:
        - Shringara (Romantic)
        - Veera (Heroic)
        - Shanta (Peaceful)
        - Raudra (Furious)
        - Karuna (Compassionate)
        - Bhayanaka (Fearful)
        - Hasya (Humorous)
        - Adbhuta (Wonderful)
        """
        
        # Default settings for epic storytelling
        default_stability = 0.65
        default_similarity = 0.80
        default_style = 0.35
        
        # Emotion-specific adjustments
        emotion_map = {
            # Heroic/Action
            "heroic": {"stability": 0.70, "similarity_boost": 0.85, "style": 0.45},
            "veera": {"stability": 0.70, "similarity_boost": 0.85, "style": 0.45},
            "action": {"stability": 0.70, "similarity_boost": 0.85, "style": 0.45},
            
            # Romantic/Emotional
            "romantic": {"stability": 0.55, "similarity_boost": 0.75, "style": 0.50},
            "shringara": {"stability": 0.55, "similarity_boost": 0.75, "style": 0.50},
            
            # Peaceful/Serene
            "peaceful": {"stability": 0.75, "similarity_boost": 0.80, "style": 0.20},
            "shanta": {"stability": 0.75, "similarity_boost": 0.80, "style": 0.20},
            
            # Dramatic/Intense
            "dramatic": {"stability": 0.60, "similarity_boost": 0.85, "style": 0.55},
            "raudra": {"stability": 0.60, "similarity_boost": 0.85, "style": 0.55},
            
            # Compassionate/Sad
            "compassionate": {"stability": 0.60, "similarity_boost": 0.75, "style": 0.40},
            "karuna": {"stability": 0.60, "similarity_boost": 0.75, "style": 0.40},
            
            # Mysterious/Fearful
            "mysterious": {"stability": 0.65, "similarity_boost": 0.80, "style": 0.45},
            "bhayanaka": {"stability": 0.65, "similarity_boost": 0.80, "style": 0.45},
        }
        
        # Get settings or use default
        settings_dict = emotion_map.get(
            emotion.lower() if emotion else "default",
            {
                "stability": default_stability,
                "similarity_boost": default_similarity,
                "style": default_style
            }
        )
        
        return VoiceSettings(
            stability=settings_dict["stability"],
            similarity_boost=settings_dict["similarity_boost"],
            style=settings_dict.get("style", default_style),
            use_speaker_boost=True  # Better multilingual clarity
        )
    
    def generate_chapter_audio(
        self,
        chapter_summary: str,
        chapter_id: int,
        emotion: str = "heroic"
    ) -> str:
        """Generate audio introduction for entire chapter"""
        
        return self.generate_narration(
            text=chapter_summary,
            emotion=emotion,
            scene_id=f"ch{chapter_id}"
        )


# Singleton instance
elevenlabs_service = ElevenLabsAudioService()
