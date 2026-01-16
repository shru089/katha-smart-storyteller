import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

const JourneyHeader: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/5 relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="flex flex-col items-center text-center mb-6 relative z-10">
        <span className="px-3 py-1 bg-primary/20 text-yellow-700 dark:text-yellow-200 text-xs font-bold uppercase tracking-wider rounded-full mb-2">Level 5</span>
        <h2 className="text-3xl font-bold text-text-main dark:text-white tracking-tight">Master Storyteller</h2>
        <p className="text-text-secondary dark:text-gray-400 text-sm mt-1">Keep sharing to reach Sage status</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background-light dark:bg-background-dark/50 border border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon name="auto_awesome" className="text-yellow-600 dark:text-yellow-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }} />
            <span className="text-2xl font-bold text-text-main dark:text-white">2,450</span>
          </div>
          <span className="text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wide">Total XP</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background-light dark:bg-background-dark/50 border border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon name="local_fire_department" className="text-orange-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }} />
            <span className="text-2xl font-bold text-text-main dark:text-white">12</span>
          </div>
          <span className="text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wide">Day Streak</span>
        </div>
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-text-main dark:text-gray-200">Level 6 Progress</span>
          <span className="text-xs font-medium text-text-secondary dark:text-gray-400">550 XP to go</span>
        </div>
        <div className="h-3 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '78%' }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          ></motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default JourneyHeader;
