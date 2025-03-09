
import { Book } from './BookTypes';
import { ChapterProcessingError } from './ErrorHandler';
import { processWithTiming } from './PerformanceMonitor';

/**
 * Validates a book's structure and content
 * 
 * This function performs comprehensive validation of a book object, checking
 * for required fields, valid chapter structure, and content integrity.
 * 
 * @param book - The book object to validate
 * @returns Array of validation errors, empty if valid
 */
export const validateBook = (book: Book | null): ChapterProcessingError[] => {
  if (!book) {
    return [{
      code: 'INVALID_BOOK',
      message: 'Book is null or undefined'
    }];
  }
  
  return processWithTiming(() => {
    const errors: ChapterProcessingError[] = [];
    
    // Check basic book properties
    if (!book.id) {
      errors.push({
        code: 'MISSING_ID',
        message: 'Book ID is missing'
      });
    }
    
    if (!book.title) {
      errors.push({
        code: 'MISSING_TITLE',
        message: 'Book title is missing'
      });
    }
    
    if (!book.chapters || !Array.isArray(book.chapters)) {
      errors.push({
        code: 'INVALID_CHAPTERS',
        message: 'Book chapters are missing or not an array'
      });
      return errors; // Return early since we can't validate chapters
    }
    
    if (book.chapters.length === 0) {
      errors.push({
        code: 'NO_CHAPTERS',
        message: 'Book has no chapters'
      });
    }
    
    // Detect large books for optimization
    const isLargeBook = book.chapters && book.chapters.length > 20;
    const totalContentLength = book.chapters.reduce(
      (total, ch) => total + (ch.content?.length || 0), 
      0
    );
    const isVeryLargeContent = totalContentLength > 500000;
    
    // Validate each chapter
    book.chapters.forEach((chapter, index) => {
      if (!chapter.id) {
        errors.push({
          code: 'CHAPTER_MISSING_ID',
          message: `Chapter ${index + 1} is missing an ID`
        });
      }
      
      if (!chapter.title) {
        errors.push({
          code: 'CHAPTER_MISSING_TITLE',
          message: `Chapter ${index + 1} is missing a title`
        });
      }
      
      // For large books or very large content, only do basic content validation
      if (isLargeBook || isVeryLargeContent) {
        if (!chapter.content) {
          errors.push({
            code: 'CHAPTER_EMPTY_CONTENT',
            message: `Chapter "${chapter.title || index + 1}" has no content`
          });
        }
      } else {
        // More thorough validation for regular-sized books
        if (!chapter.content || chapter.content.trim().length < 10) {
          errors.push({
            code: 'CHAPTER_EMPTY_CONTENT',
            message: `Chapter "${chapter.title || index + 1}" has insufficient content`
          });
        }
        
        // Check for valid HTML structure in content
        if (chapter.content) {
          // Very basic HTML validation: check for unmatched tags
          const openingTags = (chapter.content.match(/<[^\/][^>]*>/g) || []).length;
          const closingTags = (chapter.content.match(/<\/[^>]*>/g) || []).length;
          
          if (openingTags !== closingTags) {
            errors.push({
              code: 'CHAPTER_INVALID_HTML',
              message: `Chapter "${chapter.title || index + 1}" has malformed HTML`
            });
          }
        }
      }
    });
    
    return errors;
  }, "book validation");
};

/**
 * Simplified version of validateBook that returns a boolean result
 * 
 * @param book - Book object to validate
 * @returns True if the book is valid, false otherwise
 */
export const isValidBook = (book: Book | null): boolean => {
  const errors = validateBook(book);
  return errors.length === 0;
};
