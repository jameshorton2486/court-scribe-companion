// Obsolete component - replaced by PromptSelectionSection
// This file is safe to delete

import React, { useState, useEffect } from 'react';
import { getPromptTemplates, getCustomBookPrompt, saveCustomBookPrompt } from './services/PromptService';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface PromptSelectorProps {
  bookTitle: string;
  onPromptChange: (prompt: string) => void;
  enhancementPrompt?: string;
}

const PromptSelector: React.FC<PromptSelectorProps> = ({ bookTitle, onPromptChange, enhancementPrompt }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [promptTemplates, setPromptTemplates] = useState(getPromptTemplates());
  
  useEffect(() => {
    // Load custom prompt from localStorage when component mounts
    const storedPrompt = getCustomBookPrompt(bookTitle);
    if (storedPrompt) {
      setCustomPrompt(storedPrompt);
      onPromptChange(storedPrompt);
    } else if (enhancementPrompt) {
      setCustomPrompt(enhancementPrompt);
      onPromptChange(enhancementPrompt);
    }
  }, [bookTitle, onPromptChange, enhancementPrompt]);
  
  const handleTemplateSelect = (templateId: string) => {
    const template = promptTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      onPromptChange(template.prompt);
    }
  };
  
  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setCustomPrompt(newPrompt);
    onPromptChange(newPrompt);
    saveCustomBookPrompt(bookTitle, newPrompt); // Save to localStorage
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="template-select" className="block text-sm font-medium mb-2">
          Select a Template
        </label>
        <Select onValueChange={handleTemplateSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {promptTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name} - {template.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="custom-prompt" className="block text-sm font-medium mb-2">
          Custom Prompt
        </label>
        <Textarea
          id="custom-prompt"
          placeholder="Enter custom prompt..."
          value={customPrompt}
          onChange={handleCustomPromptChange}
          className="min-h-[120px]"
        />
      </div>
      
      <p className="text-xs text-muted-foreground">
        You can either select a prompt template or write your own custom prompt. 
        Custom prompts are saved to your browser's local storage.
      </p>
    </div>
  );
};

export default PromptSelector;
