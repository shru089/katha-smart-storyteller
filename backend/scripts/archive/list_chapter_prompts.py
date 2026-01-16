"""
Generate Cover Images for All Chapters
Uses AI image generation to create stunning 3:4 portrait cover images
"""

from sqlmodel import Session, select
from app.db import engine
from app.models import Story, Chapter

# Chapter-specific image prompts
CHAPTER_PROMPTS = {
    # Ramayana Chapters
    "The Ramayana": {
        1: "cinematic portrait of Lord Rama with golden bow standing in ancient Ayodhya palace courtyard, royal attire, golden hour lighting, majestic and peaceful, rich indian heritage art style, 3:4 aspect ratio",
        2: "dramatic scene of Rama and Sita in forest exile, lush green ashoka trees, traditional indian clothing, warm sunset glow, mythological painting style, emotional and serene, 3:4 portrait",
        3: "intense portrayal of Ravana's golden chariot descending from Lanka, dark clouds, ten heads with crowns, dramatic lighting, epic mythology art, powerful composition, 3:4 vertical",
        4: "heroic Hanuman flying over ocean carrying mountain, glowing sunset sky, muscular divine form, devotion and strength, vibrant colors, indian mythology art, 3:4 portrait orientation",
        5: "epic battle scene of Rama vs Ravana, divine arrows blazing with fire, ancient Lanka burning in background, intense action, mythological war art, dramatic lighting, 3:4 aspect",
        6: "joyful coronation of Rama and Sita in Ayodhya, grand palace with pillars, flower decorations, golden ornaments, celebration and dharma, rich colors, traditional indian art, 3:4 portrait",
        7: "contemplative Rama in royal court making difficult decision, golden throne room, serious expression, dharma and duty theme, regal attire, classical indian painting style, 3:4 vertical"
    },
    
    # Mahabharata Chapters
    "The Mahabharata": {
        1: "grand palace of Hastinapura with Pandavas and Kauravas, royal assembly, ancient architecture, multiple princes in traditional attire, epic scale, rich heritage art, 3:4 portrait",
        2: "intense dice game scene in royal court, Draupadi in distress, Pandavas and Kauravas, dramatic indoor lighting, tension and injustice, classical mythology art, 3:4 aspect",
        3: "Pandavas in forest exile, dense green jungle, simple hermit clothing, peaceful ashram setting, spiritual atmosphere, traditional painting style, 3:4 vertical orientation",
        4: "majestic Krishna revealing Vishwaroop to Arjuna, cosmic divine form, multiple arms, celestial background, awe-inspiring, vibrant cosmic colors, mythology art, 3:4 portrait",
        5: "epic Kurukshetra battlefield with Krishna's chariot, Arjuna with Gandiva bow, armies in background, war drums and flags, golden sunrise, heroic composition, 3:4 aspect",
        6: "final battle scene with fallen warriors, Bhima and Duryodhana combat, intense action, dust and weapons, dramatic war photography style, mythology art, 3:4 portrait",
        7: "peaceful aftermath with Pandavas and Krishna, resolution and dharma, golden temple setting, serene expressions, spiritual victory, classical indian art, 3:4 vertical"
    }
}

def get_chapter_info():
    """Get all chapters with their story information"""
    with Session(engine) as session:
        chapters = session.exec(
            select(Chapter)
            .order_by(Chapter.story_id, Chapter.index)
        ).all()
        
        chapter_info = []
        for chapter in chapters:
            story = session.exec(
                select(Story).where(Story.id == chapter.story_id)
            ).first()
            
            chapter_info.append({
                'chapter_id': chapter.id,
                'story_title': story.title,
                'story_slug': story.slug,
                'chapter_index': chapter.index,
                'chapter_title': chapter.title,
                'story_id': story.id
            })
        
        return chapter_info

def generate_prompt(story_title: str, chapter_index: int, chapter_title: str) -> str:
    """Generate image prompt for a chapter"""
    
    # Use predefined prompts if available
    if story_title in CHAPTER_PROMPTS:
        if chapter_index in CHAPTER_PROMPTS[story_title]:
            return CHAPTER_PROMPTS[story_title][chapter_index]
    
    # Fallback generic prompt
    return f"cinematic illustration of {chapter_title} from {story_title}, mythological indian epic art style, rich colors, dramatic lighting, traditional heritage painting, 3:4 portrait aspect ratio"

if __name__ == "__main__":
    print("\n" + "="*80)
    print("📸 CHAPTER COVER IMAGE SPECIFICATIONS")
    print("="*80 + "\n")
    
    chapters = get_chapter_info()
    
    print(f"Total Chapters: {len(chapters)}\n")
    
    # Group by story
    stories = {}
    for ch in chapters:
        story = ch['story_title']
        if story not in stories:
            stories[story] = []
        stories[story].append(ch)
    
    for story_title, story_chapters in stories.items():
        print(f"\n{'='*80}")
        print(f"📖 {story_title}")
        print(f"{'='*80}\n")
        
        for ch in story_chapters:
            prompt = generate_prompt(ch['story_title'], ch['chapter_index'], ch['chapter_title'])
            
            print(f"Chapter {ch['chapter_index']}: {ch['chapter_title']}")
            print(f"   ID: {ch['chapter_id']}")
            print(f"   Prompt: {prompt[:100]}...")
            print()
    
    print("\n" + "="*80)
    print("IMAGE SPECIFICATIONS:")
    print("="*80)
    print("• Aspect Ratio: 3:4 (Portrait)")
    print("• Recommended Size: 1080 x 1440 pixels")
    print("• Format: PNG/JPG")
    print("• Style: Cinematic Indian mythology art")
    print("• Colors: Rich, vibrant with golden/saffron tones")
    print("="*80 + "\n")
