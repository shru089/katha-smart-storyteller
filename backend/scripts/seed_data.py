import os
from sqlmodel import Session, select
from app.db import engine, create_db_and_tables
from app.models import User, Story, Chapter, Scene, Location, Badge, UserBadge

def seed_database():
    """Seed the database with initial data for testing"""
    create_db_and_tables()
    
    with Session(engine) as session:
        # Check if data already exists
        if session.exec(select(Story)).first():
            print("Database already seeded")
            return
        
        # Create sample user
        user = User(
            name="Guest User",
            email="guest@katha.com",
            total_xp=150,
            current_streak_days=3,
            longest_streak_days=7
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        # Create sample story
        story = Story(
            title="The Ramayana",
            slug="ramayana",
            category="Epic",
            description="The epic tale of Prince Rama's journey",
            cover_image_url="/static/images/ramayana-cover.jpg",
            total_chapters=2
        )
        session.add(story)
        session.commit()
        session.refresh(story)
        
        # Create chapters
        chapter1 = Chapter(
            story_id=story.id,
            title="Chapter 1: The Birth of Rama",
            description="The divine birth of Prince Rama in Ayodhya",
            index=1
        )
        chapter2 = Chapter(
            story_id=story.id,
            title="Chapter 2: The Exile",
            description="Rama's 14-year exile to the forest",
            index=2
        )
        session.add(chapter1)
        session.add(chapter2)
        session.commit()
        session.refresh(chapter1)
        session.refresh(chapter2)
        
        # Create scenes
        scenes = [
            Scene(
                chapter_id=chapter1.id,
                raw_text="King Dasharatha performs a yagna to be blessed with children",
                index=1,
                ai_image_url="/static/images/rama-birth.jpg",
                ai_emotion="devotional",
                ai_caption="The sacred fire ceremony begins"
            ),
            Scene(
                chapter_id=chapter1.id,
                raw_text="The divine beings appear and grant the king his wish",
                index=2,
                ai_image_url="/static/images/divine-appears.jpg",
                ai_emotion="wonder",
                ai_caption="Gods descend from heavens"
            ),
            Scene(
                chapter_id=chapter2.id,
                raw_text="Rama accepts his father's command to go into exile",
                index=1,
                ai_image_url="/static/images/rama-exile.jpg",
                ai_emotion="sorrow",
                ai_caption="The prince accepts his fate"
            ),
            Scene(
                chapter_id=chapter2.id,
                raw_text="Sita and Lakshmana join Rama in the forest",
                index=2,
                ai_image_url="/static/images/forest-journey.jpg",
                ai_emotion="peace",
                ai_caption="The journey begins"
            )
        ]
        
        for scene in scenes:
            session.add(scene)
        session.commit()
        
        # Create locations
        locations = [
            Location(
                name="Ayodhya",
                description="The birthplace of Lord Rama and capital of Kosala Kingdom",
                lat=26.7956,
                lon=82.1942,
                epoch="Ramayana",
                region="Northern India",
                era="5114 BCE"
            ),
            Location(
                name="Kurukshetra",
                description="The battlefield where the Mahabharata war was fought",
                lat=29.9695,
                lon=76.8783,
                epoch="Mahabharata",
                region="Northern India",
                era="3102 BCE"
            ),
            Location(
                name="Hampi",
                description="Believed to be the site of Kishkindha from Ramayana",
                lat=15.3350,
                lon=76.4600,
                epoch="Ramayana",
                region="Southern India",
                era="Unknown"
            )
        ]
        
        for location in locations:
            session.add(location)
        session.commit()
        
        # Create badges
        badges = [
            Badge(code="story_explorer", name="Story Explorer", description="Read your first story", icon_url="book"),
            Badge(code="devoted_reader", name="Devoted Reader", description="Read 5 stories", icon_url="favorite"),
            Badge(code="cultural_scholar", name="Cultural Scholar", description="Complete 10 stories", icon_url="psychology"),
            Badge(code="master_storyteller", name="Master Storyteller", description="Complete all stories", icon_url="auto_awesome")
        ]
        
        for badge in badges:
            session.add(badge)
        session.commit()
        
        # Award first badge to user
        user_badge = UserBadge(user_id=user.id, badge_id=badges[0].id)
        session.add(user_badge)
        session.commit()
        
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
