"""
Test Volume-Based Emotion System

Tests different emotions to verify volume adjustments are working
"""

import asyncio
import sys
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from app.services.enhanced_audio_service import get_enhanced_audio_service

async def test_volume_emotions():
    print("\n" + "="*70)
    print("TESTING VOLUME-BASED EMOTION SYSTEM")
    print("="*70 + "\n")
    
    audio_service = get_enhanced_audio_service()
    
    # Test different emotions with volume
    test_cases = [
        {
            'text': 'Everyone laughed joyfully together!',
            'emotion': 'hasya',
            'expected': '+10% louder',
            'scene_id': 801
        },
        {
            'text': 'The demon roared with thunderous anger!',
            'emotion': 'raudra',
            'expected': '+15% louder',
            'scene_id': 802
        },
        {
            'text': 'Sita wept with deep sorrow in her heart.',
            'emotion': 'karuna',
            'expected': '-15% quieter',
            'scene_id': 803
        },
        {
            'text': 'Ram spoke with absolute calm and peace.',
            'emotion': 'shanta',
            'expected': '-10% quieter',
            'scene_id': 804
        },
        {
            'text': 'The heroes stood bold and fearless.',
            'emotion': 'veera',
            'expected': '+8% louder',
            'scene_id': 805
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\nTest {i}: {test['emotion'].upper()} ({test['expected']})")
        print(f"Text: {test['text']}")
        print("-" * 70)
        
        try:
            audio_path = await audio_service.generate_simple_audio(
                text=test['text'],
                scene_id=test['scene_id'],
                emotion=test['emotion']
            )
            print(f"✓ Generated: {audio_path}")
            
        except Exception as e:
            print(f"✗ Error: {e}")
    
    print("\n" + "="*70)
    print("VOLUME TESTING COMPLETE!")
    print("="*70)
    print("\nVolume Mapping:")
    for emotion, volume in audio_service.VOLUME_MAPPING.items():
        db_change = 20 * (volume - 1) if volume != 1.0 else 0
        sign = '+' if db_change > 0 else ''
        print(f"  {emotion:12s}: {volume:.2f}x ({sign}{db_change:.1f} dB)")
    print("\n")

if __name__ == "__main__":
    asyncio.run(test_volume_emotions())
