/**
 * Home Page
 * Main landing page with stories, categories, and user progress
 * Webtoon-style story cards with proper auth integration
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

export default function Home() {
    const navigate = useNavigate();
    const [stories, setStories] = useState<Story[]>(DEMO_STORIES);
    const [progressStories, setProgressStories] = useState<Story[]>([]);
    const [activeTab, setActiveTab] = useState("सभी कथाएँ");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [lastReading, setLastReading] = useState(getLastReadingProgress());

    useEffect(() => {
        // Get user from storage
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);

            // Fetch user progress
            getUserProgress(storedUser.id)
                .then(setProgressStories)
                .catch(console.error);
        }

        // Fetch stories from API
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

            // Refresh stories
            const newStories = await getStories();
            if (newStories.length > 0) {
                setStories(newStories);
            }
        } catch (err) {
            console.error("Seed error:", err);
            toast.error("Failed to seed data", { id: "seed" });
        } finally {
            setSeeding(false);
        }
    };

    // Filter stories based on active tab
    const filteredStories = stories.filter(story => {
        if (activeTab === "सभी कथाएँ") return true;
        if (activeTab === "Recently Read") return progressStories.some(ps => ps.id === story.id);
        return story.category?.toLowerCase() === activeTab.toLowerCase();
    });

    return (
        <div className="min-h-screen bg-earth pb-24 font-sans text-sand">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 sticky top-0 bg-earth/95 backdrop-blur-xl z-40 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center shadow-glow">
                        <BookOpen size={20} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold font-serif tracking-wide text-white">Katha</h1>
                </div>

                {/* User Avatar / Login Button */}
                {isAuthenticated() ? (
                    <Link
                        to="/profile"
                        className="w-10 h-10 rounded-full bg-amber p-0.5 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    >
                        <img
                            src={user?.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Katha"}`}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover border-2 border-earth"
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

            {/* Filter Tabs */}
            <div className="px-6 flex gap-3 overflow-x-auto no-scrollbar py-4 sticky top-[76px] bg-earth/95 backdrop-blur-xl z-30">
                {["सभी कथाएँ", "महाकाव्य", "लोककथा"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeTab === tab
                            ? "bg-saffron text-white border-saffron shadow-glow"
                            : "bg-white/5 text-sand/30 border-white/5 hover:bg-white/10"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Container */}
            <div className="px-6 mt-4 space-y-10 max-w-7xl mx-auto">

                {/* Archetype CTA for logged-in users without archetype */}
                {user && !user.archetype && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/quiz')}
                        className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#EC6D13]/20 to-[#F9B233]/10 border border-[#EC6D13]/20 p-8 cursor-pointer"
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

                {/* Explore Map CTA - Visible to everyone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/explore')}
                    className="relative rounded-[32px] overflow-hidden bg-[#1A1410] border border-white/10 p-6 cursor-pointer group"
                >
                    {/* Background Map Image Pattern */}
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
                                Explore Ayodhya, Lanka, and other epic locations.
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-colors">
                            <Compass size={24} />
                        </div>
                    </div>
                </motion.div>

                {/* Continue Reading Section - Enhanced with localStorage */}
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

                {/* AI Video Reels Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Play size={18} fill="currentColor" className="text-[#EC6D13]" />
                            <h2 className="text-lg font-bold text-white/90">AI Video Reels</h2>
                        </div>
                        <button className="text-xs font-bold text-[#EC6D13]">See More</button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {filteredStories.slice(0, 4).map((story) => (
                            <Link
                                key={story.id}
                                to={`/story/${story.id}`}
                                className="min-w-[140px] aspect-[9/16] rounded-2xl overflow-hidden relative group border border-white/5"
                            >
                                <img
                                    src={getAssetUrl(story.cover_image_url) || DEMO_STORIES[1].cover_image_url}
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                                    alt={story.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3 text-[10px] font-bold truncate">{story.title}</div>
                                <div className="absolute top-3 right-3">
                                    <Play size={16} fill="white" className="text-white/80" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Audio Stories Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Headphones size={18} className="text-[#9D7AFF]" />
                            <h2 className="text-lg font-bold text-white/90">Audio Stories</h2>
                        </div>
                        <button className="text-xs font-bold text-white/40">Listen All</button>
                    </div>
                    <div className="space-y-3">
                        {filteredStories.slice(0, 3).map((story) => (
                            <Link
                                key={story.id}
                                to={`/story/${story.id}`}
                                className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition"
                            >
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                    <img
                                        src={getAssetUrl(story.cover_image_url) || DEMO_STORIES[2].cover_image_url}
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
                        ))}
                    </div>
                </section>

                {/* Story Cards Grid - Webtoon Style */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white/90">All Stories</h2>
                        <button
                            onClick={handleSeedData}
                            disabled={seeding}
                            className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest px-3 py-2 rounded-full bg-[#EC6D13]/10 text-[#EC6D13] border border-[#EC6D13]/20 hover:bg-[#EC6D13]/20 transition disabled:opacity-50"
                        >
                            <Leaf size={10} />
                            {seeding ? "Seeding..." : "Seed Data"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] rounded-[32px] bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            {filteredStories.map((story) => (
                                <Link key={story.id} to={`/story/${story.id}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="aspect-[3/4] rounded-[32px] overflow-hidden mb-3 border border-white/5 bg-[#221810] shadow-lg group">
                                            <img
                                                src={story.cover_image_url || "/fallback.svg"}
                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                alt={story.title}
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

                    {filteredStories.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-white/40 mb-4">No stories found in this category.</p>
                            <button
                                onClick={handleSeedData}
                                className="px-6 py-3 bg-[#EC6D13] text-white rounded-xl font-bold"
                            >
                                Seed Sample Stories
                            </button>
                        </div>
                    )}
                </section>
            </div>

            <BottomNavbar />
        </div>
    );
}
