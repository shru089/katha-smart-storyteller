# Implementation Plan - Katha App Refinement

This plan addresses theme color updates, media asset failures, and text presentation improvements.

## 1. Theme Refinement (Golden Orange)
- [ ] **Update Tailwind Configuration**: Ensure `saffron` and `amber` colors are defined and used.
- [ ] **Component Styles**:
    - [ ] Update `ChapterReader.tsx` buttons (currently purple/blue) to use Golden Orange gradients.
    - [ ] Update `Home.tsx` and `Button.tsx` to align with the new theme.
    - [ ] Replace any remaining blue/purple accents with Saffron/Amber tones.

## 2. Media Asset Fixes (Images, Audio, Video)
- [ ] **Backend Asset Generation**:
    - [ ] Currently, the `seed-data` endpoint only populates text and external cover images.
    - [ ] I will update the `ChapterReader` or `StoryDetails` to trigger asset generation if `ai_image_url` or `ai_audio_url` is missing.
    - [ ] Verify that `video_service.py` is correctly creating reels and that the `reel_audio_url` is being generated from the `reel_script`.
- [ ] **Static File Serving**:
    - [ ] Ensure the backend correctly serves files from `static/audio`, `static/images`, and `static/videos`.
    - [ ] Fix broken image paths in `ChapterReader`.

## 3. Text Presentation Improvements
- [ ] **Typography**:
    - [ ] Increase font size for `raw_text` in `ChapterReader.tsx` to match the "classic book" feel.
    - [ ] Use a premium Serif font (already using `font-serif`, but double-check rendering).
    - [ ] Implement better "First Letter" styling (Drop Cap) for scene starts.
- [ ] **Content**:
    - [ ] Verify that the long-form text from `stories.json` is correctly displayed in the `Scene` blocks.

## 4. Verification
- [ ] Re-seed the database with the updated `stories.json`.
- [ ] Manually trigger generation for a chapter and confirm images/audio/video play.
- [ ] Review UI on both mobile and desktop views to ensure the Golden Orange theme looks premium.
