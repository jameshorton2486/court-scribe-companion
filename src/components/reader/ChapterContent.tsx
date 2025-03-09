
import React, { useMemo } from 'react';
import GlossaryFormatter from './GlossaryFormatter';
import { sanitizeHtml } from '@/utils/validationUtils';
import { detectContentType } from './content-detection/contentTypeDetector';

interface ChapterContentProps {
  content: string;
}

/**
 * Renders chapter content with specialized formatting based on content type
 * 
 * This component analyzes the provided content and determines the appropriate
 * rendering approach based on the content type (regular text, glossary, table of contents).
 * Different content types get rendered with specialized formatting components.
 * 
 * @param content - The HTML content string to render
 */
const ChapterContent: React.FC<ChapterContentProps> = ({ content }) => {
  // Sanitize HTML content to prevent XSS
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    return sanitizeHtml(content);
  }, [content]);
  
  // Detect content type for specialized rendering
  const contentType = useMemo(() => {
    return detectContentType(sanitizedContent);
  }, [sanitizedContent]);
  
  // Render different content types with appropriate components
  switch (contentType) {
    case 'glossary':
      return <GlossaryFormatter content={sanitizedContent} />;
      
    case 'toc':
      // Future enhancement: Add specialized TOC formatter
      return (
        <div className="prose prose-lg dark:prose-invert max-w-none toc-content">
          <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
      );
      
    case 'regular':
    default:
      // Render regular content with prose styling
      return (
        <div 
          className="prose prose-lg dark:prose-invert max-w-none" 
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
        />
      );
  }
};

export default ChapterContent;
