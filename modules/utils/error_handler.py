
"""
Error Handling Module

This module provides standardized error handling functions to ensure
consistent error management across the application.
"""

import traceback
import logging
import os
import datetime
import sys
from tkinter import messagebox

# Configure logger
def setup_logging():
    """Set up logging to both console and file"""
    # Create logs directory if it doesn't exist
    log_dir = os.path.join(os.getcwd(), "Logs")
    os.makedirs(log_dir, exist_ok=True)
    
    # Create a timestamp for the log filename
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = os.path.join(log_dir, f"book_processor_{timestamp}.log")
    
    # Create root logger
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    
    # Create file handler with detailed formatting
    file_handler = logging.FileHandler(log_file)
    file_handler.setLevel(logging.DEBUG)
    file_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(file_format)
    
    # Create console handler with simpler formatting for user
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_format = logging.Formatter('%(levelname)s: %(message)s')
    console_handler.setFormatter(console_format)
    
    # Add handlers to logger
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    # Log the start of a new session
    logging.info(f"=== Starting new session {timestamp} ===")
    logging.info(f"Logs are being saved to: {log_file}")
    print(f"Log file created at: {log_file}")
    
    return log_file

# Initialize logging
log_file_path = setup_logging()
logger = logging.getLogger(__name__)

class ErrorHandler:
    """
    Centralized error handling for the application
    
    This class provides methods for handling different types of errors consistently,
    including logging, user notifications, and appropriate fallback behavior.
    """
    
    @staticmethod
    def handle_processing_error(app, error, operation_name, show_message=True):
        """
        Handle errors during document processing operations
        
        Args:
            app: The application instance
            error: The exception that occurred
            operation_name: Name of the operation where the error occurred
            show_message: Whether to show a message box to the user
            
        Returns:
            None
        """
        error_message = str(error)
        error_details = traceback.format_exc()
        
        # Log the error
        logger.error(f"Error during {operation_name}: {error_message}")
        logger.debug(f"Error details: {error_details}")
        
        # Print to console for immediate visibility
        print(f"ERROR: Operation '{operation_name}' failed: {error_message}")
        
        # Update app UI if app is provided
        if app:
            if hasattr(app, 'log') and callable(app.log):
                app.log(f"Error during {operation_name}: {error_message}", level="error")
            
            if hasattr(app, 'update_progress'):
                app.update_progress(0, f"Error during {operation_name}")
        
        # Show message to user if requested
        if show_message:
            messagebox.showerror("Error", f"Failed to {operation_name}: {error_message}")
    
    @staticmethod
    def handle_io_error(app, error, operation_name, show_message=True):
        """
        Handle I/O related errors (file operations, network, etc.)
        
        Args:
            app: The application instance
            error: The exception that occurred
            operation_name: Name of the operation where the error occurred
            show_message: Whether to show a message box to the user
            
        Returns:
            None
        """
        error_message = str(error)
        error_details = traceback.format_exc()
        
        # Log the error
        logger.error(f"I/O Error during {operation_name}: {error_message}")
        logger.debug(f"I/O Error details: {error_details}")
        
        # Print to console for immediate visibility
        print(f"I/O ERROR: Operation '{operation_name}' failed: {error_message}")
        
        # Update app UI if app is provided
        if app:
            if hasattr(app, 'log') and callable(app.log):
                app.log(f"I/O Error: {error_message}", level="error")
            
            if hasattr(app, 'update_progress'):
                app.update_progress(0, f"I/O Error during {operation_name}")
        
        # Show message to user if requested
        if show_message:
            messagebox.showerror("I/O Error", f"Failed to {operation_name}: {error_message}")
    
    @staticmethod
    def validate_input(condition, error_message, show_message=True):
        """
        Validate input conditions and raise appropriate exceptions
        
        Args:
            condition: Boolean condition to check
            error_message: Error message to show if condition is false
            show_message: Whether to show a message box to the user
            
        Returns:
            True if valid, raises ValueError otherwise
        """
        if not condition:
            logger.warning(f"Input validation failed: {error_message}")
            print(f"VALIDATION ERROR: {error_message}")
            
            if show_message:
                messagebox.showerror("Input Error", error_message)
            raise ValueError(error_message)
        return True
    
    @staticmethod
    def log_operation_start(operation_name, details=None):
        """
        Log the start of an operation
        
        Args:
            operation_name: Name of the operation
            details: Optional details about the operation
        """
        message = f"Starting operation: {operation_name}"
        if details:
            message += f" - {details}"
        
        logger.info(message)
        print(f"OPERATION: {message}")
    
    @staticmethod
    def log_operation_complete(operation_name, success=True, duration=None, details=None):
        """
        Log the completion of an operation
        
        Args:
            operation_name: Name of the operation
            success: Whether the operation was successful
            duration: How long the operation took (in seconds)
            details: Optional details about the result
        """
        status = "completed successfully" if success else "failed"
        message = f"Operation {operation_name} {status}"
        
        if duration is not None:
            message += f" in {duration:.2f} seconds"
        
        if details:
            message += f" - {details}"
        
        log_level = logging.INFO if success else logging.ERROR
        logger.log(log_level, message)
        print(f"OPERATION {'SUCCESS' if success else 'FAILED'}: {message}")
