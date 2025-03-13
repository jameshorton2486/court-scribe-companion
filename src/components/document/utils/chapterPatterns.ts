
/**
 * Patterns for detecting chapter and section headings in document content
 */

/**
 * Regular expression patterns for detecting different types of section headings
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
