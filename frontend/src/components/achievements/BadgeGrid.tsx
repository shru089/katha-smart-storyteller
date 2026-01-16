import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

const badges = [
  { name: 'Early Bird', icon: 'wb_sunny', status: 'Unlocked', color: 'from-[#FFF8E1] to-[#FFE0B2] dark:from-[#3e2723] dark:to-[#4e342e] text-orange-400 dark:text-orange-300' },
  { name: 'Bookworm', icon: 'menu_book', status: 'Unlocked', color: 'from-[#E8F5E9] to-[#C8E6C9] dark:from-[#1b5e20] dark:to-[#2e7d32] text-green-600 dark:text-green-300' },
  { name: 'Connector', icon: 'share', status: 'Unlocked', color: 'from-[#E1F5FE] to-[#B3E5FC] dark:from-[#01579b] dark:to-[#0277bd] text-sky-600 dark:text-sky-300' },
  { name: 'Flame Keeper', icon: 'local_fire_department', status: 'Legendary', color: 'from-[#FFF3E0] to-[#FFCC80] dark:from-[#e65100] dark:to-[#ff6f00] text-orange-600 dark:text-orange-100', legendary: true },
  { name: 'Night Owl', icon: 'bedtime', status: 'Locked' },
  { name: 'The Scribe', icon: 'edit_note', status: 'Locked' },
  { name: 'Explorer', icon: 'explore', status: 'Locked' },
  { name: 'Socialite', icon: 'groups', status: 'Locked' },
  { name: 'Heritage Hero', icon: 'temple_hindu', status: 'Locked' },
];

const Badge: React.FC<typeof badges[0]> = ({ name, icon, status, color, legendary }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="group flex flex-col items-center gap-3"
  >
    <div className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-sm border-2 transition-all duration-300 ${status === 'Locked' ? 'bg-stone-200 dark:bg-stone-800 shadow-inner' : `bg-gradient-to-br ${color} group-hover:border-primary`}`}>
      <Icon name={icon} className={`text-4xl ${status === 'Locked' ? 'text-stone-400 dark:text-stone-600' : ''}`} style={{ fontVariationSettings: status !== 'Locked' ? "'FILL' 1" : "'FILL' 0" }} />
      {legendary && <div className="absolute -inset-1 bg-primary/30 rounded-full blur-md -z-10"></div>}
      {status === 'Locked' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 rounded-full">
          <Icon name="lock" className="text-2xl text-stone-500 dark:text-stone-400" />
        </div>
      )}
    </div>
    <div className="text-center">
      <p className={`text-sm font-bold leading-tight ${status === 'Locked' ? 'text-text-secondary dark:text-stone-500' : 'text-text-main dark:text-gray-100'}`}>{name}</p>
      <p className={`text-[10px] mt-0.5 ${status === 'Legendary' ? 'font-bold text-orange-600 dark:text-primary' : 'text-text-secondary dark:text-gray-500'}`}>{status}</p>
    </div>
  </motion.div>
);

const BadgeGrid: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All Badges');
  const filters = ['All Badges', 'Reading (8)', 'Sharing (4)', 'Culture (12)'];

  return (
    <section>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 mb-6">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 h-9 px-5 rounded-full font-medium text-sm transition-transform active:scale-95 whitespace-nowrap ${activeFilter === filter ? 'bg-text-main text-white dark:bg-primary dark:text-black shadow-md' : 'bg-white dark:bg-card-dark border border-stone-200 dark:border-stone-700 text-text-main dark:text-gray-200'}`}>
            {filter}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 pb-4">
        {badges.map((badge, index) => <Badge key={index} {...badge} />)}
      </div>
    </section>
  );
};

export default BadgeGrid;
