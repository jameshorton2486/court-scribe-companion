
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
}

const DocumentEnhancer: React.FC<DocumentEnhancerProps> = ({
  document,
  onDocumentEnhanced
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
      setStatusMessage('Preparing document enhancement...');
      
      // Calculate total batches (chapters / 3, rounded up)
      const calculatedTotalBatches = Math.ceil(document.chapters.length / 3);
      setTotalBatches(calculatedTotalBatches);
      
      logger.info('Starting document enhancement process', { 
        document: document.title,
        chapters: document.chapters.length,
        batches: calculatedTotalBatches
      });
      
      // Process document enhancement
      const result = await processDocumentEnhancement(
        document,
        enhancementPrompt,
        updateProgress,
        updateEnhancedChapters
      );
      
      if (result.length > 0) {
        // Create enhanced document with processed chapters
        const enhancedDocument: Document = {
          ...document,
          chapters: result
        };
        
        // Call the callback to update parent component
        onDocumentEnhanced(enhancedDocument);
        
        setStatusType('success');
        logger.info('Document enhancement completed successfully', {
          document: document.title,
          chaptersProcessed: result.length
        });
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
