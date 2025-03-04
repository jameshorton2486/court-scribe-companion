
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book } from '@/components/ebook-uploader/BookProcessor';
import EnhancementOptions from './EnhancementOptions';
import EnhancementPreview from './EnhancementPreview';
import SelectChaptersTab from './SelectChaptersTab';
import { toast } from 'sonner';
import { enhanceBookContent } from './enhancementProcessor';

interface BookEnhancerProps {
  book: Book;
  onEnhancementComplete: (enhancedBook: Book) => void;
}

const BookEnhancer: React.FC<BookEnhancerProps> = ({ book, onEnhancementComplete }) => {
  const [enhancementType, setEnhancementType] = useState<'grammar' | 'content' | 'formatting'>('grammar');
  const [selectedChapters, setSelectedChapters] = useState<string[]>(book.chapters.map(ch => ch.id));
  const [enhancedBook, setEnhancedBook] = useState<Book | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewChapterId, setPreviewChapterId] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (selectedChapters.length === 0) {
      toast.error("Please select at least one chapter to enhance");
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call an API or use a library
      // For now, we'll use our simulated enhancement processor
      const enhanced = await enhanceBookContent(book, selectedChapters, enhancementType);
      
      setEnhancedBook(enhanced);
      setPreviewChapterId(enhanced.chapters[0].id);
      setCurrentStep(2);
      
      toast.success("Enhancement complete", {
        description: `Successfully enhanced ${selectedChapters.length} chapter(s).`
      });
    } catch (error) {
      toast.error("Enhancement failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyChanges = () => {
    if (enhancedBook) {
      onEnhancementComplete(enhancedBook);
      toast.success("Changes applied successfully", {
        description: "Your enhanced book is now ready."
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Book Enhancement Wizard</CardTitle>
        <CardDescription>
          Improve your book content with AI assistance. Choose the type of enhancements
          and which chapters to improve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentStep === 1 ? (
          <>
            <Tabs defaultValue="options" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="options">Enhancement Options</TabsTrigger>
                <TabsTrigger value="chapters">Select Chapters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="options">
                <EnhancementOptions 
                  enhancementType={enhancementType}
                  setEnhancementType={setEnhancementType}
                />
              </TabsContent>
              
              <TabsContent value="chapters">
                <SelectChaptersTab
                  chapters={book.chapters}
                  selectedChapters={selectedChapters}
                  setSelectedChapters={setSelectedChapters}
                />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <EnhancementPreview 
            originalBook={book}
            enhancedBook={enhancedBook!}
            previewChapterId={previewChapterId}
            setPreviewChapterId={setPreviewChapterId}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {currentStep === 1 ? (
          <>
            <Button variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleEnhance}
              disabled={isProcessing || selectedChapters.length === 0}
            >
              {isProcessing ? "Processing..." : "Enhance Content"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button onClick={handleApplyChanges}>
              Apply Changes
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookEnhancer;
