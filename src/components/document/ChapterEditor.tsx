
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chapter } from './DocumentUploader';
import { toast } from 'sonner';
import { enhanceChapterContent } from './enhancer/EnhancementService';

interface ChapterEditorProps {
  chapter: Chapter;
  onChapterUpdated: (updatedChapter: Chapter) => void;
}

const ChapterEditor: React.FC<ChapterEditorProps> = ({ 
  chapter, 
  onChapterUpdated 
}) => {
  const [activeTab, setActiveTab] = useState('read');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementType, setEnhancementType] = useState<string>('grammar');
  const [enhancedContent, setEnhancedContent] = useState('');

  const handleEnhance = async () => {
    setIsEnhancing(true);
    
    try {
      // In a real app, this would call an API
      // For this simplified version, we'll simulate enhancement
      const result = await enhanceChapterContent(chapter.content, enhancementType);
      setEnhancedContent(result);
      
      toast.success(`Chapter enhanced with ${enhancementType} improvements`);
    } catch (error) {
      toast.error("Enhancement failed", {
        description: "Could not enhance chapter content"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const applyEnhancements = () => {
    const updatedChapter = {
      ...chapter,
      content: enhancedContent
    };
    
    onChapterUpdated(updatedChapter);
    setActiveTab('read');
    setEnhancedContent('');
    
    toast.success("Changes applied to chapter", {
      description: "The enhanced content has been saved"
    });
  };

  const renderChapterContent = (content: string) => {
    return (
      <div 
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{chapter.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="enhance">Enhance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="read" className="mt-4">
            {renderChapterContent(chapter.content)}
          </TabsContent>
          
          <TabsContent value="enhance" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Select 
                  value={enhancementType} 
                  onValueChange={setEnhancementType}
                  disabled={isEnhancing}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Enhancement Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grammar">Grammar Correction</SelectItem>
                    <SelectItem value="expand">Content Expansion</SelectItem>
                    <SelectItem value="clarity">Improve Clarity</SelectItem>
                    <SelectItem value="style">Professional Style</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleEnhance} 
                  disabled={isEnhancing}
                >
                  {isEnhancing ? "Enhancing..." : "Enhance Content"}
                </Button>
              </div>
              
              {enhancedContent && (
                <div className="space-y-4">
                  <div className="border p-4 rounded-md max-h-[400px] overflow-auto">
                    {renderChapterContent(enhancedContent)}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEnhancedContent('')}>
                      Discard
                    </Button>
                    <Button onClick={applyEnhancements}>
                      Apply Changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChapterEditor;
