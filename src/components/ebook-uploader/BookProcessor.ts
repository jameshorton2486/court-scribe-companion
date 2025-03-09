
/**
 * Book Processor Module
 * 
 * This module handles the processing and conversion of text content
 * into structured book objects with chapters. It includes utilities
 * for parsing, optimizing, and validating book content.
 */

import { toast } from 'sonner';
import { ChapterProcessingError, handleProcessingError } from './processors/ErrorHandler';
import { processWithTiming, processLargeContent } from './processors/PerformanceMonitor';
import { validateBook as validateBookStructure } from './processors/BookValidator';

/**
 * Represents a chapter in a book
 */
export type Chapter = {
  /** Unique identifier for the chapter */
  id: string;
  /** Chapter title */
  title: string;
  /** Chapter content in HTML format */
  content: string;
  /** Optional array of processing errors encountered */
  processingErrors?: ChapterProcessingError[];
};

/**
 * Represents a book with metadata and chapters
 */
export type Book = {
  /** Unique identifier for the book */
  id: string;
  /** Book title */
  title: string;
  /** Book author */
  author: string;
  /** Array of chapters in the book */
  chapters: Chapter[];
  /** Optional array of processing errors encountered */
  processingErrors?: ChapterProcessingError[];
};

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
      
      // Basic chapter extraction (split by headings)
      const chapterRegex = /^#+\s+(.*?)$/gm;
      
      // Optimize for large content
      let contentLines: string[];
      
      if (isLargeContent) {
        // For large content, process line splitting in one operation
        // and avoid extra string manipulation
        contentLines = content.split('\n');
      } else {
        contentLines = content.split('\n');
      }
      
      const chapters: Chapter[] = [];
      let currentChapterTitle = '';
      let currentChapterContent = '';
      let chapterCount = 0;
      
      // Validate content structure before processing
      const hasHeadings = processWithTiming(() => {
        return contentLines.some(line => line.match(/^#+\s+(.*?)$/));
      }, "heading detection");
      
      if (!hasHeadings) {
        console.warn("No chapter headings found in content, creating a single chapter");
      }
      
      // Process content in a memory-efficient way
      processWithTiming(() => {
        const totalLines = contentLines.length;
        
        const processChunk = (startIdx: number, endIdx: number) => {
          for (let i = startIdx; i < endIdx; i++) {
            const line = contentLines[i];
            const chapterMatch = line.match(/^#+\s+(.*?)$/);
            
            if (chapterMatch) {
              // If we already have content, save the previous chapter
              if (currentChapterTitle) {
                chapters.push({
                  id: `ch${chapterCount}`,
                  title: currentChapterTitle,
                  content: currentChapterContent.trim()
                });
                chapterCount++;
              }
              
              // Start a new chapter
              currentChapterTitle = chapterMatch[1];
              currentChapterContent = `<h2>${currentChapterTitle}</h2>\n`;
            } else if (currentChapterTitle) {
              // Add to current chapter content
              currentChapterContent += line ? `<p>${line}</p>\n` : '';
            }
          }
        };
        
        if (isLargeContent) {
          // Process in chunks of 5000 lines for very large documents
          const chunkSize = 5000;
          for (let i = 0; i < totalLines; i += chunkSize) {
            const endIdx = Math.min(i + chunkSize, totalLines);
            processChunk(i, endIdx);
            
            // Log progress for very large documents
            if (i > 0 && i % (chunkSize * 2) === 0) {
              console.info(`Processed ${i} of ${totalLines} lines (${Math.round(i/totalLines*100)}%)`);
            }
          }
        } else {
          // Process all at once for smaller documents
          processChunk(0, totalLines);
        }
        
        // Add the last chapter if it exists
        if (currentChapterTitle) {
          chapters.push({
            id: `ch${chapterCount}`,
            title: currentChapterTitle,
            content: currentChapterContent.trim()
          });
        }
      }, "chapter processing");
      
      // If no chapters were found, create a single chapter
      if (chapters.length === 0) {
        console.info("Creating a single chapter from content without headings");
        
        // For large content, create a more efficient single chapter
        if (isLargeContent) {
          const formattedContent = processLargeContent(content, 20000, (chunk) => {
            return `<p>${chunk.replace(/\n/g, '</p>\n<p>')}</p>`;
          });
          
          chapters.push({
            id: 'ch0',
            title: title,
            content: `<h2>${title}</h2>\n${formattedContent}`
          });
        } else {
          chapters.push({
            id: 'ch0',
            title: title,
            content: `<h2>${title}</h2>\n<p>${content}</p>`
          });
        }
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
