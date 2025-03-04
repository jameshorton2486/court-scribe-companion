
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface GrammarEnhancementTabProps {
  enableGrammarCheck: boolean;
  setEnableGrammarCheck: (value: boolean) => void;
  grammarLevel: number;
  setGrammarLevel: (value: number) => void;
  enableSpellingCheck: boolean;
  setEnableSpellingCheck: (value: boolean) => void;
}

const GrammarEnhancementTab: React.FC<GrammarEnhancementTabProps> = ({
  enableGrammarCheck,
  setEnableGrammarCheck,
  grammarLevel,
  setGrammarLevel,
  enableSpellingCheck,
  setEnableSpellingCheck
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="grammar-check" 
            checked={enableGrammarCheck} 
            onCheckedChange={(checked) => setEnableGrammarCheck(!!checked)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="grammar-check" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Grammar Correction
            </Label>
            <p className="text-xs text-muted-foreground">
              Automatically fix grammar issues throughout the book
            </p>
          </div>
        </div>
        
        {enableGrammarCheck && (
          <div className="pl-6 space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="grammar-level" className="text-sm">Correction Level</Label>
                <span className="text-xs text-muted-foreground">
                  {grammarLevel === 1 ? 'Light' : grammarLevel === 2 ? 'Medium' : 'Thorough'}
                </span>
              </div>
              <Slider
                id="grammar-level"
                min={1}
                max={3}
                step={1}
                value={[grammarLevel]}
                onValueChange={(value) => setGrammarLevel(value[0])}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox 
          id="spelling-check" 
          checked={enableSpellingCheck} 
          onCheckedChange={(checked) => setEnableSpellingCheck(!!checked)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor="spelling-check" 
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Spelling Correction
          </Label>
          <p className="text-xs text-muted-foreground">
            Fix spelling errors and typos throughout the book
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrammarEnhancementTab;
