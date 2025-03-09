
/**
 * Chapter Processor Module
 * 
 * This module handles the processing and extraction of chapters from text content.
 * It includes utilities for parsing headings, creating chapters, and formatting content.
 */

import { processWithTiming, processLargeContent } from './PerformanceMonitor';
import { ChapterProcessingError } from './ErrorHandler';

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
 * Extracts chapters from raw text content based on headings
 * 
 * @param contentLines - Array of content lines to process
 * @param isLargeContent - Whether the content is considered large (for optimization)
 * @returns Array of extracted chapters
 */
export const extractChapters = (
  contentLines: string[],
  isLargeContent: boolean
): Chapter[] => {
  return processWithTiming(() => {
    let chapters: Chapter[] = [];
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
    
    return chapters;
  }, "chapter processing");
};

/**
 * Creates a single chapter from content without headings
 * 
 * @param title - The title to use for the single chapter
 * @param content - The content to include in the chapter
 * @param isLargeContent - Whether to apply optimizations for large content
 * @returns A single chapter object
 */
export const createSingleChapter = (
  title: string,
  content: string,
  isLargeContent: boolean
): Chapter => {
  // For large content, create a more efficient single chapter
  if (isLargeContent) {
    const formattedContent = processLargeContent(content, 20000, (chunk) => {
      return `<p>${chunk.replace(/\n/g, '</p>\n<p>')}</p>`;
    });
    
    return {
      id: 'ch0',
      title: title,
      content: `<h2>${title}</h2>\n${formattedContent}`
    };
  } else {
    return {
      id: 'ch0',
      title: title,
      content: `<h2>${title}</h2>\n<p>${content}</p>`
    };
  }
};
