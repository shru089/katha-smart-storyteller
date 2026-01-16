import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface StatsGridProps {
  user: any;
}

const StatsGrid: React.FC<StatsGridProps> = ({ user }) => {
  const stats = [
    { icon: 'auto_stories', value: user?.stories_completed || 24, label: 'Stories', color: 'text-saffron' },
    { icon: 'bolt', value: user?.xp || '1,250', label: 'Total XP', color: 'text-amber' },
    { icon: 'local_fire_department', value: user?.current_streak || 12, label: 'Streak', color: 'text-saffron' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-3 gap-3"
    >
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 dark:bg-surface-dark shadow-sm border border-white/5 gap-1.5 relative overflow-hidden">
          {stat.label === 'Total XP' && <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 rounded-full blur-xl"></div>}
          <Icon name={stat.icon} className={`${stat.color} text-2xl`} style={{ fontVariationSettings: stat.label === 'Total XP' ? "'FILL' 1" : "'FILL' 0" }} />
          <span className="text-xl font-bold text-white">{stat.value}</span>
          <span className="text-xs text-slate-500 dark:text-white/50 uppercase tracking-wide font-medium">{stat.label}</span>
        </div>
      ))}
    </motion.section>
  );
};

export default StatsGrid;
