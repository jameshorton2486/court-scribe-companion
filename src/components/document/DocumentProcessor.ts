
import { Chapter, Document } from './DocumentUploader';
import { fixEncodingIssues, detectEncodingIssues } from './utils/encodingUtils';
import { extractChapters } from './utils/chapterExtractor';

/**
 * Process document content into a structured document with chapters
 */
export const processDocument = (
  title: string,
  author: string,
  content: string
): Document => {
  // Generate a simple ID from title
  const id = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  
  // Fix encoding issues before processing
  const cleanedContent = fixEncodingIssues(content);
  
  // Extract chapters from content
  const chapters = extractChapters(cleanedContent);
  
  return {
    id,
    title,
    author: author || 'Unknown Author',
    chapters
  };
};

export { fixEncodingIssues, detectEncodingIssues };
