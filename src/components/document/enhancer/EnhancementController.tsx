
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Document, Chapter } from '../DocumentUploader';
import { getOpenAIApiKey } from './EnhancementService';
import { processChapterBatch } from './BatchProcessor';

interface EnhancementControllerProps {
  document: Document;
  onDocumentEnhanced: (enhancedDocument: Document) => void;
}

const EnhancementController: React.FC<EnhancementControllerProps> = ({ 
  document, 
  onDocumentEnhanced 
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [progress, setProgress] = useState(0);
  const [enhancedChapters, setEnhancedChapters] = useState<Chapter[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  
  const BATCH_SIZE = 3; // Process 3 chapters at a time to avoid API overload
  
  const calculateTotalBatches = (chapters: Chapter[]) => {
    return Math.ceil(chapters.length / BATCH_SIZE);
  };
  
  const enhanceDocument = async () => {
    const apiKey = getOpenAIApiKey();
    if (!apiKey) {
      toast.error("API Key Required", {
        description: "Please set your OpenAI API key in the API Key tab before enhancing the document."
      });
      return;
    }
    
    try {
      setIsEnhancing(true);
      setCurrentBatch(0);
      setEnhancedChapters([]);
      setProgress(0);
      
      const chaptersToProcess = [...document.chapters];
      const totalBatches = calculateTotalBatches(chaptersToProcess);
      setTotalBatches(totalBatches);
      
      console.log(`Starting document enhancement: ${chaptersToProcess.length} chapters in ${totalBatches} batches`);
      
      // Process chapters in batches
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        setCurrentBatch(batchIndex + 1);
        setStatusMessage(`Processing batch ${batchIndex + 1} of ${totalBatches}...`);
        
        const startIdx = batchIndex * BATCH_SIZE;
        const endIdx = Math.min(startIdx + BATCH_SIZE, chaptersToProcess.length);
        const currentBatchChapters = chaptersToProcess.slice(startIdx, endIdx);
        
        try {
          // Process the current batch
          const enhancedBatch = await processChapterBatch(currentBatchChapters, apiKey);
          
          // Update the enhanced chapters array
          setEnhancedChapters(prev => [...prev, ...enhancedBatch]);
          
          // Calculate progress
          const completedChapters = (batchIndex + 1) * BATCH_SIZE;
          const newProgress = Math.min(
            Math.round((completedChapters / chaptersToProcess.length) * 100),
            100
          );
          setProgress(newProgress);
          
          console.log(`Completed batch ${batchIndex + 1}/${totalBatches}: ${enhancedBatch.length} chapters processed`);
          
          // Add a short delay between batches to prevent API rate limits
          if (batchIndex < totalBatches - 1) {
            setStatusMessage(`Preparing next batch...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Error processing batch ${batchIndex + 1}:`, error);
          toast.error(`Error in batch ${batchIndex + 1}`, {
            description: "Some chapters couldn't be processed. Continuing with the next batch."
          });
          
          // Add the original chapters from this batch to maintain document structure
          setEnhancedChapters(prev => [...prev, ...currentBatchChapters]);
        }
      }
      
      // Create the enhanced document
      const enhancedDocument = {
        ...document,
        chapters: enhancedChapters
      };
      
      setStatusMessage('Document enhancement completed!');
      setProgress(100);
      
      // Export to Word format
      exportToWord(enhancedDocument);
      
      // Notify the parent component
      onDocumentEnhanced(enhancedDocument);
      
      toast.success("Document Enhancement Complete", {
        description: `All ${enhancedChapters.length} chapters have been enhanced and formatted.`
      });
    } catch (error) {
      console.error("Document enhancement failed:", error);
      toast.error("Enhancement Failed", {
        description: "An error occurred during the enhancement process."
      });
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const exportToWord = (enhancedDocument: Document) => {
    try {
      setStatusMessage('Preparing Word document...');
      
      // This will be implemented in the WordExporter component
      // For now, just log that we'd export it
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
  
  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Document Enhancement</h3>
        <p className="text-sm text-muted-foreground">
          Professionally rewrite and format your document chapter by chapter. This process uses AI to improve clarity, 
          fix formatting issues, and ensure professional style throughout the document.
        </p>
      </div>
      
      {isEnhancing && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Batch {currentBatch} of {totalBatches}
            </span>
            <span className="text-sm">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-center text-muted-foreground">{statusMessage}</p>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={enhanceDocument} 
          disabled={isEnhancing}
          className="w-full md:w-auto"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing Document...
            </>
          ) : (
            'Enhance Entire Document'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EnhancementController;
