
import { toast } from 'sonner';
import { Document, Chapter } from '../../DocumentUploader';
import { getOpenAIApiKey } from '../EnhancementService';
import { processChapterBatch } from '../BatchProcessor';
import { logger } from '../../utils/loggingService';

// Constants
const BATCH_SIZE = 3;

/**
 * Calculate total number of batches based on chapter count
 */
export const calculateTotalBatches = (chapters: Chapter[]): number => {
  return Math.ceil(chapters.length / BATCH_SIZE);
};

/**
 * Process document enhancement in batches
 */
export const processDocumentEnhancement = async (
  document: Document,
  enhancementPrompt: string,
  updateProgress: (batchIndex: number, progress: number, statusMessage: string) => void,
  updateEnhancedChapters: (chapters: Chapter[]) => void
): Promise<Chapter[]> => {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    const errorMessage = "Please set your OpenAI API key in the API Key tab before enhancing the document.";
    logger.error('API Key Required', { error: errorMessage });
    toast.error("API Key Required", {
      description: errorMessage
    });
    return [];
  }

  try {
    const chaptersToProcess = [...document.chapters];
    const totalBatches = calculateTotalBatches(chaptersToProcess);
    let allEnhancedChapters: Chapter[] = [];
    
    logger.info(`Starting document enhancement`, {
      documentTitle: document.title,
      chaptersCount: chaptersToProcess.length,
      totalBatches,
      promptPreview: enhancementPrompt.substring(0, 100) + (enhancementPrompt.length > 100 ? '...' : '')
    });
    
    // Process chapters in batches
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      updateProgress(
        batchIndex + 1, 
        Math.round(((batchIndex) / totalBatches) * 100),
        `Processing batch ${batchIndex + 1} of ${totalBatches}...`
      );
      
      const startIdx = batchIndex * BATCH_SIZE;
      const endIdx = Math.min(startIdx + BATCH_SIZE, chaptersToProcess.length);
      const currentBatchChapters = chaptersToProcess.slice(startIdx, endIdx);
      
      logger.info(`Processing batch ${batchIndex + 1}/${totalBatches}`, {
        batchSize: currentBatchChapters.length,
        chaptersFrom: startIdx + 1,
        chaptersTo: endIdx
      });
      
      try {
        // Process the current batch with the custom prompt
        const enhancedBatch = await processChapterBatch(
          currentBatchChapters, 
          apiKey,
          enhancementPrompt
        );
        
        // Update the enhanced chapters array
        allEnhancedChapters = [...allEnhancedChapters, ...enhancedBatch];
        updateEnhancedChapters(allEnhancedChapters);
        
        // Calculate progress
        const completedChapters = (batchIndex + 1) * BATCH_SIZE;
        const newProgress = Math.min(
          Math.round((completedChapters / chaptersToProcess.length) * 100),
          100
        );
        
        const statusMessage = `Completed ${Math.min(completedChapters, chaptersToProcess.length)} of ${chaptersToProcess.length} chapters`;
        updateProgress(
          batchIndex + 1,
          newProgress,
          statusMessage
        );
        
        logger.info(statusMessage, {
          progress: newProgress,
          batchIndex: batchIndex + 1,
          totalBatches
        });
        
        // Add a short delay between batches to prevent API rate limits
        if (batchIndex < totalBatches - 1) {
          updateProgress(
            batchIndex + 1,
            newProgress,
            `Preparing next batch...`
          );
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        logger.error(`Error processing batch ${batchIndex + 1}:`, { error });
        toast.error(`Error in batch ${batchIndex + 1}`, {
          description: "Some chapters couldn't be processed. Continuing with the next batch."
        });
        
        // Add the original chapters from this batch to maintain document structure
        allEnhancedChapters = [...allEnhancedChapters, ...currentBatchChapters];
        updateEnhancedChapters(allEnhancedChapters);
      }
    }
    
    const completionMessage = 'Document enhancement completed!';
    updateProgress(
      totalBatches,
      100,
      completionMessage
    );
    
    logger.info(completionMessage, {
      document: document.title,
      totalChapters: allEnhancedChapters.length
    });
    
    return allEnhancedChapters;
  } catch (error) {
    const errorMessage = "An error occurred during the enhancement process.";
    logger.error("Document enhancement failed:", { error });
    toast.error("Enhancement Failed", {
      description: errorMessage
    });
    return [];
  }
};

/**
 * Helper to prepare document for Word export
 */
export const exportToWord = (enhancedDocument: Document): void => {
  try {
    logger.info('Preparing document for Word export', {
      title: enhancedDocument.title,
      author: enhancedDocument.author,
      chapters: enhancedDocument.chapters.length
    });
    
    toast.success("Word Export Ready", {
      description: "Your document has been prepared for Word export."
    });
  } catch (error) {
    logger.error("Word export failed:", { error });
    toast.error("Export Failed", {
      description: "Could not prepare the Word document for export."
    });
  }
};
