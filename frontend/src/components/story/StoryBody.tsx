import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from '../../api/client';

interface StoryBodyProps {
  story: any;
}

const StoryBody: React.FC<StoryBodyProps> = ({ story }) => {
  const navigate = useNavigate();

  if (!story || !story.chapters || story.chapters.length === 0) {
    return (
      <div className="py-12 text-center text-white/20 italic">
        The pages of this story are yet to be written...
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-12"
    >
      {story.chapters.map((chapter: any, cIdx: number) => (
        <div key={chapter.id} className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
            <h3 className="text-sand/40 text-[10px] font-bold uppercase tracking-[0.3em] whitespace-nowrap">
              Chapter {cIdx + 1}: {chapter.title}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
          </div>

          {chapter.scenes?.map((scene: any) => (
            <div key={scene.id} className="space-y-6">
              <p className="text-sand/90 text-lg md:text-xl font-normal leading-relaxed tracking-wide">
                {scene.raw_text}
              </p>

              {scene.ai_image_url ? (
                <figure className="my-8 rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                  <img
                    alt={scene.ai_caption || "Scene illustration"}
                    className="w-full h-auto max-h-[400px] object-cover"
                    src={getAssetUrl(scene.ai_image_url)}
                  />
                  {scene.ai_caption && (
                    <figcaption className="bg-white/5 p-4 text-center border-t border-white/5">
                      <p className="text-xs text-sand/50 font-medium italic">{scene.ai_caption}</p>
                    </figcaption>
                  )}
                </figure>
              ) : (
                <div className="my-8">
                  <button
                    onClick={() => navigate(`/chapter/${chapter.id}`)}
                    className="w-full group relative overflow-hidden rounded-2xl bg-white/5 p-[1px] shadow-md transition-transform active:scale-[0.99]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-saffron/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center justify-between px-6 py-5 bg-earth rounded-[21px] border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-saffron/10 text-saffron border border-saffron/20">
                          <Icon name="movie_filter" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white">Visualize this moment</p>
                          <p className="text-xs text-sand/40">Enter the scene to generate AI visuals & audio</p>
                        </div>
                      </div>
                      <Icon name="chevron_right" className="text-sand/20 group-hover:text-saffron transition-colors" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      <div className="h-24"></div>
    </motion.article>
  );
};

export default StoryBody;
