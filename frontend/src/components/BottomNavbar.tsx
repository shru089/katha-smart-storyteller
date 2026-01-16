import { Home, Compass, Bookmark, User, Clapperboard } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const BottomNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { id: 'home', icon: Home, label: 'Home', path: '/' },
        { id: 'explore', icon: Compass, label: 'Map', path: '/explore' },
        { id: 'reels', icon: Clapperboard, label: 'Reels', path: '/reels' },
        { id: 'library', icon: Bookmark, label: 'Library', path: '/library' },
        { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1A1410]/95 backdrop-blur-xl border-t border-white/5 px-8 py-4 safe-bottom z-50">
            <div className="flex justify-between items-center max-w-lg mx-auto">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => navigate(tab.path)}
                            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive
                                ? 'text-[#EC6D13] scale-110 drop-shadow-[0_0_8px_rgba(236,109,19,0.3)]'
                                : 'text-white/30 hover:text-white/50'}`}
                        >
                            <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className={`text-[10px] font-bold tracking-widest uppercase ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
