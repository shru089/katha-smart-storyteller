import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface XPToastProps {
    xp: number;
    isVisible: boolean;
    onComplete?: () => void;
}

export const XPToast: React.FC<XPToastProps> = ({ xp, isVisible, onComplete }) => {
    useEffect(() => {
        if (isVisible && onComplete) {
            const timer = setTimeout(onComplete, 2000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="fixed bottom-24 right-6 z-50 flex items-center gap-2 pointer-events-none"
                >
                    <span className="text-4xl">✨</span>
                    <div className="bg-saffron/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-glow border border-white/20">
                        <span className="font-bold text-lg">+{xp} XP</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
