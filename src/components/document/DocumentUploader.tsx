import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { processDocument, validateDocument } from './DocumentProcessor';

// Export interfaces for use in other components
export interface ProcessingError {
  code: string;
  message: string;
  details?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  processingErrors?: ProcessingError[];
}

export interface Document {
  id: string;
  title: string;
  author: string;
  chapters: Chapter[];
  processingErrors?: ProcessingError[];
}

const DocumentUploader: React.FC<{ onDocumentLoaded: (document: Document) => void }> = ({ onDocumentLoaded }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };
  
  const processUploadedDocument = useCallback(() => {
    setIsLoading(true);
    setUploadError(null);
    
    try {
      const validationResult = validateDocument(content);
      
      if (!validationResult.isValid) {
        toast.error("Document Validation Failed", {
          description: validationResult.messages.join(', ')
        });
        setUploadError(validationResult.messages.join(', '));
        return;
      }
      
      const document = processDocument(title, author, content);
      onDocumentLoaded(document);
      toast.success("Document processed successfully", {
        description: `${document.chapters.length} chapters extracted`
      });
      
    } catch (error: any) {
      console.error("Error processing document:", error);
      toast.error("Document Processing Failed", {
        description: error.message || 'An unexpected error occurred'
      });
      setUploadError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [title, author, content, onDocumentLoaded]);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const fileContent = event.target?.result;
      if (typeof fileContent === 'string') {
        setContent(fileContent);
        toast.success("File uploaded successfully", {
          description: file.name
        });
      } else {
        toast.error("Failed to read file content");
        setUploadError("Failed to read file content");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setUploadError("Failed to read file");
    };
    setIsLoading(true);
    setUploadError(null);
    reader.onloadend = () => {
      setIsLoading(false);
    };
    reader.readAsText(file);
  };
  
  return (
    <Card className="w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Document Uploader</CardTitle>
        <CardDescription>Upload your document to begin</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <label
                  htmlFor="upload-file"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select a file to upload
                </label>
              </div>
              <Input 
                type="file" 
                id="upload-file" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
              {uploadError && (
                <p className="text-sm text-red-500">Upload Error: {uploadError}</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="paste" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="document-title"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Document Title
                </label>
                <Input 
                  type="text" 
                  id="document-title" 
                  placeholder="Enter document title" 
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>
              
              <div className="space-y-2">
                <label
                  htmlFor="document-author"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Document Author (optional)
                </label>
                <Input 
                  type="text" 
                  id="document-author" 
                  placeholder="Enter author name" 
                  value={author}
                  onChange={handleAuthorChange}
                />
              </div>
              
              <div className="space-y-2">
                <label
                  htmlFor="document-content"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Document Content
                </label>
                <textarea
                  id="document-content"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Paste your document content here..."
                  value={content}
                  onChange={handleContentChange}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          onClick={processUploadedDocument} 
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? (
            <>
              Processing <span className="animate-spin ml-2">...</span>
            </>
          ) : (
            "Process Document"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentUploader;
