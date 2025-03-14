
import { toast } from 'sonner';
import { Book } from '@/components/ebook-uploader/BookProcessor';
import { ChapterProcessingError } from '@/components/ebook-uploader/processors/ErrorHandler';
import { EnhancementOptions } from './types/enhancementTypes';
import { enhanceChapterContent } from './processors/chapterEnhancer';
import { safeApiCall } from './utils/enhancementUtils';
import { safeOperation, executeWithTiming } from '@/utils/errorHandlingUtils';

// Import the Chapter interface to ensure type compatibility
import { Chapter, ProcessingError } from '@/components/document/DocumentUploader';

/**
 * Enhances a book by processing selected chapters with specified enhancement options
 * 
 * This function coordinates the enhancement of multiple chapters within a book,
 * applying the configured enhancement options to each selected chapter.
 * It handles errors gracefully and provides user feedback throughout the process.
 * 
 * @param book - The book object containing chapters to enhance
 * @param selectedChapterIds - IDs of chapters to process
 * @param options - Enhancement configuration options
 * @returns Enhanced book with processed chapters
 */
export const enhanceBook = async (
  book: Book,
  selectedChapterIds: string[],
  options: EnhancementOptions
): Promise<Book> => {
  return safeOperation(async () => {
    const enhancedBook = { ...book };
    const enhancedChapters = [...book.chapters];
    const enhancementErrors: ChapterProcessingError[] = [];
    
    const timingResult = await executeWithTiming(async () => {
      // Process each chapter
      for (let i = 0; i < enhancedChapters.length; i++) {
        const chapter = enhancedChapters[i];
        
        if (!selectedChapterIds.includes(chapter.id)) {
          continue;
        }
        
        console.info(`Enhancing chapter: ${chapter.title}`);
        
        const result = await safeApiCall(
          () => enhanceChapterContent(chapter.content, options),
          `Failed to enhance chapter: ${chapter.title}`
        );
        
        if (result) {
          enhancedChapters[i] = {
            ...chapter,
            content: result.content,
          };
          
          if (result.errors && result.errors.length > 0) {
            // Add errors to chapter if the interface supports it
            if ('processingErrors' in chapter) {
              (enhancedChapters[i] as any).processingErrors = result.errors;
            }
            enhancementErrors.push(...result.errors);
          }
          
          if (result.warnings && result.warnings.length > 0) {
            console.warn(`Warnings for chapter "${chapter.title}":`, result.warnings);
          }
          
          toast.success(`Enhanced chapter: ${chapter.title}`, {
            description: result.processingTime ? 
              `Processed in ${(result.processingTime / 1000).toFixed(1)}s` : undefined
          });
        } else {
          enhancementErrors.push({
            message: `Failed to enhance chapter: ${chapter.title}`,
            code: 'ENHANCEMENT_FAILED'
          });
        }
      }
      
      return { enhancedChapters, enhancementErrors };
    }, 'Book enhancement');
    
    // Check if enhancement was successful
    if (timingResult) {
      enhancedBook.chapters = timingResult.result.enhancedChapters;
      
      if (timingResult.result.enhancementErrors.length > 0) {
        // Add errors to book if the interface supports it
        (enhancedBook as any).processingErrors = timingResult.result.enhancementErrors;
      }
      
      console.info(`Enhanced book in ${(timingResult.executionTime / 1000).toFixed(2)}s`);
      return enhancedBook;
    } else {
      throw new Error('Book enhancement failed');
    }
  }, 'Book enhancement', 'Failed to enhance book') as Promise<Book>;
};

// Export the types
export * from './types/enhancementTypes';

// Export everything needed for external use
export default {
  enhanceBook,
  enhanceChapterContent
};
