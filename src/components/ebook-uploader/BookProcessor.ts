
/**
 * Book Processor Module
 * 
 * This module handles the processing and conversion of text content
 * into structured book objects with chapters. It includes utilities
 * for parsing, optimizing, and validating book content.
 */

import { toast } from 'sonner';
import { ChapterProcessingError, handleProcessingError } from './processors/ErrorHandler';
import { processWithTiming } from './processors/PerformanceMonitor';
import { validateBook as validateBookStructure } from './processors/BookValidator';
import { extractChapters, createSingleChapter, Chapter } from './processors/ChapterProcessor';
import { Book } from './processors/BookTypes';

// Re-export types for backwards compatibility
export type { Chapter, Book };

/**
 * Processes raw text content into a structured book object
 * 
 * This function handles the conversion of text content into a well-structured
 * book with chapters. It includes optimizations for large documents, error handling,
 * and performance monitoring.
 * 
 * @param title - The title of the book
 * @param author - The author of the book
 * @param content - The raw text content to process
 * @returns A structured Book object or null if processing failed
 */
export const processBookContent = (
  title: string, 
  author: string, 
  content: string
): Book | null => {
  // Validate inputs
  if (!title.trim()) {
    toast.error("Please enter a title for your ebook");
    return null;
  }

  if (!content.trim()) {
    toast.error("Please enter content for your ebook");
    return null;
  }

  try {
    // Detect large content
    const isLargeContent = content.length > 50000;
    
    if (isLargeContent) {
      console.info(`Processing large document (${content.length} characters)`);
      toast.info("Processing large document", { 
        description: "This may take a moment...",
        duration: 3000
      });
    }
    
    return processWithTiming(() => {
      // Generate a simple ID based on title
      const id = title.toLowerCase().replace(/\s+/g, '-');
      
      // Split content into lines for processing
      let contentLines: string[];
      
      if (isLargeContent) {
        // For large content, process line splitting in one operation
        contentLines = content.split('\n');
      } else {
        contentLines = content.split('\n');
      }
      
      // Extract chapters from content
      let chapters = extractChapters(contentLines, isLargeContent);
      
      // If no chapters were found, create a single chapter
      if (chapters.length === 0) {
        console.info("Creating a single chapter from content without headings");
        chapters.push(createSingleChapter(title, content, isLargeContent));
      }

      // Log successful processing
      console.info(`Processed book with ${chapters.length} chapters`);
      
      // For large books, add detailed log
      if (isLargeContent) {
        let totalContentSize = 0;
        chapters.forEach(ch => totalContentSize += ch.content.length);
        console.info(`Total processed content size: ${(totalContentSize / 1024).toFixed(2)}KB in ${chapters.length} chapters`);
      }
      
      return {
        id,
        title,
        author: author || 'Unknown Author',
        chapters
      };
    }, "book processing");
  } catch (error) {
    console.error("Error processing content:", error);
    
    // Create a structured error object
    const processingError = handleProcessingError(error);
    
    // Show user-friendly error toast
    toast.error("Error processing content", {
      description: processingError.message
    });
    
    // Return null to indicate processing failure
    return null;
  }
};

// Re-export validateBook from the validator module
export const validateBook = validateBookStructure;
