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
            "heroic": "epic hyper-realistic cinematic masterpiece, glorious golden hour rays, god-like mythic warrior stance",
            "veera": "epic hyper-realistic cinematic masterpiece, glorious golden hour rays, god-like mythic warrior stance",
            "romantic": "divine celestial atmosphere, soft glowing lotus flowers, rich warm dreamy lighting",
            "shringara": "divine celestial atmosphere, soft glowing lotus flowers, rich warm dreamy lighting",
            "dramatic": "spectacular chiaroscuro, intense mythological contrast, sweeping majestic shadows",
            "raudra": "epic celestial fury, majestic dramatic lightning strikes, intense divine action aura",
            "peaceful": "serene sacred temple sanctuary, ethereal glowing sunset mist, calm transcendental energy",
            "shanta": "serene sacred temple sanctuary, ethereal glowing sunset mist, calm transcendental energy",
            "action": "high-octane mythic combat, electric kinetic neon weapon auras, spectacular dynamic movements",
            "mysterious": "shadowy divine mystery, bioluminescent magical flora, dark ambient atmosphere",
            "bhayanaka": "shadowy divine mystery, bioluminescent magical flora, dark ambient atmosphere",
            "hasya": "vibrant celebratory colors, joyful radiant festival ambient sparklers, beautiful details",
            "adbhuta": "breathtaking cosmic magic realism, majestic celestial space nebula aura, divine awe"
        }
        
        style = emotion_styles.get(emotion.lower() if emotion else "default", "epic hyper-realistic cinematic masterpiece, breathtaking mythological concept art")
        
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
