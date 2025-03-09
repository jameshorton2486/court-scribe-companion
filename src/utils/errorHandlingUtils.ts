
/**
 * Utilities for error handling and operation safety
 * 
 * This module provides functions for safely executing operations with proper error handling,
 * performance timing, and user feedback.
 */

import { toast } from 'sonner';

/**
 * Error interface for structured error information
 */
export interface AppError {
  message: string;
  details?: string;
  originalError?: unknown;
  code?: string;
  context?: string;
}

/**
 * Standard error codes for application
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Result of a timed execution with performance metrics
 */
export interface TimedExecutionResult<T> {
  result: T;
  executionTime: number;
}

/**
 * Formats an error into a standardized AppError structure
 * 
 * @param error - The original error that occurred
 * @param context - Context in which the error occurred
 * @returns Structured AppError object
 */
export const formatError = (error: unknown, context: string): AppError => {
  console.error(`Error in ${context}:`, error);
  
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack,
      originalError: error,
      code: ErrorCode.UNKNOWN_ERROR,
      context
    };
  }
  
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      message: String((error as { message: unknown }).message),
      originalError: error,
      code: ErrorCode.UNKNOWN_ERROR,
      context
    };
  }
  
  return {
    message: `An unexpected error occurred in ${context}`,
    details: String(error),
    originalError: error,
    code: ErrorCode.UNKNOWN_ERROR,
    context
  };
};

/**
 * Handles an error and returns a structured error object
 * 
 * @param error - The original error that occurred
 * @param operation - Name of the operation where the error occurred
 * @param showToast - Whether to show a toast notification
 * @returns Structured error object with message and details
 */
export const handleError = (error: unknown, operation: string, showToast: boolean = false): AppError => {
  const appError = formatError(error, operation);
  
  if (showToast) {
    toast.error(`Error: ${appError.message}`, {
      description: `Failed during ${operation}`,
      duration: 5000,
    });
  }
  
  return appError;
};

/**
 * Executes an operation with timing measurements
 * 
 * @param operation - Async function to execute and time
 * @param operationName - Name of the operation for logging
 * @returns Result with execution time in ms
 */
export const executeWithTiming = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<TimedExecutionResult<T> | null> => {
  try {
    const startTime = performance.now();
    const result = await operation();
    const executionTime = performance.now() - startTime;
    
    console.info(`${operationName} completed in ${executionTime.toFixed(2)}ms`);
    
    return {
      result,
      executionTime
    };
  } catch (error) {
    handleError(error, operationName);
    return null;
  }
};

/**
 * Creates a debounced version of a function
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
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
 * Safely executes an operation with error handling
 * 
 * @param operation - Async function to execute safely
 * @param operationName - Name of the operation for error reporting
 * @param errorMessage - User-friendly error message
 * @returns Result of the operation or null on error
 */
export const safeOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  errorMessage: string = `Error during ${operationName}`
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    const appError = handleError(error, operationName);
    
    toast.error(errorMessage, {
      description: appError.message
    });
    
    return null;
  }
};
