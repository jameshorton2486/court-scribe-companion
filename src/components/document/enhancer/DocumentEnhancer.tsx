
import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import EnhanceButton from './components/EnhanceButton';
import EnhancementProgress from './components/EnhancementProgress';
import StatusIndicator from './components/StatusIndicator';
import PromptSelectionSection from './components/PromptSelectionSection';
import { Document, Chapter } from '../DocumentUploader';
import { processDocumentEnhancement } from './services/EnhancementProcessorService';
import { logger } from '../utils/loggingService';
import SystemMonitor from './components/SystemMonitor';

interface DocumentEnhancerProps {
  document: Document;
  onDocumentEnhanced: (enhancedDocument: Document) => void;
  selectedChapterIds?: string[];
}

const DocumentEnhancer: React.FC<DocumentEnhancerProps> = ({
  document,
  onDocumentEnhanced,
  selectedChapterIds
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedChapters, setEnhancedChapters] = useState<Chapter[]>([]);
  const [enhancementPrompt, setEnhancementPrompt] = useState<string>('');
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState('enhance');

  const updateProgress = useCallback((batchIndex: number, progressValue: number, message: string) => {
    setCurrentBatch(batchIndex);
    setProgress(progressValue);
    setStatusMessage(message);
  }, []);

  const updateEnhancedChapters = useCallback((chapters: Chapter[]) => {
    setEnhancedChapters(chapters);
  }, []);

  const handleEnhance = async () => {
    if (isEnhancing) return;
    
    try {
      setIsEnhancing(true);
      setStatusType('loading');
      setProgress(0);
      
      // Filter chapters if specific chapters are selected
      let chaptersToProcess = document.chapters;
      if (selectedChapterIds && selectedChapterIds.length > 0) {
        chaptersToProcess = document.chapters.filter(chapter => 
          selectedChapterIds.includes(chapter.id)
        );
        setStatusMessage(`Preparing to enhance ${chaptersToProcess.length} selected sections...`);
        
        logger.info('Starting targeted document enhancement', { 
          document: document.title,
          selectedChapters: selectedChapterIds.length,
          totalChapters: document.chapters.length
        });
      } else {
        setStatusMessage('Preparing complete document enhancement...');
        
        logger.info('Starting complete document enhancement', { 
          document: document.title,
          chapters: document.chapters.length
        });
      }
      
      // Calculate total batches (chapters / 3, rounded up)
      const calculatedTotalBatches = Math.ceil(chaptersToProcess.length / 3);
      setTotalBatches(calculatedTotalBatches);
      
      // Create a document with only the chapters to process
      const documentToProcess: Document = {
        ...document,
        chapters: chaptersToProcess
      };
      
      // Process document enhancement
      const enhancedChaptersResult = await processDocumentEnhancement(
        documentToProcess,
        enhancementPrompt,
        updateProgress,
        updateEnhancedChapters
      );
      
      if (enhancedChaptersResult.length > 0) {
        let finalChapters: Chapter[];
        
        // If we're only enhancing specific chapters, we need to merge them back with the original chapters
        if (selectedChapterIds && selectedChapterIds.length > 0) {
          finalChapters = document.chapters.map(originalChapter => {
            const enhancedChapter = enhancedChaptersResult.find(ec => ec.id === originalChapter.id);
            return enhancedChapter || originalChapter;
          });
          
          logger.info('Selective enhancement completed', {
            document: document.title,
            enhancedChapters: enhancedChaptersResult.length,
            totalChapters: document.chapters.length
          });
        } else {
          // If enhancing all chapters, just use the enhanced result
          finalChapters = enhancedChaptersResult;
          
          logger.info('Complete document enhancement completed', {
            document: document.title,
            chaptersProcessed: enhancedChaptersResult.length
          });
        }
        
        // Create enhanced document with processed chapters
        const enhancedDocument: Document = {
          ...document,
          chapters: finalChapters
        };
        
        // Call the callback to update parent component
        onDocumentEnhanced(enhancedDocument);
        
        setStatusType('success');
      } else {
        setStatusType('error');
        setStatusMessage('Enhancement failed. Please check API key and try again.');
        logger.error('Document enhancement returned no results');
      }
    } catch (error) {
      setStatusType('error');
      setStatusMessage('An error occurred during enhancement');
      logger.error('Enhancement process failed with error', { error });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="enhance">Enhance Document</TabsTrigger>
          <TabsTrigger value="monitor">System Monitor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enhance" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Enhancement Options</h3>
            
            {selectedChapterIds && selectedChapterIds.length > 0 ? (
              <div className="mb-4 p-3 bg-accent rounded-md">
                <p className="text-sm font-medium">Enhancing {selectedChapterIds.length} selected section(s)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Only the selected sections will be enhanced. The rest of the document will remain unchanged.
                </p>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-accent rounded-md">
                <p className="text-sm font-medium">Enhancing entire document</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All {document.chapters.length} sections will be enhanced.
                </p>
              </div>
            )}
            
            <PromptSelectionSection
              onPromptSelected={setEnhancementPrompt}
              disabled={isEnhancing}
            />
            
            {statusType !== 'idle' && (
              <div className="mt-6">
                <StatusIndicator 
                  status={statusType}
                  message={statusType === 'success' ? 'Enhancement Complete' : statusType === 'error' ? 'Enhancement Failed' : 'Enhancing Document'}
                  description={statusMessage}
                />
              </div>
            )}
            
            <div className="mt-6">
              <EnhancementProgress
                isEnhancing={isEnhancing}
                currentBatch={currentBatch}
                totalBatches={totalBatches}
                progress={progress}
                statusMessage={statusMessage}
              />
            </div>
            
            <div className="mt-6">
              <EnhanceButton
                isEnhancing={isEnhancing}
                onEnhance={handleEnhance}
              />
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitor">
          <SystemMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentEnhancer;
