
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CustomPromptEditorProps {
  customPromptEnabled: boolean;
  customTitle: string;
  customPrompt: string;
  onCustomTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CustomPromptEditor: React.FC<CustomPromptEditorProps> = ({
  customPromptEnabled,
  customTitle,
  customPrompt,
  onCustomTitleChange,
  onCustomPromptChange
}) => {
  if (!customPromptEnabled) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="custom-title">Custom Enhancement Title</Label>
        <Input
          id="custom-title"
          placeholder="My Book Enhancement"
          value={customTitle}
          onChange={onCustomTitleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="custom-prompt">Custom Enhancement Prompt</Label>
        <Textarea
          id="custom-prompt"
          placeholder="Write your custom enhancement prompt here..."
          value={customPrompt}
          onChange={onCustomPromptChange}
          className="min-h-[200px]"
        />
        <p className="text-xs text-muted-foreground">
          Write detailed instructions for how the AI should enhance your document.
          Be specific about style, tone, formatting, and content improvements.
        </p>
      </div>
    </div>
  );
};

export default CustomPromptEditor;
