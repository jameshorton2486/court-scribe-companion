
import { toast } from 'sonner';

export type ChapterProcessingError = {
  message: string;
  code: string;
  details?: string;
};

export type Chapter = {
  id: string;
  title: string;
  content: string;
  processingErrors?: ChapterProcessingError[];
};

export type Book = {
  id: string;
  title: string;
  author: string;
  chapters: Chapter[];
  processingErrors?: ChapterProcessingError[];
};

// Error handling helper function
const handleProcessingError = (error: unknown): ChapterProcessingError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'PROCESSING_ERROR',
      details: error.stack
    };
  }
  return {
    message: 'Unknown error occurred',
    code: 'UNKNOWN_ERROR',
    details: String(error)
  };
};

// Performance monitoring
const processWithTiming = <T>(
  operation: () => T,
  operationName: string
): T => {
  const startTime = performance.now();
  
  try {
    const result = operation();
    const endTime = performance.now();
    const processingTime = endTime - startTime;
    
    if (processingTime > 500) {
      console.info(`Performance: ${operationName} took ${processingTime.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`Error in ${operationName} after ${(endTime - startTime).toFixed(2)}ms:`, error);
    throw error;
  }
};

// Helper to process content in chunks for large documents
const processLargeContent = (
  content: string,
  chunkSize: number = 10000,
  processor: (chunk: string) => string
): string => {
  // For small content, process directly
  if (content.length < chunkSize) {
    return processor(content);
  }
  
  console.info(`Processing large content in chunks (${content.length} chars)`);
  
  // For larger content, process in chunks
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    const chunk = content.substring(i, Math.min(i + chunkSize, content.length));
    chunks.push(processor(chunk));
    
    // Report progress for very large documents
    if (i > 0 && i % (chunkSize * 10) === 0) {
      console.info(`Processed ${i} of ${content.length} characters (${Math.round(i/content.length*100)}%)`);
    }
  }
  
  return chunks.join('');
};

export const processBookContent = (
  title: string, 
  author: string, 
  content: string
): Book | null => {
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
