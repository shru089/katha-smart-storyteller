"""
Quick test for fast video service
"""
import sys
import os

sys.path.insert(0, '.')

from app.services.fast_video_service import fast_video_service

print("=" * 60)
print("TESTING FAST VIDEO SERVICE")
print("=" * 60)

try:
    print("\nGenerating fast video...")
    print("Estimated time: 5-10 seconds\n")
    
    url = fast_video_service.generate_fast_video(
        scene_text="The sun rose over the golden spires of Ayodhya. King Dasharatha prepared for the royal ceremony.",
        emotion="peaceful",
        scene_id=9999  # Test ID
    )
    
    print("\nSUCCESS!")
    print(f"Video URL: {url}")
    print(f"View at: http://localhost:8000{url}")
    print("\nFast video service is working!")
    
except Exception as e:
    print(f"\nError: {e}")
    import traceback
    traceback.print_exc()
