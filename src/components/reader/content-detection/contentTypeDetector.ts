
/**
 * Content type detection utilities
 * 
 * This module provides functions to analyze content and determine its type
 * (e.g., glossary, regular text, etc.), which helps in applying appropriate
 * formatting and display logic.
 */

/**
 * Determines if content appears to be a glossary based on formatting patterns
 * 
 * @param text - Text content to analyze
 * @returns Boolean indicating if the content resembles a glossary
 */
export const isGlossaryContent = (text: string): boolean => {
  if (!text) return false;
  
  // Look for patterns like roman numerals and numbered lists
  const containsRomanNumerals = /^[IVX]+\.\s+/m.test(text);
  const containsNumberedTerms = /^\d+\.\s+[A-Za-z]/m.test(text);
  const containsMultipleDefinitions = (text.match(/^\d+\.\s+[A-Za-z]/gm) || []).length > 3;
  
  return (containsRomanNumerals || containsNumberedTerms) && containsMultipleDefinitions;
};

/**
 * Determines if content appears to be a table of contents
 * 
 * @param text - Text content to analyze
 * @returns Boolean indicating if the content resembles a table of contents
 */
export const isTocContent = (text: string): boolean => {
  if (!text) return false;
  
  // Look for patterns common in table of contents
  const containsChapterHeaders = /chapter\s+\d+/i.test(text);
  const containsMultiplePages = /\.\s*\d+$/m.test(text);
  const containsMultipleEntries = (text.match(/\.\s*\d+$/gm) || []).length > 3;
  
  return (containsChapterHeaders || containsMultiplePages) && containsMultipleEntries;
};

/**
 * Determines the appropriate rendering mode for content
 * 
 * @param content - Text content to analyze
 * @returns String indicating the content type ('glossary', 'toc', 'regular')
 */
export const detectContentType = (content: string): 'glossary' | 'toc' | 'regular' => {
  if (isGlossaryContent(content)) {
    return 'glossary';
  } else if (isTocContent(content)) {
    return 'toc';
  } else {
    return 'regular';
  }
};

