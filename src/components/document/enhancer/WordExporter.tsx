
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { Document } from '../DocumentUploader';
import { formatForWordExport } from './BatchProcessor';
import { toast } from 'sonner';

interface WordExporterProps {
  document: Document;
}

const WordExporter: React.FC<WordExporterProps> = ({ document }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // In a real app, this would generate a Word document
      // For now, we'll just simulate a small delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For a real implementation, we would:
      // 1. Format each chapter
      // 2. Generate a Word document
      // 3. Download it to the user's device
      
      // Simulate processing each chapter
      console.log(`Exporting ${document.chapters.length} chapters to Word format`);
      document.chapters.forEach(chapter => {
        const formattedContent = formatForWordExport(chapter.content);
        console.log(`Chapter "${chapter.title}" formatted for Word export`);
      });
      
      // Simulate a successful export
      toast.success("Export Successful", {
        description: "Your document has been exported to Word format"
      });
    } catch (error) {
      console.error("Word export error:", error);
      toast.error("Export Failed", {
        description: "An error occurred while exporting to Word format"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button 
      variant="outline"
      onClick={handleExport}
      disabled={isExporting}
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
