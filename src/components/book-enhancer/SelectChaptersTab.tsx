
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Chapter } from '@/components/ebook-uploader/BookProcessor';

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
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleAll}
        >
          {selectedChapters.length === chapters.length ? "Deselect All" : "Select All"}
        </Button>
      </div>

      <ScrollArea className="h-60 border rounded-md p-4">
        <div className="space-y-2">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="flex items-start space-x-2">
              <Checkbox
                id={`chapter-${chapter.id}`}
                checked={selectedChapters.includes(chapter.id)}
                onCheckedChange={() => toggleChapter(chapter.id)}
              />
              <Label
                htmlFor={`chapter-${chapter.id}`}
                className="text-sm font-medium leading-none cursor-pointer flex-1"
              >
                Chapter {index + 1}: {chapter.title}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SelectChaptersTab;
