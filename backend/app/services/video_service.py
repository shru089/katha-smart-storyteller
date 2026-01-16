"""
Video Generation Service
Generates short vertical video reels for scenes using Pollinations.ai
Fast and reliable for Gen Z short-form content
"""

import requests
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class VideoGenerationService:
    """Generate vertical video reels for scene narratives"""
    
    def __init__(self):
        self.base_url = "https://image.pollinations.ai/prompt"
        self.video_dir = "static/videos/scenes"
        os.makedirs(self.video_dir, exist_ok=True)
    
    def generate_scene_video(
        self,
        scene_text: str,
        emotion: Optional[str] = None,
        scene_id: Optional[int] = None
    ) -> str:
        """
        Generate a vertical 9:16 video reel for a scene
        
        Args:
            scene_text: The narrative content
            emotion: Emotional tone (for visual styling)
            scene_id: Scene ID for filename
            
        Returns:
            Relative path to generated video file
        """
        try:
            # Create cinematic prompt
            prompt = self._create_video_prompt(scene_text, emotion)
            
            # Generate video URL with Pollinations
            # Note: Pollinations primarily generates images, for true video we'd use
            # a service like Runway ML, but for MVP we'll use high-quality images
           # as placeholders or create slideshow videos
            
            video_path = self._generate_image_for_scene(prompt, scene_id)
            logger.info(f"Generated video for scene {scene_id}: {video_path}")
            
            return video_path
            
        except Exception as e:
            logger.error(f"Video generation failed: {e}")
            raise
    
    def _create_video_prompt(self, scene_text: str, emotion: Optional[str]) -> str:
        """Create optimized prompt for visual generation"""
        
        # Extract key visual elements
        snippet = scene_text[:200] if len(scene_text) > 200 else scene_text
        
        # Emotion-based styling
        emotion_styles = {
            "heroic": "epic cinematic, golden hour lighting, majestic composition",
            "romantic": "soft dreamy atmosphere, warm golden tones, intimate framing",
            "dramatic": "high contrast, dramatic shadows, intense mood",
            "peaceful": "serene calm atmosphere, soft pastel colors, tranquil scene",
            "action": "dynamic motion blur, intense energy, cinematic action shot",
            "mysterious": "dark atmospheric fog, moody lighting, enigmatic ambiance"
        }
        
        style = emotion_styles.get(emotion, "cinematic epic ancient Indian mythology")
        
        prompt = f"""
        Cinematic vertical scene from ancient Indian epic: {snippet}.
        {style}, highly detailed digital art, 4K quality,
        rich vibrant colors, authentic historical costumes,
        dramatic composition, no modern elements,
        vertical 9:16 aspect ratio perfect for mobile viewing.
        """
        
        return prompt.strip()
    
    def _generate_image_for_scene(self, prompt: str, scene_id: Optional[int]) -> str:
        """Generate high-quality vertical image (placeholder for video)"""
        
        # Pollinations.ai image generation
        encoded_prompt = requests.utils.quote(prompt)
        image_url = (
            f"{self.base_url}/{encoded_prompt}"
            f"?width=1080&height=1920"
            f"&model=flux-realism"
            f"&enhance=true"
            f"&nologo=true"
        )
        
        # Download and save
        response = requests.get(image_url, timeout=60)
        response.raise_for_status()
        
        filename = f"scene_{scene_id or 'temp'}_video.jpg"
        filepath = os.path.join(self.video_dir, filename)
        
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        return f"/static/videos/scenes/{filename}"
    
    def generate_chapter_reel(
        self,
        scenes: list,
        chapter_title: str,
        chapter_id: int
    ) -> str:
        """
        Generate a master reel for entire chapter
        Combines multiple scenes into one cohesive video
        
        For MVP: Generate a representative still image
        Full implementation: Use video editing library to stitch scenes
        """
        try:
            # Create chapter summary prompt
            scene_texts = [s.get("raw_text", "")[:100] for s in scenes[:5]]  # First 5 scenes
            combined_text = " ".join(scene_texts)
            
            prompt = f"""
            Epic cinematic poster for chapter: {chapter_title}.
            Story summary: {combined_text}.
            Ancient Indian mythology, grand scale composition,
            multiple characters and scenes merged artistically,
            vertical 9:16 format, highly detailed, 4K quality,
            dramatic lighting, rich vibrant colors.
            """
            
            # Generate master image
            encoded_prompt = requests.utils.quote(prompt)
            image_url = (
                f"{self.base_url}/{encoded_prompt}"
                f"?width=1080&height=1920"
                f"&model=flux-realism"
                f"&enhance=true"
                f"&nologo=true"
            )
            
            response = requests.get(image_url, timeout=60)
            response.raise_for_status()
            
            filename = f"chapter_{chapter_id}_reel.jpg"
            filepath = os.path.join(self.video_dir, filename)
            
            with open(filepath, "wb") as f:
                f.write(response.content)
            
            logger.info(f"Generated chapter reel: {filepath}")
            return f"/static/videos/scenes/{filename}"
            
        except Exception as e:
            logger.error(f"Chapter reel generation failed: {e}")
            raise


# Singleton instance
video_service = VideoGenerationService()
