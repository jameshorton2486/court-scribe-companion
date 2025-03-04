
import React, { useEffect, useRef } from 'react';

interface ChapterContentProps {
  content: string;
}

const ChapterContent: React.FC<ChapterContentProps> = ({ content }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Apply syntax highlighting and other enhancements after render
  useEffect(() => {
    if (contentRef.current) {
      // You could add additional formatting or syntax highlighting here
      // For example, if you wanted to highlight code blocks or apply other styling
      
      // Add support for table of contents links
      const headings = contentRef.current.querySelectorAll('h2, h3, h4');
      headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.setAttribute('id', id);
      });
    }
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className="reader-content prose prose-slate max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ChapterContent;
