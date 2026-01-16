import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface ProfileHeaderProps {
  user: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4 py-2"
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-amber-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative h-28 w-28 rounded-full p-[3px] bg-gradient-to-tr from-primary to-amber-300">
          <div className="h-full w-full rounded-full bg-slate-100 dark:bg-surface-dark p-0.5 overflow-hidden">
            <img
              alt="Profile Picture"
              className="h-full w-full rounded-full object-cover"
              src={user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user?.name || "Katha")}
            />
          </div>
        </div>
        <button className="absolute bottom-1 right-1 bg-slate-900 dark:bg-white text-white dark:text-surface-dark rounded-full p-1.5 shadow-lg border-2 border-white dark:border-background-dark flex items-center justify-center">
          <Icon name="edit" className="text-[16px]" />
        </button>
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold leading-tight text-white">{user?.name || "Member"}</h2>
        <p className="text-primary font-medium text-sm">@{user?.username || user?.email?.split('@')[0] || "user"}</p>
        <p className="text-slate-500 dark:text-white/60 text-sm mt-1 max-w-[250px] mx-auto leading-relaxed">
          {user?.email}
        </p>
        <p className="text-slate-500 dark:text-white/40 text-xs mt-2 italic px-4">
          {user?.bio || "A seeker of ancient wisdom, exploring the depths of Indian mythology. ✨"}
        </p>
      </div>
    </motion.section>
  );
};

export default ProfileHeader;
