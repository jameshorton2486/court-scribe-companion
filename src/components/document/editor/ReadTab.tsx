
import React from 'react';
import { Chapter } from '../DocumentUploader';

interface ReadTabProps {
  chapter: Chapter;
}

const ReadTab = ({ chapter }: ReadTabProps) => {
  const renderChapterContent = (content: string) => {
    return (
      <div 
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return renderChapterContent(chapter.content);
};

export default ReadTab;
