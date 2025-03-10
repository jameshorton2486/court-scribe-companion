
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Chapter } from '../DocumentUploader';
import { enhanceChapterContent } from '../enhancer/EnhancementService';

interface EnhanceTabProps {
  chapter: Chapter;
  onContentEnhanced: (content: string) => void;
}

const EnhanceTab = ({ chapter, onContentEnhanced }: EnhanceTabProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementType, setEnhancementType] = useState<string>('grammar');
  const [enhancedContent, setEnhancedContent] = useState('');

  const handleEnhance = async () => {
    setIsEnhancing(true);
    
    try {
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

  const renderChapterContent = (content: string) => {
    return (
      <div 
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
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
          {isEnhancing ? 
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing...
            </> : 
            "Enhance Content"
          }
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
            <Button onClick={() => onContentEnhanced(enhancedContent)}>
              Apply Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhanceTab;
