
import React, { useMemo } from 'react';
import GlossaryFormatter from './GlossaryFormatter';
import { sanitizeHtml } from '@/utils/validationUtils';
import { isGlossaryContent } from './content-detection/contentTypeDetector';

interface ChapterContentProps {
  content: string;
}

/**
 * Renders chapter content with specialized formatting based on content type
 * 
 * This component analyzes the provided content and determines the appropriate
 * rendering approach. For regular content, it sanitizes the HTML and renders it directly.
 * For glossary-type content, it uses the specialized GlossaryFormatter.
 * 
 * @param content - The HTML content string to render
 */
const ChapterContent: React.FC<ChapterContentProps> = ({ content }) => {
  // Sanitize HTML content to prevent XSS
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    return sanitizeHtml(content);
  }, [content]);
  
  // Handle specific content types
  if (isGlossaryContent(sanitizedContent)) {
    return <GlossaryFormatter content={sanitizedContent} />;
  }
  
  // Render regular content with prose styling
  return (
    <div 
      className="prose prose-lg dark:prose-invert max-w-none" 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  );
};

export default ChapterContent;
