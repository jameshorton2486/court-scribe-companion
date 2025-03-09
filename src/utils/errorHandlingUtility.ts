
/**
 * Error Handling Utility
 * 
 * This module provides reusable error handling functions to standardize
 * error handling across the application.
 */

import { toast } from 'sonner';
import { AppError, ErrorCode, formatError, handleError } from './errorHandlingUtils';

/**
 * Handles errors in a standardized way with optional toast notification
 * 
 * @param error The error to handle
 * @param context Context in which the error occurred
 * @param showToast Whether to show a toast notification
 * @returns The formatted AppError
 */
export const handleFormattedError = (
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
 * Try-catch wrapper for async operations
 * 
 * @param operation Function to execute
 * @param operationName Name of the operation (for error reporting)
 * @param fallbackValue Value to return in case of error (optional)
 * @returns Result of the operation or fallback value
 */
export async function tryCatchAsync<T>(
  operation: () => Promise<T>,
  operationName: string,
  fallbackValue?: T
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    handleFormattedError(error, operationName);
    return fallbackValue;
  }
}

/**
 * Try-catch wrapper for synchronous operations
 * 
 * @param operation Function to execute
 * @param operationName Name of the operation (for error reporting)
 * @param fallbackValue Value to return in case of error (optional)
 * @returns Result of the operation or fallback value
 */
export function tryCatch<T>(
  operation: () => T,
  operationName: string,
  fallbackValue?: T
): T | undefined {
  try {
    return operation();
  } catch (error) {
    handleFormattedError(error, operationName);
    return fallbackValue;
  }
}

/**
 * Validates a condition and throws an error if the condition is false
 * 
 * @param condition Condition to validate
 * @param errorMessage Error message to throw
 * @param errorCode Error code to use
 * @throws Error with the specified message and code if condition is false
 */
export function validateCondition(
  condition: boolean,
  errorMessage: string,
  errorCode: ErrorCode = ErrorCode.VALIDATION_ERROR
): void {
  if (!condition) {
    const error: AppError = {
      code: errorCode,
      message: errorMessage,
      context: 'Validation'
    };
    throw error;
  }
}

/**
 * Creates a debounced version of a function
 * 
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function createDebounced<T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}
