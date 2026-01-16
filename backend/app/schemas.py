from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict

# User
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None
    archetype: Optional[str] = None

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    username: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    email: Optional[str] = None
    total_xp: int
    current_streak_days: int
    longest_streak_days: int
    stories_read: int = 0
    archetype: Optional[str] = None
    created_at: Optional[datetime] = None

class AuthResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str
    expires_in: int
    message: str

# Scene / Chapter / Story responses
class SceneOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    chapter_id: int
    index: int
    raw_text: str
    reel_script: Optional[str] = None
    
    # AI fields from database (keep these for backward compatibility)
    ai_caption: Optional[str] = None
    ai_symbolism: Optional[str] = None
    ai_emotion: Optional[str] = None
    ai_background_music_tag: Optional[str] = None
    ai_image_prompt: Optional[str] = None
    ai_image_url: Optional[str] = None
    ai_video_url: Optional[str] = None
    ai_audio_url: Optional[str] = None
    reel_audio_url: Optional[str] = None
    
    # Computed properties for clean API (map ai_* fields to simple names)
    @property
    def caption(self) -> Optional[str]:
        """Map ai_caption to caption"""
        return self.ai_caption
    
    @property
    def symbolism(self) -> Optional[str]:
        """Map ai_symbolism to symbolism"""
        return self.ai_symbolism
    
    @property
    def emotion(self) -> Optional[str]:
        """Map ai_emotion to emotion"""
        return self.ai_emotion
    
    @property
    def music_tag(self) -> Optional[str]:
        """Map ai_background_music_tag to music_tag"""
        return self.ai_background_music_tag
    
    @property
    def image_prompt(self) -> Optional[str]:
        """Map ai_image_prompt to image_prompt"""
        return self.ai_image_prompt
    
    @property
    def image_url(self) -> Optional[str]:
        """Map ai_image_url to image_url"""
        return self.ai_image_url
    
    @property
    def audio_url(self) -> Optional[str]:
        """Map ai_audio_url to audio_url"""
        return self.ai_audio_url

class ChapterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    story_id: int
    index: int
    title: str
    next_chapter_id: Optional[int] = None
    short_summary: Optional[str]
    cover_image_url: Optional[str] = None
    scenes: List[SceneOut] = []

class StoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    slug: str
    description: Optional[str]
    category: Optional[str]
    cover_image_url: Optional[str]
    total_chapters: int
    total_scenes: int
    chapters: List[ChapterOut] = []

# Achievements
class BadgeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    code: str
    name: str
    description: Optional[str]
    icon_url: Optional[str]
    earned_at: Optional[datetime] = None

class AchievementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    total_xp: int
    current_streak_days: int
    longest_streak_days: int
    earned_badges: List[BadgeOut] = []
    locked_badges: List[BadgeOut] = []

# Map
class LocationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    description: Optional[str] = None
    lat: float
    lon: float
    epoch: Optional[str] = None
    region: Optional[str] = None
    era: Optional[str] = None
