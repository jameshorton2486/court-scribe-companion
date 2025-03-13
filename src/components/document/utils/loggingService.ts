
/**
 * Centralized logging service for the application
 * Provides consistent formatting and log levels
 */

type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

// In-memory log storage (limited to prevent memory issues)
const MAX_LOG_ENTRIES = 1000;
const logHistory: LogEntry[] = [];

// Environment-based log level filtering
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  'debug': 0,
  'info': 1,
  'warning': 2,
  'error': 3,
  'critical': 4
};

let currentMinLogLevel: LogLevel = 'info'; // Default log level

/**
 * Set the minimum log level to display
 */
export const setLogLevel = (level: LogLevel): void => {
  currentMinLogLevel = level;
  console.log(`Log level set to: ${level}`);
};

/**
 * Create a timestamp for log entries
 */
const createTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Internal function to add a log entry
 */
const addLogEntry = (level: LogLevel, message: string, context?: Record<string, any>): void => {
  // Check if we should log based on current log level
  if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[currentMinLogLevel]) {
    return;
  }
  
  const entry: LogEntry = {
    timestamp: createTimestamp(),
    level,
    message,
    context
  };
  
  // Add to history, maintaining max size
  logHistory.push(entry);
  if (logHistory.length > MAX_LOG_ENTRIES) {
    logHistory.shift();
  }
  
  // Format the log entry
  const formattedEntry = formatLogEntry(entry);
  
  // Output to console with appropriate styling
  switch (level) {
    case 'debug':
      console.debug(formattedEntry, context || '');
      break;
    case 'info':
      console.info(formattedEntry, context || '');
      break;
    case 'warning':
      console.warn(formattedEntry, context || '');
      break;
    case 'error':
    case 'critical':
      console.error(formattedEntry, context || '');
      break;
  }
};

/**
 * Format a log entry for display
 */
const formatLogEntry = (entry: LogEntry): string => {
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
};

/**
 * Public logging API
 */
export const logger = {
  debug: (message: string, context?: Record<string, any>) => addLogEntry('debug', message, context),
  info: (message: string, context?: Record<string, any>) => addLogEntry('info', message, context),
  warning: (message: string, context?: Record<string, any>) => addLogEntry('warning', message, context),
  error: (message: string, context?: Record<string, any>) => addLogEntry('error', message, context),
  critical: (message: string, context?: Record<string, any>) => addLogEntry('critical', message, context),
  
  /**
   * Get the log history
   */
  getHistory: (): LogEntry[] => [...logHistory],
  
  /**
   * Clear the log history
   */
  clearHistory: (): void => {
    logHistory.length = 0;
    console.log('Log history cleared');
  }
};

/**
 * Performance monitoring helpers
 */
export const performance = {
  /**
   * Start timing an operation
   */
  startTimer: (operationName: string): (() => void) => {
    const startTime = window.performance.now();
    logger.debug(`Starting operation: ${operationName}`);
    
    return () => {
      const endTime = window.performance.now();
      const duration = endTime - startTime;
      logger.info(`Operation complete: ${operationName}`, { 
        operation: operationName,
        durationMs: duration.toFixed(2) 
      });
    };
  },
  
  /**
   * Wrap a function with performance monitoring
   */
  monitor: <T extends (...args: any[]) => any>(
    operationName: string, 
    fn: T
  ): ((...args: Parameters<T>) => ReturnType<T>) => {
    return (...args: Parameters<T>): ReturnType<T> => {
      const startTime = window.performance.now();
      logger.debug(`Starting operation: ${operationName}`);
      
      try {
        const result = fn(...args);
        const endTime = window.performance.now();
        const duration = endTime - startTime;
        
        logger.info(`Operation complete: ${operationName}`, { 
          operation: operationName,
          durationMs: duration.toFixed(2) 
        });
        
        return result;
      } catch (error) {
        const endTime = window.performance.now();
        const duration = endTime - startTime;
        
        logger.error(`Operation failed: ${operationName}`, {
          operation: operationName,
          durationMs: duration.toFixed(2),
          error
        });
        
        throw error;
      }
    };
  }
};
