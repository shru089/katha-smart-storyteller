import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface StoryHeaderProps {
  chapterTitle: string;
  storyTitle: string;
  progress: number;
}

const StoryHeader: React.FC<StoryHeaderProps> = ({ chapterTitle, storyTitle, progress }) => {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 glass-header border-b border-white/5"
    >
      <div className="flex items-center p-4 pb-2 justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-primary transition-colors flex size-10 items-center justify-center rounded-full active:bg-white/10"
        >
          <Icon name="arrow_back_ios_new" className="text-[28px]" />
        </button>
        <div className="flex flex-col items-center flex-1">
          <span className="text-white/60 text-xs font-medium uppercase tracking-widest">{chapterTitle}</span>
          <h2 className="text-white text-base font-bold leading-tight tracking-tight">{storyTitle}</h2>
        </div>
        <button className="text-white hover:text-primary transition-colors flex size-10 items-center justify-center rounded-full active:bg-white/10">
          <Icon name="bookmark_border" className="text-[28px] fill-current" />
        </button>
      </div>
      <div className="px-0 pb-0">
        <div className="bg-white/10 h-1 w-full">
          <motion.div
            className="h-1 bg-primary shadow-[0_0_10px_rgba(236,109,19,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          ></motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default StoryHeader;
