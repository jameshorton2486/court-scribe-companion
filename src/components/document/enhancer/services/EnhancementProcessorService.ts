
/**
 * Enhancement Processor Service
 * 
 * Handles the enhancement of document content, processing chapters in batches
 * and applying different enhancement techniques based on configuration.
 */

import { Document, Chapter } from '../../DocumentUploader';
import { enhanceChapterContent } from './ContentEnhancementService';
import { logger } from '../../utils/loggingService';

/**
 * Process document enhancement in batches
 * 
 * @param document - The document to enhance
 * @param customPrompt - Optional custom enhancement prompt
 * @param updateProgress - Callback to update progress UI
 * @param updateEnhancedChapters - Callback to update enhanced chapters
 * @returns Enhanced chapters
 */
export const processDocumentEnhancement = async (
  document: Document,
  customPrompt?: string,
  updateProgress?: (batchIndex: number, progress: number, message: string) => void,
  updateEnhancedChapters?: (chapters: Chapter[]) => void
): Promise<Chapter[]> => {
  try {
    // Create a copy of the document chapters that we can modify
    const chaptersToProcess = [...document.chapters];
    const enhancedChapters: Chapter[] = [];
    
    // Skip chapters that should be excluded from enhancement
    const eligibleChapters = chaptersToProcess.filter(chapter => !chapter.excludeFromEnhancement);
    
    // Process chapters in batches of 3 for better UI feedback
    const batchSize = 3;
    const totalBatches = Math.ceil(eligibleChapters.length / batchSize);
    
    // Add skipped chapters to results immediately - they won't be enhanced
    const skippedChapters = chaptersToProcess.filter(chapter => chapter.excludeFromEnhancement);
    enhancedChapters.push(...skippedChapters);
    
    logger.info('Starting document enhancement', {
      totalChapters: chaptersToProcess.length,
      eligibleChapters: eligibleChapters.length,
      skippedChapters: skippedChapters.length,
      batchSize,
      totalBatches
    });
    
    // Process eligible chapters in batches
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, eligibleChapters.length);
      const currentBatch = eligibleChapters.slice(start, end);
      
      if (updateProgress) {
        updateProgress(
          batchIndex + 1, 
          (batchIndex / totalBatches) * 100, 
          `Processing batch ${batchIndex + 1} of ${totalBatches}...`
        );
      }
      
      logger.info(`Processing batch ${batchIndex + 1} of ${totalBatches}`, {
        chaptersInBatch: currentBatch.length
      });
      
      // Process chapters in parallel for better performance
      const batchPromises = currentBatch.map(async (chapter) => {
        try {
          const startTime = Date.now();
          
          // Choose enhancement type based on chapter title/content
          const enhancementType = determineEnhancementType(chapter);
          
          logger.info(`Enhancing chapter "${chapter.title}"`, {
            chapterId: chapter.id,
            enhancementType,
            contentLength: chapter.content.length
          });
          
          // Enhance chapter content
          const enhancedContent = await enhanceChapterContent(
            chapter.content,
            enhancementType,
            customPrompt
          );
          
          const enhancedChapter: Chapter = {
            ...chapter,
            content: enhancedContent
          };
          
          const duration = Date.now() - startTime;
          logger.info(`Enhanced chapter "${chapter.title}" (${duration}ms)`, {
            chapterId: chapter.id
          });
          
          return enhancedChapter;
        } catch (error) {
          logger.error(`Error enhancing chapter "${chapter.title}"`, {
            error,
            chapterId: chapter.id
          });
          
          // Return the original chapter if enhancement fails
          return chapter;
        }
      });
      
      // Wait for all chapters in this batch to be processed
      const enhancedBatch = await Promise.all(batchPromises);
      enhancedChapters.push(...enhancedBatch);
      
      // Update progress after each batch is complete
      if (updateProgress) {
        updateProgress(
          batchIndex + 1, 
          ((batchIndex + 1) / totalBatches) * 100, 
          `Completed batch ${batchIndex + 1} of ${totalBatches}`
        );
      }
      
      // Update the enhanced chapters in the UI as they're processed
      if (updateEnhancedChapters) {
        // Sort the chapters to maintain the original order
        const sortedChapters = [...enhancedChapters].sort((a, b) => {
          const indexA = chaptersToProcess.findIndex(c => c.id === a.id);
          const indexB = chaptersToProcess.findIndex(c => c.id === b.id);
          return indexA - indexB;
        });
        
        updateEnhancedChapters(sortedChapters);
      }
    }
    
    // Make sure the chapters are in the original order
    const finalEnhancedChapters = [...enhancedChapters].sort((a, b) => {
      const indexA = chaptersToProcess.findIndex(c => c.id === a.id);
      const indexB = chaptersToProcess.findIndex(c => c.id === b.id);
      return indexA - indexB;
    });
    
    logger.info('Document enhancement completed', {
      chaptersProcessed: eligibleChapters.length,
      totalEnhancedChapters: finalEnhancedChapters.length
    });
    
    return finalEnhancedChapters;
  } catch (error) {
    logger.error('Error in document enhancement process', { error });
    throw error;
  }
};

/**
 * Determine the best enhancement type based on chapter content
 * 
 * @param chapter - The chapter to analyze
 * @returns Enhancement type to apply
 */
const determineEnhancementType = (chapter: Chapter): string => {
  const title = chapter.title.toLowerCase();
  const content = chapter.content.toLowerCase();
  
  // Apply content-specific enhancement strategies
  if (
    title.includes('introduction') || 
    title.includes('overview') ||
    title.includes('preface')
  ) {
    return 'style';
  }
  
  if (
    content.includes('example') ||
    content.includes('case study') ||
    content.includes('for instance')
  ) {
    return 'clarity';
  }
  
  if (
    title.includes('conclusion') ||
    title.includes('summary')
  ) {
    return 'expand';
  }
  
  // Default enhancement type
  return 'grammar';
};

// Export other utility functions as needed
export { enhanceChapterContent };
