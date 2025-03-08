
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TocItem } from '@/components/TableOfContents';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';

interface MobileTocProps {
  toc: TocItem[];
  activeChapter: string | undefined;
  onItemClick: (id: string) => void;
  onClose: () => void;
}

const MobileToc: React.FC<MobileTocProps> = ({
  toc,
  activeChapter,
  onItemClick,
  onClose
}) => {
  // Lock body scrolling when TOC is open
  useLockBodyScroll();

  // Handle escape key to close the TOC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleTocItemClick = (id: string) => {
    try {
      onItemClick(id);
      onClose();
    } catch (error) {
      console.error('Error navigating to chapter:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden">
      <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs h-full pt-20 pb-6 bg-card shadow-xl overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="px-4 py-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">Table of Contents</h3>
              <button 
                className="p-2 rounded-full hover:bg-muted"
                onClick={onClose}
                aria-label="Close table of contents"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {toc.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No chapters available</p>
            ) : (
              toc.map((item) => (
                <div 
                  key={item.id}
                  className={cn(
                    "toc-item flex justify-between items-center my-1",
                    activeChapter === item.id && "active"
                  )}
                  onClick={() => handleTocItemClick(item.id)}
                >
                  <span className="truncate mr-2">{item.title}</span>
                  {item.page && <span className="text-xs opacity-60 flex-shrink-0">{item.page}</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div 
        className="fixed inset-0 z-40 bg-black/20" 
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
};

export default MobileToc;
