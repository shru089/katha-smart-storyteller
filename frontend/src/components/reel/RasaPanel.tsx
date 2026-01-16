import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

const rasas = [
  { name: 'Shringara', english: 'Love', icon: 'favorite', color: 'text-primary' },
  { name: 'Hasya', english: 'Laughter', icon: 'sentiment_very_satisfied', color: 'text-yellow-500' },
  { name: 'Karuna', english: 'Sorrow', icon: 'water_drop', color: 'text-blue-500' },
  { name: 'Raudra', english: 'Anger', icon: 'local_fire_department', color: 'text-red-500' },
  { name: 'Veera', english: 'Heroism', icon: 'swords', color: 'text-orange-500' },
  { name: 'Adbhuta', english: 'Wonder', icon: 'auto_awesome', color: 'text-purple-500' },
  { name: 'Shanta', english: 'Peace', icon: 'spa', color: 'text-green-500' },
];

interface RasaPanelProps {
  scene: any;
  onClose: () => void;
  onGenerateVoice: (rasa: string) => void;
}

const RasaPanel: React.FC<RasaPanelProps> = ({ scene, onClose, onGenerateVoice }) => {
  const [selectedRasa, setSelectedRasa] = useState(scene.emotion || 'Shringara');

  const currentRasa = rasas.find(r => r.name.toLowerCase() === selectedRasa.toLowerCase()) || rasas[0];

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-full bg-[#1A1414] border-t border-white/10 rounded-t-[32px] pb-10 shadow-2xl"
    >
      <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
        <div className="h-1.5 w-12 rounded-full bg-white/10"></div>
      </div>

      <div className="flex items-center justify-between px-6 mb-6">
        <button onClick={onClose} className="text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Close</button>
        <div className="flex items-center gap-2">
          <Icon name="psychology" className="text-primary text-xl" />
          <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em]">Scene Mood</h3>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="flex gap-4 overflow-x-auto px-6 pb-6 no-scrollbar snap-x">
        {rasas.map(rasa => {
          const isActive = currentRasa.name === rasa.name;
          return (
            <button
              key={rasa.name}
              onClick={() => {
                setSelectedRasa(rasa.name);
                onGenerateVoice(rasa.name); // Re-generate voice with new mood
              }}
              className={`snap-center shrink-0 flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 border ${isActive
                  ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(236,109,19,0.4)]'
                  : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
                }`}
            >
              <Icon name={rasa.icon} className={`${isActive ? 'text-white' : rasa.color} text-xl`} />
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold leading-tight">{rasa.name}</span>
                <span className={`text-[9px] font-medium uppercase tracking-wider ${isActive ? 'text-white/70' : 'text-white/20'}`}>
                  {rasa.english}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start">
          <div className={`p-2 rounded-lg bg-white/5 ${currentRasa.color}`}>
            <Icon name="info" className="text-xl" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium leading-relaxed">
              <span className="text-primary font-bold">{currentRasa.name}</span> currently colors this scene. This mood influences the AI's narration tone and background musical orchestration.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RasaPanel;
