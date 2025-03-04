
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ChapterContentProps {
  content: string;
  fontFamily?: string;
}

const ChapterContent: React.FC<ChapterContentProps> = ({ 
  content, 
  fontFamily = 'serif' 
}) => {
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

  // Map font family values to Tailwind classes
  const fontFamilyClass = {
    'serif': 'font-serif',
    'sans-serif': 'font-sans',
    'georgia': 'font-serif', // Fallback to serif
    'garamond': 'font-serif', // Fallback to serif
    'palatino': 'font-serif'  // Fallback to serif
  }[fontFamily] || 'font-serif';

  return (
    <div 
      ref={contentRef}
      className={cn(
        "reader-content prose prose-slate max-w-none dark:prose-invert",
        fontFamilyClass,
        "prose-headings:mb-4 prose-headings:mt-6",
        "prose-p:my-3 prose-p:leading-7",
        "prose-li:my-1",
        "prose-img:rounded-md"
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ChapterContent;
