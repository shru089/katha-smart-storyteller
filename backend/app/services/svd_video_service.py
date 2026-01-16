"""
SVD Video Generation Service
Uses Stable Video Diffusion to create actual animated videos from static images
Completely FREE via Hugging Face Inference API
"""

import requests
import os
import time
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class SVDVideoService:
    """Generate animated videos using Stable Video Diffusion"""
    
    def __init__(self):
        self.hf_token = os.getenv("HF_API_KEY", "")  # Use existing HF_API_KEY
        self.svd_api_url = "https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt"
        self.pollinations_url = "https://image.pollinations.ai/prompt"
        self.video_dir = "static/videos/scenes"
        self.images_dir = "static/images/scenes"
        os.makedirs(self.video_dir, exist_ok=True)
        os.makedirs(self.images_dir, exist_ok=True)
        
        if not self.hf_token:
            logger.warning("HF_API_KEY not set. Video generation will fail.")
    
    def generate_scene_video(
        self,
        scene_text: str,
        emotion: Optional[str] = None,
        scene_id: Optional[int] = None
    ) -> str:
        """
        Generate animated video from scene text
        
        Pipeline:
        1. Generate image with Pollinations (fast, free)
        2. Animate image with SVD (free via HF)
        
        Args:
            scene_text: The narrative content
            emotion: Emotional tone
            scene_id: Scene ID for filename
            
        Returns:
            Relative path to generated video file
        """
        try:
            logger.info(f"Starting video generation for scene {scene_id}")
            
            # Step 1: Generate static image
            image_path = self._generate_cinematic_image(scene_text, emotion, scene_id)
            logger.info(f"Image generated: {image_path}")
            
            # Step 2: Animate with SVD
            video_path = self._animate_with_svd(image_path, scene_id)
            logger.info(f"Video generated: {video_path}")
            
            return video_path
            
        except Exception as e:
            logger.error(f"Video generation failed for scene {scene_id}: {e}")
            # Fallback: return static image if video fails
            return image_path if 'image_path' in locals() else None
    
    def _generate_cinematic_image(
        self,
        scene_text: str,
        emotion: Optional[str],
        scene_id: Optional[int]
    ) -> str:
        """Generate high-quality cinematic image using Pollinations"""
        
        # Create optimized prompt
        prompt = self._create_visual_prompt(scene_text, emotion)
        
        # Generate with Pollinations
        encoded_prompt = requests.utils.quote(prompt)
        image_url = (
            f"{self.pollinations_url}/{encoded_prompt}"
            f"?width=1024&height=576"  # 16:9 better for SVD than 9:16
            f"&model=flux-realism"
            f"&enhance=true"
            f"&nologo=true"
        )
        
        response = requests.get(image_url, timeout=60)
        response.raise_for_status()
        
        # Save image
        filename = f"scene_{scene_id or 'temp'}_source.jpg"
        filepath = os.path.join(self.images_dir, filename)
        
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        return filepath
    
    def _animate_with_svd(self, image_path: str, scene_id: Optional[int]) -> str:
        """
        Animate static image using Stable Video Diffusion
        
        Args:
            image_path: Local path to source image
            scene_id: Scene ID for output filename
            
        Returns:
            Path to generated MP4 video
        """
        
        if not self.hf_token:
            raise ValueError("HUGGINGFACE_API_KEY required for video generation")
        
        headers = {
            "Authorization": f"Bearer {self.hf_token}"
        }
        
        # Read image file
        with open(image_path, "rb") as f:
            image_data = f.read()
        
        # Send to SVD API
        logger.info(f"Sending image to SVD API for animation...")
        response = requests.post(
            self.svd_api_url,
            headers=headers,
            data=image_data,
            timeout=300  # SVD can take 1-3 minutes
        )
        
        # Handle rate limits / model loading
        if response.status_code == 503:
            logger.warning("Model is loading, waiting 20s...")
            time.sleep(20)
            response = requests.post(
                self.svd_api_url,
                headers=headers,
                data=image_data,
                timeout=300
            )
        
        response.raise_for_status()
        
        # Save video
        filename = f"scene_{scene_id or 'temp'}_reel.mp4"
        filepath = os.path.join(self.video_dir, filename)
        
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        return f"/static/videos/scenes/{filename}"
    
    def _create_visual_prompt(self, scene_text: str, emotion: Optional[str]) -> str:
        """Create optimized prompt for image generation"""
        
        snippet = scene_text[:180] if len(scene_text) > 180 else scene_text
        
        # Emotion-based styling
        emotion_styles = {
            "heroic": "epic cinematic, golden hour lighting, majestic hero",
            "romantic": "soft dreamy atmosphere, warm tones",
            "dramatic": "high contrast, dramatic shadows, intense",
            "peaceful": "serene calm, soft colors, tranquil",
            "action": "dynamic motion, intense energy",
            "mysterious": "dark atmospheric, moody lighting"
        }
        
        style = emotion_styles.get(emotion, "cinematic epic")
        
        prompt = f"""
        Cinematic scene from ancient Indian epic: {snippet}.
        {style}, highly detailed digital art, authentic costumes,
        no text, no watermarks, film photography quality, 
        dramatic composition, rich colors.
        """
        
        return prompt.strip()
    
    def generate_chapter_reel(
        self,
        scenes: list,
        chapter_title: str,
        chapter_id: int
    ) -> str:
        """
        Generate master reel for chapter
        Uses first scene as representative
        """
        try:
            if not scenes:
                raise ValueError("No scenes provided for chapter reel")
            
            # Use first scene for chapter representative video
            first_scene = scenes[0]
            scene_text = first_scene.get("raw_text", chapter_title)
            emotion = first_scene.get("ai_emotion", "heroic")
            
            return self.generate_scene_video(
                scene_text=f"{chapter_title}: {scene_text}",
                emotion=emotion,
                scene_id=f"ch{chapter_id}"
            )
            
        except Exception as e:
            logger.error(f"Chapter reel generation failed: {e}")
            raise


# Singleton instance
svd_video_service = SVDVideoService()
