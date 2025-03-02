
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChapterNavigationProps {
  onPrevChapter: () => void;
  onNextChapter: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  onPrevChapter,
  onNextChapter,
  hasPrevious,
  hasNext
}) => {
  return (
    <div className="flex justify-between mt-12 pt-6 border-t">
      <button
        onClick={onPrevChapter}
        className={cn(
          "flex items-center px-4 py-2 rounded-md transition-colors",
          hasPrevious 
            ? "bg-primary/10 hover:bg-primary/20" 
            : "opacity-50 cursor-not-allowed"
        )}
        disabled={!hasPrevious}
      >
        <ArrowLeft size={18} className="mr-2" />
        Previous Chapter
      </button>
      
      <button
        onClick={onNextChapter}
        className={cn(
          "flex items-center px-4 py-2 rounded-md transition-colors",
          hasNext 
            ? "bg-primary/10 hover:bg-primary/20" 
            : "opacity-50 cursor-not-allowed"
        )}
        disabled={!hasNext}
      >
        Next Chapter
        <ArrowRight size={18} className="ml-2" />
      </button>
    </div>
  );
};

export default ChapterNavigation;
