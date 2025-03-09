
/**
 * Detects if the provided text is likely to be glossary content
 * 
 * This detector looks for common patterns in glossary text such as
 * Roman numerals followed by periods or numbered terms.
 * 
 * @param text - The content to analyze
 * @returns boolean indicating if this appears to be glossary content
 */
export const isGlossaryContent = (text: string): boolean => {
  // Look for patterns like roman numerals and numbered lists
  const containsRomanNumerals = /^[IVX]+\.\s+/m.test(text);
  const containsNumberedTerms = /^\d+\.\s+[A-Za-z]/m.test(text);
  
  return containsRomanNumerals || containsNumberedTerms;
};

/**
 * Detects if the provided text is likely to be a table of contents
 * 
 * @param text - The content to analyze
 * @returns boolean indicating if this appears to be TOC content
 */
export const isTableOfContents = (text: string): boolean => {
  // Check if the text has multiple entries with page numbers
  const hasPageNumbers = /\.\s*\d+\s*$/m.test(text);
  const hasChapterHeadings = /^(chapter|section)\s+\d+/mi.test(text);
  
  return hasPageNumbers && hasChapterHeadings;
};

/**
 * Detects if the provided text is likely to be a bibliography
 * 
 * @param text - The content to analyze
 * @returns boolean indicating if this appears to be bibliography content
 */
export const isBibliography = (text: string): boolean => {
  // Check for common bibliography patterns
  const hasCitations = /^\s*\d+\.\s+[A-Z][a-z]+,\s+[A-Z]\./m.test(text);
  const hasReferences = /^references$/mi.test(text);
  
  return hasCitations || hasReferences;
};
