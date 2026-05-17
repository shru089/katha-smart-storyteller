"""
Dialogue Emotion Tagging Service

Parses story text to identify dialogue and apply character-specific emotions.
Uses the same narrator voice but varies tone/emotion based on who's speaking.
"""

from typing import List, Dict, Tuple
import re


class DialogueEmotionService:
    """Service to parse dialogue and assign character-specific emotions"""
    
    # Character-to-emotion mapping based on authentic personalities
    CHARACTER_EMOTIONS = {
        # Heroes - Calm, Soothing, Bold
        'ram': 'shanta',           # Ram: Calm, soothing, makes you feel safe - but bold and unapologetic
        'lakshman': 'veera',       # Lakshman: Protective, fierce loyalty
        'hanuman': 'veera',        # Hanuman: Devoted, heroic strength
        
        # Heroines - Firm, Unapologetic  
        'sita': 'veera',           # Sita: Unapologetically firm, strong, dignified
        'draupadi': 'raudra',      # Draupadi: Fierce, fiery, demands justice
        
        # Kings and Authority
        'king': 'raudra',          # King Dasharatha: Commanding, authoritative (but can be sad)
        'dasharatha': 'karuna',    # When sad/burdened (context dependent)
        'ravan': 'raudra',         # Ravan: Arrogant, powerful, angry
        
        # Supporting Characters
        'kaikeyi': 'bibhatsa',     # Kaikeyi: Bitter, harsh
        'manthara': 'bibhatsa',    # Manthara: Poisonous, manipulative
        'sugriva': 'karuna',       # Sugriva: Sad, exiled monkey king
        'vibhishana': 'shanta',    # Vibhishana: Calm, righteous
        'bharat': 'karuna',        # Bharat: Sorrowful, dutiful
        
        # New Characters
        'bali': 'raudra',          # Bali/Mahabali: Powerful king
        'mahabali': 'raudra',      # Alternate name for Bali
        'tara': 'karuna',          # Tara: Mahabali's wife, sorrowful
        'shurpanakha': 'raudra',   # Shurpanakha: Ravan's sister, aggressive demoness
        'kausalya': 'karuna',      # Kausalya: Gentle mother
        'sumitra': 'shanta',       # Sumitra: Calm queen
        'shatrughna': 'veera',     # Shatrughna: Loyal warrior
        'jatayu': 'veera',         # Jatayu: Heroic bird
        'angad': 'veera',          # Angad: Young warrior
        'jambavan': 'shanta',      # Jambavan: Wise bear king
        'urmila': 'karuna',        # Urmila: Devoted wife
        'mandodari': 'karuna',     # Mandodari: Ravan's good wife
        
        # Default
        'narrator': 'narrative',   # Neutral, smooth narrator
        'default': 'narrative'
    }
    
    def parse_dialogue_segments(self, text: str) -> List[Dict]:
        """
        Parse text into segments with emotion tags
        
        Returns:
            List of dicts with 'text' and 'emotion' keys
        """
        segments = []
        
        # 1. Try to parse as colon-separated script format first (e.g. "Arjuna: I'm burned out. Krishna: Rise up.")
        script_pattern = r'(\b[A-Za-z0-9_]+)\s*:\s*([^:\n]+?)(?=\s+\b[A-Za-z0-9_]+\s*:|$)'
        matches = list(re.finditer(script_pattern, text))
        
        if len(matches) >= 1:
            last_pos = 0
            for match in matches:
                # Add narration before the dialogue
                narration_before = text[last_pos:match.start()].strip()
                if narration_before:
                    segments.append({
                        'text': narration_before,
                        'emotion': 'narrative'
                    })
                
                speaker = match.group(1).strip()
                dialogue_text = match.group(2).strip()
                
                # Identify character and emotion
                character = self.identify_character(speaker)
                base_emotion = self.CHARACTER_EMOTIONS.get(character, 'narrative')
                
                segments.append({
                    'text': dialogue_text,
                    'emotion': base_emotion,
                    'character': character,
                    'is_dialogue': True
                })
                
                last_pos = match.end()
            
            # Add remaining narration after last dialogue
            narration_after = text[last_pos:].strip()
            if narration_after:
                segments.append({
                    'text': narration_after,
                    'emotion': 'narrative'
                })
            
            return segments

        # 2. Otherwise, fall back to standard quote matching: "dialogue", speaker said
        dialogue_pattern = r'["\']([^"\']+)["\'],?\s*([\w\s]+?)\s+(said|whispered|shouted|replied|asked|murmured|cried|laughed|sighed|roared)'
        
        last_pos = 0
        for match in re.finditer(dialogue_pattern, text, re.IGNORECASE):
            # Add narration before this dialogue (if any)
            narration_before = text[last_pos:match.start()].strip()
            if narration_before:
                segments.append({
                    'text': narration_before,
                    'emotion': 'narrative'
                })
            
            # Extract dialogue components
            dialogue_text = match.group(1)  # Quoted text
            speaker_context = match.group(2).lower()  # Who said it
            speech_verb = match.group(3).lower()  # How they said it
            
            # Identify character and emotion
            character = self.identify_character(speaker_context)
            base_emotion = self.CHARACTER_EMOTIONS.get(character, 'narrative')
            
            # Modify emotion based on speech verb
            emotion = self.adjust_emotion_for_verb(base_emotion, speech_verb)
            
            # Add dialogue segment
            segments.append({
                'text': dialogue_text,
                'emotion': emotion,
                'character': character,
                'is_dialogue': True
            })
            
            last_pos = match.end()
            
        # Add remaining narration after last dialogue
        narration_after = text[last_pos:].strip()
        if narration_after:
            segments.append({
                'text': narration_after,
                'emotion': 'narrative'
            })
            
        return segments
    
    def identify_character(self, speaker_text: str) -> str:
        """Identify character from speaker context"""
        speaker_lower = speaker_text.lower().strip()
        
        # Direct character names
        if 'king' in speaker_lower or 'dasharatha' in speaker_lower:
            return 'king' if 'king' in speaker_lower else 'dasharatha'
        elif 'ram' in speaker_lower:
            return 'ram'
        elif 'sita' in speaker_lower:
            return 'sita'
        elif 'lakshman' in speaker_lower:
            return 'lakshman'
        elif 'hanuman' in speaker_lower:
            return 'hanuman'
        elif 'ravan' in speaker_lower:
            return 'ravan'
        elif 'kaikeyi' in speaker_lower:
            return 'kaikeyi'
        elif 'draupadi' in speaker_lower:
            return 'draupadi'
        elif 'sugriva' in speaker_lower:
            return 'sugriva'
        elif 'vibhishana' in speaker_lower:
            return 'vibhishana'
        elif 'bali' in speaker_lower or 'mahabali' in speaker_lower:
            return 'bali'
        elif 'tara' in speaker_lower:
            return 'tara'
        elif 'shurpanakha' in speaker_lower:
            return 'shurpanakha'
        elif 'kausalya' in speaker_lower:
            return 'kausalya'
        elif 'sumitra' in speaker_lower:
            return 'sumitra'
        elif 'bharat' in speaker_lower:
            return 'bharat'
        elif 'shatrughna' in speaker_lower:
            return 'shatrughna'
        elif 'jatayu' in speaker_lower:
            return 'jatayu'
        elif 'angad' in speaker_lower:
            return 'angad'
        elif 'jambavan' in speaker_lower:
            return 'jambavan'
        elif 'urmila' in speaker_lower:
            return 'urmila'
        elif 'mandodari' in speaker_lower:
            return 'mandodari'
        elif 'manthara' in speaker_lower:
            return 'manthara'
        
        # Pronouns - context-dependent
        # For now, default to narrator
        # TODO: Track character context for "he said" / "she said"
        
        return 'default'
    
    def adjust_emotion_for_verb(self, base_emotion: str, verb: str) -> str:
        """Adjust emotion based on how something was said"""
        verb_emotions = {
            'whispered': 'shanta',      # Soft, calm
            'shouted': 'raudra',        # Loud, angry
            'cried': 'karuna',          # Sad
            'laughed': 'hasya',         # Joyful
            'sighed': 'karuna',         # Sad
            'murmured': 'shanta',       # Soft
            'roared': 'raudra',         # Angry
        }
        
        # Override base emotion if verb suggests strong emotion
        return verb_emotions.get(verb, base_emotion)
    
    def merge_small_segments(self, segments: List[Dict], min_words: int = 3) -> List[Dict]:
        """
        Merge very small segments to avoid too many audio file switches
        
        Example: "Enter," → merge with previous/next narration
        """
        if len(segments) <= 1:
            return segments
        
        merged = []
        buffer = None
        
        for segment in segments:
            word_count = len(segment['text'].split())
            
            # If segment is too small and same emotion as buffer, merge
            if word_count < min_words and buffer and buffer['emotion'] == segment['emotion']:
                buffer['text'] = f"{buffer['text']} {segment['text']}"
            else:
                if buffer:
                    merged.append(buffer)
                buffer = segment.copy()
        
        if buffer:
            merged.append(buffer)
        
        return merged


# Singleton instance
_dialogue_emotion_service = None

def get_dialogue_emotion_service() -> DialogueEmotionService:
    """Get or create dialogue emotion service singleton"""
    global _dialogue_emotion_service
    if _dialogue_emotion_service is None:
        _dialogue_emotion_service = DialogueEmotionService()
    return _dialogue_emotion_service
