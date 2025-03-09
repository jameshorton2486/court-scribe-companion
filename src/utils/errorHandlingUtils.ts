
import { toast } from 'sonner';

export enum ErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  STORAGE_ERROR = 'STORAGE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  SECURITY_ERROR = 'SECURITY_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  PARSING_ERROR = 'PARSING_ERROR'
}

export interface AppError {
  code: ErrorCode;
  message: string;
  context?: string;
  originalError?: unknown;
  data?: Record<string, unknown>;
}

/**
 * Standard error handling function that logs and shows toast notifications
 * 
 * @param error Error to handle
 * @param context Context in which the error occurred
 * @param showToast Whether to show a toast notification
 * @returns Formatted AppError
 */
export const handleError = (
  error: unknown, 
  context = 'Application',
  showToast = true
): AppError => {
  const appError = formatError(error, context);
  
  // Log the error to console with context
  console.error(`[${context}] ${appError.message}`, appError);
  
  // Show toast notification if requested
  if (showToast) {
    toast.error(`Error: ${appError.message}`, {
      description: appError.context,
      duration: 5000,
    });
  }
  
  return appError;
};

/**
 * Format an unknown error into a standard AppError format
 */
export const formatError = (error: unknown, context = 'Application'): AppError => {
  // Handle case when error is already in AppError format
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    return error as AppError;
  }
  
  // Handle Error object
  if (error instanceof Error) {
    let code = ErrorCode.UNKNOWN_ERROR;
    
    // Determine error type based on Error subclass or message
    if ('code' in error && typeof error.code === 'string') {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        code = ErrorCode.TIMEOUT;
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        code = ErrorCode.NETWORK_ERROR;
      }
    }
    
    if (error.name === 'SecurityError') {
      code = ErrorCode.SECURITY_ERROR;
    } else if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      code = ErrorCode.STORAGE_ERROR;
    } else if (error.name === 'SyntaxError' || error.name === 'TypeError') {
      code = ErrorCode.PARSING_ERROR;
    }
    
    // Create standardized error
    return {
      code,
      message: error.message || 'An unknown error occurred',
      context,
      originalError: error
    };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error,
      context
    };
  }
  
  // Default for anything else
  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: 'An unknown error occurred',
    context,
    originalError: error
  };
};

/**
 * Safely executes an async operation with error handling
 */
export const safeOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  errorMessage = 'Operation failed'
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const appError = handleError(error, operationName, true);
    
    // Add custom user-friendly message
    appError.message = errorMessage;
    
    throw appError;
  }
};

/**
 * Executes an operation with timing measurement
 */
export const executeWithTiming = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await operation();
    const endTime = performance.now();
    console.info(`${operationName} completed in ${(endTime - startTime).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`${operationName} failed after ${(endTime - startTime).toFixed(2)}ms`);
    throw error;
  }
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}

/**
 * Creates a throttled function that invokes func at most once per threshold period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  threshold = 300
): (...args: Parameters<T>) => void {
  let last: number = 0;
  let timeout: number | undefined;
  
  return function(...args: Parameters<T>): void {
    const now = Date.now();
    const remaining = threshold - (now - last);
    
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
      last = now;
      func(...args);
    } else if (!timeout) {
      timeout = window.setTimeout(() => {
        last = Date.now();
        timeout = undefined;
        func(...args);
      }, remaining);
    }
  };
}

/**
 * Check if an error has a specific code
 */
export const hasErrorCode = (error: AppError, code: ErrorCode): boolean => {
  return error.code === code;
};

// Fix build error with correct comparison
export const isSecurityError = (error: AppError): boolean => {
  return error.code === ErrorCode.SECURITY_ERROR;
};
