
import React, { useState, useEffect } from 'react';
import DocumentUploader from '../DocumentUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhanceButton from './components/EnhanceButton';
import StatusIndicator from './components/StatusIndicator';
import PromptSelectionSection from './components/PromptSelectionSection';
import EnhancementProgress from './components/EnhancementProgress';
import SystemMonitor from './components/SystemMonitor';

interface EnhancementControllerProps {
  onDocumentUpload: (file: File) => void;
  onEnhance: (selectedPrompts: string[]) => Promise<void>;
  enhancementProgress: number;
  isEnhancing: boolean;
  status: 'idle' | 'loading' | 'enhancing' | 'complete' | 'error';
  availablePrompts: string[];
  selectedPrompts: string[];
  onSelectPrompt: (prompt: string) => void;
  onDeselectPrompt: (prompt: string) => void;
  errorMessage?: string;
  currentBatch?: number;
  totalBatches?: number;
  statusMessage?: string;
}

const EnhancementController: React.FC<EnhancementControllerProps> = ({
  onDocumentUpload,
  onEnhance,
  enhancementProgress,
  isEnhancing,
  status,
  availablePrompts,
  selectedPrompts,
  onSelectPrompt,
  onDeselectPrompt,
  errorMessage,
  currentBatch = 0,
  totalBatches = 0,
  statusMessage = "",
}) => {
  const [uploadedDocumentName, setUploadedDocumentName] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'complete' || status === 'error') {
      // Reset selected prompts when enhancement is complete or has an error
      // This might not be the desired behavior, so consider removing if needed
    }
  }, [status]);

  const handleFileUpload = (file: File) => {
    setUploadedDocumentName(file.name);
    onDocumentUpload(file);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Enhancement</CardTitle>
        <CardDescription>Upload and enhance your document with AI prompts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DocumentUploader onFileUpload={handleFileUpload} />
        {uploadedDocumentName && (
          <p>Uploaded Document: {uploadedDocumentName}</p>
        )}
        <PromptSelectionSection
          onPromptSelected={(prompt: string) => {
            // Parse the prompt and update selected prompts
            const promptsArray = prompt.split(",").map(p => p.trim());
            // Clear existing prompts
            [...selectedPrompts].forEach(p => onDeselectPrompt(p));
            // Add new prompts
            promptsArray.forEach(p => onSelectPrompt(p));
          }}
          enhancementPrompt={selectedPrompts.join(", ")}
          disabled={false}
          bookTitle={uploadedDocumentName || undefined}
        />
        <EnhanceButton
          isEnhancing={isEnhancing}
          onEnhance={() => onEnhance(selectedPrompts)}
        />
        <EnhancementProgress 
          progress={enhancementProgress}
          isEnhancing={isEnhancing}
          currentBatch={currentBatch}
          totalBatches={totalBatches}
          statusMessage={statusMessage}
        />
        <StatusIndicator 
          status={status === 'loading' ? 'loading' : 
                 status === 'enhancing' ? 'info' : 
                 status === 'complete' ? 'success' : 
                 status === 'error' ? 'error' : 'idle'}
          message={errorMessage || statusMessage || "Ready"}
        />
        <SystemMonitor />
      </CardContent>
      <CardFooter>
        {errorMessage && (
          <p className="text-red-500">Error: {errorMessage}</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default EnhancementController;
