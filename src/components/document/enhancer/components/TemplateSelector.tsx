
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the template interface
interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface TemplateSelectorProps {
  onTemplateSelect: (template: string) => void;
  disabled?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onTemplateSelect,
  disabled = false
}) => {
  // Predefined prompt templates
  const defaultTemplates: PromptTemplate[] = [
    {
      id: 'grammar',
      name: 'Grammar & Clarity',
      description: 'Improve grammar and clarity while preserving style',
      prompt: 'Improve grammar, spelling, and clarity in this content. Fix punctuation and sentence structure issues while preserving the original tone and style. Make the text more readable but don\'t change the meaning or add new information.'
    },
    {
      id: 'professional',
      name: 'Professional Tone',
      description: 'Make the content more professional and formal',
      prompt: 'Rewrite this content to have a more professional and formal tone. Improve vocabulary, eliminate casual language, and ensure proper grammar and punctuation. Make it suitable for a business or academic context.'
    },
    {
      id: 'concise',
      name: 'Concise & Direct',
      description: 'Make the content more concise and to-the-point',
      prompt: 'Make this content more concise and direct. Remove unnecessary words, redundancies, and filler phrases. Simplify complex sentences while preserving all important information and key points.'
    },
    {
      id: 'engaging',
      name: 'Engaging & Interesting',
      description: 'Make the content more engaging and interesting',
      prompt: 'Make this content more engaging and interesting to read. Improve the flow, use more varied sentence structures, and add descriptive language where appropriate. Make it captivating while maintaining the original meaning and information.'
    }
  ];
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultTemplates[0].id);
  
  useEffect(() => {
    // Initialize with the first template
    if (defaultTemplates.length > 0) {
      const template = defaultTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        onTemplateSelect(template.prompt);
      }
    }
  }, []);
  
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = defaultTemplates.find(t => t.id === templateId);
    if (template) {
      onTemplateSelect(template.prompt);
    }
  };
  
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="template-selector" className="block text-sm font-medium mb-2">
          Enhancement Template
        </label>
        <Select
          value={selectedTemplate}
          onValueChange={handleTemplateChange}
          disabled={disabled}
        >
          <SelectTrigger id="template-selector" className="w-full">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {defaultTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {defaultTemplates.find(t => t.id === selectedTemplate)?.description || 'Select a template to see description'}
      </div>
    </div>
  );
};

export default TemplateSelector;
