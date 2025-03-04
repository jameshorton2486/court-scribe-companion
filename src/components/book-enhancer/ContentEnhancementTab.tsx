
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ContentEnhancementTabProps {
  enableContentExpansion: boolean;
  setEnableContentExpansion: (value: boolean) => void;
  expansionLevel: number;
  setExpansionLevel: (value: number) => void;
  writingStyle: string;
  setWritingStyle: (value: string) => void;
  improveClarity: boolean;
  setImproveClarity: (value: boolean) => void;
}

const ContentEnhancementTab: React.FC<ContentEnhancementTabProps> = ({
  enableContentExpansion,
  setEnableContentExpansion,
  expansionLevel,
  setExpansionLevel,
  writingStyle,
  setWritingStyle,
  improveClarity,
  setImproveClarity
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="content-expansion" 
            checked={enableContentExpansion} 
            onCheckedChange={(checked) => setEnableContentExpansion(!!checked)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="content-expansion" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Content Expansion
            </Label>
            <p className="text-xs text-muted-foreground">
              Add more detailed content to improve depth and engagement
            </p>
          </div>
        </div>
        
        {enableContentExpansion && (
          <div className="pl-6 space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="expansion-level" className="text-sm">Expansion Level</Label>
                <span className="text-xs text-muted-foreground">
                  {expansionLevel === 1 ? 'Minimal' : expansionLevel === 2 ? 'Moderate' : 'Substantial'}
                </span>
              </div>
              <Slider
                id="expansion-level"
                min={1}
                max={3}
                step={1}
                value={[expansionLevel]}
                onValueChange={(value) => setExpansionLevel(value[0])}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Writing Style</Label>
        <RadioGroup value={writingStyle} onValueChange={setWritingStyle} className="space-y-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="academic" id="style-academic" />
            <Label htmlFor="style-academic" className="text-sm">Academic</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="conversational" id="style-conversational" />
            <Label htmlFor="style-conversational" className="text-sm">Conversational</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="professional" id="style-professional" />
            <Label htmlFor="style-professional" className="text-sm">Professional</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="storytelling" id="style-storytelling" />
            <Label htmlFor="style-storytelling" className="text-sm">Storytelling</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox 
          id="improve-clarity" 
          checked={improveClarity} 
          onCheckedChange={(checked) => setImproveClarity(!!checked)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor="improve-clarity" 
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Improve Clarity & Readability
          </Label>
          <p className="text-xs text-muted-foreground">
            Restructure sentences and paragraphs for better readability
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentEnhancementTab;
