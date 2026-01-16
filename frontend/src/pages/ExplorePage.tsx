import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sliders, ChevronRight, Play, Map as MapIcon, Compass } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getStories, Story, getAssetUrl } from '../api/client';
import InteractiveMap from '../components/InteractiveMap';

const STATIC_CATEGORIES = ["All", "Mythology", "Folklore", "History", "Philosophy"];

const ExplorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list'); // Default to list, or 'map' if accessed via map CTA?
  const navigate = useNavigate();

  // Check if we should default to map mode (e.g. url param)
  useEffect(() => {
    if (location.search.includes('mode=map')) {
      setViewMode('map');
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      getStories(activeTab, searchQuery)
        .then(setStories)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [activeTab, searchQuery]);

  const storyOfTheDay = stories.length > 0 ? stories[0] : null;
  const trendingStories = stories.length > 1 ? stories.slice(1) : [];



  if (loading) return (
    <div className="min-h-screen bg-earth flex items-center justify-center text-sand">
      <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-earth text-sand pb-32 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-earth/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center shadow-lg shadow-saffron/20">
            <span className="text-white text-lg font-bold">K</span>
          </div>
          <h1 className="text-2xl font-bold font-serif tracking-tight">खोजें (Explore)</h1>
        </div>
        <Link to="/profile" className="w-10 h-10 rounded-full bg-amber p-0.5 shadow-lg cursor-pointer">
          <img src={user?.profile_image_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user?.name || "Katha")} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-earth" />
        </Link>
      </header>

      <div className="px-6 space-y-8 max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-saffron transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search for legends, gods, or eras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-saffron/50 focus:bg-white/10 transition-all font-medium"
          />
          <Sliders className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
        </div>

        {/* View Toggle */}
        <div className="flex justify-end">
          <div className="bg-white/5 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
            >
              <Compass size={20} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-saffron text-white shadow-glow' : 'text-white/40 hover:text-white'}`}
            >
              <MapIcon size={20} />
            </button>
          </div>
        </div>

        {viewMode === 'map' ? (
          <InteractiveMap />
        ) : (
          <>
            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {STATIC_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeTab === cat
                    ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20"
                    : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {storyOfTheDay && activeTab === "All" && !searchQuery && (
              /* Story of the Day */
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white/90">Story of the Day</h2>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Featured</span>
                </div>

                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/story/${storyOfTheDay.id}`)}
                  className="relative h-80 w-full rounded-[40px] overflow-hidden group shadow-2xl border border-white/10 cursor-pointer"
                >
                  <img
                    src={getAssetUrl(storyOfTheDay.cover_image_url) || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"}
                    alt={storyOfTheDay.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/40 to-transparent opacity-90" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-2 py-1 bg-saffron text-[10px] font-black rounded uppercase tracking-widest">
                        {(storyOfTheDay as any).category || "Epic"}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/60 uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-1 rounded">
                        <Play size={10} fill="currentColor" /> {(storyOfTheDay as any).total_chapters || 0} Chapters
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold font-serif mb-2 leading-tight">{storyOfTheDay.title}</h3>
                    <p className="text-white/60 text-sm mb-6 max-w-sm line-clamp-2">
                      {storyOfTheDay.description}
                    </p>
                    <button className="flex items-center gap-2 bg-white text-earth px-6 py-3 rounded-full text-sm font-bold hover:bg-saffron hover:text-white transition-all w-fit group/btn">
                      Explore Story <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </section>
            )}

            {/* Trending Now / Filtered */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white/90">
                  {searchQuery ? `Search Results for "${searchQuery}"` : (activeTab === "All" ? "Trending Now" : `Discover ${activeTab}`)}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(searchQuery ? stories : (activeTab === "All" ? trendingStories : stories)).map((story) => (
                  <motion.div
                    key={story.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/story/${story.id}`)}
                    className="space-y-3 group cursor-pointer"
                  >
                    <div className="aspect-[3/4] rounded-[32px] overflow-hidden border border-white/5 bg-white/5">
                      <img
                        src={getAssetUrl(story.cover_image_url) || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop"}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white/90 truncate">{story.title}</h4>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">
                        {(story as any).category || "Mythology"} • {(story as any).total_chapters || 0} Ch
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
