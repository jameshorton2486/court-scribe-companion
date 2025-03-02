
import React from 'react';

interface ChapterContentProps {
  content: string;
}

const ChapterContent: React.FC<ChapterContentProps> = ({ content }) => {
  return (
    <div 
      className="reader-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ChapterContent;
