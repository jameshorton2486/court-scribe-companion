
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PencilIcon, RotateCcw } from 'lucide-react';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

interface TemplateSelectorProps {
  promptTemplates: PromptTemplate[];
  selectedTemplateId: string;
  customPromptEnabled: boolean;
  onTemplateSelect: (templateId: string) => void;
  onEnableCustomPrompt: () => void;
  onResetToTemplates: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  promptTemplates,
  selectedTemplateId,
  customPromptEnabled,
  onTemplateSelect,
  onEnableCustomPrompt,
  onResetToTemplates
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Select Prompt Template</h4>
        {customPromptEnabled && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onResetToTemplates}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Use Templates
          </Button>
        )}
      </div>
      
      {!customPromptEnabled && (
        <RadioGroup 
          value={selectedTemplateId} 
          onValueChange={onTemplateSelect}
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
            onClick={onEnableCustomPrompt}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Create Custom
          </Button>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;
