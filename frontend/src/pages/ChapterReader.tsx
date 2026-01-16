/**
 * Chapter Reader Component
 * Premium "Novel + Webtoon" hybridization experience
 * Vertical scrolling with integrated AI visualization and narration
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
    getChapterScenes,
    getChapterDetail,
    completeScene,
    getStoredUser,
    Chapter,
    Scene,
    generateSceneContent,
    generateChapterReel,
    getAssetUrl,
    getUserFavorites,
    toggleFavorite
} from '../api/client';
import {
    ChevronLeft,
    Play,
    Volume2,
    Sparkles,
    Share2,
    Heart,
    Info,
    ArrowDown,
    Headphones,
    MonitorPlay,
    Pause,
    SkipBack,
    SkipForward
} from 'lucide-react';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';
import VideoModal from '../components/common/VideoModal';
import { saveReadingProgress } from '../utils/readingProgress';

const ChapterReader: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSceneIndex, setActiveSceneIndex] = useState(0);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | undefined>(undefined);
    const [isGeneratingReel, setIsGeneratingReel] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Audio Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const loadContent = useCallback(async () => {
        if (!id) return;
        try {
            const [chapterData, scenesData] = await Promise.all([
                getChapterDetail(parseInt(id)),
                getChapterScenes(parseInt(id))
            ]);
            setChapter(chapterData);
            setScenes(scenesData);

            // Check favorite status
            const user = getStoredUser();
            if (user && chapterData.story_id) {
                try {
                    const favorites = await getUserFavorites(user.id);
                    setIsFavorite(favorites.some(s => s.id === chapterData.story_id));
                } catch (e) {
                    console.error("Failed to check favorites", e);
                }
            }
        } catch (error) {
            console.error("Failed to load chapter:", error);
            toast.error("Failed to unroll the scrolls.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadContent();
    }, [loadContent]);

    const handleToggleFavorite = async () => {
        const user = getStoredUser();
        if (!user || !chapter) return;

        try {
            const res = await toggleFavorite(user.id, chapter.story_id);
            setIsFavorite(res.status === 'favorited');
            toast.success(res.message);
        } catch (e) {
            toast.error("Failed to update favorites");
        }
    };

    // Track active scene on scroll and save progress
    useEffect(() => {
        const handleScroll = () => {
            const viewportHeight = window.innerHeight;
            const sceneElements = document.querySelectorAll('.scene-block');

            sceneElements.forEach((el, index) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < viewportHeight / 2 && rect.bottom > viewportHeight / 2) {
                    if (activeSceneIndex !== index) {
                        setActiveSceneIndex(index);
                        handleSceneComplete(scenes[index].id);

                        // Save reading progress
                        if (chapter) {
                            const progress = Math.round(((index + 1) / scenes.length) * 100);
                            saveReadingProgress({
                                storyId: chapter.story_id,
                                storyTitle: chapter.title.split(':')[0], // Extract story name
                                chapterId: chapter.id,
                                chapterTitle: chapter.title,
                                chapterIndex: chapter.index,
                                coverImageUrl: chapter.cover_image_url,
                                progress,
                                lastRead: new Date().toISOString(),
                                sceneIndex: index
                            });
                        }
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSceneIndex, scenes, chapter]);

    const handleSceneComplete = async (sceneId: number) => {
        const user = getStoredUser();
        if (!user) return;
        try {
            await completeScene(sceneId, user.id);
        } catch (e) {
            // Silently fail if already completed
        }
    };
    const handleVisualiseScene = async (scene: Scene) => {
        if (!scene.ai_video_url) {
            setIsVideoModalOpen(true);
            setIsVideoLoading(true);
            toast.promise(
                (async () => {
                    const updatedScene = await generateSceneContent(scene.id);
                    setScenes(prev => prev.map(s => s.id === scene.id ? updatedScene : s));
                    if (updatedScene.ai_video_url) {
                        setActiveVideoUrl(getAssetUrl(updatedScene.ai_video_url));
                    } else {
                        throw new Error("Generation failed");
                    }
                })(),
                {
                    loading: 'Our digital weavers are crafting the scene...',
                    success: 'Behold the visualization!',
                    error: 'The weavers need more time. Try again.'
                }
            ).finally(() => setIsVideoLoading(false));
            return;
        }
        setActiveVideoUrl(getAssetUrl(scene.ai_video_url));
        setIsVideoModalOpen(true);
    };

    const handleMasterReel = async () => {
        if (!id) return;
        setIsGeneratingReel(true);
        setIsVideoModalOpen(true);
        setIsVideoLoading(true);
        toast.promise(
            (async () => {
                const res = await generateChapterReel(parseInt(id));
                setActiveVideoUrl(getAssetUrl(res.video_url));
            })(),
            {
                loading: 'Forging the Master Chapter Reel...',
                success: 'The Master Reel is ready!',
                error: 'Encountered a flaw in the forge. Try again.'
            }
        ).finally(() => {
            setIsGeneratingReel(false);
            setIsVideoLoading(false);
        });
    };

    const toggleAudio = async (scene: Scene) => {
        // Check if audio exists
        if (!scene.ai_audio_url) {
            toast.error('Audio podcast not available for this scene.');
            return;
        }

        // Play the audio directly
        playAudio(scene.ai_audio_url);
    };

    const playAudio = (url: string) => {
        if (isPlaying && audioRef.current && audioRef.current.src.includes(url)) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(getAssetUrl(url));

            audioRef.current.onloadedmetadata = () => {
                if (audioRef.current) {
                    setAudioDuration(audioRef.current.duration);
                }
            };

            audioRef.current.onended = () => {
                setIsPlaying(false);
                setAudioProgress(0);
                setCurrentTime(0);
            };

            audioRef.current.ontimeupdate = () => {
                if (audioRef.current) {
                    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                    setAudioProgress(progress);
                    setCurrentTime(audioRef.current.currentTime);
                }
            };

            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // Skip forward 10 seconds
    const skipForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(
                audioRef.current.currentTime + 10,
                audioRef.current.duration
            );
        }
    };

    // Skip backward 10 seconds
    const skipBackward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(
                audioRef.current.currentTime - 10,
                0
            );
        }
    };

    // Seek to specific position
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = percent * audioRef.current.duration;
    };

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            if ((e.target as HTMLElement).matches('input, textarea')) return;

            if (e.code === 'Space') {
                e.preventDefault();
                if (scenes[activeSceneIndex]) {
                    toggleAudio(scenes[activeSceneIndex]);
                }
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                skipForward();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                skipBackward();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [activeSceneIndex, scenes]);

    if (loading) {
        return (
            <div className="min-h-screen bg-earth flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-saffron/20 border-t-saffron animate-spin mb-6" />
                <p className="text-sand/60 font-serif italic text-lg animate-pulse tracking-wide">अनरोलिंग द सक्रोल्स (Unrolling the Scrolls)...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth text-sand cursor-default selection:bg-saffron/30 font-serif">
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-saffron z-50 origin-[0%]"
                style={{ scaleX }}
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4 flex items-center justify-between bg-gradient-to-b from-[#0F0A0A] to-transparent">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-saffron/20 transition-all shadow-glow"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex-1 px-4 text-center overflow-hidden">
                    <p className="text-[12px] uppercase tracking-[0.3em] text-saffron font-black truncate drop-shadow-lg">
                        {chapter?.title}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleToggleFavorite}
                        className={`w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 transition-all shadow-glow ${isFavorite ? 'text-red-500 hover:text-red-400' : 'text-white hover:text-red-500'}`}
                    >
                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:text-saffron">
                        <Share2 size={18} />
                    </button>
                </div>
            </header>

            {/* Novel Header - Cover Inspired */}
            <section className="min-h-screen flex flex-col items-center justify-start pt-24 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-saffron/10 to-transparent opacity-30 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="z-10 w-full max-w-2xl"
                >
                    {/* Image First - Webtoon Hero */}
                    <div className="relative aspect-[9/12] md:aspect-video rounded-3xl overflow-hidden mb-12 shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-saffron/20 group">
                        <img
                            src={chapter?.cover_image_url ? `http://localhost:8000${chapter.cover_image_url}` : getAssetUrl(scenes[0]?.ai_image_url) || 'https://images.unsplash.com/photo-1628135805272-36c1c87515b6?q=80&w=1080&auto=format&fit=crop'}
                            alt="Chapter Cover"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A0A] via-transparent to-transparent opacity-60" />
                    </div>

                    <span className="text-[14px] font-black uppercase tracking-[0.5em] text-saffron/80 mb-6 block drop-shadow-md">
                        अध्याये (Chapter) {chapter?.index}
                    </span>
                    <h1 className="text-6xl md:text-9xl font-display font-bold text-white mb-8 leading-tight tracking-tighter drop-shadow-[0_10px_30px_rgba(236,109,19,0.3)]">
                        {chapter?.title}
                    </h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
                        <Button
                            onClick={handleMasterReel}
                            disabled={isGeneratingReel}
                            className={`h-14 px-8 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-transform hover:scale-105 ${isGeneratingReel ? 'opacity-50 shadow-none' : 'shadow-[0_10px_30px_rgba(236,109,19,0.3)]'}`}
                        >
                            {isGeneratingReel ? <span className="animate-spin">⏳</span> : <MonitorPlay size={24} />}
                            पूरी रील्स देखें (Watch Master Reel)
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => toggleAudio(scenes[0])}
                            className="bg-white/5 border border-white/10 text-sand h-14 px-8 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                        >
                            <Volume2 size={24} />
                            सुनना शुरू करें (Start Listening)
                        </Button>
                    </div>

                    <p className="text-sand/60 max-w-xl mx-auto italic text-2xl leading-relaxed mb-16 border-l-4 border-saffron/30 pl-8 text-left">
                        {chapter?.short_summary}
                    </p>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex flex-col items-center gap-3 text-saffron/30"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black">पढ़ना शुरू करें (Scroll to Read)</span>
                        <ArrowDown size={20} />
                    </motion.div>
                </motion.div>
            </section>

            {/* Scenes - Vertical Webtoon Format */}
            <main className="max-w-4xl mx-auto pb-96">
                {scenes.map((scene) => (
                    <div
                        key={scene.id}
                        className="scene-block relative mb-24 md:mb-32 px-6"
                    >
                        {/* Interactive Novel Controls */}
                        <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8">
                            <button
                                onClick={() => toggleAudio(scene)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all border ${isPlaying && audioRef.current?.src.includes(scene.ai_audio_url || '')
                                    ? 'bg-saffron text-white border-saffron shadow-glow'
                                    : 'bg-white/5 text-sand/60 border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Volume2 size={20} />
                                <span className="text-xs font-black uppercase tracking-widest">वक्ता (Speaker)</span>
                            </button>

                            <button
                                onClick={() => handleVisualiseScene(scene)}
                                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 text-sand/60 border border-white/10 hover:bg-white/10 hover:text-saffron transition-all"
                            >
                                <MonitorPlay size={20} />
                                <span className="text-xs font-black uppercase tracking-widest">दृश्य (Visualize)</span>
                            </button>

                            {scene.emotion && (
                                <div className="ml-auto px-5 py-2 bg-saffron/5 border border-saffron/20 rounded-lg text-[10px] font-black text-saffron uppercase tracking-[0.2em] shadow-inner">
                                    {scene.emotion}
                                </div>
                            )}
                        </div>

                        {/* Text Content - "Book Style" */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -left-10 top-0 bottom-0 w-[4px] bg-gradient-to-b from-transparent via-saffron/20 to-transparent hidden xl:block" />

                            <p className="text-xl md:text-3xl font-serif leading-[1.8] text-sand/90 mb-12 tracking-tight text-justify 
                                first-letter:text-6xl md:first-letter:text-8xl first-letter:font-bold first-letter:text-saffron first-letter:mr-4 first-letter:float-left first-letter:leading-none first-letter:pt-2">
                                {scene.raw_text}
                            </p>

                            {scene.symbolism && (
                                <div className="flex gap-6 items-start bg-saffron/5 p-8 rounded-[30px] border-l-[6px] border-saffron shadow-xl italic text-xl text-sand/70">
                                    <Info size={28} className="text-saffron shrink-0 mt-1" />
                                    <p><span className="text-saffron/80 font-black uppercase text-xs not-italic mr-3 block mb-1 tracking-widest">प्रतीकात्मकता (Symbolism)</span> {scene.symbolism}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                ))}

                {/* Conclusion Section */}
                <section className="py-40 px-6 text-center mt-32 border-t border-white/5 bg-gradient-to-b from-transparent to-saffron/10 rounded-t-[120px]">
                    <div className="w-24 h-24 rounded-full bg-saffron/20 flex items-center justify-center mx-auto mb-10 shadow-glow border border-saffron/30">
                        <Sparkles className="text-saffron" size={40} />
                    </div>
                    <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">कथा समाप्त (The Scroll Concludes)</h3>
                    <p className="text-sand/40 mb-16 text-2xl italic tracking-wide"> "{chapter?.title}" का अंत।</p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="px-12 bg-white/5 border border-white/10 hover:bg-white/10 text-sand"
                            onClick={() => navigate(`/story/${chapter?.story_id}`)}
                        >
                            मुख्य पृष्ठ (Back to Story)
                        </Button>

                        {chapter?.next_chapter_id && (
                            <Button
                                size="lg"
                                className="px-12 bg-saffron text-white hover:bg-saffron/90 shadow-glow"
                                onClick={() => {
                                    navigate(`/chapter/${chapter.next_chapter_id}`);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                अगला अध्याय (Next Chapter)
                                <ChevronLeft className="rotate-180 ml-2" size={20} />
                            </Button>
                        )}
                    </div>
                </section>
            </main>

            {/* Bottom Floating Control (Quick Actions) */}
            <AnimatePresence>
                {activeSceneIndex >= 0 && (
                    <motion.div
                        initial={{ y: 200 }}
                        animate={{ y: 0 }}
                        exit={{ y: 200 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl"
                    >
                        <div className="bg-[#1A1410]/98 backdrop-blur-3xl border border-saffron/20 rounded-[40px] p-5 shadow-[0_20px_100px_rgba(0,0,0,0.8)]
">
                            {/* Top Row: Controls */}
                            <div className="flex items-center gap-4 mb-4">
                                {/* Skip Back */}
                                <button
                                    onClick={skipBackward}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-sand/60 hover:bg-white/10 hover:text-saffron transition-all border border-white/5"
                                    title="Rewind 10s (←)"
                                >
                                    <SkipBack size={18} />
                                </button>

                                {/* Play/Pause */}
                                <button
                                    onClick={() => toggleAudio(scenes[activeSceneIndex])}
                                    className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all shadow-xl ${isPlaying ? 'bg-saffron text-white scale-95 shadow-glow animate-pulse' : 'bg-white/10 text-sand hover:bg-white/20'
                                        }`}
                                    title="Play/Pause (Space)"
                                >
                                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                                </button>

                                {/* Skip Forward */}
                                <button
                                    onClick={skipForward}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-sand/60 hover:bg-white/10 hover:text-saffron transition-all border border-white/5"
                                    title="Forward 10s (→)"
                                >
                                    <SkipForward size={18} />
                                </button>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-saffron mb-1">नारायण कथा (Narrating)</span>
                                            <h4 className="text-sm font-bold text-sand truncate">दृश्य (Scene) {activeSceneIndex + 1} of {scenes.length}</h4>
                                        </div>
                                        <span className="text-[10px] font-mono text-saffron font-bold">
                                            {formatTime(currentTime)} / {formatTime(audioDuration)}
                                        </span>
                                    </div>

                                    {/* Seekable Progress Bar */}
                                    <div
                                        className="h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                                        onClick={handleSeek}
                                        title="Click to seek"
                                    >
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-saffron via-amber to-saffron bg-[length:200%_auto] animate-shimmer relative"
                                            style={{
                                                width: isPlaying
                                                    ? `${audioProgress}%`
                                                    : `${(activeSceneIndex + 1) / scenes.length * 100}%`
                                            }}
                                        >
                                            {/* Seeker dot */}
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3">
                                    <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-sand/40 hover:text-saffron transition-all border border-white/5">
                                        <Headphones size={22} />
                                    </button>
                                    <button
                                        onClick={() => handleVisualiseScene(scenes[activeSceneIndex])}
                                        className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-sand/40 hover:text-saffron transition-all border border-white/5"
                                    >
                                        <MonitorPlay size={22} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <VideoModal
                isOpen={isVideoModalOpen}
                onClose={() => {
                    setIsVideoModalOpen(false);
                    setIsVideoLoading(false);
                }}
                videoUrl={activeVideoUrl}
                loading={isVideoLoading}
            />
        </div>
    );
};

export default ChapterReader;
