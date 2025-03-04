
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Chapter } from '@/components/ebook-uploader/BookProcessor';
import { CircleCheck, CircleX } from 'lucide-react';

interface SelectChaptersTabProps {
  chapters: Chapter[];
  selectedChapters: string[];
  setSelectedChapters: (chapterIds: string[]) => void;
}

const SelectChaptersTab: React.FC<SelectChaptersTabProps> = ({
  chapters,
  selectedChapters,
  setSelectedChapters
}) => {
  const toggleChapter = (chapterId: string) => {
    if (selectedChapters.includes(chapterId)) {
      setSelectedChapters(selectedChapters.filter(id => id !== chapterId));
    } else {
      setSelectedChapters([...selectedChapters, chapterId]);
    }
  };

  const toggleAll = () => {
    if (selectedChapters.length === chapters.length) {
      setSelectedChapters([]);
    } else {
      setSelectedChapters(chapters.map(ch => ch.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm">
          Select which chapters you want to enhance:
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleAll}
            className="flex items-center space-x-1"
          >
            {selectedChapters.length === chapters.length ? (
              <>
                <CircleX className="h-4 w-4" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <CircleCheck className="h-4 w-4" />
                <span>Select All</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <ScrollArea className="h-60 border rounded-md p-4">
        <div className="space-y-2">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-accent/50 transition-colors">
              <Checkbox
                id={`chapter-${chapter.id}`}
                checked={selectedChapters.includes(chapter.id)}
                onCheckedChange={() => toggleChapter(chapter.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label
                  htmlFor={`chapter-${chapter.id}`}
                  className="text-sm font-medium leading-none cursor-pointer block mb-1"
                >
                  Chapter {index + 1}: {chapter.title}
                </Label>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {chapter.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="text-sm text-muted-foreground">
        Selected {selectedChapters.length} of {chapters.length} chapters
      </div>
    </div>
  );
};

export default SelectChaptersTab;
