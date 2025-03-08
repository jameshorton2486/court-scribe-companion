
import { toast } from 'sonner';
import { handleError, safeOperation, executeWithTiming } from '@/utils/errorHandlingUtils';
import { EnhancementOptions, EnhancementResult } from '../types/enhancementTypes';

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

/**
 * Caches enhancement results to improve performance for repeated operations
 * 
 * @param key - Unique identifier for the enhancement operation
 * @param operation - Function that performs the enhancement
 * @param options - Enhancement options that affect the result
 * @returns Cached result if available, otherwise new enhancement result
 */
export const cacheEnhancementResult = async <T>(
  key: string,
  operation: () => Promise<T>,
  options: EnhancementOptions
): Promise<T> => {
  // Create a cache key based on the provided key and relevant options
  const cacheKey = `enhancement_${key}_${JSON.stringify(options)}`;
  
  try {
    // Check if cached result exists in sessionStorage
    const cachedItem = sessionStorage.getItem(cacheKey);
    
    if (cachedItem) {
      const { timestamp, result } = JSON.parse(cachedItem);
      
      // Use cache if it's less than 30 minutes old
      const cacheAgeMins = (Date.now() - timestamp) / (1000 * 60);
      if (cacheAgeMins < 30) {
        console.info(`Using cached enhancement result for ${key} (${cacheAgeMins.toFixed(1)} mins old)`);
        return result as T;
      }
    }
    
    // Execute the operation and cache the result
    const result = await operation();
    
    // Store in sessionStorage with timestamp
    const cacheItem = {
      timestamp: Date.now(),
      result
    };
    
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (storageError) {
      // If storage fails (e.g., quota exceeded), just log without failing the operation
      console.warn('Failed to cache enhancement result:', storageError);
    }
    
    return result;
  } catch (error) {
    // If anything goes wrong with caching, execute the operation directly
    console.warn('Enhancement cache error, falling back to direct execution:', error);
    return operation();
  }
};

/**
 * Validates whether enhancement options are valid for processing
 * 
 * @param options - The enhancement options to validate
 * @returns True if options are valid, false otherwise
 */
export const validateEnhancementOptions = (options: EnhancementOptions): boolean => {
  // Check if any enhancement type is enabled
  const hasEnabledEnhancement = 
    options.enableGrammarCheck || 
    options.enableSpellingCheck || 
    options.enableContentExpansion || 
    options.enableProfessionalFormatting;
  
  if (!hasEnabledEnhancement) {
    toast.warning("No enhancements selected", {
      description: "Please select at least one enhancement type to apply."
    });
    return false;
  }
  
  // Validate specific enhancement types
  if (options.enableGrammarCheck && (options.grammarLevel < 1 || options.grammarLevel > 5)) {
    toast.warning("Invalid grammar level", {
      description: "Grammar level must be between 1 and 5."
    });
    return false;
  }
  
  if (options.enableContentExpansion && (options.expansionLevel < 1 || options.expansionLevel > 3)) {
    toast.warning("Invalid expansion level", {
      description: "Expansion level must be between 1 and 3."
    });
    return false;
  }
  
  return true;
};
