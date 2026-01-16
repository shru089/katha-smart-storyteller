import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader } from 'lucide-react';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl?: string;
    loading?: boolean;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, loading }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isOpen && videoUrl && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.log("Autoplay failed", e));
        }
    }, [isOpen, videoUrl]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                onClick={onClose}
            >
                <button className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-50 bg-black/20 p-2 rounded-full" onClick={onClose}>
                    <X size={32} />
                </button>

                <div className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/50">
                            <Loader className="animate-spin" size={32} />
                            <p className="text-sm font-medium animate-pulse">Summoning Visuals...</p>
                        </div>
                    ) : (
                        videoUrl ? (
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                className="w-full h-full object-cover"
                                controls
                                playsInline
                                loop
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/40 text-center p-6">
                                <p>No video available for this scene. Press "Generate" in the reader.</p>
                            </div>
                        )
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VideoModal;
