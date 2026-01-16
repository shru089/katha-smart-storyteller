import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getAssetUrl } from '../../api/client';

interface StoryHeroProps {
  imageUrl: string;
  title: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const StoryHero: React.FC<StoryHeroProps> = ({ imageUrl, title, isFavorite, onToggleFavorite }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden group shadow-lg"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${getAssetUrl(imageUrl)})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/40 to-transparent"></div>

      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-4 right-4 p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all z-10"
        >
          <Heart
            size={24}
            className={isFavorite ? "fill-red-500 text-red-500" : "text-white"}
          />
        </button>
      )}

      <div className="absolute bottom-0 left-0 p-5 w-full">
        <h1 className="text-sand text-3xl font-extrabold leading-tight drop-shadow-md mb-2">{title}</h1>
      </div>
    </motion.div>
  );
};

export default StoryHero;
