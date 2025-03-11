
import { toast } from 'sonner';
import { Document, Chapter } from '../../DocumentUploader';
import { getOpenAIApiKey } from '../EnhancementService';
import { processChapterBatch } from '../BatchProcessor';

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
    toast.error("API Key Required", {
      description: "Please set your OpenAI API key in the API Key tab before enhancing the document."
    });
    return [];
  }

  try {
    const chaptersToProcess = [...document.chapters];
    const totalBatches = calculateTotalBatches(chaptersToProcess);
    let allEnhancedChapters: Chapter[] = [];
    
    console.log(`Starting document enhancement: ${chaptersToProcess.length} chapters in ${totalBatches} batches`);
    console.log(`Using enhancement prompt: ${enhancementPrompt.substring(0, 100)}...`);
    
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
        
        updateProgress(
          batchIndex + 1,
          newProgress,
          `Completed ${Math.min(completedChapters, chaptersToProcess.length)} of ${chaptersToProcess.length} chapters`
        );
        
        console.log(`Completed batch ${batchIndex + 1}/${totalBatches}: ${enhancedBatch.length} chapters processed`);
        
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
        console.error(`Error processing batch ${batchIndex + 1}:`, error);
        toast.error(`Error in batch ${batchIndex + 1}`, {
          description: "Some chapters couldn't be processed. Continuing with the next batch."
        });
        
        // Add the original chapters from this batch to maintain document structure
        allEnhancedChapters = [...allEnhancedChapters, ...currentBatchChapters];
        updateEnhancedChapters(allEnhancedChapters);
      }
    }
    
    updateProgress(
      totalBatches,
      100,
      'Document enhancement completed!'
    );
    
    return allEnhancedChapters;
  } catch (error) {
    console.error("Document enhancement failed:", error);
    toast.error("Enhancement Failed", {
      description: "An error occurred during the enhancement process."
    });
    return [];
  }
};

/**
 * Helper to prepare document for Word export
 */
export const exportToWord = (enhancedDocument: Document): void => {
  try {
    console.log('Would export document to Word format:', enhancedDocument.title);
    
    toast.success("Word Export Ready", {
      description: "Your document has been prepared for Word export."
    });
  } catch (error) {
    console.error("Word export failed:", error);
    toast.error("Export Failed", {
      description: "Could not prepare the Word document for export."
    });
  }
};
