/**
 * Reels Page
 * Vertical video feed of AI generated scenes
 */

import { useEffect, useState } from "react";
import { getReels, getAssetUrl, type Scene } from "../api/client";
import { BottomNavbar } from "../components/BottomNavbar";
import { motion } from "framer-motion";
import { Play, Heart, Share2, Info } from "lucide-react";
import VideoModal from "../components/common/VideoModal";

export default function ReelsPage() {
    const [reels, setReels] = useState<Scene[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | undefined>(undefined);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    useEffect(() => {
        getReels()
            .then(setReels)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const openVideo = (url?: string) => {
        if (!url) return;
        setActiveVideoUrl(getAssetUrl(url));
        setIsVideoModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-earth pb-24 font-sans text-sand">
            {/* Header */}
            <div className="px-6 py-6 sticky top-0 bg-earth/95 backdrop-blur-xl z-40 border-b border-white/5">
                <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
                    <span className="text-[#EC6D13]">AI</span> Reels
                </h1>
            </div>

            {/* Grid */}
            <div className="px-4 mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {reels.map((scene, index) => (
                    <motion.div
                        key={scene.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="aspect-[9/16] relative rounded-2xl overflow-hidden cursor-pointer group bg-black/40"
                        onClick={() => openVideo(scene.ai_video_url)}
                    >
                        {/* Video/Thumbnail */}
                        <img
                            src={getAssetUrl(scene.ai_video_url)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt="Reel"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Play fill="white" className="text-white" size={24} />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight mb-1">
                                {scene.raw_text}
                            </h3>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-white/50 uppercase tracking-widest font-black">
                                    {scene.emotion || "Cinematic"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!loading && reels.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Play className="text-white/20" size={32} />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2">No Reels Yet</h2>
                    <p className="text-white/40 text-sm">
                        Generate some videos in the chapter reader to see them here!
                    </p>
                </div>
            )}

            <VideoModal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                videoUrl={activeVideoUrl}
                loading={false}
            />

            <BottomNavbar />
        </div>
    );
}
