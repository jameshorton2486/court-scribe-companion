
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface EnhancementProgressProps {
  isEnhancing: boolean;
  currentBatch: number;
  totalBatches: number;
  progress: number;
  statusMessage: string;
}

const EnhancementProgress: React.FC<EnhancementProgressProps> = ({
  isEnhancing,
  currentBatch,
  totalBatches,
  progress,
  statusMessage
}) => {
  if (!isEnhancing) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">
          Batch {currentBatch} of {totalBatches}
        </span>
        <span className="text-sm">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-center text-muted-foreground">{statusMessage}</p>
    </div>
  );
};

export default EnhancementProgress;
