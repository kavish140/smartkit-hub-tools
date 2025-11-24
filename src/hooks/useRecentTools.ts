import { useState, useEffect, useCallback } from 'react';

const RECENT_TOOLS_KEY = 'smartkit_recent_tools';
const MAX_RECENT = 5;

interface RecentTool {
  title: string;
  timestamp: number;
}

export const useRecentTools = () => {
  const [recentTools, setRecentTools] = useState<RecentTool[]>(() => {
    const stored = localStorage.getItem(RECENT_TOOLS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading recent tools:', e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(recentTools));
  }, [recentTools]);

  const addRecentTool = useCallback((toolTitle: string) => {
    setRecentTools(prev => {
      // Remove if already exists
      const filtered = prev.filter(t => t.title !== toolTitle);
      
      // Add to beginning
      const newRecent = [
        { title: toolTitle, timestamp: Date.now() },
        ...filtered
      ].slice(0, MAX_RECENT);
      
      return newRecent;
    });
  }, []);

  return { recentTools, addRecentTool };
};
