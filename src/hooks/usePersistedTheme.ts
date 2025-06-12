
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
      // Forza sempre il tema scuro come default se non c'è una preferenza salvata
      const persistedTheme = localStorage.getItem('theme');
      if (!persistedTheme) {
        setTheme('dark');
        localStorage.setItem('theme', 'dark');
      }
    }
  }, [mounted, setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return { theme, setTheme, mounted, toggleTheme };
};
