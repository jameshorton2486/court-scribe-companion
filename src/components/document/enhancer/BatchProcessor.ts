
import { Chapter } from '../DocumentUploader';
import { enhanceChapterContent, logEnhancementError } from './EnhancementService';

/**
 * Process a batch of chapters for enhancement
 * 
 * @param chapters Batch of chapters to process
 * @param apiKey OpenAI API key
 * @param customPrompt Optional custom prompt to guide enhancements
 * @returns Enhanced chapters
 */
export const processChapterBatch = async (
  chapters: Chapter[],
  apiKey: string,
  customPrompt?: string
): Promise<Chapter[]> => {
  if (!chapters || chapters.length === 0) {
    return [];
  }
  
  console.log(`Processing batch of ${chapters.length} chapters${customPrompt ? ' with custom prompt' : ''}`);
  
  // Process chapters in parallel for efficiency
  const enhancementPromises = chapters.map(async (chapter) => {
    try {
      // For main chapters (h2) and subsections (h3), determine enhancement type
      const enhancementType = chapter.level === 3 ? 'clarity' : 'style';
      
      // Process the chapter content with AI enhancement
      const enhancedContent = await enhanceChapterContent(
        chapter.content,
        enhancementType,
        customPrompt // Pass the custom prompt if provided
      );
      
      // Return enhanced chapter
      return {
        ...chapter,
        content: enhancedContent,
        isEnhanced: true
      };
    } catch (error) {
      // Log the error but return the original chapter to maintain document structure
      logEnhancementError(error, `Chapter ${chapter.title}`);
      return chapter;
    }
  });
  
  // Wait for all chapters to be processed
  return Promise.all(enhancementPromises);
};

/**
 * Process all chapters in batches
 * 
 * @param chapters All chapters to process
 * @param apiKey OpenAI API key
 * @param batchSize Number of chapters to process in each batch
 * @param onBatchComplete Callback for when a batch completes
 * @param customPrompt Optional custom prompt to guide enhancements
 * @returns Enhanced chapters
 */
export const processBatches = async (
  chapters: Chapter[],
  apiKey: string,
  batchSize: number,
  onBatchComplete?: (batch: Chapter[], batchIndex: number) => void,
  customPrompt?: string
): Promise<Chapter[]> => {
  if (!chapters || chapters.length === 0) {
    return [];
  }
  
  const totalBatches = Math.ceil(chapters.length / batchSize);
  console.log(`Processing ${chapters.length} chapters in ${totalBatches} batches`);
  
  let enhancedChapters: Chapter[] = [];
  
  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, chapters.length);
    const batch = chapters.slice(start, end);
    
    console.log(`Processing batch ${i + 1}/${totalBatches} with ${batch.length} chapters`);
    
    try {
      // Process the current batch
      const enhancedBatch = await processChapterBatch(batch, apiKey, customPrompt);
      enhancedChapters.push(...enhancedBatch);
      
      // Notify of batch completion
      if (onBatchComplete) {
        onBatchComplete(enhancedBatch, i);
      }
      
      // Add a small delay between batches to prevent API rate limits
      if (i < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      logEnhancementError(error, `Batch ${i + 1}`);
      // On error, add the original chapters to maintain document structure
      enhancedChapters.push(...batch);
    }
  }
  
  return enhancedChapters;
};
