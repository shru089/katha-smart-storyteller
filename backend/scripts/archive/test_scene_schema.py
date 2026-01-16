"""Test Scene Schema Mapping"""
import requests

try:
    r = requests.get('http://localhost:8000/api/chapters/1/scenes')
    r.raise_for_status()
    scenes = r.json()
    
    if scenes:
        print(f"\n✓ Got {len(scenes)} scenes")
        scene1 = scenes[0]
        print(f"\nScene 1 fields:")
        print(f"  emotion: {scene1.get('emotion')}")
        print(f"  symbolism: {scene1.get('symbolism')}")
        print(f"  ai_emotion: {scene1.get('ai_emotion')}")
        print(f"  ai_symbolism: {scene1.get('ai_symbolism')}")
        
        if scene1.get('emotion'):
            print(f"\n✓ emotion field is working!")
        if scene1.get('symbolism'):
            print(f"✓ symbolism field is working!")
    else:
        print("No scenes found")
        
except Exception as e:
    print(f"Error: {e}")
