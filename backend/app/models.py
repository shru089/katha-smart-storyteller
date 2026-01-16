from typing import Optional, List
from datetime import datetime, date
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    username: Optional[str] = Field(default=None, unique=True, index=True)
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    email: Optional[str] = None
    password_hash: Optional[str] = None  # Store hashed password
    created_at: datetime = Field(default_factory=datetime.utcnow)
    total_xp: int = 0
    current_streak_days: int = 0
    longest_streak_days: int = 0
    last_active_date: Optional[date] = None
    stories_read: int = 0
    archetype: Optional[str] = None

    progress: List["UserSceneProgress"] = Relationship(back_populates="user")
    badges: List["UserBadge"] = Relationship(back_populates="user")
    favorites: List["UserFavoriteStory"] = Relationship(back_populates="user")

class UserFavoriteStory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    story_id: int = Field(foreign_key="story.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="favorites")

class Story(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    slug: str = Field(index=True, unique=True)
    description: Optional[str] = None
    category: Optional[str] = None
    cover_image_url: Optional[str] = None
    total_chapters: int = 0
    total_scenes: int = 0

    chapters: List["Chapter"] = Relationship(back_populates="story")

class Chapter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    story_id: int = Field(foreign_key="story.id")
    index: int
    title: str
    short_summary: Optional[str] = None
    cover_image_url: Optional[str] = None

    story: Optional[Story] = Relationship(back_populates="chapters")
    scenes: List["Scene"] = Relationship(back_populates="chapter")

class Scene(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    chapter_id: int = Field(foreign_key="chapter.id")
    index: int
    raw_text: str  # Podcast/Narration text
    reel_script: Optional[str] = None  # Movie-style dialogue for reels

    ai_caption: Optional[str] = None
    ai_symbolism: Optional[str] = None
    ai_emotion: Optional[str] = None
    ai_background_music_tag: Optional[str] = None
    ai_image_prompt: Optional[str] = None
    ai_image_url: Optional[str] = None
    ai_video_url: Optional[str] = None
    ai_audio_url: Optional[str] = None  # Url to generated podcast narration
    reel_audio_url: Optional[str] = None  # Url to generated reel dialogue audio
    generated_at: Optional[datetime] = None

    chapter: Optional[Chapter] = Relationship(back_populates="scenes")
    progress: List["UserSceneProgress"] = Relationship(back_populates="scene")

class UserSceneProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    scene_id: int = Field(foreign_key="scene.id")
    completed: bool = False
    completed_at: Optional[datetime] = None
    xp_earned: int = 0

    user: Optional[User] = Relationship(back_populates="progress")
    scene: Optional[Scene] = Relationship(back_populates="progress")

class Badge(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(unique=True, index=True)
    name: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    unlock_condition: Optional[str] = None

    users: List["UserBadge"] = Relationship(back_populates="badge")

class UserBadge(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    badge_id: int = Field(foreign_key="badge.id")
    earned_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="badges")
    badge: Optional[Badge] = Relationship(back_populates="users")

class Location(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    lat: float
    lon: float
    epoch: Optional[str] = None
    region: Optional[str] = None
    era: Optional[str] = None
