
import React, { useMemo } from 'react';
import { parseGlossaryContent } from './glossary/GlossaryParser';
import { renderGlossaryToHtml } from './glossary/GlossaryRenderer';
import './glossary.css';

interface GlossaryFormatterProps {
  content: string;
}

/**
 * Component that formats glossary content with specialized rendering
 * 
 * Handles parsing of glossary entries and renders them with proper formatting
 * and structure for better readability.
 */
const GlossaryFormatter: React.FC<GlossaryFormatterProps> = ({ content }) => {
  // Parse the glossary content into structured data
  const glossaryItems = useMemo(() => {
    return parseGlossaryContent(content);
  }, [content]);
  
  // Create HTML string from glossary data
  const glossaryHtml = useMemo(() => {
    return renderGlossaryToHtml(glossaryItems);
  }, [glossaryItems]);
  
  // Render the glossary with specialized formatting
  return (
    <div 
      className="glossary-container prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: glossaryHtml }}
    />
  );
};

export default GlossaryFormatter;
