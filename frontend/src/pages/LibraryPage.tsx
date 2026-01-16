import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, Grid, List as ListIcon, Heart, Plus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStories, Story, getAssetUrl, api, getAchievements } from '../api/client';
import { BottomNavbar } from '../components/BottomNavbar';
import { Zap, Flame, Trophy, Award, ChevronRight } from 'lucide-react';

const CATEGORIES = ["All", "Reading", "Read", "Favorites"];

const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [achievements, setAchievements] = useState<any>(null);
  const [readingProgress, setReadingProgress] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const progress = localStorage.getItem('katha_reading_progress');
    if (progress) {
      setReadingProgress(JSON.parse(progress));
    }
  }, []);

  useEffect(() => {
    if (user) {
      getAchievements(user.id)
        .then(setAchievements)
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (!user && activeTab !== "All") return;

    setLoading(true);
    let fetchPromise;
    if (activeTab === "Reading" && user) {
      fetchPromise = api.get(`/users/${user.id}/progress`).then(r => r.data);
    } else if (activeTab === "Read" && user) {
      fetchPromise = api.get(`/users/${user.id}/completed`).then(r => r.data);
    } else if (activeTab === "Favorites" && user) {
      fetchPromise = api.get(`/users/${user.id}/favorites`).then(r => r.data);
    } else {
      fetchPromise = getStories();
    }

    fetchPromise
      .then(setStories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab, user]);

  if (loading && stories.length === 0) return (
    <div className="min-h-screen bg-earth flex items-center justify-center text-sand font-serif italic text-xl">
      Opening the library gates...
    </div>
  );

  return (
    <div className="min-h-screen bg-earth text-sand pb-32 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-earth/80 backdrop-blur-xl z-50">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-saffron">Katha Collection</span>
          <h1 className="text-3xl font-bold font-serif leading-tight">मेरा पुस्तकालय (My Library)</h1>
        </div>
        <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition border border-white/5 text-white/60">
          <Settings size={20} />
        </button>
      </header>

      <div className="px-6 space-y-8 max-w-2xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 backdrop-blur-sm"
          >
            <Zap className="text-saffron" size={20} />
            <span className="text-xl font-black text-white">{achievements?.total_xp || 0}</span>
            <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Total XP</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 backdrop-blur-sm"
          >
            <Flame className="text-orange-500" size={20} />
            <span className="text-xl font-black text-white">{achievements?.current_streak_days || 0}</span>
            <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Day Streak</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 backdrop-blur-sm"
          >
            <Trophy className="text-yellow-500" size={20} />
            <span className="text-xl font-black text-white">{achievements?.earned_badges?.length || 0}</span>
            <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Badges</span>
          </motion.div>
        </div>

        {/* Badge Showcase */}
        {achievements?.earned_badges?.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Recent Achievements</h3>
              <button className="text-[10px] font-bold text-saffron flex items-center gap-1">
                VIEW ALL <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {achievements.earned_badges.map((badge: any, i: number) => (
                <motion.div
                  key={badge.code}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-shrink-0 flex flex-col items-center space-y-2 group"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron/20 to-orange-500/20 border border-saffron/30 flex items-center justify-center shadow-lg shadow-saffron/5 group-hover:scale-110 transition-transform">
                    {badge.icon_url ? (
                      <img src={getAssetUrl(badge.icon_url)} alt={badge.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <Award className="text-saffron" size={32} />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-white/60 text-center max-w-[70px] leading-tight truncate">
                    {badge.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-saffron transition-colors" size={20} />
          <input
            type="text"
            placeholder="Find a story, author, or genre..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-saffron/50 focus:bg-white/10 transition-all font-medium"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${activeTab === cat
                ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20"
                : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
                }`}
            >
              {cat === "Favorites" && <Heart size={14} fill={activeTab === "Favorites" ? "white" : "none"} />}
              {activeTab === cat && cat !== "All" && cat !== "Favorites" && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Your Collection */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white/90">{activeTab} Stories</h2>
            <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-white/30 hover:text-white/50"}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-white/30 hover:text-white/50"}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>

          {stories.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
                <BookOpen size={32} />
              </div>
              <p className="text-white/40 font-medium">No stories found in this category.</p>
              <button onClick={() => navigate('/')} className="text-saffron font-bold text-sm">Explore stories</button>
            </div>
          ) : (
            <div className={`grid ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"} gap-6`}>
              {stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/story/${story.id}`)}
                  className={`group cursor-pointer ${viewMode === "list" ? "flex items-center gap-4 bg-white/5 p-3 rounded-[32px] border border-white/5" : ""}`}
                >
                  <div className={`relative overflow-hidden rounded-[32px] border border-white/5 bg-white/5 ${viewMode === "grid" ? "aspect-[3/4] mb-3" : "w-20 h-20 flex-shrink-0"}`}>
                    <img src={getAssetUrl(story.cover_image_url) || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop"} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate group-hover:text-saffron transition-colors">{story.title}</h4>
                    <p className="text-[10px] font-bold text-sand/30 uppercase tracking-widest mt-1">
                      {(story as any).category || "Mythology"} • {story.total_chapters || 0} Ch
                    </p>

                    {/* Progress Bar for Reading Tab */}
                    {activeTab === "Reading" && readingProgress[story.id] && (
                      <div className="mt-3 space-y-1.5">
                        <div className="flex justify-between text-[8px] font-black tracking-tighter text-white/40 uppercase">
                          <span>Progress</span>
                          <span>{Math.round(readingProgress[story.id].percentage || 0)}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${readingProgress[story.id].percentage || 0}%` }}
                            className="h-full bg-gradient-to-r from-saffron to-orange-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* My Collections Placeholder */}
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-4">My Collections</h2>
          <div className="space-y-4">
            <button className="w-full border-2 border-dashed border-white/10 rounded-[32px] p-4 flex items-center justify-center gap-3 text-white/40 hover:border-saffron/50 hover:text-saffron/50 transition-all group active:scale-[0.98]">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-saffron/10">
                <Plus size={20} />
              </div>
              <span className="font-bold text-sm">Create New Collection</span>
            </button>
          </div>
        </section>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default LibraryPage;
