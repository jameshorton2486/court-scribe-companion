
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chapter } from './DocumentUploader';
import ReadTab from './editor/ReadTab';
import EnhanceTab from './editor/EnhanceTab';
import ApiKeyTab from './editor/ApiKeyTab';

interface ChapterEditorProps {
  chapter: Chapter;
  onChapterUpdated: (updatedChapter: Chapter) => void;
}

const ChapterEditor: React.FC<ChapterEditorProps> = ({ 
  chapter, 
  onChapterUpdated 
}) => {
  const [activeTab, setActiveTab] = useState('read');

  const handleEnhancedContent = (enhancedContent: string) => {
    const updatedChapter = {
      ...chapter,
      content: enhancedContent
    };
    onChapterUpdated(updatedChapter);
    setActiveTab('read');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{chapter.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="enhance">Enhance</TabsTrigger>
            <TabsTrigger value="apikey">API Key</TabsTrigger>
          </TabsList>
          
          <TabsContent value="read" className="mt-4">
            <ReadTab chapter={chapter} />
          </TabsContent>
          
          <TabsContent value="enhance" className="mt-4">
            <EnhanceTab 
              chapter={chapter}
              onContentEnhanced={handleEnhancedContent}
            />
          </TabsContent>
          
          <TabsContent value="apikey" className="mt-4">
            <ApiKeyTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChapterEditor;
