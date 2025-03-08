
import tkinter as tk
import datetime
from enum import Enum

class LogLevel(Enum):
    DEBUG = 0
    INFO = 1
    WARNING = 2
    ERROR = 3
    CRITICAL = 4

class LogManager:
    """Manages the application log text widget with improved error handling and log levels"""
    
    def __init__(self, log_text):
        self.log_text = log_text
        self.log_level = LogLevel.INFO  # Default log level
        
    def set_log_level(self, level):
        """Set the minimum log level to display"""
        self.log_level = level
        
    def _get_timestamp(self):
        """Get current timestamp for log entries"""
        return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
    def log(self, message, level=LogLevel.INFO):
        """Add a message to the log text widget with specified log level"""
        if level.value < self.log_level.value:
            return  # Skip messages below current log level
            
        timestamp = self._get_timestamp()
        level_str = level.name
        formatted_message = f"[{timestamp}] [{level_str}] {message}"
        
        # Set color based on log level
        tag = level.name.lower()
        
        self.log_text.config(state=tk.NORMAL)
        self.log_text.insert(tk.END, f"{formatted_message}\n", (tag,))
        self.log_text.see(tk.END)
        self.log_text.config(state=tk.DISABLED)
        
        # Configure tags for different log levels
        if not hasattr(self, 'tags_configured'):
            self.log_text.tag_configure('debug', foreground='gray')
            self.log_text.tag_configure('info', foreground='black')
            self.log_text.tag_configure('warning', foreground='orange')
            self.log_text.tag_configure('error', foreground='red')
            self.log_text.tag_configure('critical', foreground='red', font=('Arial', 10, 'bold'))
            self.tags_configured = True
    
    def debug(self, message):
        """Log a debug message"""
        self.log(message, LogLevel.DEBUG)
        
    def info(self, message):
        """Log an info message"""
        self.log(message, LogLevel.INFO)
        
    def warning(self, message):
        """Log a warning message"""
        self.log(message, LogLevel.WARNING)
        
    def error(self, message):
        """Log an error message"""
        self.log(message, LogLevel.ERROR)
        
    def critical(self, message):
        """Log a critical error message"""
        self.log(message, LogLevel.CRITICAL)
