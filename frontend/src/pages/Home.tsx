/**
 * Home Page
 * Main landing page with stories, categories, and user progress
 * Webtoon-style story cards with skeleton loaders and proper auth integration
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Leaf, BookOpen, ChevronRight, Volume2, Headphones, Compass } from "lucide-react";
import { BottomNavbar } from "../components/BottomNavbar";
import ContinueReadingCard from "../components/ContinueReadingCard";
import { getLastReadingProgress } from "../utils/readingProgress";
import {
    getStories,
    getUserProgress,
    getStoredUser,
    isAuthenticated,
    seedData,
    getAssetUrl,
    type Story,
    type User
} from "../api/client";
import toast from "react-hot-toast";

// Fallback demo stories for immediate display
const DEMO_STORIES: Story[] = [
    {
        id: 1,
        title: "रामायण",
        slug: "ramayana-epic",
        category: "महाकाव्य",
        cover_image_url: "https://pollinations.ai/p/cinematic%20painting%20of%20lord%20rama%20with%20bow%20in%20front%20of%20ayodhya%20palace%20golden%20hour%20rich%20heritage?width=1080&height=1920&nologo=true",
        description: "मर्यादा पुरुषोत्तम श्री राम की पावन कथा।"
    },
    {
        id: 2,
        title: "महाभारत",
        slug: "mahabharata-short",
        category: "महाकाव्य",
        cover_image_url: "https://pollinations.ai/p/cinematic%20battle%20of%20kurukshetra%20krishna%20chariot%20arjuna?width=1080&height=1920&nologo=true",
        description: "कुरुक्षेत्र के धर्मयुद्ध की गाथा।"
    }
];

// ── Skeleton components ──────────────────────────────────────────────────────

function StoryCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[3/4] rounded-[32px] bg-white/5 mb-3 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer" />
            </div>
            <div className="h-4 bg-white/5 rounded-lg w-3/4 mb-2" />
            <div className="h-2.5 bg-white/5 rounded-lg w-1/2" />
        </div>
    );
}

function ReelCardSkeleton() {
    return (
        <div className="animate-pulse min-w-[140px] aspect-[9/16] rounded-2xl bg-white/5 overflow-hidden relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer" />
        </div>
    );
}

function AudioRowSkeleton() {
    return (
        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl animate-pulse">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-white/10 rounded w-3/4" />
                <div className="h-2.5 bg-white/5 rounded w-1/2" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────────

const TABS = ["सभी कथाएँ", "महाकाव्य", "लोककथा"];

export default function Home() {
    const navigate = useNavigate();
    const [stories, setStories] = useState<Story[]>(DEMO_STORIES);
    const [progressStories, setProgressStories] = useState<Story[]>([]);
    const [activeTab, setActiveTab] = useState("सभी कथाएँ");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [lastReading] = useState(getLastReadingProgress());

    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);
            getUserProgress(storedUser.id)
                .then(setProgressStories)
                .catch(console.error);
        }

        getStories()
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setStories(data);
                }
            })
            .catch((err) => {
                console.log("Using demo stories:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSeedData = async () => {
        if (seeding) return;
        setSeeding(true);
        toast.loading("Seeding story data...", { id: "seed" });
        try {
            await seedData();
            toast.success("Stories seeded! Refreshing...", { id: "seed" });
            const newStories = await getStories();
            if (newStories.length > 0) setStories(newStories);
        } catch (err) {
            console.error("Seed error:", err);
            toast.error("Failed to seed data", { id: "seed" });
        } finally {
            setSeeding(false);
        }
    };

    const filteredStories = stories.filter(story => {
        if (activeTab === "सभी कथाएँ") return true;
        if (activeTab === "Recently Read") return progressStories.some(ps => ps.id === story.id);
        return story.category?.toLowerCase() === activeTab.toLowerCase();
    });

    return (
        <div className="min-h-screen bg-earth pb-28 font-sans text-sand">

            {/* ── Sticky Header ── */}
            <div className="flex items-center justify-between px-6 py-5 sticky top-0 bg-earth/95 backdrop-blur-xl z-40 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center shadow-glow">
                        <BookOpen size={20} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold font-serif tracking-wide text-white">Katha</h1>
                </div>

                {isAuthenticated() ? (
                    <Link
                        to="/profile"
                        className="w-10 h-10 rounded-full bg-amber/30 p-0.5 shadow-lg cursor-pointer hover:scale-105 transition-transform border border-amber/30"
                    >
                        <img
                            src={user?.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Katha"}`}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </Link>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="px-4 py-2 bg-saffron text-white text-sm font-bold rounded-xl hover:bg-saffron/80 transition-colors shadow-glow"
                    >
                        Login
                    </button>
                )}
            </div>

            {/* ── Filter Tabs ── */}
            <div className="px-6 flex gap-3 overflow-x-auto no-scrollbar py-4 sticky top-[73px] bg-earth/95 backdrop-blur-xl z-30">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                            activeTab === tab
                                ? "bg-saffron text-white border-saffron shadow-glow"
                                : "bg-white/5 text-sand/40 border-white/5 hover:bg-white/10 hover:text-sand/60"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Content ── */}
            <div className="px-6 mt-2 space-y-10 max-w-7xl mx-auto">

                {/* Archetype CTA */}
                {user && !user.archetype && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/quiz')}
                        className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#EC6D13]/20 to-[#F9B233]/10 border border-[#EC6D13]/20 p-7 cursor-pointer"
                    >
                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#EC6D13] mb-2 block">
                                Personalize Your Journey
                            </span>
                            <h2 className="text-2xl font-bold font-serif mb-2">
                                Who are you in the grand epic?
                            </h2>
                            <p className="text-white/60 text-sm mb-6 max-w-[240px]">
                                Take the archetype quiz to discover your role as a Warrior, Sage, Seeker, or Guardian.
                            </p>
                            <button className="flex items-center gap-2 bg-[#EC6D13] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest">
                                Start Quiz <ChevronRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Interactive Map CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/explore')}
                    className="relative rounded-[28px] overflow-hidden bg-[#1A1410] border border-white/10 p-6 cursor-pointer group"
                >
                    <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/India_1400_CE.jpg')] bg-cover bg-center grayscale mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-saffron mb-1 block">
                                Interactive Map
                            </span>
                            <h2 className="text-xl font-bold font-serif text-white mb-1">
                                Sacred Geography
                            </h2>
                            <p className="text-white/40 text-xs max-w-[200px]">
                                Explore Ayodhya, Lanka, Dwarka and other epic locations.
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-saffron group-hover:border-saffron transition-all duration-300">
                            <Compass size={22} className="group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </motion.div>

                {/* Continue Reading */}
                {lastReading && activeTab === "सभी कथाएँ" && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white/90">जारी रखें (Continue Reading)</h2>
                        </div>
                        <ContinueReadingCard
                            storyTitle={lastReading.storyTitle}
                            storyId={lastReading.storyId}
                            chapterTitle={lastReading.chapterTitle}
                            chapterId={lastReading.chapterId}
                            chapterIndex={lastReading.chapterIndex}
                            coverImageUrl={lastReading.coverImageUrl}
                            progress={lastReading.progress}
                            lastRead={lastReading.lastRead}
                        />
                    </section>
                )}

                {/* AI Video Reels */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Play size={18} fill="currentColor" className="text-saffron" />
                            <h2 className="text-lg font-bold text-white/90">AI Video Reels</h2>
                        </div>
                        <button
                            onClick={() => navigate('/reels')}
                            className="text-xs font-bold text-saffron hover:text-saffron/80 transition-colors"
                        >
                            See More
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {loading
                            ? [1, 2, 3].map(i => <ReelCardSkeleton key={i} />)
                            : filteredStories.slice(0, 4).map((story) => (
                                <Link
                                    key={story.id}
                                    to={`/story/${story.id}`}
                                    className="min-w-[140px] aspect-[9/16] rounded-2xl overflow-hidden relative group border border-white/5 flex-shrink-0"
                                >
                                    <img
                                        src={getAssetUrl(story.cover_image_url) || DEMO_STORIES[0].cover_image_url}
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                                        alt={story.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3 text-[10px] font-bold truncate">{story.title}</div>
                                    <div className="absolute top-3 right-3">
                                        <Play size={16} fill="white" className="text-white/80" />
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </section>

                {/* Audio Stories */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Headphones size={18} className="text-[#9D7AFF]" />
                            <h2 className="text-lg font-bold text-white/90">Audio Stories</h2>
                        </div>
                        <button className="text-xs font-bold text-white/40 hover:text-white/60 transition-colors">
                            Listen All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {loading
                            ? [1, 2, 3].map(i => <AudioRowSkeleton key={i} />)
                            : filteredStories.slice(0, 3).map((story) => (
                                <Link
                                    key={story.id}
                                    to={`/story/${story.id}`}
                                    className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                        <img
                                            src={getAssetUrl(story.cover_image_url) || DEMO_STORIES[0].cover_image_url}
                                            className="w-full h-full object-cover"
                                            alt={story.title}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold truncate">{story.title}</h4>
                                        <p className="text-[10px] text-sand/40 font-bold uppercase tracking-widest mt-1">
                                            {story.category || "Folklore"} • {story.total_scenes || 0} scenes
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center text-amber flex-shrink-0">
                                        <Volume2 size={18} />
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </section>

                {/* All Stories Grid */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white/90">All Stories</h2>
                        {/* Seed Data — dev only */}
                        {import.meta.env.DEV && (
                            <button
                                onClick={handleSeedData}
                                disabled={seeding}
                                className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest px-3 py-2 rounded-full bg-saffron/10 text-saffron border border-saffron/20 hover:bg-saffron/20 transition disabled:opacity-50"
                            >
                                <Leaf size={9} />
                                {seeding ? "Seeding..." : "Seed Data"}
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 gap-5">
                            {[1, 2, 3, 4].map(i => <StoryCardSkeleton key={i} />)}
                        </div>
                    ) : filteredStories.length === 0 ? (
                        <div className="text-center py-16 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                                <BookOpen size={28} className="text-white/20" />
                            </div>
                            <p className="text-white/40 text-sm">No stories in this category yet.</p>
                            {import.meta.env.DEV && (
                                <button
                                    onClick={handleSeedData}
                                    className="px-6 py-3 bg-saffron text-white rounded-xl font-bold text-sm hover:bg-saffron/80 transition-colors"
                                >
                                    Seed Sample Stories
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-5">
                            {filteredStories.map((story, i) => (
                                <Link key={story.id} to={`/story/${story.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="aspect-[3/4] rounded-[28px] overflow-hidden mb-3 border border-white/5 bg-[#221810] shadow-lg group">
                                            <img
                                                src={story.cover_image_url || "/fallback.svg"}
                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                alt={story.title}
                                                loading="lazy"
                                            />
                                        </div>
                                        <h3 className="font-bold text-white truncate pr-2">{story.title}</h3>
                                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">
                                            {story.category || "Folklore"} • {story.total_chapters || 0} chapters
                                        </p>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

            </div>

            <BottomNavbar />
        </div>
    );
}
