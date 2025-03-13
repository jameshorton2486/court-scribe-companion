
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhanceButton from './components/EnhanceButton';
import StatusIndicator from './components/StatusIndicator';
import PromptSelectionSection from './components/PromptSelectionSection';
import EnhancementProgress from './components/EnhancementProgress';
import SystemMonitor from './components/SystemMonitor';
import { Document } from '../DocumentUploader';

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

  // Helper function to map status to StatusIndicator type
  const mapStatusToIndicatorType = (status: 'idle' | 'loading' | 'enhancing' | 'complete' | 'error'): 'success' | 'error' | 'warning' | 'info' | 'loading' | 'idle' => {
    switch (status) {
      case 'loading': return 'loading';
      case 'enhancing': return 'info';
      case 'complete': return 'success';
      case 'error': return 'error';
      case 'idle':
      default: return 'idle';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Enhancement</CardTitle>
        <CardDescription>Upload and enhance your document with AI prompts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* We need to update how we use DocumentUploader based on its actual interface */}
        <div className="document-upload-section">
          <input
            type="file"
            accept=".txt,.docx,.md,.html"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file);
              }
            }}
            className="hidden"
            id="document-upload"
          />
          <label
            htmlFor="document-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
          >
            Upload Document
          </label>
        </div>
        
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
          text="Enhance Entire Document"
        />
        <EnhancementProgress 
          progress={enhancementProgress}
          isEnhancing={isEnhancing}
          currentBatch={currentBatch}
          totalBatches={totalBatches}
          statusMessage={statusMessage}
        />
        <StatusIndicator 
          status={mapStatusToIndicatorType(status)}
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
