
import React, { useState } from 'react';
import DocumentUploader, { Document, Chapter } from './DocumentUploader';
import ChapterList from './ChapterList';
import ChapterEditor from './ChapterEditor';
import { toast } from 'sonner';

const DocumentManager: React.FC = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const handleDocumentUploaded = (doc: Document) => {
    setDocument(doc);
    setSelectedChapter(null);
    toast.success("Document processed successfully", {
      description: `${doc.chapters.length} chapters extracted`
    });
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const handleChapterUpdated = (updatedChapter: Chapter) => {
    if (!document) return;

    // Update the chapter in the document
    const updatedChapters = document.chapters.map(ch => 
      ch.id === updatedChapter.id ? updatedChapter : ch
    );

    setDocument({
      ...document,
      chapters: updatedChapters
    });

    setSelectedChapter(updatedChapter);
    
    toast.success("Chapter updated", {
      description: "Changes have been saved to the document"
    });
  };

  return (
    <div className="space-y-8">
      {!document && (
        <DocumentUploader onDocumentLoaded={handleDocumentUploaded} />
      )}
      
      {document && !selectedChapter && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{document.title}</h2>
            <p className="text-muted-foreground">By {document.author}</p>
          </div>
          
          <ChapterList 
            chapters={document.chapters} 
            onChapterSelect={handleChapterSelect} 
          />
        </div>
      )}
      
      {document && selectedChapter && (
        <div className="space-y-4">
          <button 
            onClick={() => setSelectedChapter(null)}
            className="text-sm flex items-center hover:underline"
          >
            ← Back to chapters
          </button>
          
          <ChapterEditor 
            chapter={selectedChapter}
            onChapterUpdated={handleChapterUpdated}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentManager;
