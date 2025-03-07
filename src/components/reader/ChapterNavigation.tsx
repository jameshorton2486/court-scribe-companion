
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ChapterNavigationProps {
  onPrevChapter: () => void;
  onNextChapter: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  currentChapter: number;
  totalChapters: number;
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  onPrevChapter,
  onNextChapter,
  hasPrevious,
  hasNext,
  currentChapter,
  totalChapters
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      toast.success("Chapter bookmarked", {
        description: `Chapter ${currentChapter} has been bookmarked for later reading.`,
      });
    } else {
      toast.info("Bookmark removed", {
        description: `Bookmark for Chapter ${currentChapter} has been removed.`,
      });
    }
  };

  // Calculate percentage for progress
  const progressPercentage = (currentChapter / totalChapters) * 100;
  
  return (
    <div className="flex flex-col space-y-4 mt-12 pt-6 border-t">
      {/* Chapter info and bookmark */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          Chapter {currentChapter} of {totalChapters}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBookmark}
          className={cn(
            "ml-2 transition-colors",
            isBookmarked && "text-primary"
          )}
        >
          {isBookmarked ? (
            <BookmarkCheck size={16} className="mr-1" />
          ) : (
            <Bookmark size={16} className="mr-1" />
          )}
          <span className="text-xs">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
        </Button>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          onClick={onPrevChapter}
          variant="outline"
          className={cn(
            "flex items-center transition-colors",
            !hasPrevious && "opacity-50 cursor-not-allowed"
          )}
          disabled={!hasPrevious}
        >
          <ArrowLeft size={18} className="mr-2" />
          Previous Chapter
        </Button>
        
        <Button
          onClick={onNextChapter}
          variant="outline"
          className={cn(
            "flex items-center transition-colors",
            !hasNext && "opacity-50 cursor-not-allowed"
          )}
          disabled={!hasNext}
        >
          Next Chapter
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
      
      {/* Enhanced progress indicator */}
      <div className="w-full mt-2 space-y-1">
        <div className="bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Beginning</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
          <span>End</span>
        </div>
      </div>
    </div>
  );
};

export default ChapterNavigation;
