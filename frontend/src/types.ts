export type User = {
    id: number;
    name: string;
    email?: string;
    total_xp: number;
    current_streak_days: number;
    longest_streak_days: number;
};

export type Story = {
    id: number;
    title: string;
    slug: string;
    description?: string;
    category?: string;
    cover_image_url?: string;
    total_chapters: number;
    total_scenes: number;
};

export type Scene = {
    id: number;
    chapter_id: number;
    index: number;
    raw_text: string;
    caption?: string;
    symbolism?: string;
    emotion?: string;
    music_tag?: string;
    image_prompt?: string;
    image_url?: string;
};

export type Badge = {
    code: string;
    name: string;
    description?: string;
    icon_url?: string;
    earned_at?: string;
};
