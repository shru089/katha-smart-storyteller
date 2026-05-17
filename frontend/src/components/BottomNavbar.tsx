/**
 * BottomNavbar
 * Always-visible labels, saffron active indicator, smooth transitions.
 */

import { Home, Compass, Bookmark, User, Clapperboard } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
    { id: 'home',    icon: Home,        label: 'Home',    path: '/' },
    { id: 'explore', icon: Compass,     label: 'Explore', path: '/explore' },
    { id: 'reels',   icon: Clapperboard, label: 'Reels',  path: '/reels' },
    { id: 'library', icon: Bookmark,    label: 'Library', path: '/library' },
    { id: 'profile', icon: User,        label: 'Profile', path: '/profile' },
];

export const BottomNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel px-2 pt-2 pb-safe">
            {/* Inner safe-area padding for notched phones */}
            <div
                className="flex justify-around items-end max-w-lg mx-auto pb-[env(safe-area-inset-bottom,8px)]"
            >
                {tabs.map((tab) => {
                    const active = isActive(tab.path);
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => navigate(tab.path)}
                            aria-label={tab.label}
                            aria-current={active ? 'page' : undefined}
                            className="relative flex flex-col items-center gap-1 pt-1 pb-2 px-3 min-w-[56px] group"
                        >
                            {/* Active pill indicator above icon */}
                            {active && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-saffron shadow-[0_0_8px_rgba(236,109,19,0.6)]"
                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                animate={active ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                                <Icon
                                    size={22}
                                    strokeWidth={active ? 2.5 : 1.8}
                                    className={`transition-colors duration-200 ${
                                        active
                                            ? 'text-saffron drop-shadow-[0_0_6px_rgba(236,109,19,0.5)]'
                                            : 'text-white/40 group-hover:text-white/60'
                                    }`}
                                />
                            </motion.div>

                            {/* Label — always visible */}
                            <span
                                className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 ${
                                    active ? 'text-saffron' : 'text-white/30 group-hover:text-white/50'
                                }`}
                            >
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
