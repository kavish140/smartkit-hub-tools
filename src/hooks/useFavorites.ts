import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'smartkit_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading favorites:', e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((toolTitle: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(toolTitle)
        ? prev.filter(t => t !== toolTitle)
        : [...prev, toolTitle];
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((toolTitle: string) => favorites.includes(toolTitle), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};
