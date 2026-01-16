import sys
sys.path.insert(0, '.')

from sqlmodel import Session, select
from app.db import engine
from app.models import Chapter

with Session(engine) as session:
    chapters = session.exec(select(Chapter)).all()
    with_covers = sum(1 for c in chapters if c.cover_image_url)
    print(f"Chapters with covers: {with_covers}/{len(chapters)}")
    
    for c in chapters[:5]:
        cover_status = c.cover_image_url if c.cover_image_url else "NO COVER"
        print(f"Ch{c.index}: {cover_status}")
