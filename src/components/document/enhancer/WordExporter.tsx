
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileDown, Loader2 } from 'lucide-react';
import { Document } from '../DocumentUploader';
import { formatForWordExport } from './BatchProcessor';

interface WordExporterProps {
  document: Document;
}

const WordExporter: React.FC<WordExporterProps> = ({ document }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToWord = async () => {
    try {
      setIsExporting(true);
      
      // Create a Word-compatible document
      let docContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${document.title}</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; }
    h1 { font-size: 18pt; font-weight: bold; margin-top: 24pt; margin-bottom: 6pt; }
    h2 { font-size: 16pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; }
    h3 { font-size: 14pt; font-weight: bold; margin-top: 14pt; margin-bottom: 4pt; }
    h4 { font-size: 13pt; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt; }
    p { margin: 6pt 0; }
  </style>
</head>
<body>
  <h1>${document.title}</h1>
  <p>By ${document.author || 'Unknown Author'}</p>
`;

      // Add each chapter and handle subsections
      document.chapters.forEach(chapter => {
        // Extract chapter number if it exists (e.g., "Chapter 3" or "3" from "3.1")
        const chapterMatch = chapter.title.match(/^(?:Chapter\s+)?(\d+)(?:\.\d+)?|^(\d+)(?:\.\d+)?/i);
        const isSubsection = chapter.title.match(/^\d+\.\d+/) !== null;
        
        if (isSubsection) {
          // This is a subsection (e.g., "3.1")
          docContent += `<h3>${chapter.title}</h3>`;
        } else {
          // This is a main chapter
          docContent += `<h2>${chapter.title}</h2>`;
        }
        
        docContent += formatForWordExport(chapter.content);
      });

      docContent += `</body></html>`;

      // Create a Blob with the document content
      const blob = new Blob([docContent], { type: 'application/msword' });
      
      // Create a download link using the browser's document object
      const link = window.document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      // Clean up the filename
      const safeTitle = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${safeTitle}.doc`;
      
      // Trigger the download
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast.success("Document Exported", {
        description: "Your enhanced document has been exported to Word format."
      });
    } catch (error) {
      console.error("Error exporting to Word:", error);
      toast.error("Export Failed", {
        description: "Could not export the document to Word format."
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={exportToWord} 
      disabled={isExporting}
      variant="outline"
      className="w-full md:w-auto"
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Export to Word
        </>
      )}
    </Button>
  );
};

export default WordExporter;
