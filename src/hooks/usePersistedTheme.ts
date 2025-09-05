
import { useState, useEffect } from 'react';


export const usePersistedTheme = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Forza sempre il tema scuro
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, [mounted]);

  // Non permettere il cambio di tema - sempre scuro
  const toggleTheme = () => {
    // Non fa nulla - mantiene sempre il tema scuro
  };

  return { theme: 'dark', setTheme: () => {}, mounted, toggleTheme };
};
