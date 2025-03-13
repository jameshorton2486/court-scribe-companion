
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

export interface CustomPromptEditorProps {
  onPromptChange: (prompt: string) => void;
  initialPrompt?: string;
  disabled?: boolean;
}

const CustomPromptEditor: React.FC<CustomPromptEditorProps> = ({ 
  onPromptChange,
  initialPrompt,
  disabled = false
}) => {
  const [promptText, setPromptText] = useState<string>('');
  
  // Default prompt template as a starting point
  const defaultPrompt = "Rewrite and enhance this content to improve clarity, grammar, and readability while preserving the original meaning and style.";
  
  useEffect(() => {
    // Initialize with provided prompt or default prompt
    const initialText = initialPrompt || defaultPrompt;
    setPromptText(initialText);
    onPromptChange(initialText);
  }, [initialPrompt]);
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPromptText(newPrompt);
    onPromptChange(newPrompt);
  };
  
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="custom-prompt" className="block text-sm font-medium mb-2">
          Custom Enhancement Instructions
        </label>
        <Textarea
          id="custom-prompt"
          placeholder="Enter custom enhancement instructions..."
          value={promptText}
          onChange={handlePromptChange}
          disabled={disabled}
          className="min-h-[120px]"
        />
      </div>
      
      <p className="text-xs text-muted-foreground">
        Write clear instructions for how the AI should enhance your document. 
        Be specific about tone, style, and what aspects to focus on.
      </p>
    </div>
  );
};

export default CustomPromptEditor;
