import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StoryHeader from '../components/story/StoryHeader';
import StoryHero from '../components/story/StoryHero';
import StoryBody from '../components/story/StoryBody';

import { getStoryDetail, Story, getAssetUrl, getUserFavorites, toggleFavorite, getStoredUser } from '../api/client';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eye, Volume2 } from 'lucide-react';
import VideoModal from '../components/common/VideoModal';
import toast from 'react-hot-toast';

const StoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | any>(null);
  const [loading, setLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | undefined>(undefined);
  const [isFavorite, setIsFavorite] = useState(false);

  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);

  // TODO: Implement new audio podcast playback
  const handleListen = async (sceneId: number, text: string, existingAudioUrl?: string) => {
    if (existingAudioUrl) {
      const audio = new Audio(getAssetUrl(existingAudioUrl));
      audio.play();
      return;
    }
    // OLD GENERATION CODE REMOVED - will use new audio API
    console.log("Audio generation disabled - new system coming soon");
  };

  // TODO: Implement new video visualization (optional future feature)
  const handleVisualise = async (sceneId: number, prompt: string, existingVideoUrl?: string) => {
    if (existingVideoUrl) {
      setActiveVideoUrl(getAssetUrl(existingVideoUrl));
      setIsVideoModalOpen(true);
      return;
    }
    // OLD GENERATION CODE REMOVED
    console.log("Video generation disabled - new system coming soon");
  };

  useEffect(() => {
    if (id) {
      getStoryDetail(parseInt(id))
        .then(async (data) => {
          setStory(data);
          // Check favorites
          const user = getStoredUser();
          if (user) {
            try {
              const favorites = await getUserFavorites(user.id);
              setIsFavorite(favorites.some((s: any) => s.id === parseInt(id)));
            } catch (e) {
              console.error("Failed to fetch favorites", e);
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    const user = getStoredUser();
    if (!user || !story) return;

    try {
      const res = await toggleFavorite(user.id, story.id);
      setIsFavorite(res.status === 'favorited');
      toast.success(res.message);
    } catch (e) {
      toast.error("Failed to update favorites");
    }
  };

  if (loading) return <div className="min-h-screen bg-earth flex items-center justify-center text-sand">Loading...</div>;
  if (!story) return <div className="min-h-screen bg-earth flex items-center justify-center text-sand">Story not found</div>;

  return (
    <div className="w-full bg-earth min-h-screen flex flex-col relative pb-32">
      <StoryHeader
        chapterTitle={story.category || "Mythology"}
        storyTitle={story.title}
        progress={0} // To be updated with actual progress
      />
      <main className="flex-1 flex flex-col gap-6 p-5 max-w-2xl mx-auto w-full">
        <StoryHero
          imageUrl={story.cover_image_url || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"}
          title={story.title}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
        />

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-[#9d7aff]/10 text-[#9d7aff] text-xs font-bold rounded-full border border-[#9d7aff]/20 uppercase tracking-widest">
            {story.category || "Folklore"}
          </span>
          <span className="px-3 py-1 bg-white/5 text-white/40 text-xs font-bold rounded-full border border-white/5 uppercase tracking-widest">
            {story.total_chapters} Chapters
          </span>
        </div>

        <div className="text-white/80 leading-relaxed text-sm">
          {story.description || "No description available for this story."}
        </div>

        {/* Ramayana Custom Intro */}
        {(story.title.includes("Ramayana") || story.title.includes("रामायण")) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 rounded-3xl bg-saffron/5 border border-saffron/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl font-serif text-saffron">ॐ</span>
            </div>
            <h4 className="text-saffron font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-saffron/30"></span>
              ऐतिह्य (The Tradition)
            </h4>
            <div className="space-y-4 text-sand/80 text-sm font-serif leading-relaxed italic">
              <p>
                The Ramayana is not a myth in the usual sense. It belongs to a tradition called <strong>itihasa</strong>—stories remembered as lived history, shaped through generations of listening, retelling, and reflection. While details differ across regions and versions, the heart of the story endures.
              </p>
              <p>
                At its center is Rama—a prince of the solar dynasty—whose journey through love, exile, duty, loss, and leadership forms the soul of the Ramayana. The word Ramayana means Rama’s path or Rama’s journey—not just across lands, but through moral choices and human dilemmas.
              </p>
              <p>
                Over centuries, the Ramayana has been told in many voices and cultures. Katha draws from the Valmiki Ramayana, the oldest Sanskrit telling, while honoring the rich diversity of interpretations that surround it.
              </p>
              <p>
                This is not just a story of gods and kings. It is a story about <strong>dharma</strong>—doing what feels right when the answer is unclear, and living with the consequences of our choices.
              </p>
              <p>
                Katha invites you to listen, reflect, and reconnect with these stories—not as distant legends, but as living narratives that still speak to our lives today.
              </p>
            </div>
          </motion.div>
        )}

        <h3 className="text-white font-bold text-lg mt-4 mb-2">Chapters</h3>
        <div className="space-y-3">
          {story.chapters?.map((chapter: any, idx: number) => (
            <motion.div
              key={chapter.id}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-2xl flex items-center justify-between border bg-white/5 border-white/5 text-white/60`}
              onClick={() => {
                navigate(`/chapter/${chapter.id}`);
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-white/10`}>
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-white">{chapter.title}</h4>
                  <span className="text-xs opacity-60">
                    {chapter.scenes?.length || 0} Scenes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors disabled:opacity-50"
                    disabled={generatingAudio}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chapter.scenes?.[0]) {
                        handleListen(chapter.scenes[0].id, chapter.scenes[0].raw_text, chapter.scenes[0].ai_audio_url);
                      }
                    }}
                  >
                    <Volume2 size={16} className={generatingAudio ? "animate-pulse text-[#EC6D13]" : ""} />
                  </button>
                  <button
                    className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors disabled:opacity-50"
                    disabled={generatingVideo}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chapter.scenes?.[0]) {
                        handleVisualise(chapter.scenes[0].id, chapter.scenes[0].ai_image_prompt, chapter.scenes[0].ai_video_url);
                      }
                    }}
                  >
                    <Eye size={16} className={generatingVideo ? "animate-pulse text-[#EC6D13]" : ""} />
                  </button>
                  <ChevronRight size={18} className="text-white/20" />
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        <StoryBody story={story} />
      </main>



      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={activeVideoUrl}
        loading={generatingVideo && !activeVideoUrl}
      />

      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0F0A1F] to-transparent pointer-events-none z-30"></div>
    </div>
  );
};

export default StoryDetails;


