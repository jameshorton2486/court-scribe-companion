
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TocItem } from '@/components/TableOfContents';

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
  return (
    <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden">
      <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs pt-20 pb-6 bg-card overflow-y-auto animate-slide-in">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Table of Contents</h3>
            <button 
              className="p-2 rounded-full hover:bg-muted"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
          {toc.map((item) => (
            <div 
              key={item.id}
              className={cn(
                "toc-item flex justify-between items-center",
                activeChapter === item.id && "active"
              )}
              onClick={() => onItemClick(item.id)}
            >
              <span>{item.title}</span>
              {item.page && <span className="text-xs opacity-60">{item.page}</span>}
            </div>
          ))}
        </div>
      </div>
      <div 
        className="fixed inset-0 z-40 bg-black/20" 
        onClick={onClose}
      />
    </div>
  );
};

export default MobileToc;
