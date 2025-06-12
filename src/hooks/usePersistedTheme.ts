
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export const usePersistedTheme = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Check if there's a persisted theme, otherwise set dark as default
      const persistedTheme = localStorage.getItem('app-theme');
      if (!persistedTheme) {
        setTheme('dark');
        localStorage.setItem('app-theme', 'dark');
      } else if (persistedTheme !== theme) {
        setTheme(persistedTheme);
      }
    }
  }, [mounted, setTheme, theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  return { theme, setTheme, mounted, toggleTheme };
};
