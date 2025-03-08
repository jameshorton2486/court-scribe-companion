
import { useEffect } from 'react';

/**
 * A hook that prevents body scrolling while a component is mounted
 */
export function useLockBodyScroll(): void {
  useEffect(() => {
    // Save the original body overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []); // Empty array ensures effect is only run on mount and unmount
}
