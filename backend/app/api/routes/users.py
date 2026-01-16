"""
User Routes - Authentication and User Management
Includes JWT token-based authentication
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from app.db import get_session
from app.models import User
from app.schemas import UserCreate, UserLogin, UserOut, UserUpdate
from app.auth import hash_password, verify_password
from app.jwt_auth import create_access_token, get_current_user_id, get_optional_user_id
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


# Enhanced Response Models
class AuthResponse(BaseModel):
    """Response for login/register with JWT token"""
    user: UserOut
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    message: str


class ProfileUpdateResponse(BaseModel):
    user: UserOut
    message: str


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, session: Session = Depends(get_session)):
    """
    Register a new user.
    Returns user data and JWT token for immediate authentication.
    """
    # Check if email already exists
    stmt = select(User).where(User.email == payload.email)
    existing_user = session.exec(stmt).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    # Create user with hashed password
    hashed = hash_password(payload.password)
    user = User(
        name=payload.name, 
        email=payload.email, 
        password_hash=hashed,
        username=payload.email.split("@")[0]  # Default username from email
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # Generate JWT token
    token_response = create_access_token(user.id, user.email)
    user_out = UserOut.model_validate(user)
    
    return AuthResponse(
        user=user_out,
        access_token=token_response.access_token,
        token_type=token_response.token_type,
        expires_in=token_response.expires_in,
        message="Registration successful! Welcome to Katha."
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, session: Session = Depends(get_session)):
    """
    Authenticate user and return JWT token.
    """
    stmt = select(User).where(User.email == payload.email)
    user = session.exec(stmt).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )
    
    if not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )
    
    # Generate JWT token
    token_response = create_access_token(user.id, user.email)
    user_out = UserOut.model_validate(user)
    
    return AuthResponse(
        user=user_out,
        access_token=token_response.access_token,
        token_type=token_response.token_type,
        expires_in=token_response.expires_in,
        message="Login successful! Welcome back."
    )


@router.get("/me", response_model=UserOut)
def get_current_user_profile(
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    """
    Get current authenticated user's profile.
    Requires valid JWT token.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut.model_validate(user)


@router.put("/me", response_model=ProfileUpdateResponse)
def update_current_user_profile(
    payload: UserUpdate,
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    """
    Update current authenticated user's profile.
    Requires valid JWT token.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    session.add(user)
    session.commit()
    session.refresh(user)
    
    return ProfileUpdateResponse(
        user=UserOut.model_validate(user),
        message="Profile updated successfully"
    )


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, session: Session = Depends(get_session)):
    """
    Get a user's public profile by ID.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut.model_validate(user)


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int, 
    payload: UserUpdate, 
    session: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id)
):
    """
    Update a user's profile.
    Only the user themselves can update their profile.
    """
    if current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile"
        )
    
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    session.add(user)
    session.commit()
    session.refresh(user)
    return UserOut.model_validate(user)


@router.get("/{user_id}/progress", response_model=list)
def get_user_story_progress(
    user_id: int, 
    session: Session = Depends(get_session),
    current_user_id: Optional[int] = Depends(get_optional_user_id)
):
    """
    Return stories that the user has started but not necessarily finished.
    """
    from app.models import UserSceneProgress, Scene, Chapter, Story
    
    stmt = select(Story).join(Chapter).join(Scene).join(UserSceneProgress).where(
        UserSceneProgress.user_id == user_id
    ).distinct()
    stories = session.exec(stmt).all()
    return stories


@router.get("/{user_id}/favorites", response_model=list)
def get_user_favorites(user_id: int, session: Session = Depends(get_session)):
    """
    Get user's favorite stories.
    """
    from app.models import UserFavoriteStory, Story
    stmt = select(Story).join(UserFavoriteStory).where(UserFavoriteStory.user_id == user_id)
    stories = session.exec(stmt).all()
    return stories


@router.post("/{user_id}/favorites/{story_id}")
def toggle_favorite(
    user_id: int, 
    story_id: int, 
    session: Session = Depends(get_session),
    current_user_id: int = Depends(get_current_user_id)
):
    """
    Toggle a story as favorite for the user.
    """
    if current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only modify your own favorites"
        )
    
    from app.models import UserFavoriteStory
    stmt = select(UserFavoriteStory).where(
        UserFavoriteStory.user_id == user_id, 
        UserFavoriteStory.story_id == story_id
    )
    fav = session.exec(stmt).first()
    
    if fav:
        session.delete(fav)
        session.commit()
        return {"status": "unfavorited", "message": "Story removed from favorites"}
    else:
        new_fav = UserFavoriteStory(user_id=user_id, story_id=story_id)
        session.add(new_fav)
        session.commit()
        return {"status": "favorited", "message": "Story added to favorites"}


@router.get("/{user_id}/completed", response_model=list)
def get_user_completed_stories(user_id: int, session: Session = Depends(get_session)):
    """
    Return stories where all scenes are completed by the user.
    """
    from app.models import Story, Chapter, Scene, UserSceneProgress
    from sqlalchemy import func
    
    # Get all stories with completed scene counts
    stories_with_progress = session.exec(
        select(Story)
    ).all()
    
    completed_stories = []
    for story in stories_with_progress:
        total_scenes = story.total_scenes
        if total_scenes == 0:
            continue
            
        # Count completed scenes for this story
        completed_count = session.exec(
            select(func.count(UserSceneProgress.id))
            .join(Scene).join(Chapter)
            .where(
                Chapter.story_id == story.id,
                UserSceneProgress.user_id == user_id,
                UserSceneProgress.completed == True
            )
        ).one()
        
        if completed_count >= total_scenes:
            completed_stories.append(story)
    
    return completed_stories
