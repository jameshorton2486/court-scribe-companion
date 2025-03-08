
import { toast } from 'sonner';

export type ChapterProcessingError = {
  message: string;
  code: string;
  details?: string;
};

// Error handling helper function
export const handleProcessingError = (error: unknown): ChapterProcessingError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'PROCESSING_ERROR',
      details: error.stack
    };
  }
  return {
    message: 'Unknown error occurred',
    code: 'UNKNOWN_ERROR',
    details: String(error)
  };
};
