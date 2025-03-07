
import React from 'react';
import GlossaryFormatter from './GlossaryFormatter';

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
  
  if (isGlossaryContent(content)) {
    return <GlossaryFormatter content={content} />;
  }
  
  return <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />;
};

export default ChapterContent;
