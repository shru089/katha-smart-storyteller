import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface SettingItem {
  icon: string;
  label: string;
  color: string;
  value?: string;
  disabled?: boolean;
}

const settingsGroups: SettingItem[][] = [
  [
    { icon: 'person', label: 'Account', color: 'bg-saffron/10 text-saffron' },
    { icon: 'language', label: 'Language', color: 'bg-amber/10 text-amber', value: 'English (US)' },
    { icon: 'tune', label: 'Preferences', color: 'bg-sand/10 text-amber' },
  ],
  [
    { icon: 'translate', label: 'Regional (Coming Soon)', color: 'bg-white/5 text-sand/40', disabled: true },
    { icon: 'help', label: 'Help & Support', color: 'bg-white/5 text-sand/60' },
  ],
];

const SettingsList: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <h3 className="text-slate-900 dark:text-white font-bold text-lg px-1">Settings</h3>
      {settingsGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5">
          {group.map((item, itemIndex) => (
            <React.Fragment key={item.label}>
              <button
                className={`flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={item.disabled}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                    <Icon name={item.icon} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
                    {item.value && <span className="text-[10px] text-primary/60 font-bold uppercase">{item.value}</span>}
                  </div>
                </div>
                {!item.disabled && <Icon name="chevron_right" className="text-slate-400 group-hover:text-primary transition-colors" />}
              </button>
              {itemIndex < group.length - 1 && <div className="h-px bg-slate-100 dark:bg-white/5 mx-4"></div>}
            </React.Fragment>
          ))}
        </div>
      ))}
    </motion.section>
  );
};

export default SettingsList;
