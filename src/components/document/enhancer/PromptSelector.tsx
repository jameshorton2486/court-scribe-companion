
import React, { useState } from 'react';
import { getPromptTemplates } from './EnhancementService';
import TemplateSelector from './components/TemplateSelector';
import CustomPromptEditor from './components/CustomPromptEditor';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BookTextIcon } from 'lucide-react';

interface PromptSelectorProps {
  onPromptSelected: (prompt: string) => void;
  selectedPrompt: string;
}

const PromptSelector: React.FC<PromptSelectorProps> = ({ 
  onPromptSelected,
  selectedPrompt
}) => {
  const [customPromptEnabled, setCustomPromptEnabled] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customTitle, setCustomTitle] = useState('My Custom Book Enhancement');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('default');
  
  const promptTemplates = getPromptTemplates();
  
  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplateId(templateId);
    
    // Find the selected template
    const template = promptTemplates.find(t => t.id === templateId);
    if (template) {
      onPromptSelected(template.prompt);
      setCustomPromptEnabled(false);
    }
  };
  
  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
    if (customPromptEnabled) {
      onPromptSelected(e.target.value);
    }
  };
  
  const enableCustomPrompt = () => {
    setCustomPromptEnabled(true);
    onPromptSelected(customPrompt);
  };
  
  const resetToTemplates = () => {
    setCustomPromptEnabled(false);
    handleTemplateSelection(selectedTemplateId);
  };

  const handleCustomTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTitle(e.target.value);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-md font-medium">Enhancement Prompt</h3>
        <p className="text-sm text-muted-foreground">
          Choose how the AI should enhance your document
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="prompt-options">
          <AccordionTrigger>Enhancement Prompt Options</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-6">
              <TemplateSelector 
                promptTemplates={promptTemplates}
                selectedTemplateId={selectedTemplateId}
                customPromptEnabled={customPromptEnabled}
                onTemplateSelect={handleTemplateSelection}
                onEnableCustomPrompt={enableCustomPrompt}
                onResetToTemplates={resetToTemplates}
              />
              
              <CustomPromptEditor 
                customPromptEnabled={customPromptEnabled}
                customTitle={customTitle}
                customPrompt={customPrompt}
                onCustomTitleChange={handleCustomTitleChange}
                onCustomPromptChange={handleCustomPromptChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BookTextIcon className="h-4 w-4" />
          <span>
            {customPromptEnabled 
              ? `Using custom prompt: ${customTitle}`
              : `Using template: ${promptTemplates.find(t => t.id === selectedTemplateId)?.name}`
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default PromptSelector;
