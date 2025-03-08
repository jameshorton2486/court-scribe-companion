
import { toast } from 'sonner';

/**
 * Tracks the processing time of an asynchronous operation
 * 
 * @param operation - The async operation to execute and time
 * @returns Object containing the operation result and processing time in ms
 */
export const trackProcessingTime = async <T>(
  operation: () => Promise<T>
): Promise<{result: T, processingTime: number}> => {
  const startTime = performance.now();
  const result = await operation();
  const processingTime = performance.now() - startTime;
  return { result, processingTime };
};

/**
 * Executes an API call with proper error handling and user feedback
 * 
 * @param apiCall - The API call function to execute
 * @param errorMessage - Error message to display if the call fails
 * @returns The API call result or null on failure
 */
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
