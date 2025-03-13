
/**
 * Centralized logging service with performance monitoring
 */

// Define log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3
}

// Configure logger
const loggerConfig = {
  level: LogLevel.INFO,
  includeTimestamp: true,
  logToConsole: true
};

// Performance monitoring utility
interface PerformanceApi {
  startTimer: (operationName: string) => () => void;
  monitor: <T extends (...args: any[]) => any>(
    operationName: string, 
    fn: T
  ) => (...args: Parameters<T>) => ReturnType<T>;
  now: () => number;
}

// Create the performance monitoring API
export const performance: PerformanceApi = {
  /**
   * Start a timer for an operation and return a function to end it
   * 
   * @param operationName - Name of the operation being timed
   * @returns Function to call when operation is complete
   * 
   * @example
   * const endTimer = performance.startTimer('Process chapter');
   * // ... do work
   * endTimer(); // Logs the time elapsed
   */
  startTimer: (operationName: string) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const elapsedMs = endTime - startTime;
      logger.debug(`Operation "${operationName}" completed in ${elapsedMs.toFixed(2)}ms`);
    };
  },
  
  /**
   * Monitor the execution time of a function
   * 
   * @param operationName - Name of the operation to monitor
   * @param fn - Function to monitor
   * @returns Wrapped function that logs execution time
   * 
   * @example
   * const processChapter = performance.monitor('Process chapter', (chapter) => {
   *   // process the chapter
   *   return processedChapter;
   * });
   */
  monitor: (operationName, fn) => {
    return (...args) => {
      const startTime = performance.now();
      const result = fn(...args);
      
      // Check if the result is a promise
      if (result instanceof Promise) {
        return result.finally(() => {
          const endTime = performance.now();
          const elapsedMs = endTime - startTime;
          logger.debug(`Async operation "${operationName}" completed in ${elapsedMs.toFixed(2)}ms`);
        });
      }
      
      // For synchronous functions
      const endTime = performance.now();
      const elapsedMs = endTime - startTime;
      logger.debug(`Operation "${operationName}" completed in ${elapsedMs.toFixed(2)}ms`);
      
      return result;
    };
  },
  
  /**
   * Get the current high-resolution time
   * 
   * @returns Current time in milliseconds
   */
  now: () => {
    return typeof window !== 'undefined' && window.performance && window.performance.now
      ? window.performance.now()
      : Date.now();
  }
};

// Logger implementation
export const logger = {
  /**
   * Log a debug message
   * 
   * @param message - Message to log
   * @param data - Optional data to include with the log
   */
  debug: (message: string, data?: any) => {
    if (loggerConfig.level <= LogLevel.DEBUG) {
      console.debug(
        `${loggerConfig.includeTimestamp ? new Date().toISOString() : ''} [DEBUG] ${message}`,
        data || ''
      );
    }
  },
  
  /**
   * Log an info message
   * 
   * @param message - Message to log
   * @param data - Optional data to include with the log
   */
  info: (message: string, data?: any) => {
    if (loggerConfig.level <= LogLevel.INFO) {
      console.info(
        `${loggerConfig.includeTimestamp ? new Date().toISOString() : ''} [INFO] ${message}`,
        data || ''
      );
    }
  },
  
  /**
   * Log a warning message
   * 
   * @param message - Message to log
   * @param data - Optional data to include with the log
   */
  warning: (message: string, data?: any) => {
    if (loggerConfig.level <= LogLevel.WARNING) {
      console.warn(
        `${loggerConfig.includeTimestamp ? new Date().toISOString() : ''} [WARNING] ${message}`,
        data || ''
      );
    }
  },
  
  /**
   * Log an error message
   * 
   * @param message - Message to log
   * @param data - Optional data to include with the log
   */
  error: (message: string, data?: any) => {
    if (loggerConfig.level <= LogLevel.ERROR) {
      console.error(
        `${loggerConfig.includeTimestamp ? new Date().toISOString() : ''} [ERROR] ${message}`,
        data || ''
      );
    }
  },
  
  /**
   * Set the current log level
   * 
   * @param level - New log level
   */
  setLevel: (level: LogLevel) => {
    loggerConfig.level = level;
  }
};

// Export utility for tracking function execution
export const trackFunctionExecution = <T extends (...args: any[]) => any>(
  functionName: string,
  fn: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return performance.monitor(functionName, fn);
};
