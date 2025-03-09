
"""
Error Handling Module

This module provides standardized error handling functions to ensure
consistent error management across the application.
"""

import traceback
import logging
from tkinter import messagebox

# Configure logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
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
        
        # Update app UI if app is provided
        if app:
            if hasattr(app, 'log') and app.log:
                app.log.error(f"Error during {operation_name}: {error_message}")
            
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
        
        # Log the error
        logger.error(f"I/O Error during {operation_name}: {error_message}")
        
        # Update app UI if app is provided
        if app:
            if hasattr(app, 'log') and app.log:
                app.log.error(f"I/O Error: {error_message}")
            
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
            if show_message:
                messagebox.showerror("Input Error", error_message)
            raise ValueError(error_message)
        return True
