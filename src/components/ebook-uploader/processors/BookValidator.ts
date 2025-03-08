
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { ChapterProcessingError } from './ErrorHandler';
import { processWithTiming } from './PerformanceMonitor';

// Function to validate book structure
export const validateBook = (book: Book): ChapterProcessingError[] => {
  return processWithTiming(() => {
    const errors: ChapterProcessingError[] = [];
    
    // Check basic book properties
    if (!book.title) {
      errors.push({
        code: 'MISSING_TITLE',
        message: 'Book title is missing'
      });
    }
    
    if (!book.chapters || book.chapters.length === 0) {
      errors.push({
        code: 'NO_CHAPTERS',
        message: 'Book has no chapters'
      });
    }
    
    // Detect large books for optimization
    const isLargeBook = book.chapters && book.chapters.length > 20;
    
    // Validate each chapter
    book.chapters.forEach((chapter, index) => {
      if (!chapter.title) {
        errors.push({
          code: 'CHAPTER_MISSING_TITLE',
          message: `Chapter ${index + 1} is missing a title`
        });
      }
      
      // For large books, only do basic content validation
      if (isLargeBook) {
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
      }
    });
    
    return errors;
  }, "book validation");
};
