
/**
 * Chapter Pattern Detection Module
 * 
 * Provides regular expression patterns and utility functions for detecting
 * and processing chapter and section headings in document content.
 * 
 * @module chapterPatterns
 */

/**
 * Regular expression patterns for detecting different types of section headings
 * 
 * These patterns identify various heading formats including:
 * - "Chapter X: Title" format
 * - Numbered headings (e.g., "1. Title")
 * - Subsection headings (e.g., "1.1 Title")
 * - Appendix headings (e.g., "Appendix A: Title")
 * - Letter-based headings (e.g., "A. Title")
 * - Back matter and index headings
 */
export const sectionPatterns = [
  /^chapter\s+(\d+)[\s:]+(.+)$/i,            // "Chapter X: Title"
  /^(\d+)[\s\.]+(.+)$/,                       // "1. Title"
  /^(\d+\.\d+)[\s]+(.+)$/,                   // "1.1 Title" (subsection)
  /^appendix\s+([A-Z])[\s:\.]+(.+)$/i,       // "Appendix A: Title"
  /^([A-Z])[\s:\.]+(.+)$/,                   // "A. Title" (appendix style)
  /^back\s+matter:?\s*(.+)$/i,               // "Back Matter: Title"
  /^index:?\s*(.+)$/i,                       // "Index: Title"
];

/**
 * Check if a line appears to be a chapter or section heading
 * 
 * @param line - The text line to check
 * @param patterns - Array of RegExp patterns to match against
 * @returns True if the line matches any heading pattern, false otherwise
 */
export const isHeading = (line: string, patterns: RegExp[]): boolean => {
  for (const pattern of patterns) {
    if (line.match(pattern)) {
      return true;
    }
  }
  return false;
};

/**
 * Get chapter title based on match and section type
 * 
 * Formats the chapter title according to its type (regular chapter,
 * appendix, or back matter) and ensures consistent formatting.
 * 
 * @param match - The RegExp match result containing capture groups
 * @param isInAppendices - Whether the match is in the appendices section
 * @param isInBackMatter - Whether the match is in the back matter section
 * @returns Formatted chapter title
 */
export const getChapterTitle = (
  match: RegExpMatchArray, 
  isInAppendices: boolean, 
  isInBackMatter: boolean
): string => {
  if (isInAppendices) {
    return `Appendix ${match[1]}: ${match[2] || 'Untitled'}`;
  } else if (isInBackMatter) {
    return match[2] || match[1];
  } else {
    return `Chapter ${match[1]}: ${match[2]}`;
  }
};

/**
 * Get chapter content header with appropriate markup
 * 
 * Creates an HTML heading element for the chapter/section with appropriate
 * formatting based on the section type.
 * 
 * @param match - The RegExp match result containing capture groups
 * @param isInAppendices - Whether the match is in the appendices section
 * @param isInBackMatter - Whether the match is in the back matter section
 * @returns HTML heading element as a string
 */
export const getChapterContentHeader = (
  match: RegExpMatchArray, 
  isInAppendices: boolean, 
  isInBackMatter: boolean
): string => {
  if (isInAppendices) {
    return `<h2>Appendix ${match[1]}: ${match[2] || 'Untitled'}</h2>\n`;
  } else if (isInBackMatter) {
    return `<h2>${match[2] || match[1]}</h2>\n`;
  } else {
    return `<h2>Chapter ${match[1]}: ${match[2]}</h2>\n`;
  }
};
