from sqlmodel import Session, select
from app.db import engine
from app.models import Story
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

with Session(engine) as session:
    stories = session.exec(select(Story)).all()
    print("\n=== DATABASE STORIES ===\n")
    for s in stories:
        print(f"ID {s.id}: {s.title} ({s.slug})")
        print(f"   Chapters: {s.total_chapters}, Scenes: {s.total_scenes}")
        print()
