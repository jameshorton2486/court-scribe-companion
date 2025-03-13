
import React, { useState } from 'react';
import TemplateSelector from './TemplateSelector';
import CustomPromptEditor from './CustomPromptEditor';

export interface PromptSelectionSectionProps {
  onPromptSelected: (prompt: string) => void;
  enhancementPrompt?: string;
  disabled?: boolean;
  bookTitle?: string;
}

const PromptSelectionSection: React.FC<PromptSelectionSectionProps> = ({ 
  onPromptSelected,
  enhancementPrompt = '',
  disabled = false,
  bookTitle
}) => {
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  
  const handleTemplateSelected = (template: string) => {
    if (!disabled) {
      onPromptSelected(template);
    }
  };
  
  const handleCustomPromptChange = (customPrompt: string) => {
    if (!disabled) {
      onPromptSelected(customPrompt);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="useCustomPrompt"
          checked={useCustomPrompt}
          onChange={(e) => setUseCustomPrompt(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="useCustomPrompt" className="text-sm font-medium leading-none">
          Use Custom Prompt
        </label>
      </div>
      
      {useCustomPrompt ? (
        <CustomPromptEditor
          onPromptChange={handleCustomPromptChange}
          initialPrompt={enhancementPrompt}
          disabled={disabled}
        />
      ) : (
        <TemplateSelector
          onTemplateSelect={handleTemplateSelected}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default PromptSelectionSection;
