import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'smartkit_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }, []);

  const toggleFavorite = (toolTitle: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(toolTitle)
        ? prev.filter(t => t !== toolTitle)
        : [...prev, toolTitle];
      
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (toolTitle: string) => favorites.includes(toolTitle);

  return { favorites, toggleFavorite, isFavorite };
};
