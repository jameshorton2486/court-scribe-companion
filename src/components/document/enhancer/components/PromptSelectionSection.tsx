
import React from 'react';
import PromptSelector from '../PromptSelector';
import CustomBookPrompt from '../CustomBookPrompt';

interface PromptSelectionSectionProps {
  bookTitle: string;
  enhancementPrompt: string;
  onPromptChange: (prompt: string) => void;
}

const PromptSelectionSection: React.FC<PromptSelectionSectionProps> = ({
  bookTitle,
  enhancementPrompt,
  onPromptChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <PromptSelector 
          onPromptSelected={onPromptChange}
          selectedPrompt={enhancementPrompt}
        />
      </div>
      <div>
        <CustomBookPrompt 
          bookTitle={bookTitle}
          onPromptSelected={onPromptChange}
        />
      </div>
    </div>
  );
};

export default PromptSelectionSection;
