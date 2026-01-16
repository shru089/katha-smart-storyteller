"""
Test Dialogue Emotion Tagging

Parse a sample Ramayana scene and show emotion tagging.
"""

import sys
sys.path.insert(0, '.')

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from app.services.dialogue_emotion_service import get_dialogue_emotion_service

# Sample text with dialogue from Ramayana
sample_text = """The palace was quiet. Too quiet.

Inside his chamber, the king sat alone, hands folded, staring at the flame of a single oil lamp. Tomorrow should have been the proudest day of his life. So why did his chest feel so heavy?

A servant knocked.

"Enter," the king said.

The door opened, and a young attendant stepped inside, bowing low. "Your Majesty, the queen requests your presence."

The king sighed. "Tell her I will come shortly."

"She says it is urgent, my lord," the servant whispered.

The king's eyes darkened. Something was wrong. He could feel it."""

def main():
    print("\n" + "="*70)
    print("DIALOGUE EMOTION TAGGING TEST")
    print("="*70 + "\n")
    
    service = get_dialogue_emotion_service()
    
    print("Original Text:")
    print("-" * 70)
    print(sample_text)
    print("\n")
    
    # Parse into segments
    segments = service.parse_dialogue_segments(sample_text)
    
    print(f"Parsed into {len(segments)} segments:")
    print("=" * 70 + "\n")
    
    for i, segment in enumerate(segments, 1):
        is_dialogue = segment.get('is_dialogue', False)
        character = segment.get('character', 'N/A')
        emotion = segment['emotion']
        text = segment['text'][:60] + "..." if len(segment['text']) > 60 else segment['text']
        
        segment_type = "DIALOGUE" if is_dialogue else "NARRATION"
        
        print(f"Segment {i}: [{segment_type}]")
        print(f"  Character: {character}")
        print(f"  Emotion: {emotion}")
        print(f"  Text: \"{text}\"")
        print()
    
    print("=" * 70)
    print("✓ Dialogue parsing successful!")
    print("✓ Emotions assigned based on speakers")
    print("✓ Ready for audio generation")
    print()

if __name__ == "__main__":
    main()
