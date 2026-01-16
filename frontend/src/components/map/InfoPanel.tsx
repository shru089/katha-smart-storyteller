import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface InfoPanelProps {
  title: string;
  epoch: string;
  region: string;
  era: string;
  description: string;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ title, epoch, region, era, description, onClose }) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="absolute bottom-0 left-0 w-full z-20 flex flex-col justify-end pointer-events-none"
    >
      <div className="pointer-events-auto bg-surface-dark w-full rounded-t-2xl shadow-card-up flex flex-col pb-8 pt-2 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="flex w-full items-center justify-center pt-2 pb-4" onClick={onClose}>
          <div className="h-1.5 w-12 rounded-full bg-white/20"></div>
        </div>
        <div className="px-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-[28px] font-bold leading-tight text-white">{title}</h2>
              <button className="text-text-muted hover:text-white transition-colors">
                <Icon name="share" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-background-dark bg-primary/90 px-2.5 py-1 rounded-md">
                <Icon name="history_edu" className="text-[14px]" />
                {epoch}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-text-muted bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                <Icon name="public" className="text-[14px]" />
                {region}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-text-muted bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                <Icon name="schedule" className="text-[14px]" />
                {era}
              </span>
            </div>
          </div>
          <div className="h-px w-full bg-white/10"></div>
          <p className="font-sans text-sm leading-relaxed text-[#e0dac5]">{description}</p>
          <div className="pt-2 flex gap-3">
            <button className="flex-1 bg-primary text-background-dark h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(242,185,13,0.3)] hover:brightness-110 active:scale-[0.98] transition-all">
              <Icon name="menu_book" />
              Read Story
            </button>
            <button className="bg-white/10 text-white size-12 rounded-xl flex items-center justify-center hover:bg-white/20 active:scale-[0.98] transition-all border border-white/10">
              <Icon name="bookmark_border" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoPanel;
