
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { processDocument } from './DocumentProcessor';

export type Document = {
  id: string;
  title: string;
  author: string;
  chapters: Chapter[];
};

export type Chapter = {
  id: string;
  title: string;
  content: string;
};

interface DocumentUploaderProps {
  onDocumentLoaded: (document: Document) => void;
}

const DocumentUploader = ({ onDocumentLoaded }: DocumentUploaderProps) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      
      // Auto-populate title from filename if empty
      if (!title) {
        const fileName = e.target.files[0].name.replace(/\.\w+$/, '');
        setTitle(fileName);
      }
    }
  };

  const handleProcess = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title for your document");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Read file content
      const text = await readFileContent(file);
      
      // Process document
      const document = processDocument(title, author, text);
      
      if (document) {
        onDocumentLoaded(document);
        toast.success("Document processed successfully", {
          description: `Created ${document.chapters.length} chapter(s) from your document.`
        });
      }
    } catch (error) {
      console.error("Error processing document:", error);
      toast.error("Failed to process document", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      
      reader.onerror = () => reject(new Error("File read error"));
      
      if (file.type === 'application/pdf') {
        // For PDF files, we would need PDF.js or similar library
        // This is a simplified version so we'll show an error
        reject(new Error("PDF processing is not supported in this simplified demo"));
      } else {
        // For text files, DOCX would need additional processing in real app
        reader.readAsText(file);
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Document Title</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter document title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="author">Author (Optional)</Label>
          <Input 
            id="author" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file">Upload File</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Input
              id="file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".txt,.docx,.md,.html"
            />
            <Label htmlFor="file" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />
              {file ? (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">
                  Click to select a document file (.txt, .docx, .md, .html)
                </span>
              )}
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleProcess}
          disabled={isProcessing || !file}
          className="w-full"
        >
          {isProcessing ? "Processing..." : "Process Document"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentUploader;
