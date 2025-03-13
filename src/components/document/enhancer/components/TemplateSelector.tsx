
import React, { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface TemplateSelectorProps {
  onTemplateSelect: (template: string) => void;
  disabled?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onTemplateSelect,
  disabled = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('academic');
  
  const templates = {
    academic: "Enhance this text to meet high academic standards. Improve grammar, clarity, and formal tone while preserving the original meaning. Use appropriate academic vocabulary and ensure logical flow between ideas. Fix any structural issues while maintaining the author's voice.",
    professional: "Transform this content into polished, professional writing. Correct grammatical errors, enhance vocabulary, and improve sentence structure. Ensure clear communication while maintaining a business-appropriate tone. Make the content concise and impactful.",
    creative: "Enhance this writing with creative flair. Improve the imagery, vary sentence structure, and elevate vocabulary. Maintain the author's unique voice while fixing grammatical errors. Make the narrative engaging and evocative while preserving the original story and meaning.",
    simplified: "Simplify this text for improved readability. Clarify complex ideas, use simpler vocabulary, and break down lengthy sentences. Fix grammatical errors and ensure logical flow. Maintain the core message while making the content more accessible to a general audience.",
    technical: "Refine this technical content for clarity and precision. Ensure accurate terminology, fix grammar issues, and improve structural organization. Maintain technical depth while making explanations more accessible. Ensure consistent formatting of technical elements."
  };
  
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    // @ts-ignore - TypeScript doesn't know about the templates object keys
    const templateText = templates[value] || '';
    onTemplateSelect(templateText);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="template-select" className="block text-sm font-medium mb-2">
          Select Enhancement Template
        </label>
        <Select 
          value={selectedTemplate} 
          onValueChange={handleTemplateChange}
          disabled={disabled}
        >
          <SelectTrigger id="template-select" className="w-full">
            <SelectValue placeholder="Select a writing style" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="simplified">Simplified</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm">
          {templates[selectedTemplate as keyof typeof templates]}
        </p>
      </div>
    </div>
  );
};

export default TemplateSelector;
