from sqlmodel import Session, select
from app.db import engine
from app.models import Badge

def seed_badges():
    with Session(engine) as session:
        if session.exec(select(Badge)).first():
            print("Badges already exist")
            return
        
        badges = [
            Badge(code="story_explorer", name="Story Explorer", description="Read your first story", icon_url="book"),
            Badge(code="devoted_reader", name="Devoted Reader", description="Read 5 stories", icon_url="favorite"),
            Badge(code="cultural_scholar", name="Cultural Scholar", description="Complete 10 stories", icon_url="psychology"),
            Badge(code="master_storyteller", name="Master Storyteller", description="Complete all stories", icon_url="auto_awesome")
        ]
        
        for badge in badges:
            session.add(badge)
        session.commit()
        print("Badges seeded successfully!")

if __name__ == "__main__":
    seed_badges()
