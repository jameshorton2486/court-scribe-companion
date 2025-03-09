
import { AppError } from '@/utils/errorHandlingUtils';

/**
 * Tracks the execution time of an operation
 * 
 * @param operation - The operation to track
 * @returns Result with execution time
 */
export const trackProcessingTime = async <T>(operation: () => Promise<T>): Promise<{
  result: T;
  processingTime: number;
}> => {
  const startTime = performance.now();
  const result = await operation();
  const processingTime = performance.now() - startTime;
  
  return { result, processingTime };
};

/**
 * Executes an operation with timing measurements
 * 
 * @param operation - The operation to execute
 * @param operationName - Name of the operation for logging
 * @returns Result with execution time if successful, null if failed
 */
export const executeWithTiming = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<{ result: T; executionTime: number } | null> => {
  try {
    const startTime = performance.now();
    const result = await operation();
    const executionTime = performance.now() - startTime;
    
    console.info(`Executed ${operationName} in ${(executionTime / 1000).toFixed(2)}s`);
    return { result, executionTime };
  } catch (error) {
    console.error(`Error executing ${operationName}:`, error);
    return null;
  }
};

/**
 * Makes a safe API call with error handling
 * 
 * @param apiCall - The API call function to execute
 * @param errorMessage - Error message to use if the call fails
 * @returns Result of the API call if successful, null if failed
 */
export const safeApiCall = async <T>(apiCall: () => Promise<T>, errorMessage: string): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
};
