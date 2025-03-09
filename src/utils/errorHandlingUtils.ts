
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
}

/**
 * Result of a timed execution with performance metrics
 */
export interface TimedExecutionResult<T> {
  result: T;
  executionTime: number;
}

/**
 * Handles an error and returns a structured error object
 * 
 * @param error - The original error that occurred
 * @param operation - Name of the operation where the error occurred
 * @returns Structured error object with message and details
 */
export const handleError = (error: unknown, operation: string): AppError => {
  console.error(`Error during ${operation}:`, error);
  
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack,
      originalError: error,
      code: 'ERROR'
    };
  }
  
  return {
    message: `An unexpected error occurred during ${operation}`,
    details: String(error),
    originalError: error,
    code: 'UNKNOWN_ERROR'
  };
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
