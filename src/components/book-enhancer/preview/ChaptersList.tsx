
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check } from 'lucide-react';
import { Chapter } from '@/components/ebook-uploader/BookProcessor';

interface ChaptersListProps {
  chapters: Chapter[];
}

const ChaptersList: React.FC<ChaptersListProps> = ({ chapters }) => {
  if (chapters.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="h-28">
      <ul className="space-y-2">
        {chapters.map((chapter, index) => (
          <li key={chapter.id} className="text-sm flex items-start space-x-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <span className="font-medium">Chapter {index + 1}: {chapter.title}</span>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {chapter.content.replace(/<[^>]*>/g, '').substring(0, 60)}...
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};

export default ChaptersList;
