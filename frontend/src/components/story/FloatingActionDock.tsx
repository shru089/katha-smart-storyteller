import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface FloatingActionDockProps {
  onListen?: () => void;
  onVisualize?: () => void;
}

const FloatingActionDock: React.FC<FloatingActionDockProps> = ({ onListen, onVisualize }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
      className="fixed bottom-6 left-0 right-0 z-40 px-6 flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center p-1.5 gap-2 bg-[#1A1414]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl max-w-sm w-full">
        <button
          onClick={onListen}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all active:scale-95 shadow-glow shimmer-btn"
        >
          <Icon name="headphones" className="text-[20px]" />
          <span className="text-sm">Listen</span>
        </button>
        <div className="w-px h-6 bg-white/10"></div>
        <button
          onClick={onVisualize}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all active:scale-95"
        >
          <Icon name="smart_display" className="text-[20px] text-primary" />
          <span className="text-sm">Visualize</span>
        </button>
        <button className="size-12 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/40 transition-colors">
          <Icon name="ios_share" />
        </button>
      </div>
    </motion.div>
  );
};

export default FloatingActionDock;
