
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EnhanceButtonProps {
  isEnhancing: boolean;
  onEnhance: () => void;
  text?: string;
}

const EnhanceButton: React.FC<EnhanceButtonProps> = ({ 
  isEnhancing, 
  onEnhance,
  text
}) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onEnhance} 
        disabled={isEnhancing}
        className="w-full md:w-auto"
      >
        {isEnhancing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enhancing Document...
          </>
        ) : (
          text || 'Enhance Entire Document'
        )}
      </Button>
    </div>
  );
};

export default EnhanceButton;
