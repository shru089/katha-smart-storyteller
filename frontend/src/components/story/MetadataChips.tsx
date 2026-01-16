import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

const MetadataChips: React.FC = () => {
  const chips = [
    { icon: 'schedule', text: '5 min read' },
    { text: 'Fantasy' },
    { text: 'Indian Mythology' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap gap-2"
    >
      {chips.map((chip, index) => (
        <div key={index} className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary-brown/50 border border-white/5 backdrop-blur-sm">
          {chip.icon && <Icon name={chip.icon} className="text-primary text-[16px] mr-1.5" />}
          <span className="text-text-cream/90 text-xs font-medium">{chip.text}</span>
        </div>
      ))}
    </motion.div>
  );
};

export default MetadataChips;
