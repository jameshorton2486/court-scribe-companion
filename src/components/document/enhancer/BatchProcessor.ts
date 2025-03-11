import { Chapter } from '../DocumentUploader';
import { enhanceChapterContent, logEnhancementError } from './EnhancementService';

/**
 * Process a batch of chapters with AI enhancement
 */
export const processChapterBatch = async (
  chapters: Chapter[],
  apiKey: string,
  enhancementPrompt: string
): Promise<Chapter[]> => {
  // Create a copy of the chapters to avoid mutating the original
  const enhancedChapters: Chapter[] = [];
  
  // Process each chapter
  for (const chapter of chapters) {
    try {
      // Enhance the chapter content
      const enhancedContent = await enhanceChapterContent(
        chapter.content,
        'style', // Default to style enhancement
        enhancementPrompt // Use the custom prompt
      );
      
      // Add the enhanced chapter to the result
      enhancedChapters.push({
        ...chapter,
        content: enhancedContent
      });
      
      // Add a small delay between chapters to prevent rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      logEnhancementError(error, `Processing chapter "${chapter.title}"`);
      
      // If enhancement fails, keep the original chapter
      enhancedChapters.push(chapter);
    }
  }
  
  return enhancedChapters;
};

/**
 * Formats content for Word export
 */
export const formatForWordExport = (content: string): string => {
  // In a real implementation, this would format the content for Word
  // For this simplified version, we just make some basic HTML formatting adjustments
  
  let formattedContent = content;
  
  // Ensure paragraph tags
  if (!formattedContent.startsWith('<p>')) {
    formattedContent = '<p>' + formattedContent;
  }
  if (!formattedContent.endsWith('</p>')) {
    formattedContent += '</p>';
  }
  
  // Fix common formatting issues
  formattedContent = formattedContent
    .replace(/<p>\s*<\/p>/g, '') // Remove empty paragraphs
    .replace(/([.!?:;,])([^\s\d"])/g, '$1 $2') // Add space after punctuation
    .replace(/<(\/?)h(\d)>/g, '<$1strong>') // Convert headings to strong for Word compatibility
    .replace(/<br\s*\/?>/g, '</p><p>') // Convert <br> to paragraphs
    .replace(/<hr\s*\/?>/g, '<p>---</p>'); // Convert <hr> to text separator
  
  // Add Word-specific metadata (this would be more sophisticated in a real implementation)
  const wordMetadata = `
    <meta name="author" content="Document Enhancer">
    <meta name="description" content="Enhanced document for Word export">
  `;
  
  return formattedContent;
};

/**
 * Process batches of chapters
 */
export const processBatches = async (
  chapters: Chapter[],
  apiKey: string,
  batchSize: number = 3,
  enhancementPrompt: string
): Promise<Chapter[]> => {
  const allEnhancedChapters: Chapter[] = [];
  
  // Process chapters in batches
  for (let i = 0; i < chapters.length; i += batchSize) {
    const batch = chapters.slice(i, i + batchSize);
    const enhancedBatch = await processChapterBatch(batch, apiKey, enhancementPrompt);
    allEnhancedChapters.push(...enhancedBatch);
    
    // Add a delay between batches
    if (i + batchSize < chapters.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return allEnhancedChapters;
};
