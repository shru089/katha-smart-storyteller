"""
Fix Audio URL Paths in Database

Change /audio/ to /static/audio/ so files can be accessed.
"""

import sys
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from sqlmodel import Session, select
from app.db import engine
from app.models import Scene

with Session(engine) as session:
    print("\nFixing audio URLs...")
    
    # Get all scenes with audio
    scenes = session.exec(
        select(Scene).where(Scene.ai_audio_url != None)
    ).all()
    
    fixed = 0
    for scene in scenes:
        if scene.ai_audio_url and scene.ai_audio_url.startswith('/audio/'):
            # Change /audio/ to /static/audio/
            scene.ai_audio_url = scene.ai_audio_url.replace('/audio/', '/static/audio/')
            session.add(scene)
            fixed += 1
    
    session.commit()
    
    print(f"Fixed {fixed} audio URLs")
    print("All audio files now accessible at /static/audio/\n")
