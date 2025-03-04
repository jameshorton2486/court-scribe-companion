
import React from 'react';
import { Book, Chapter } from '@/components/ebook-uploader/BookProcessor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnhancementPreviewProps {
  originalBook: Book;
  enhancedBook: Book;
  previewChapterId: string | null;
  setPreviewChapterId: (id: string | null) => void;
}

const EnhancementPreview: React.FC<EnhancementPreviewProps> = ({
  originalBook,
  enhancedBook,
  previewChapterId,
  setPreviewChapterId
}) => {
  // Find the current chapter in both original and enhanced versions
  const originalChapter = originalBook.chapters.find(ch => ch.id === previewChapterId);
  const enhancedChapter = enhancedBook.chapters.find(ch => ch.id === previewChapterId);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 items-start sm:items-center justify-between">
        <Label htmlFor="chapter-select" className="text-sm font-medium">
          Preview Chapter:
        </Label>
        <Select
          value={previewChapterId || ''}
          onValueChange={(value) => setPreviewChapterId(value)}
        >
          <SelectTrigger id="chapter-select" className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select a chapter to preview" />
          </SelectTrigger>
          <SelectContent>
            {enhancedBook.chapters.map((chapter, index) => (
              <SelectItem key={chapter.id} value={chapter.id}>
                Chapter {index + 1}: {chapter.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {originalChapter && enhancedChapter && (
        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="original">Original</TabsTrigger>
            <TabsTrigger value="enhanced">Enhanced</TabsTrigger>
            <TabsTrigger value="comparison">Side by Side</TabsTrigger>
          </TabsList>
          
          <TabsContent value="original">
            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert" 
                dangerouslySetInnerHTML={{ __html: originalChapter.content }} 
              />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="enhanced">
            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert" 
                dangerouslySetInnerHTML={{ __html: enhancedChapter.content }} 
              />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="comparison">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-2">Original</div>
                <ScrollArea className="h-[400px] border rounded-md p-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert" 
                    dangerouslySetInnerHTML={{ __html: originalChapter.content }} 
                  />
                </ScrollArea>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Enhanced</div>
                <ScrollArea className="h-[400px] border rounded-md p-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert" 
                    dangerouslySetInnerHTML={{ __html: enhancedChapter.content }} 
                  />
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EnhancementPreview;
