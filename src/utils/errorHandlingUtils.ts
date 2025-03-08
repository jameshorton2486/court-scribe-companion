
import { toast } from 'sonner';
import { ChapterProcessingError } from '@/components/ebook-uploader/processors/ErrorHandler';

/**
 * Standard error interface for application-wide error handling
 */
export interface AppError {
  /** Error message displayed to the user */
  message: string;
  /** Error code for tracking and categorizing errors */
  code: string;
  /** Optional additional details about the error */
  details?: string;
  /** Optional original error object */
  originalError?: unknown;
}

/**
 * Creates a standardized error object from any error type
 * 
 * @param error - The original error object or message
 * @param defaultMessage - Fallback message if error doesn't provide one
 * @param errorCode - Error code for categorization
 * @returns Structured AppError object
 */
export const createAppError = (
  error: unknown, 
  defaultMessage = 'An unexpected error occurred',
  errorCode = 'UNKNOWN_ERROR'
): AppError => {
  if (error instanceof Error) {
    return {
      message: error.message || defaultMessage,
      code: errorCode,
      details: error.stack,
      originalError: error
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
      code: errorCode
    };
  }
  
  return {
    message: defaultMessage,
    code: errorCode,
    details: error ? String(error) : undefined,
    originalError: error
  };
};

/**
 * Converts AppError to ChapterProcessingError format
 * for backward compatibility
 */
export const toChapterProcessingError = (error: AppError): ChapterProcessingError => {
  return {
    message: error.message,
    code: error.code,
    details: error.details
  };
};

/**
 * Handles errors with consistent logging and user notification
 * 
 * @param error - Error object or message
 * @param context - Context description for better error tracking
 * @param notifyUser - Whether to show a toast notification
 * @returns AppError object for optional further handling
 */
export const handleError = (
  error: unknown,
  context = 'Operation',
  notifyUser = true
): AppError => {
  const appError = createAppError(error);
  
  // Log error with context
  console.error(`${context} error:`, appError.originalError || appError.message);
  
  // Notify user if requested
  if (notifyUser) {
    toast.error(`${context} failed`, {
      description: appError.message || 'Please try again'
    });
  }
  
  return appError;
};

/**
 * Wraps async functions with standardized error handling
 * 
 * @param operation - Async function to execute safely
 * @param errorContext - Context description for the operation
 * @param defaultErrorMessage - Default message if operation fails
 * @returns Result of the operation or null on failure
 */
export const safeOperation = async <T>(
  operation: () => Promise<T>,
  errorContext = 'Operation',
  defaultErrorMessage = 'Operation failed'
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    handleError(error, errorContext);
    return null;
  }
};

/**
 * Executes an async operation with proper timing tracking and error handling
 * 
 * @param operation - Async function to execute
 * @param operationName - Name of the operation for logging
 * @returns Operation result with execution time or null on failure
 */
export const executeWithTiming = async <T>(
  operation: () => Promise<T>,
  operationName = 'Operation'
): Promise<{ result: T; executionTime: number } | null> => {
  try {
    const startTime = performance.now();
    const result = await operation();
    const executionTime = performance.now() - startTime;
    
    console.info(`${operationName} completed in ${executionTime.toFixed(2)}ms`);
    
    return { result, executionTime };
  } catch (error) {
    handleError(error, operationName);
    return null;
  }
};
