
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getPromptTemplates } from './EnhancementService';
import { PencilIcon, BookTextIcon, ResetIcon } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Select Prompt Template</h4>
                  {customPromptEnabled && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetToTemplates}
                    >
                      <ResetIcon className="mr-2 h-4 w-4" />
                      Use Templates
                    </Button>
                  )}
                </div>
                
                {!customPromptEnabled && (
                  <RadioGroup 
                    value={selectedTemplateId} 
                    onValueChange={handleTemplateSelection}
                    className="space-y-2"
                  >
                    {promptTemplates.map(template => (
                      <div key={template.id} className="flex items-start space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value={template.id} id={`template-${template.id}`} />
                        <div className="grid gap-1.5">
                          <Label htmlFor={`template-${template.id}`} className="font-medium">
                            {template.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <h4 className="text-sm font-medium">
                    {customPromptEnabled ? 'Custom Prompt' : 'Or Create Custom Prompt'}
                  </h4>
                  
                  {!customPromptEnabled && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={enableCustomPrompt}
                    >
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Create Custom
                    </Button>
                  )}
                </div>
                
                {customPromptEnabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-title">Custom Enhancement Title</Label>
                      <Input
                        id="custom-title"
                        placeholder="My Book Enhancement"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-prompt">Custom Enhancement Prompt</Label>
                      <Textarea
                        id="custom-prompt"
                        placeholder="Write your custom enhancement prompt here..."
                        value={customPrompt}
                        onChange={handleCustomPromptChange}
                        className="min-h-[200px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Write detailed instructions for how the AI should enhance your document.
                        Be specific about style, tone, formatting, and content improvements.
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
