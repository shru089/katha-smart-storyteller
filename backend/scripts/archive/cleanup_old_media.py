"""
Complete cleanup of old media generation code

Removes:
- Old service files (image, video, voice, music)
- Old API route files (image, video, voice, pipeline)
- Clears static directories

Preserves:
- rishi_service.py (AI chat)
- gamification_service.py (badges/XP)
- seed_service.py (database seeding)
"""

import os
import sys
import shutil
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

def cleanup_old_media():
    print("\n" + "="*60)
    print("🧹 CLEANUP: Removing Old Media Generation Code")
    print("="*60 + "\n")
    
    backend = Path(__file__).parent
    
    # Services to delete
    service_files = [
        "app/services/image_service.py",
        "app/services/video_service.py",
        "app/services/voice_service.py",
        "app/services/music_service.py",
        "app/services/ai_service.py",  # Old AI orchestration
    ]
    
    # Routes to delete
    route_files = [
        "app/api/routes/ai/image.py",
        "app/api/routes/ai/video.py",
        "app/api/routes/ai/voice.py",
        "app/api/routes/ai/pipeline.py",
    ]
    
    # Static directories to clear
    static_dirs = [
        "static/audio",
        "static/videos",
    ]
    
    deleted_count = 0
    
    # Delete service files
    print("📁 Deleting old service files...")
    for file_path in service_files:
        path = backend / file_path
        if path.exists():
            path.unlink()
            print(f"   ✅ {file_path}")
            deleted_count += 1
        else:
            print(f"   ⚠️  Not found: {file_path}")
    
    print()
    
    # Delete route files
    print("📁 Deleting old API route files...")
    for file_path in route_files:
        path = backend / file_path
        if path.exists():
            path.unlink()
            print(f"   ✅ {file_path}")
            deleted_count += 1
        else:
            print(f"   ⚠️  Not found: {file_path}")
    
    print()
    
    # Clear static directories
    print("📁 Clearing static media directories...")
    for dir_path in static_dirs:
        path = backend / dir_path
        if path.exists():
            files_deleted = 0
            for item in path.iterdir():
                if item.is_file():
                    item.unlink()
                    files_deleted += 1
            print(f"   ✅ {dir_path} - cleared {files_deleted} files")
        else:
            print(f"   ⚠️  Not found: {dir_path}")
    
    print()
    print("="*60)
    print(f"✨ CLEANUP COMPLETE! Deleted {deleted_count} files")
    print("="*60)
    
    # List remaining important files
    print("\n✅ Essential Files Preserved:")
    preserved = [
        "app/services/rishi_service.py",
        "app/services/gamification_service.py",
        "app/services/seed_service.py",
        "app/api/routes/ai/rishi.py",
    ]
    
    for file_path in preserved:
        path = backend / file_path
        if path.exists():
            print(f"   ✓ {file_path}")
        else:
            print(f"   ✗ Missing: {file_path}")
    
    print()
    print("⚠️  NEXT STEPS:")
    print("   1. Update frontend to remove calls to /api/ai/image and /api/ai/video")
    print("   2. Restart backend server: uvicorn app.main:app --reload")
    print("   3. Verify app still works without media generation")
    print()

if __name__ == "__main__":
    try:
        cleanup_old_media()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
