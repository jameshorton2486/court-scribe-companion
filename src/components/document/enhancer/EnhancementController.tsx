import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Document, Chapter } from '../DocumentUploader';
import { getOpenAIApiKey, getCustomBookPrompt, getPromptTemplates } from './EnhancementService';
import EnhancementProgress from './components/EnhancementProgress';
import EnhanceButton from './components/EnhanceButton';
import PromptSelectionSection from './components/PromptSelectionSection';
import { 
  calculateTotalBatches, 
  processDocumentEnhancement, 
  exportToWord 
} from './services/EnhancementProcessorService';

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
  const [enhancementPrompt, setEnhancementPrompt] = useState(getPromptTemplates()[0].prompt);
  
  // Check for existing custom prompt on load
  useEffect(() => {
    const savedPrompt = getCustomBookPrompt(document.title);
    if (savedPrompt) {
      setEnhancementPrompt(savedPrompt);
      toast.info("Book-specific prompt loaded", {
        description: "A custom prompt for this book was found and loaded"
      });
    }
  }, [document.title]);
  
  const updateProgress = (batchIndex: number, newProgress: number, message: string) => {
    setCurrentBatch(batchIndex);
    setProgress(newProgress);
    setStatusMessage(message);
  };
  
  const updateEnhancedChapters = (chapters: Chapter[]) => {
    setEnhancedChapters(chapters);
  };
  
  const enhanceDocument = async () => {
    try {
      setIsEnhancing(true);
      setCurrentBatch(0);
      setEnhancedChapters([]);
      setProgress(0);
      
      const chaptersToProcess = [...document.chapters];
      const totalBatches = calculateTotalBatches(chaptersToProcess);
      setTotalBatches(totalBatches);
      
      const enhancedChapters = await processDocumentEnhancement(
        document,
        enhancementPrompt,
        updateProgress,
        updateEnhancedChapters
      );
      
      if (enhancedChapters.length > 0) {
        // Create the enhanced document
        const enhancedDocument = {
          ...document,
          chapters: enhancedChapters
        };
        
        // Export to Word format
        exportToWord(enhancedDocument);
        
        // Notify the parent component
        onDocumentEnhanced(enhancedDocument);
        
        toast.success("Document Enhancement Complete", {
          description: `All ${enhancedChapters.length} chapters have been enhanced and formatted.`
        });
      }
    } catch (error) {
      console.error("Document enhancement failed:", error);
      toast.error("Enhancement Failed", {
        description: "An error occurred during the enhancement process."
      });
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const handlePromptChange = (prompt: string) => {
    setEnhancementPrompt(prompt);
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
      
      <PromptSelectionSection 
        bookTitle={document.title}
        enhancementPrompt={enhancementPrompt}
        onPromptChange={handlePromptChange}
      />
      
      <EnhancementProgress 
        isEnhancing={isEnhancing}
        currentBatch={currentBatch}
        totalBatches={totalBatches}
        progress={progress}
        statusMessage={statusMessage}
      />
      
      <EnhanceButton 
        isEnhancing={isEnhancing}
        onEnhance={enhanceDocument}
      />
    </div>
  );
};

// Import this from PromptService to avoid circular dependencies
const getPromptTemplates = () => {
  return [
    {
      id: 'default',
      name: 'Standard Enhancement',
      description: 'Basic document enhancement focusing on grammar, clarity, and style.',
      prompt: 'Enhance this document by improving grammar, clarity, and professional style while maintaining the original meaning and content structure.'
    },
    // ... other templates would be here
  ];
};

export default EnhancementController;
