"""
Test Multi-Voice Audio Generation

Tests the enhanced audio service with:
1. Male and female character voices
2. Different emotion depths
3. Dialogue vs narration
"""

import asyncio
import sys
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from app.services.enhanced_audio_service import get_enhanced_audio_service

async def test_multi_voice():
    print("\n" + "="*70)
    print("TESTING MULTI-VOICE AUDIO GENERATION")
    print("="*70 + "\n")
    
    audio_service = get_enhanced_audio_service()
    
    # Test dialogues with different characters
    test_cases = [
        {
            'text': '"We must protect Sita at all costs," Ram said firmly.',
            'scene_id': 999,
            'description': 'Male dialogue (Ram) - should use male voice'
        },
        {
            'text': '"I will not be silenced," Sita replied with unwavering strength.',
            'scene_id': 998,
            'description': 'Female dialogue (Sita) - should use female voice'
        },
        {
            'text': 'The forest was silent. Birds chirped in the distance as the sun rose over the Himalayas.',
            'scene_id': 997,
            'description': 'Pure narration - should use narrator voice'
        },
        {
            'text': '"Hanuman! Come forth!" the king shouted. Hanuman bowed respectfully. "I am here, my lord," he whispered.',
            'scene_id': 996,
            'description': 'Mixed dialogue - multiple male voices with emotions'
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\nTest {i}: {test['description']}")
        print(f"Text: {test['text'][:60]}...")
        print("-" * 70)
        
        try:
            audio_path = await audio_service.generate_audio_for_scene(
                scene_text=test['text'],
                scene_id=test['scene_id'],
                scene_emotion=None
            )
            print(f"✓ Generated: {audio_path}")
            
        except Exception as e:
            print(f"✗ Error: {e}")
    
    print("\n" + "="*70)
    print("TESTING EMOTION DEPTH")
    print("="*70 + "\n")
    
    # Test different emotions
    emotions = {
        'shanta': 'Ram spoke with absolute calm and peace.',
        'raudra': 'Ravan roared with thunderous anger!',
        'karuna': 'Sita wept with deep sorrow...',
        'veera': 'The heroes stood bold and fearless.',
        'hasya': 'Everyone laughed joyfully together!'
    }
    
    for emotion, text in emotions.items():
        print(f"\n{emotion.upper()}: {text}")
        try:
            audio_path = await audio_service.generate_simple_audio(
                text=text,
                scene_id=900 + list(emotions.keys()).index(emotion),
                emotion=emotion
            )
            print(f"✓ Generated with {emotion} emotion: {audio_path}")
        except Exception as e:
            print(f"✗ Error: {e}")
    
    print("\n" + "="*70)
    print("ALL TESTS COMPLETE!")
    print("="*70 + "\n")

if __name__ == "__main__":
    asyncio.run(test_multi_voice())
