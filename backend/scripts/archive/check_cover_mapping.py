"""Check which cover images are assigned to which chapters"""
from app.db import SessionLocal
from app.models import Chapter

session = SessionLocal()

# Get all chapters
ramayana_chapters = session.query(Chapter).filter(Chapter.story_id == 3).order_by(Chapter.index).all()
mahabharata_chapters = session.query(Chapter).filter(Chapter.story_id == 4).order_by(Chapter.index).all()

print("=" * 80)
print("RAMAYANA CHAPTERS (Story ID: 3)")
print("=" * 80)
for ch in ramayana_chapters:
    print(f"Chapter {ch.index}: {ch.title[:50]}")
    print(f"  Cover: {ch.cover_image_url}")
    print()

print("=" * 80)
print("MAHABHARATA CHAPTERS (Story ID: 4)")
print("=" * 80)
for ch in mahabharata_chapters:
    print(f"Chapter {ch.index}: {ch.title[:50]}")
    print(f"  Cover: {ch.cover_image_url}")
    print()

session.close()
