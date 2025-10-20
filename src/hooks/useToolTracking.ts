import { useEffect } from 'react';
import { useRecentTools } from './useRecentTools';

export const useToolTracking = (toolName: string) => {
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    // Add to recent tools when component mounts
    addRecentTool(toolName);
  }, [toolName, addRecentTool]);
};
