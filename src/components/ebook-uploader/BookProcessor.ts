
import { toast } from 'sonner';

export type Chapter = {
  id: string;
  title: string;
  content: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  chapters: Chapter[];
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
      chapters.push({
        id: 'ch0',
        title: title,
        content: `<h2>${title}</h2>\n<p>${content}</p>`
      });
    }

    return {
      id,
      title,
      author: author || 'Unknown Author',
      chapters
    };
  } catch (error) {
    console.error("Error processing content:", error);
    toast.error("Error processing content", {
      description: "There was a problem converting your content to an e-book format."
    });
    return null;
  }
};
