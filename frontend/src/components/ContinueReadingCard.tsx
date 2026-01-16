/**
 * Continue Reading Feature
 * Tracks and displays user's reading progress
 */

import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAssetUrl } from "../api/client";

interface ContinueReadingProps {
    storyTitle: string;
    storyId: number;
    chapterTitle: string;
    chapterId: number;
    chapterIndex: number;
    coverImageUrl?: string;
    progress?: number; // 0-100
    lastRead?: string; // timestamp
}

export default function ContinueReadingCard({
    storyTitle,
    storyId,
    chapterTitle,
    chapterId,
    chapterIndex,
    coverImageUrl,
    progress = 0,
    lastRead
}: ContinueReadingProps) {
    const navigate = useNavigate();

    const formatLastRead = (timestamp?: string) => {
        if (!timestamp) return "Recently";
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/chapter/${chapterId}`)}
            className="relative group cursor-pointer bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl overflow-hidden border border-yellow-900/30 hover:border-yellow-600/50 transition-all duration-300"
        >
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
                <img
                    src={getAssetUrl(coverImageUrl) || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"}
                    alt={chapterTitle}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative p-6 flex items-center gap-6">
                {/* Chapter Cover Thumbnail */}
                <div className="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden shadow-xl">
                    <img
                        src={getAssetUrl(coverImageUrl) || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"}
                        alt={chapterTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-yellow-500 text-sm mb-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatLastRead(lastRead)}</span>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-1 truncate">
                        {storyTitle}
                    </h3>

                    <p className="text-gray-300 text-sm mb-3 truncate">
                        Chapter {chapterIndex}: {chapterTitle}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
                        <div
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{progress}% complete</span>
                        <button className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition-colors font-medium">
                            <BookOpen className="w-3 h-3" />
                            Continue Reading
                        </button>
                    </div>
                </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 border-2 border-yellow-500/0 group-hover:border-yellow-500/30 rounded-2xl transition-all duration-300 pointer-events-none" />
        </motion.div>
    );
}
