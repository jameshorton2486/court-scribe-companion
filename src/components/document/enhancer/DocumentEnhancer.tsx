
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Document } from '../DocumentUploader';
import { testApiKey } from './EnhancementService';
import EnhancementController from './EnhancementController';
import ApiKeyTab from '../editor/ApiKeyTab';
import WordExporter from './WordExporter';

interface DocumentEnhancerProps {
  document: Document;
  onDocumentEnhanced: (enhancedDocument: Document) => void;
}

const DocumentEnhancer: React.FC<DocumentEnhancerProps> = ({ 
  document, 
  onDocumentEnhanced 
}) => {
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean | null>(null);
  const [enhancedDocument, setEnhancedDocument] = useState<Document | null>(null);
  
  useEffect(() => {
    // Check API key validity on component mount
    checkApiKey();
  }, []);
  
  const checkApiKey = async () => {
    const result = await testApiKey();
    setIsApiKeyValid(result.success);
  };
  
  const handleApiKeyChange = async () => {
    await checkApiKey();
  };
  
  const handleDocumentEnhanced = (updatedDocument: Document) => {
    setEnhancedDocument(updatedDocument);
    onDocumentEnhanced(updatedDocument);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Enhancer</CardTitle>
        <CardDescription>
          Rewrite and format your entire document with professional styling
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isApiKeyValid && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Key Required</AlertTitle>
            <AlertDescription>
              An OpenAI API key is required to enhance your document. Please enter a valid API key below.
            </AlertDescription>
            
            <div className="mt-4">
              <ApiKeyTab onApiKeyChanged={handleApiKeyChange} />
            </div>
          </Alert>
        )}
        
        {isApiKeyValid && (
          <>
            <div className="space-y-2">
              <h3 className="text-md font-medium">Document Information</h3>
              <p className="text-sm"><strong>Title:</strong> {document.title}</p>
              <p className="text-sm"><strong>Author:</strong> {document.author || 'Unknown'}</p>
              <p className="text-sm"><strong>Chapters:</strong> {document.chapters.length}</p>
            </div>
            
            <EnhancementController 
              document={document} 
              onDocumentEnhanced={handleDocumentEnhanced} 
            />
            
            {enhancedDocument && (
              <div className="flex justify-end">
                <WordExporter document={enhancedDocument} />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentEnhancer;
