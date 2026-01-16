"""
Enhanced Audio Service with Dialogue Emotion Support

Generates audio with character-specific emotional tones by:
1. Parsing dialogue into segments
2. Generating audio for each segment with appropriate emotion
3. Concatenating segments into final audio file
"""

import edge_tts
import asyncio
from pathlib import Path
from typing import Optional
import uuid
from pydub import AudioSegment
import os

from app.services.dialogue_emotion_service import get_dialogue_emotion_service
import math


class EnhancedAudioService:
    """Service for generating emotionally-rich audio with dialogue support"""
    
    # Emotion to parameter mapping (based on 9 Rasas)
    EMOTION_MAPPING = {
        'shanta': {'rate': '-18%', 'pitch': '-12Hz'},      # Ram: Calm, soothing, makes you feel safe
        'hasya': {'rate': '+10%', 'pitch': '+20Hz'},       # Joy - upbeat
        'karuna': {'rate': '-25%', 'pitch': '-25Hz'},      # Sadness - slow, low, deeper
        'raudra': {'rate': '+20%', 'pitch': '+15Hz'},      # Anger/Authority - bold, commanding, intense
        'bhayanaka': {'rate': '+15%', 'pitch': '+35Hz'},   # Fear - fast, tense, higher
        'shringara': {'rate': '-12%', 'pitch': '+8Hz'},    # Love - warm, gentle
        'adbhuta': {'rate': '-18%', 'pitch': '+20Hz'},     # Wonder - slow, rising, awe
        'veera': {'rate': '+5%', 'pitch': '-20Hz'},        # Sita/Heroes: Firm, unapologetic, bold, lower
        'bibhatsa': {'rate': '+8%', 'pitch': '-25Hz'},     # Disgust - sharp, deeper
        'narrative': {'rate': '+0%', 'pitch': '+0Hz'}      # Default narrator
    }
    
    # Voice mapping for different character types and narration
    VOICES = {
        # For dialogues - gender-appropriate voices
        'male_character': 'en-IN-PrabhatNeural',      # Indian male - for Ram, Hanuman, etc.
        'female_character': 'en-IN-NeerjaNeural',     # Indian female - for Sita, Draupadi, etc.
        
        # For narrations
        'narrator': 'en-IN-NeerjaNeural',             # Indian female - regular narration
        'main_narrator': 'en-US-AriaNeural',          # American female - main/important narrations
    }
    
    # Character gender mapping
    MALE_CHARACTERS = ['ram', 'lakshman', 'hanuman', 'king', 'dasharatha', 'ravan', 
                       'sugriva', 'vibhishana', 'bharat', 'shatrughna', 'jatayu',
                       'bali', 'mahabali', 'angad', 'jambavan', 'default']
    FEMALE_CHARACTERS = ['sita', 'draupadi', 'kaikeyi', 'manthara', 'kausalya',
                         'sumitra', 'urmila', 'mandodari', 'tara', 'shurpanakha']
    
    # Volume mapping for emotions (multiplier for amplitude)
    VOLUME_MAPPING = {
        'hasya': 1.10,      # +10% louder - joy, cheerful
        'raudra': 1.15,     # +15% louder - anger, commanding
        'veera': 1.08,      # +8% louder - heroism, bold
        'adbhuta': 1.00,    # Baseline - wonder
        'shanta': 0.90,     # -10% quieter - peace, calm
        'karuna': 0.85,     # -15% quieter - sadness
        'shringara': 0.92,  # -8% quieter - love, gentle
        'bhayanaka': 1.05,  # +5% louder - fear, tense
        'bibhatsa': 0.95,   # -5% quieter - disgust
        'narrative': 1.00   # Baseline - neutral
    }
    
    def __init__(self, output_dir: str = "static/audio"):
        """Initialize audio service"""
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.temp_dir = self.output_dir / "temp"
        self.temp_dir.mkdir(exist_ok=True)
        self.dialogue_service = get_dialogue_emotion_service()
    
    async def generate_segment_audio(
        self,
        text: str,
        emotion: str,
        segment_id: str,
        character: str = 'narrator',
        is_dialogue: bool = False
    ) -> str:
        """Generate audio for a single text segment"""
        params = self.EMOTION_MAPPING.get(emotion, self.EMOTION_MAPPING['narrative'])
        
        # Select appropriate voice based on character and context
        if is_dialogue:
            # For dialogues, use gender-appropriate voice
            if character in self.MALE_CHARACTERS:
                voice = self.VOICES['male_character']
            elif character in self.FEMALE_CHARACTERS:
                voice = self.VOICES['female_character']
            else:
                # Default to male for unknown characters in dialogues
                voice = self.VOICES['male_character']
        else:
            # For narration, use the regular narrator voice
            voice = self.VOICES['narrator']
        
        # Create temp filename
        temp_filename = f"seg_{segment_id}.mp3"
        temp_filepath = self.temp_dir / temp_filename
        
        # Generate audio using Edge TTS
        communicate = edge_tts.Communicate(
            text,
            voice,
            rate=params['rate'],
            pitch=params['pitch']
        )
        
        await communicate.save(str(temp_filepath))
        
        # Apply volume adjustment based on emotion
        volume_multiplier = self.VOLUME_MAPPING.get(emotion, 1.0)
        if volume_multiplier != 1.0:
            try:
                audio = AudioSegment.from_mp3(str(temp_filepath))
                # Convert multiplier to dB: dB = 20 * log10(multiplier)
                db_change = 20 * math.log10(volume_multiplier)
                adjusted_audio = audio + db_change
                adjusted_audio.export(str(temp_filepath), format="mp3", bitrate="128k")
            except Exception as e:
                print(f"    Warning: Could not apply volume adjustment: {e}")
        
        return str(temp_filepath)
    
    async def generate_multi_segment_audio(
        self,
        scene_text: str,
        scene_id: int
    ) -> str:
        """
        Generate audio with dialogue emotion support
        
        Args:
            scene_text: Full scene text with dialogue
            scene_id: Scene ID for filename
        
        Returns:
            Path to final concatenated audio file
        """
        # Parse into emotional segments
        segments = self.dialogue_service.parse_dialogue_segments(scene_text)
        
        # If only one segment or very simple, use simple generation
        if len(segments) <= 1:
            return await self.generate_simple_audio(scene_text, scene_id, 'narrative')
        
        print(f"  Generating {len(segments)} segments...")
        
        # Generate audio for each segment
        segment_files = []
        for i, segment in enumerate(segments):
            segment_text = segment['text'].strip()
            if not segment_text:
                continue
            
            emotion = segment['emotion']
            character = segment.get('character', 'narrator')
            is_dialogue = segment.get('is_dialogue', False)
            segment_id = f"{scene_id}_{i}_{uuid.uuid4().hex[:4]}"
            
            # Debug output
            dialogue_mark = "🗣️" if is_dialogue else "📖"
            print(f"    {dialogue_mark} Segment {i+1}: {emotion} ({character})")
            
            audio_file = await self.generate_segment_audio(
                segment_text,
                emotion,
                segment_id,
                character,
                is_dialogue
            )
            segment_files.append(audio_file)
        
        # Concatenate all segments
        final_path = await self.concatenate_audio_segments(segment_files, scene_id)
        
        # Cleanup temp files
        for temp_file in segment_files:
            try:
                os.remove(temp_file)
            except:
                pass
        
        return final_path
    
    async def concatenate_audio_segments(self, segment_files: list, scene_id: int) -> str:
        """Concatenate multiple audio segments into one file"""
        combined = AudioSegment.empty()
        
        for audio_file in segment_files:
            try:
                segment = AudioSegment.from_mp3(audio_file)
                # Add tiny silence between segments for natural flow (100ms)
                silence = AudioSegment.silent(duration=100)
                combined += segment + silence
            except Exception as e:
                print(f"  Warning: Could not load segment {audio_file}: {e}")
                continue
        
        # Export final file
        filename = f"scene_{scene_id}_{uuid.uuid4().hex[:8]}.mp3"
        filepath = self.output_dir / filename
        
        combined.export(str(filepath), format="mp3", bitrate="128k")
        
        return f"/static/audio/{filename}"
    
    async def generate_simple_audio(
        self,
        text: str,
        scene_id: int,
        emotion: str = 'narrative'
    ) -> str:
        """Simple audio generation for scenes without dialogue"""
        params = self.EMOTION_MAPPING.get(emotion, self.EMOTION_MAPPING['narrative'])
        
        # Use main narrator for simple scenes
        voice = self.VOICES['narrator']
        
        filename = f"scene_{scene_id}_{uuid.uuid4().hex[:8]}.mp3"
        filepath = self.output_dir / filename
        
        communicate = edge_tts.Communicate(
            text,
            voice,
            rate=params['rate'],
            pitch=params['pitch']
        )
        
        await communicate.save(str(filepath))
        
        return f"/static/audio/{filename}"
    
    async def generate_audio_for_scene(
        self,
        scene_text: str,
        scene_id: int,
        scene_emotion: Optional[str] = None
    ) -> str:
        """
        Main entry point for scene audio generation
        
        Automatically detects dialogue and applies appropriate emotions
        """
        # Use multi-segment generation for better character differentiation
        return await self.generate_multi_segment_audio(scene_text, scene_id)


# Singleton
_enhanced_audio_service = None

def get_enhanced_audio_service() -> EnhancedAudioService:
    """Get or create enhanced audio service singleton"""
    global _enhanced_audio_service
    if _enhanced_audio_service is None:
        _enhanced_audio_service = EnhancedAudioService()
    return _enhanced_audio_service
