
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
      // Forza sempre il tema scuro
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, [mounted, setTheme]);

  // Non permettere il cambio di tema - sempre scuro
  const toggleTheme = () => {
    // Non fa nulla - mantiene sempre il tema scuro
  };

  return { theme: 'dark', setTheme, mounted, toggleTheme };
};
