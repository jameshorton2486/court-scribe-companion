
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Document, Chapter } from './DocumentUploader';
import DocumentUploader from './DocumentUploader';
import ChapterEditor from './ChapterEditor';
import ChapterList from './ChapterList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const DocumentManager = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);

  const handleDocumentLoaded = (loadedDocument: Document) => {
    setDocument(loadedDocument);
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setActiveChapter(chapter);
  };

  const handleChapterUpdated = (updatedChapter: Chapter) => {
    if (!document) return;
    
    const updatedChapters = document.chapters.map(ch => 
      ch.id === updatedChapter.id ? updatedChapter : ch
    );
    
    setDocument({
      ...document,
      chapters: updatedChapters
    });
    
    setActiveChapter(updatedChapter);
  };

  const handleBackToChapters = () => {
    setActiveChapter(null);
  };

  const handleSaveDocument = () => {
    if (!document) return;
    
    // In a real app, you would save to storage or server
    // For this simplified version, we'll just show a success message
    
    const jsonBlob = new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, '_')}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    toast.success("Document saved successfully", {
      description: "Your document has been saved as a JSON file"
    });
  };

  if (!document) {
    return <DocumentUploader onDocumentLoaded={handleDocumentLoaded} />;
  }

  if (activeChapter) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToChapters}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Chapters</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDocument}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            <span>Save Document</span>
          </Button>
        </div>
        
        <ChapterEditor 
          chapter={activeChapter}
          onChapterUpdated={handleChapterUpdated}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{document.title}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDocument}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            <span>Save Document</span>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Author: {document.author}
          </p>
          <p className="text-sm text-muted-foreground">
            {document.chapters.length} chapter(s)
          </p>
        </CardContent>
      </Card>
      
      <ChapterList 
        chapters={document.chapters}
        onChapterSelect={handleChapterSelect}
      />
    </div>
  );
};

export default DocumentManager;
