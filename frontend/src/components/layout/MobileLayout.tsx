import React from 'react';
import BottomNavBar from './BottomNavBar';

interface MobileLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  headerTitle?: string;
  onBack?: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, showHeader = false, headerTitle = '', onBack }) => {
  return (
    <div className="relative min-h-screen flex flex-col pb-24 max-w-md mx-auto shadow-2xl overflow-hidden bg-background-light dark:bg-background-dark">
      {showHeader && (
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
          {onBack && (
            <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-2xl text-slate-800 dark:text-white">arrow_back</span>
            </button>
          )}
          <h1 className="text-lg font-bold tracking-tight flex-1 text-center pr-10">{headerTitle}</h1>
          <div className="w-10"></div>
        </header>
      )}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
};

export default MobileLayout;
