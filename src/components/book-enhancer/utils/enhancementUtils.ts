
import { toast } from 'sonner';
import { handleError, safeOperation, executeWithTiming } from '@/utils/errorHandlingUtils';

/**
 * Tracks the processing time of an asynchronous operation
 * 
 * @param operation - The async operation to execute and time
 * @returns Object containing the operation result and processing time in ms
 */
export const trackProcessingTime = async <T>(
  operation: () => Promise<T>
): Promise<{result: T, processingTime: number}> => {
  const timing = await executeWithTiming(operation, 'Processing operation');
  
  if (timing) {
    return {
      result: timing.result,
      processingTime: timing.executionTime
    };
  }
  
  throw new Error('Operation failed or was interrupted');
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
  return safeOperation(apiCall, 'API Call', errorMessage);
};

/**
 * Provides consistent error formatting for enhancement operations
 * 
 * @param error - The error object or message
 * @param defaultMessage - Default message if error doesn't have one
 * @returns Formatted error object with message and details
 */
export const formatEnhancementError = (error: unknown, defaultMessage: string) => {
  return handleError(error, 'Enhancement', true);
};
