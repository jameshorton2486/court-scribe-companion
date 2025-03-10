
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Chapter } from './DocumentUploader';
import { toast } from 'sonner';
import { enhanceChapterContent, setOpenAIApiKey, testApiKey } from './enhancer/EnhancementService';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

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
  const [apiKey, setApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [testingApiKey, setTestingApiKey] = useState(false);

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

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("API Key Required", {
        description: "Please enter an OpenAI API key to test"
      });
      return;
    }

    setTestingApiKey(true);
    setApiKeyStatus(null);
    setOpenAIApiKey(apiKey);

    try {
      const result = await testApiKey();
      setApiKeyStatus(result);
      
      if (result.success) {
        toast.success("API Key Valid", {
          description: result.message
        });
      } else {
        toast.error("API Key Invalid", {
          description: result.message
        });
      }
    } catch (error) {
      setApiKeyStatus({
        success: false,
        message: "An error occurred while testing the API key"
      });
      toast.error("Connection Error", {
        description: "Could not test the API key. Please try again."
      });
    } finally {
      setTestingApiKey(false);
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
                    <Button onClick={applyEnhancements}>
                      Apply Changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="apikey" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Test OpenAI API Key</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your OpenAI API key to test the connection and enable AI enhancements.
                </p>
                
                <div className="flex space-x-2">
                  <Input
                    type="password"
                    placeholder="Enter OpenAI API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <Button 
                    onClick={handleTestApiKey}
                    disabled={testingApiKey}
                  >
                    {testingApiKey ? 
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </> : 
                      "Test Key"
                    }
                  </Button>
                </div>
              </div>
              
              {apiKeyStatus && (
                <Alert variant={apiKeyStatus.success ? "default" : "destructive"}>
                  {apiKeyStatus.success ? 
                    <CheckCircle className="h-4 w-4" /> : 
                    <XCircle className="h-4 w-4" />
                  }
                  <AlertTitle>
                    {apiKeyStatus.success ? "API Key Valid" : "API Key Invalid"}
                  </AlertTitle>
                  <AlertDescription>
                    {apiKeyStatus.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChapterEditor;
