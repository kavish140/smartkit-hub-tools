import { useEffect, useRef, useCallback } from 'react';

export const useKeyboardShortcuts = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // / key - Focus search (like GitHub)
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape - Clear search and blur
      if (e.key === 'Escape') {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.value = '';
          searchInput.blur();
          // Trigger change event
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      // Ctrl+/ or Cmd+/ - Show shortcuts help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        // You can implement a shortcuts modal here
        console.log('Keyboard Shortcuts:\n' +
          'Ctrl+K or / - Focus search\n' +
          'Esc - Clear search\n' +
          'Ctrl+/ - Show this help'
        );
      }
    }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return searchInputRef;
};
