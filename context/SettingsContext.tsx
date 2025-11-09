import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';

type Theme = 'light' | 'dark';

interface SettingsContextType {
  theme: Theme;
  toggleTheme: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playSfx: (type: 'success' | 'error' | 'send' | 'notification') => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

// Base64 encoded silent WAV files for different sound effects
// This avoids creating new files and keeps everything in code.
// Actual sounds should be replaced here.
const sfxSources = {
  success: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
  error: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
  send: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
  notification: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const audioCache = useMemo(() => ({
      success: new Audio(sfxSources.success),
      error: new Audio(sfxSources.error),
      send: new Audio(sfxSources.send),
      notification: new Audio(sfxSources.notification),
  }), []);
  
  // FIX: Cast the result of Object.values to HTMLAudioElement[] to fix the type error.
  (Object.values(audioCache) as HTMLAudioElement[]).forEach(audio => audio.volume = 0.25);


  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    const storedSound = localStorage.getItem('soundEnabled');
    setIsSoundEnabled(storedSound ? JSON.parse(storedSound) : true);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);
  
  const toggleSound = useCallback(() => {
    const newSoundState = !isSoundEnabled;
    setIsSoundEnabled(newSoundState);
    localStorage.setItem('soundEnabled', JSON.stringify(newSoundState));
  }, [isSoundEnabled]);

  const playSfx = useCallback((type: keyof typeof sfxSources) => {
    if (isSoundEnabled && audioCache[type]) {
        audioCache[type].currentTime = 0;
        audioCache[type].play().catch(e => console.error("SFX play failed:", e));
    }
  }, [isSoundEnabled, audioCache]);


  const contextValue = { theme, toggleTheme, isSoundEnabled, toggleSound, playSfx };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
