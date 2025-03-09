
"""
Log Manager Module

This module provides comprehensive logging capabilities for the application,
with support for different log levels, formatting, and UI integration.
"""

import tkinter as tk
import datetime
from enum import Enum

class LogLevel(Enum):
    """
    Enumeration of available log levels in increasing order of severity.
    
    Attributes:
        DEBUG (0): Detailed information, typically of interest only when diagnosing problems.
        INFO (1): Confirmation that things are working as expected.
        WARNING (2): An indication that something unexpected happened, or may happen in the near future.
        ERROR (3): Due to a more serious problem, the software has not been able to perform some function.
        CRITICAL (4): A serious error, indicating that the program itself may be unable to continue running.
    """
    DEBUG = 0
    INFO = 1
    WARNING = 2
    ERROR = 3
    CRITICAL = 4

class LogManager:
    """
    Manages the application log text widget with improved error handling and log levels.
    
    This class handles all aspects of logging to the UI, including:
    - Managing log levels and filtering
    - Formatting log messages with timestamps
    - Color coding log entries by severity
    - Providing convenience methods for different log levels
    
    Attributes:
        log_text: The tkinter text widget where logs will be displayed
        log_level: The minimum log level to display (defaults to INFO)
    """
    
    def __init__(self, log_text):
        """
        Initialize the LogManager with a text widget.
        
        Args:
            log_text: The tkinter text widget where logs will be displayed
        """
        self.log_text = log_text
        self.log_level = LogLevel.INFO  # Default log level
        self.tags_configured = False
        
    def set_log_level(self, level):
        """
        Set the minimum log level to display.
        
        Args:
            level: A LogLevel enum value representing the minimum level to display
        """
        self.log_level = level
        
    def _get_timestamp(self):
        """
        Get current timestamp for log entries.
        
        Returns:
            str: A formatted timestamp string
        """
        return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
    def log(self, message, level=LogLevel.INFO):
        """
        Add a message to the log text widget with specified log level.
        
        Args:
            message: The message text to log
            level: The LogLevel for this message (default: INFO)
        """
        if level.value < self.log_level.value:
            return  # Skip messages below current log level
            
        timestamp = self._get_timestamp()
        level_str = level.name
        formatted_message = f"[{timestamp}] [{level_str}] {message}"
        
        # Set color based on log level
        tag = level.name.lower()
        
        # Configure tags if not already done
        if not self.tags_configured:
            self.log_text.tag_configure('debug', foreground='gray')
            self.log_text.tag_configure('info', foreground='black')
            self.log_text.tag_configure('warning', foreground='orange')
            self.log_text.tag_configure('error', foreground='red')
            self.log_text.tag_configure('critical', foreground='red', font=('Arial', 10, 'bold'))
            self.tags_configured = True
        
        self.log_text.config(state=tk.NORMAL)
        self.log_text.insert(tk.END, f"{formatted_message}\n", (tag,))
        self.log_text.see(tk.END)
        self.log_text.config(state=tk.DISABLED)
    
    def debug(self, message):
        """
        Log a debug message.
        
        Args:
            message: The debug message to log
        """
        self.log(message, LogLevel.DEBUG)
        
    def info(self, message):
        """
        Log an info message.
        
        Args:
            message: The info message to log
        """
        self.log(message, LogLevel.INFO)
        
    def warning(self, message):
        """
        Log a warning message.
        
        Args:
            message: The warning message to log
        """
        self.log(message, LogLevel.WARNING)
        
    def error(self, message):
        """
        Log an error message.
        
        Args:
            message: The error message to log
        """
        self.log(message, LogLevel.ERROR)
        
    def critical(self, message):
        """
        Log a critical error message.
        
        Args:
            message: The critical error message to log
        """
        self.log(message, LogLevel.CRITICAL)
