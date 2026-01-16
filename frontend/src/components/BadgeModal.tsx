import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface BadgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    badge: {
        name: string;
        description: string;
        icon: string; // Emoji or SVG path
        type: 'gold' | 'purple' | 'fire';
    } | null;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ isOpen, onClose, badge }) => {
    if (!badge) return null;

    const colors = {
        gold: 'from-amber to-saffron',
        purple: 'from-saffron to-secondary',
        fire: 'from-orange-500 to-red-600'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[100] px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="bg-earth w-full max-w-sm rounded-[32px] p-8 text-center relative border border-white/10 shadow-[0_0_50px_rgba(236,109,19,0.3)]"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 rounded-[32px] overflow-hidden">
                            <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-pulse-slow" />
                        </div>

                        <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${colors[badge.type || 'gold']} flex items-center justify-center text-4xl shadow-glow mb-6`}>
                            {badge.icon}
                        </div>

                        <div className="text-saffron font-bold text-xs uppercase tracking-widest mb-2">नया पदक अनलॉक (New Badge Unlocked)</div>
                        <h2 className="text-2xl font-bold text-white mb-2">{badge.name}</h2>
                        <p className="text-white/60 text-sm mb-8 leading-relaxed">
                            {badge.description} <br />
                            <span className="text-amber font-semibold mt-2 block">+50 XP प्राप्त हुआ (gained)!</span>
                        </p>

                        <div className="flex gap-4">
                            <Button variant="ghost" className="flex-1" onClick={onClose}>Close</Button>
                            <Button variant="primary" className="flex-1 bg-saffron hover:bg-secondary border-none" onClick={onClose}>View Profile</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
