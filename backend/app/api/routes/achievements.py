from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import List
from app.db import get_session
from app.models import User, UserBadge, Badge
from app.schemas import AchievementOut, BadgeOut
from sqlmodel import Session

router = APIRouter()

@router.get("/{user_id}/achievements", response_model=AchievementOut)
def get_achievements(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # earned badges
    stmt = select(UserBadge).where(UserBadge.user_id == user_id)
    ub = session.exec(stmt).all()
    earned = []
    earned_codes = set()
    for ub_item in ub:
        badge = session.get(Badge, ub_item.badge_id)
        earned.append(BadgeOut(code=badge.code, name=badge.name, description=badge.description, icon_url=badge.icon_url, earned_at=ub_item.earned_at))
        earned_codes.add(badge.code)
    # locked badges
    all_badges = session.exec(select(Badge)).all()
    locked = []
    for badge in all_badges:
        if badge.code not in earned_codes:
            locked.append(BadgeOut(code=badge.code, name=badge.name, description=badge.description, icon_url=badge.icon_url))
    return AchievementOut(
        total_xp=user.total_xp,
        current_streak_days=user.current_streak_days,
        longest_streak_days=user.longest_streak_days,
        earned_badges=earned,
        locked_badges=locked
    )
