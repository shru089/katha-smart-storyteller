import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import JourneyHeader from '../components/achievements/JourneyHeader';
import BadgeGrid from '../components/achievements/BadgeGrid';
import Icon from '../components/ui/Icon';

const Achievements: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col pb-24 mx-auto max-w-md w-full overflow-x-hidden shadow-2xl shadow-black/5 bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all text-text-main dark:text-white">
          <Icon name="arrow_back_ios_new" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-center flex-1 pr-10 text-text-main dark:text-white">My Journey</h1>
      </header>
      <main className="flex-1 flex flex-col gap-6 p-4">
        <JourneyHeader />
        <BadgeGrid />
      </main>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 1 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-text-main dark:bg-white text-white dark:text-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
          <Icon name="check_circle" className="text-primary dark:text-yellow-600 text-sm" />
          <span className="text-sm font-bold">Streak updated!</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;

