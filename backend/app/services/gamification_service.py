"""
Gamification logic: XP, streaks, badges.
Functions operate using DB session from sqlmodel.
"""

from sqlmodel import select
from datetime import datetime, date, timedelta
from typing import List
from app.models import User, UserSceneProgress, Badge, UserBadge, Story, Chapter, Scene

SCENE_XP = 25 # Increased for better progression feel

# Badge Codes matching seed_badges.py
BADGE_EXPLORER = "story_explorer"
BADGE_READER = "devoted_reader"
BADGE_SCHOLAR = "cultural_scholar"
BADGE_MASTER = "master_storyteller"

def complete_scene(session, user_id: int, scene_id: int) -> dict:
    """
    Mark a scene completed for a user, award XP if first time,
    update streaks and badges. Returns update summary.
    """
    user = session.get(User, user_id)
    if not user:
        raise ValueError("User not found")

    scene = session.get(Scene, scene_id)
    if not scene:
        raise ValueError("Scene not found")

    stmt = select(UserSceneProgress).where(UserSceneProgress.user_id == user_id, UserSceneProgress.scene_id == scene_id)
    progress = session.exec(stmt).first()
    newly_earned_badges = []

    now = datetime.utcnow()
    today = date.today()

    if not progress:
        progress = UserSceneProgress(user_id=user_id, scene_id=scene_id, completed=True, completed_at=now, xp_earned=SCENE_XP)
        session.add(progress)
        user.total_xp += SCENE_XP
        user.stories_read += 1 # simplistic: count each scene as progress towards stories read count
    else:
        if not progress.completed:
            progress.completed = True
            progress.completed_at = now
            progress.xp_earned = SCENE_XP
            user.total_xp += SCENE_XP
            user.stories_read += 1

    # Streak logic
    last_active = user.last_active_date
    if last_active is None:
        user.current_streak_days = 1
    else:
        if last_active == today - timedelta(days=1):
            user.current_streak_days += 1
        elif last_active == today:
            pass
        else:
            user.current_streak_days = 1
    user.last_active_date = today
    if user.current_streak_days > user.longest_streak_days:
        user.longest_streak_days = user.current_streak_days

    session.add(user)
    session.commit()

    # Evaluate badges
    newly_codes = evaluate_badges_for_user(session, user_id)
    for code in newly_codes:
        badge = session.exec(select(Badge).where(Badge.code == code)).first()
        if badge:
            newly_earned_badges.append({
                "code": badge.code, 
                "name": badge.name, 
                "description": badge.description, 
                "icon_url": badge.icon_url
            })

    session.commit()

    return {
        "status": "success",
        "xp_added": SCENE_XP,
        "total_xp": user.total_xp,
        "current_streak_days": user.current_streak_days,
        "new_badges": newly_earned_badges,
    }

def evaluate_badges_for_user(session, user_id: int) -> List[str]:
    newly_awarded = []
    
    def has_badge(code: str) -> bool:
        stmt = select(UserBadge).join(Badge).where(UserBadge.user_id == user_id, Badge.code == code)
        return session.exec(stmt).first() is not None

    # Helper to award
    def award(code: str):
        badge = session.exec(select(Badge).where(Badge.code == code)).first()
        if badge:
            session.add(UserBadge(user_id=user_id, badge_id=badge.id))
            newly_awarded.append(code)

    # Count completed stories
    # A story is completed if all its scenes are completed
    # For MVP, we can just use stories_read count if we don't want to do full DB join
    user = session.get(User, user_id)
    stories_completed = user.stories_read // 3 # approx 3 scenes per story in our seed

    # STORY_EXPLORER: Read first story (or 1 scene)
    if not has_badge(BADGE_EXPLORER) and user.stories_read >= 1:
        award(BADGE_EXPLORER)

    # DEVOTED_READER: Read 5 stories
    if not has_badge(BADGE_READER) and stories_completed >= 5:
        award(BADGE_READER)

    # CULTURAL_SCHOLAR: Read 10 stories
    if not has_badge(BADGE_SCHOLAR) and stories_completed >= 10:
        award(BADGE_SCHOLAR)

    # MASTER_STORYTELLER: Read all (placeholder 20)
    if not has_badge(BADGE_MASTER) and stories_completed >= 20:
        award(BADGE_MASTER)

    return newly_awarded
