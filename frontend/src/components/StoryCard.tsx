import React from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Story } from '../api/client';

interface StoryCardProps {
    story: Story;
    variant?: 'portrait' | 'landscape';
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, variant = 'portrait' }) => {
    const navigate = useNavigate();

    // Fallback image if none provided
    const bgImage = story.cover_image_url || 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=600&auto=format&fit=crop';

    if (variant === 'landscape') {
        return (
            <div
                onClick={() => navigate(`/story/${story.id}`)}
                className="relative w-full h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-soft"
            >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-5 w-full">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-xs font-bold text-saffron uppercase tracking-wider mb-1 block">Trending</span>
                            <h3 className="text-xl font-bold text-white leading-tight">{story.title}</h3>
                            <p className="text-gray-300 text-xs mt-1 line-clamp-1">{story.description}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                            <Play size={20} className="text-white fill-current" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => navigate(`/story/${story.id}`)}
            className="relative h-64 rounded-xl overflow-hidden cursor-pointer group shadow-soft"
        >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-earth/90 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-lg font-bold text-white leading-snug mb-1">{story.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span>Mythology</span>
                    <span>•</span>
                    <span>12 mins</span>
                </div>
            </div>

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-saffron p-1.5 rounded-full shadow-lg">
                    <Play size={12} className="text-white fill-current" />
                </div>
            </div>
        </div>
    );
};
