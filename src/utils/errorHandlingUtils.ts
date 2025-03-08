
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
  /** Optional timestamp when the error occurred */
  timestamp?: number;
  /** Optional component or context where the error occurred */
  context?: string;
}

/**
 * Enum of standard error codes for the application
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  SECURITY_ERROR = 'SECURITY_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Creates a standardized error object from any error type
 * 
 * @param error - The original error object or message
 * @param context - Context description for better error tracking
 * @param errorCode - Error code for categorization
 * @returns Structured AppError object
 */
export const createAppError = (
  error: unknown, 
  context = 'Operation',
  errorCode = ErrorCode.UNKNOWN_ERROR
): AppError => {
  // Sanitize any potential harmful content in error messages
  const sanitizeErrorMessage = (msg: string): string => {
    return msg
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .substring(0, 500); // Limit length of error messages
  };

  if (error instanceof Error) {
    return {
      message: sanitizeErrorMessage(error.message) || 'An unexpected error occurred',
      code: errorCode,
      details: error.stack ? sanitizeErrorMessage(error.stack) : undefined,
      originalError: error,
      timestamp: Date.now(),
      context
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: sanitizeErrorMessage(error),
      code: errorCode,
      timestamp: Date.now(),
      context
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    code: errorCode,
    details: error ? sanitizeErrorMessage(String(error)) : undefined,
    originalError: error,
    timestamp: Date.now(),
    context
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
  // Determine appropriate error code based on error type
  let errorCode = ErrorCode.UNKNOWN_ERROR;
  
  if (error instanceof Error) {
    if (error.name === 'ValidationError') {
      errorCode = ErrorCode.VALIDATION_ERROR;
    } else if (error.name === 'NetworkError' || error.message.includes('network')) {
      errorCode = ErrorCode.NETWORK_ERROR;
    } else if (error.message.includes('storage') || error.message.includes('localStorage')) {
      errorCode = ErrorCode.STORAGE_ERROR;
    } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
      errorCode = ErrorCode.TIMEOUT;
    }
  }
  
  const appError = createAppError(error, context, errorCode);
  
  // Log error with context
  console.error(`${context} error [${appError.code}]:`, appError.originalError || appError.message);
  
  // Notify user if requested
  if (notifyUser) {
    // Use different toast types based on error severity
    if (errorCode === ErrorCode.VALIDATION_ERROR) {
      toast.warning(`${context} validation error`, {
        description: appError.message || 'Please check your inputs'
      });
    } else if (errorCode === ErrorCode.SECURITY_ERROR) {
      toast.error(`Security warning`, {
        description: 'A security issue was detected. Please contact support.'
      });
    } else {
      toast.error(`${context} failed`, {
        description: appError.message || 'Please try again'
      });
    }
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

/**
 * Debounces a function to improve performance
 * 
 * @param func - Function to debounce
 * @param wait - Time to wait in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function to improve performance
 * 
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Retries an async operation with exponential backoff
 * 
 * @param operation - Async function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param baseDelay - Base delay in milliseconds
 * @returns Result of the operation or throws the last error
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 300
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1})`, error);
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};
