import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';

const navItems = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/explore', icon: 'search', label: 'Explore' },
  { path: '/library', icon: 'library_books', label: 'Library' },
  { path: '/profile', icon: 'person', label: 'Profile' },
];

const BottomNavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#1a120b]/90 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 pb-safe">
      <div className="flex justify-around items-center h-[68px] max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-1 group relative transition-colors ${
                isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-2 w-8 h-8 bg-primary/10 rounded-full scale-100 transition-transform"></div>
                )}
                <Icon name={item.icon} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }} />
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
