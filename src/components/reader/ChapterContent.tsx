
import React, { useMemo } from 'react';
import GlossaryFormatter from './GlossaryFormatter';
import { sanitizeHtml } from '@/utils/validationUtils';

interface ChapterContentProps {
  content: string;
}

const ChapterContent: React.FC<ChapterContentProps> = ({ content }) => {
  const isGlossaryContent = (text: string): boolean => {
    // Look for patterns like roman numerals and numbered lists
    const containsRomanNumerals = /^[IVX]+\.\s+/m.test(text);
    const containsNumberedTerms = /^\d+\.\s+[A-Za-z]/m.test(text);
    
    return containsRomanNumerals || containsNumberedTerms;
  };
  
  // Sanitize HTML content to prevent XSS
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    return sanitizeHtml(content);
  }, [content]);
  
  // Handle specific content types
  if (isGlossaryContent(sanitizedContent)) {
    return <GlossaryFormatter content={sanitizedContent} />;
  }
  
  return (
    <div 
      className="prose prose-lg dark:prose-invert max-w-none" 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  );
};

export default ChapterContent;
