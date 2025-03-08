
import React, { useEffect, useState } from 'react';
import { parseGlossaryContent, isGlossaryContent } from './glossary/GlossaryParser';
import { renderGlossaryToHtml } from './glossary/GlossaryRenderer';

export function formatGlossaryContent(content: string): string {
  try {
    if (!isGlossaryContent(content)) {
      return content;
    }
    
    const glossary = parseGlossaryContent(content);
    return renderGlossaryToHtml(glossary);
  } catch (error) {
    console.error('Error formatting glossary:', error);
    return content; // Return original content if parsing fails
  }
}

interface GlossaryFormatterProps {
  content: string;
}

const GlossaryFormatter: React.FC<GlossaryFormatterProps> = ({ content }) => {
  const [formattedContent, setFormattedContent] = useState('');
  
  useEffect(() => {
    if (content && isGlossaryContent(content)) {
      setFormattedContent(formatGlossaryContent(content));
    } else {
      setFormattedContent(content);
    }
  }, [content]);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
  );
};

export default GlossaryFormatter;
