import React, { useState } from 'react';
import DocumentUploader, { Document, Chapter } from './DocumentUploader';
import ChapterList from './ChapterList';
import ChapterEditor from './ChapterEditor';
import DocumentEnhancer from './enhancer/DocumentEnhancer';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DocumentManager: React.FC = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<string>("chapters");
  const [selectedChaptersForEnhancement, setSelectedChaptersForEnhancement] = useState<string[]>([]);

  const handleDocumentLoaded = (doc: Document) => {
    setDocument(doc);
    setSelectedChapter(null);
    setSelectedChaptersForEnhancement([]);
    toast.success("Document processed successfully", {
      description: `${doc.chapters.length} chapters extracted`
    });
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
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

    setSelectedChapter(updatedChapter);
    
    toast.success("Chapter updated", {
      description: "Changes have been saved to the document"
    });
  };

  const handleDocumentEnhanced = (enhancedDocument: Document) => {
    setDocument(enhancedDocument);
    setSelectedChapter(null);
    setActiveTab("chapters");
    setSelectedChaptersForEnhancement([]);
    
    toast.success("Document enhanced", {
      description: "The document has been professionally rewritten and formatted"
    });
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
  };

  const toggleChapterSelection = (chapterId: string) => {
    if (selectedChaptersForEnhancement.includes(chapterId)) {
      setSelectedChaptersForEnhancement(
        selectedChaptersForEnhancement.filter(id => id !== chapterId)
      );
    } else {
      setSelectedChaptersForEnhancement([...selectedChaptersForEnhancement, chapterId]);
    }
  };

  const handleSelectAllChapters = () => {
    if (!document) return;
    
    if (selectedChaptersForEnhancement.length === document.chapters.length) {
      setSelectedChaptersForEnhancement([]);
    } else {
      setSelectedChaptersForEnhancement(document.chapters.map(ch => ch.id));
    }
  };

  return (
    <div className="space-y-8">
      {!document && (
        <DocumentUploader onDocumentLoaded={handleDocumentLoaded} />
      )}
      
      {document && !selectedChapter && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{document.title}</h2>
            <p className="text-muted-foreground">By {document.author || "Unknown Author"}</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
              <TabsTrigger value="enhance">Enhance Document</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chapters" className="pt-4">
              <ChapterList 
                chapters={document.chapters} 
                onChapterSelect={handleChapterSelect}
                selectedChapters={activeTab === "enhance" ? selectedChaptersForEnhancement : []}
                onChapterToggle={activeTab === "enhance" ? toggleChapterSelection : undefined}
              />
            </TabsContent>
            
            <TabsContent value="enhance" className="pt-4">
              <div className="mb-4 flex items-center justify-between bg-muted p-4 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium mb-1">Section Selection</h3>
                  <p className="text-xs text-muted-foreground">
                    Select sections to enhance or leave all unselected to enhance the entire document
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAllChapters}
                >
                  {selectedChaptersForEnhancement.length === document.chapters.length 
                    ? "Deselect All" 
                    : "Select All"}
                </Button>
              </div>
              
              <ChapterList 
                chapters={document.chapters} 
                onChapterSelect={handleChapterSelect}
                selectedChapters={selectedChaptersForEnhancement}
                onChapterToggle={toggleChapterSelection}
                selectionMode={true}
              />
              
              <DocumentEnhancer 
                document={document}
                onDocumentEnhanced={handleDocumentEnhanced}
                selectedChapterIds={selectedChaptersForEnhancement.length > 0 
                  ? selectedChaptersForEnhancement 
                  : undefined}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {document && selectedChapter && (
        <div className="space-y-4">
          <Button 
            onClick={handleBackToChapters}
            variant="ghost"
            className="text-sm flex items-center hover:underline p-0"
          >
            ← Back to chapters
          </Button>
          
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
