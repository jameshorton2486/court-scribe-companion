
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
    // Generate a simple ID based on title
    const id = title.toLowerCase().replace(/\s+/g, '-');
    
    // Basic chapter extraction (split by headings)
    const chapterRegex = /^#+\s+(.*?)$/gm;
    const contentLines = content.split('\n');
    
    const chapters: Chapter[] = [];
    let currentChapterTitle = '';
    let currentChapterContent = '';
    let chapterCount = 0;
    
    // Validate content structure before processing
    const hasHeadings = contentLines.some(line => line.match(/^#+\s+(.*?)$/));
    
    if (!hasHeadings) {
      console.warn("No chapter headings found in content, creating a single chapter");
    }
    
    contentLines.forEach(line => {
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
    });
    
    // Add the last chapter if it exists
    if (currentChapterTitle) {
      chapters.push({
        id: `ch${chapterCount}`,
        title: currentChapterTitle,
        content: currentChapterContent.trim()
      });
    }
    
    // If no chapters were found, create a single chapter
    if (chapters.length === 0) {
      console.info("Creating a single chapter from content without headings");
      chapters.push({
        id: 'ch0',
        title: title,
        content: `<h2>${title}</h2>\n<p>${content}</p>`
      });
    }

    // Log successful processing
    console.info(`Processed book with ${chapters.length} chapters`);
    
    return {
      id,
      title,
      author: author || 'Unknown Author',
      chapters
    };
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
  
  // Validate each chapter
  book.chapters.forEach((chapter, index) => {
    if (!chapter.title) {
      errors.push({
        code: 'CHAPTER_MISSING_TITLE',
        message: `Chapter ${index + 1} is missing a title`
      });
    }
    
    if (!chapter.content || chapter.content.trim().length < 10) {
      errors.push({
        code: 'CHAPTER_EMPTY_CONTENT',
        message: `Chapter "${chapter.title || index + 1}" has insufficient content`
      });
    }
  });
  
  return errors;
};
