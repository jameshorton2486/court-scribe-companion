
import { Chapter, Document } from './DocumentUploader';

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
  
  // Extract chapters from content
  const chapters = extractChapters(content);
  
  return {
    id,
    title,
    author: author || 'Unknown Author',
    chapters
  };
};

/**
 * Extract chapters from document content
 */
const extractChapters = (content: string): Chapter[] => {
  // Split content into lines
  const lines = content.split('\n');
  const chapters: Chapter[] = [];
  
  // Simple chapter detection (heading patterns)
  const chapterPatterns = [
    /^chapter\s+(\d+|[A-Z]+)[\s:]+(.+)$/i,  // "Chapter X: Title" or "Chapter X - Title"
    /^(\d+|[A-Z]+)[\s\.]+(.+)$/            // "1. Title" or "I. Title"
  ];
  
  let currentChapterTitle = 'Introduction';
  let currentChapterContent = '';
  let chapterCount = 0;
  
  // Function to add current chapter
  const addChapter = () => {
    if (currentChapterContent) {
      chapters.push({
        id: `ch-${chapterCount}`,
        title: currentChapterTitle,
        content: currentChapterContent.trim()
      });
      chapterCount++;
    }
  };
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if line is a chapter heading
    let isChapterHeading = false;
    
    for (const pattern of chapterPatterns) {
      const match = line.match(pattern);
      if (match) {
        // Save previous chapter
        addChapter();
        
        // Start new chapter
        currentChapterTitle = match[2] ? match[2].trim() : `Chapter ${match[1]}`;
        currentChapterContent = `<h2>${currentChapterTitle}</h2>\n`;
        isChapterHeading = true;
        break;
      }
    }
    
    // If not a chapter heading, add to current chapter
    if (!isChapterHeading) {
      // If this is the first content and no chapter yet, create default chapter
      if (chapters.length === 0 && !currentChapterContent) {
        currentChapterTitle = 'Introduction';
        currentChapterContent = `<h2>${currentChapterTitle}</h2>\n`;
      }
      
      // Add line to current chapter content
      currentChapterContent += `<p>${line}</p>\n`;
    }
  }
  
  // Add final chapter
  addChapter();
  
  // If no chapters were found, create a single chapter with all content
  if (chapters.length === 0) {
    chapters.push({
      id: 'ch-0',
      title: 'Content',
      content: `<h2>Content</h2>\n<p>${content}</p>`
    });
  }
  
  return chapters;
};
