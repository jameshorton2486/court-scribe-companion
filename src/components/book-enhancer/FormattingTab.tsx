
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormattingTabProps {
  enableProfessionalFormatting: boolean;
  setEnableProfessionalFormatting: (value: boolean) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
  generateTOC: boolean;
  setGenerateTOC: (value: boolean) => void;
  addChapterBreaks: boolean;
  setAddChapterBreaks: (value: boolean) => void;
}

const FormattingTab: React.FC<FormattingTabProps> = ({
  enableProfessionalFormatting,
  setEnableProfessionalFormatting,
  fontFamily,
  setFontFamily,
  generateTOC,
  setGenerateTOC,
  addChapterBreaks,
  setAddChapterBreaks
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="professional-formatting" 
          checked={enableProfessionalFormatting} 
          onCheckedChange={(checked) => setEnableProfessionalFormatting(!!checked)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor="professional-formatting" 
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Professional Formatting
          </Label>
          <p className="text-xs text-muted-foreground">
            Apply consistent formatting throughout the book
          </p>
        </div>
      </div>
      
      {enableProfessionalFormatting && (
        <div className="pl-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font-family" className="text-sm">Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="serif">Serif (Times New Roman)</SelectItem>
                <SelectItem value="sans-serif">Sans Serif (Arial)</SelectItem>
                <SelectItem value="georgia">Georgia</SelectItem>
                <SelectItem value="garamond">Garamond</SelectItem>
                <SelectItem value="palatino">Palatino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="generate-toc" 
              checked={generateTOC} 
              onCheckedChange={(checked) => setGenerateTOC(!!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="generate-toc" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Generate Table of Contents
              </Label>
              <p className="text-xs text-muted-foreground">
                Create a detailed table of contents with page numbers
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="chapter-breaks" 
              checked={addChapterBreaks} 
              onCheckedChange={(checked) => setAddChapterBreaks(!!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="chapter-breaks" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Add Chapter Breaks
              </Label>
              <p className="text-xs text-muted-foreground">
                Insert page breaks between chapters for better formatting
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormattingTab;
