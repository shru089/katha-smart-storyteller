"""
Fast Video Service - Simplified Version
Returns static cinematic images instantly (5 seconds)
Can be upgraded to Ken Burns animation later
"""

import os
import logging
from typing import Optional
import requests

logger = logging.getLogger(__name__)

class FastVideoService:
    """Generate fast visual content using static images"""
    
    def __init__(self):
        self.pollinations_url = "https://image.pollinations.ai/prompt"
        self.images_dir = "static/videos/fast"  # Using videos dir for consistency
        os.makedirs(self.images_dir, exist_ok=True)
    
    def generate_fast_video(
        self,
        scene_text: str,
        emotion: Optional[str] = None,
        scene_id: Optional[int] = None
    ) -> str:
        """
        Generate fast visual content (currently returns static image)
        
        Args:
            scene_text: Story text for image generation
            emotion: Emotional tone
            scene_id: Scene ID for filename
            
        Returns:
            Path to generated image/video
        """
        try:
            logger.info(f"Fast visual generation for scene {scene_id}")
            
            # Generate cinematic image (5 seconds)
            image_url = self._generate_cinematic_image(scene_text, emotion, scene_id)
            
            logger.info(f"Fast visual generated: {image_url}")
            return image_url
            
        except Exception as e:
            logger.error(f"Fast visual generation failed: {e}")
            raise
    
    def _generate_cinematic_image(
        self,
        scene_text: str,
        emotion: Optional[str],
        scene_id: Optional[int]
    ) ->str:
        """Generate cinematic image with Pollinations"""
        
        # Create visual prompt
        snippet = scene_text[:180] if len(scene_text) > 180 else scene_text
        
        emotion_styles = {
            "heroic": "epic cinematic, golden hour lighting",
            "romantic": "soft dreamy atmosphere, warm tones",
            "dramatic": "high contrast, dramatic shadows",
            "peaceful": "serene calm, soft colors",
            "action": "dynamic energy, intense",
            "mysterious": "dark atmospheric, moody"
        }
        
        style = emotion_styles.get(emotion, "cinematic epic")
        
        prompt = f"""
        Cinematic scene from ancient Indian epic: {snippet}.
        {style}, highly detailed digital art, 
        rich vibrant colors, 4K quality, no text, vertical format.
        """
        
        # Generate image
        encoded_prompt = requests.utils.quote(prompt.strip())
        image_url = (
            f"{self.pollinations_url}/{encoded_prompt}"
            f"?width=1080&height=1920"  # 9:16 vertical for mobile
            f"&model=flux-realism"
            f"&enhance=true"
            f"&nologo=true"
        )
        
        response = requests.get(image_url, timeout=60)
        response.raise_for_status()
        
        # Save image
        filename = f"scene_{scene_id or 'temp'}_fast.jpg"
        filepath = os.path.join(self.images_dir, filename)
        
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        return f"/static/videos/fast/{filename}"


# Singleton instance
fast_video_service = FastVideoService()
