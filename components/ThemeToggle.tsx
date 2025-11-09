import React from 'react';
import { useSettings } from '../context/SettingsContext';
// FIX: Added missing import for AnimatePresence.
import { motion, AnimatePresence } from 'framer-motion';

const Icon = ({ path, className = "h-5 w-5" }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useSettings();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 left-6 z-50 bg-card-light/80 dark:bg-card-dark/70 backdrop-blur-lg p-3 rounded-full shadow-lg border border-[var(--border-color)] text-text-light dark:text-text-dark"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
            key={theme}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
        {theme === 'light' ? (
            <Icon path="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        ) : (
            <Icon path="M12 3v2.25m6.364.364l-1.591 1.591M21 12h-2.25m-.364 6.364l-1.591-1.591M12 18.75V21m-6.364-.364l1.591-1.591M3 12h2.25m.364-6.364l1.591 1.591M12 6a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
        )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;