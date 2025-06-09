
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export const usePersistedTheme = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && theme) {
      // Persist theme to localStorage
      localStorage.setItem('app-theme', theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted) {
      // Load persisted theme on mount
      const persistedTheme = localStorage.getItem('app-theme');
      if (persistedTheme && persistedTheme !== theme) {
        setTheme(persistedTheme);
      }
    }
  }, [mounted, setTheme, theme]);

  return { theme, setTheme, mounted };
};
