import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SymbolismDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    title?: string;
}

export const SymbolismDrawer: React.FC<SymbolismDrawerProps> = ({
    isOpen,
    onClose,
    content,
    title = "Hidden Meaning"
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-[#2E1F14] rounded-t-[30px] p-6 z-[60] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                    >
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />

                        <div className="flex items-center gap-3 mb-4 text-saffron">
                            <Sparkles size={20} />
                            <h3 className="text-sm font-bold uppercase tracking-widest">{title}</h3>
                        </div>

                        <h2 className="text-2xl font-serif text-white mb-4 leading-relaxed">
                            {content || "The symbolism here is deep and profound, connecting ancient wisdom with modern understanding."}
                        </h2>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={onClose}
                                className="text-white/60 hover:text-white text-sm font-medium px-4 py-2"
                            >
                                Close Insight
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
