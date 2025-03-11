
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { toast } from 'sonner';
import { BookOpen, SaveIcon, PencilIcon } from 'lucide-react';
import { 
  saveCustomBookPrompt, 
  getCustomBookPrompt,
  getAllCustomBookPrompts 
} from './EnhancementService';

interface CustomBookPromptProps {
  bookTitle: string;
  onPromptSelected: (prompt: string) => void;
}

const CustomBookPrompt: React.FC<CustomBookPromptProps> = ({ 
  bookTitle, 
  onPromptSelected 
}) => {
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [savedPrompts, setSavedPrompts] = useState<Record<string, string>>({});
  const [hasExistingPrompt, setHasExistingPrompt] = useState<boolean>(false);
  
  // Load existing prompt for this book if available
  useEffect(() => {
    loadExistingPrompt();
    loadAllSavedPrompts();
  }, [bookTitle]);
  
  const loadExistingPrompt = () => {
    const existingPrompt = getCustomBookPrompt(bookTitle);
    if (existingPrompt) {
      setCustomPrompt(existingPrompt);
      setHasExistingPrompt(true);
    } else {
      setHasExistingPrompt(false);
      // Set default template
      setCustomPrompt(`Prompt for AI Rewriting & Refinement of "${bookTitle}"
Objective:
Refine and enhance this book by improving readability, removing redundancies, strengthening transitions, and enhancing formatting consistency. Ensure it remains engaging, well-structured, and easy to navigate for readers.

Key Improvement Areas:
- Enhance Readability & Structure: Break up large blocks of text with subheadings, bullet points, and numbered lists.
- Improve section transitions so that concepts flow logically.
- Add introductory and summary paragraphs to each section for clarity.
- Standardize Formatting & Style: Ensure consistent use of formatting for examples and key terms.
- Improve Practical Applications: Add interactive examples and checklists where appropriate.

Write in a clear, engaging, and professional tone while maintaining the original voice and intent of the author.`);
    }
  };
  
  const loadAllSavedPrompts = () => {
    setSavedPrompts(getAllCustomBookPrompts());
  };
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
  };
  
  const handleSavePrompt = () => {
    if (!customPrompt.trim()) {
      toast.error('Prompt cannot be empty');
      return;
    }
    
    saveCustomBookPrompt(bookTitle, customPrompt);
    setHasExistingPrompt(true);
    toast.success('Book prompt saved', {
      description: 'Your custom prompt for this book has been saved'
    });
    loadAllSavedPrompts();
  };
  
  const handleUsePrompt = () => {
    if (!customPrompt.trim()) {
      toast.error('Prompt cannot be empty');
      return;
    }
    
    onPromptSelected(customPrompt);
    toast.success('Custom prompt applied', {
      description: 'Your custom book prompt is now being used for enhancement'
    });
  };
  
  const handleSelectSavedPrompt = (bookTitle: string) => {
    const promptToUse = savedPrompts[bookTitle];
    setCustomPrompt(promptToUse);
    toast.success('Prompt loaded', {
      description: `Loaded prompt from "${bookTitle}"`
    });
  };
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          <BookOpen className="mr-2 h-4 w-4" />
          {hasExistingPrompt 
            ? 'Edit Book-Specific Prompt' 
            : 'Create Book-Specific Prompt'}
        </Button>
      </DrawerTrigger>
      
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Book-Specific Enhancement Prompt</DrawerTitle>
            <DrawerDescription>
              Create a customized AI prompt specifically tailored for enhancing "{bookTitle}"
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4 pb-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-book-prompt">
                    Detailed Enhancement Instructions
                  </Label>
                  <Textarea
                    id="custom-book-prompt"
                    placeholder="Write detailed instructions for how the AI should enhance your document..."
                    value={customPrompt}
                    onChange={handlePromptChange}
                    className="min-h-[400px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about style, tone, formatting, and content improvements you want the AI to make.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleSavePrompt}
                  >
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save Prompt
                  </Button>
                  <Button 
                    onClick={handleUsePrompt}
                  >
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Use This Prompt
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Previously Saved Prompts</h4>
                
                {Object.keys(savedPrompts).length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No saved prompts found. Save a prompt to reuse it later.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {Object.keys(savedPrompts).map(title => (
                      <Card key={title} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium truncate">
                              {title}
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleSelectSavedPrompt(title)}
                            >
                              Use
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {savedPrompts[title].substring(0, 50)}...
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                <div className="pt-4">
                  <h4 className="text-sm font-medium">Tips for Effective Prompts</h4>
                  <ul className="text-xs text-muted-foreground list-disc list-inside mt-2 space-y-1">
                    <li>Begin with a clear objective statement</li>
                    <li>List specific areas to focus on</li>
                    <li>Include format preferences</li>
                    <li>Specify tone and style requirements</li>
                    <li>Mention any content that should not be changed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomBookPrompt;
