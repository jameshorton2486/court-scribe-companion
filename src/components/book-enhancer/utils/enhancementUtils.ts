
import { toast } from 'sonner';

export const trackProcessingTime = async <T>(
  operation: () => Promise<T>
): Promise<{result: T, processingTime: number}> => {
  const startTime = performance.now();
  const result = await operation();
  const processingTime = performance.now() - startTime;
  return { result, processingTime };
};

export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  errorMessage: string
): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    let details = '';
    
    if (error instanceof Error) {
      details = error.message;
    } else if (typeof error === 'string') {
      details = error;
    }
    
    toast.error(errorMessage, { 
      description: details || 'Please try again'
    });
    
    return null;
  }
};
