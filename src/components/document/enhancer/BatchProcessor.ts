
import { Chapter } from '../DocumentUploader';
import { enhanceChapterContent } from './EnhancementService';

/**
 * Processes a batch of chapters using the AI enhancement service
 * 
 * @param chapters Array of chapters to process
 * @param apiKey OpenAI API key
 * @returns Array of enhanced chapters
 */
export const processChapterBatch = async (
  chapters: Chapter[],
  apiKey: string
): Promise<Chapter[]> => {
  console.log(`Processing batch of ${chapters.length} chapters`);
  
  const enhancementPromises = chapters.map(async (chapter) => {
    try {
      console.log(`Enhancing chapter: ${chapter.title}`);
      
      // First, enhance the content with grammar and clarity improvements
      const improvedContent = await enhanceChapterContent(chapter.content, 'grammar');
      
      // Then, enhance with professional style formatting
      const enhancedContent = await enhanceChapterContent(improvedContent, 'style');
      
      return {
        ...chapter,
        content: enhancedContent
      };
    } catch (error) {
      console.error(`Failed to enhance chapter "${chapter.title}":`, error);
      // Return the original chapter if enhancement fails
      return chapter;
    }
  });
  
  // Process all chapters in the batch concurrently
  return Promise.all(enhancementPromises);
};

/**
 * Formats the enhanced content for Word export
 * 
 * @param content HTML content to format
 * @returns Formatted content
 */
export const formatForWordExport = (content: string): string => {
  // This is a simplified version - in a real implementation,
  // this would apply proper Word-compatible formatting
  
  // Clean up any HTML artifacts that might cause issues in Word
  let formattedContent = content
    .replace(/<\/?span[^>]*>/g, '') // Remove span tags
    .replace(/<br\s*\/?>/g, '\n') // Replace <br> with newlines
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n') // Format paragraphs
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n') // Format headings
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
    .replace(/<\/?(em|i)>/g, '_') // Format italics
    .replace(/<\/?(strong|b)>/g, '**') // Format bold
    .replace(/<\/?(ul|ol|li)[^>]*>/g, '') // Remove list tags
    .replace(/<li>(.*?)<\/li>/g, '• $1\n') // Format list items
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&lt;/g, '<') // Replace HTML entities
    .replace(/&gt;/g, '>') 
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  return formattedContent;
};
