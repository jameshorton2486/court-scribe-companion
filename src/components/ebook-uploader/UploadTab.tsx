
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UploadTabProps {
  title: string;
  setTitle: (title: string) => void;
  author: string;
  setAuthor: (author: string) => void;
  setContent: (content: string) => void;
}

const UploadTab = ({ title, setTitle, author, setAuthor, setContent }: UploadTabProps) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setContent(text);
      toast.success("File uploaded successfully", {
        description: "The content has been loaded into the text area for editing."
      });
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Error reading file", {
        description: "Please make sure the file is a valid text file."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-input rounded-lg p-12">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-muted mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Upload an e-book file</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".txt,.md,.html"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="mb-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
          <p className="text-xs text-muted-foreground">
            Supported formats: .txt, .md, .html
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="upload-title" className="text-sm font-medium">
              E-book Title
            </label>
            <input
              id="upload-title"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Enter e-book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="upload-author" className="text-sm font-medium">
              Author (Optional)
            </label>
            <input
              id="upload-author"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTab;
