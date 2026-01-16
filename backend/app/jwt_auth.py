"""
JWT Authentication Module for Katha
Secure token-based authentication with proper error handling
"""

import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlmodel import Session, select

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "katha-secret-key-change-in-production-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security = HTTPBearer(auto_error=False)


class TokenData(BaseModel):
    user_id: int
    email: Optional[str] = None
    exp: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user_id: int


def create_access_token(user_id: int, email: str = None) -> TokenResponse:
    """
    Create a JWT access token for a user.
    """
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # in seconds
        user_id=user_id
    )


def verify_token(token: str) -> Optional[TokenData]:
    """
    Verify and decode a JWT token.
    Returns TokenData if valid, None otherwise.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        email = payload.get("email")
        exp = datetime.fromtimestamp(payload.get("exp"))
        
        if user_id is None:
            return None
            
        return TokenData(user_id=user_id, email=email, exp=exp)
    except JWTError:
        return None


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> int:
    """
    Dependency to get the current authenticated user's ID from JWT token.
    Raises 401 if not authenticated.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token_data = verify_token(credentials.credentials)
    
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return token_data.user_id


async def get_optional_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Optional[int]:
    """
    Dependency to optionally get the current user's ID.
    Returns None if not authenticated (doesn't raise error).
    """
    if credentials is None:
        return None
    
    token_data = verify_token(credentials.credentials)
    return token_data.user_id if token_data else None


def get_current_user(session: Session, user_id: int):
    """
    Get the full user object from the database.
    """
    from app.models import User
    
    user = session.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
