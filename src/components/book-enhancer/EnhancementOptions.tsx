
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, Pencil, Type } from 'lucide-react';

interface EnhancementOptionsProps {
  enhancementType: 'grammar' | 'content' | 'formatting';
  setEnhancementType: (type: 'grammar' | 'content' | 'formatting') => void;
}

const EnhancementOptions: React.FC<EnhancementOptionsProps> = ({ 
  enhancementType, 
  setEnhancementType 
}) => {
  return (
    <div className="space-y-4">
      <div className="text-sm mb-4">
        Select the type of enhancement you'd like to apply to your book:
      </div>

      <RadioGroup 
        value={enhancementType} 
        onValueChange={(value) => setEnhancementType(value as 'grammar' | 'content' | 'formatting')}
        className="space-y-4"
      >
        <div>
          <Card className={`cursor-pointer transition ${enhancementType === 'grammar' ? 'border-primary' : ''}`}>
            <CardContent className="p-4 flex items-start space-x-4">
              <RadioGroupItem value="grammar" id="grammar" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="grammar" className="text-base font-medium flex items-center cursor-pointer">
                  <Check className="mr-2 h-5 w-5" />
                  Grammar & Style Correction
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Fix spelling, grammar, punctuation errors and improve readability. This is ideal for
                  polishing a mostly complete manuscript.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className={`cursor-pointer transition ${enhancementType === 'content' ? 'border-primary' : ''}`}>
            <CardContent className="p-4 flex items-start space-x-4">
              <RadioGroupItem value="content" id="content" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="content" className="text-base font-medium flex items-center cursor-pointer">
                  <Pencil className="mr-2 h-5 w-5" />
                  Content Enhancement
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Expand content with additional details, examples, and explanations. 
                  This option creates more comprehensive chapters from your existing content.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className={`cursor-pointer transition ${enhancementType === 'formatting' ? 'border-primary' : ''}`}>
            <CardContent className="p-4 flex items-start space-x-4">
              <RadioGroupItem value="formatting" id="formatting" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="formatting" className="text-base font-medium flex items-center cursor-pointer">
                  <Type className="mr-2 h-5 w-5" />
                  Professional Formatting
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Improve the structure, headings, and layout of your book to match 
                  professional publishing standards. Includes proper chapter formatting and 
                  consistent styling.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </RadioGroup>
    </div>
  );
};

export default EnhancementOptions;
