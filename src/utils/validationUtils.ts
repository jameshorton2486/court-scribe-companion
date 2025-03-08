
import { Book } from '@/components/ebook-uploader/EbookUploader';

/**
 * Schema interface defining the expected structure of a valid book
 */
interface BookValidationSchema {
  id: string;
  title: string;
  chapters: { id: string; title: string; content: string }[];
}

/**
 * Validates that a book object has the correct structure and required properties
 * 
 * @param book - The book object to validate
 * @returns Boolean indicating if the book structure is valid
 */
export const validateBook = (book: any): boolean => {
  if (!book || typeof book !== 'object') return false;
  if (typeof book.id !== 'string' || !book.id) return false;
  if (typeof book.title !== 'string' || !book.title) return false;
  
  if (!Array.isArray(book.chapters)) return false;
  
  for (const chapter of book.chapters) {
    if (!chapter || typeof chapter !== 'object') return false;
    if (typeof chapter.id !== 'string' || !chapter.id) return false;
    if (typeof chapter.title !== 'string') return false;
    
    if (chapter.content && typeof chapter.content !== 'string') return false;
  }
  
  return true;
};

/**
 * Sanitizes HTML content by removing potentially dangerous scripts and event handlers
 * 
 * @param html - The HTML content to sanitize
 * @returns Sanitized HTML content
 */
export const sanitizeHtml = (html: string): string => {
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  return sanitized;
};
