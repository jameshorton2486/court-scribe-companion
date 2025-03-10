
"""
Base Operation Handler Module

This module provides the base class for all operation handlers with common functionality.
"""

from modules.utils.error_handler import ErrorHandler

class BaseOperationHandler:
    """
    Base class for all operation handlers
    
    This class provides common functionality for all operation handlers,
    including result tracking and error handling.
    
    Attributes:
        app: The application instance containing UI elements and data
        operation_results: Dictionary tracking results of operations
    """
    
    def __init__(self, app):
        """
        Initialize the operation handler
        
        Args:
            app: The application instance
        """
        self.app = app
        self.operation_results = {}
    
    def get_operation_result(self, operation_name):
        """
        Get the result of a specific operation
        
        Args:
            operation_name: Name of the operation to retrieve result for
            
        Returns:
            The result of the operation, or None if not available
        """
        return self.operation_results.get(operation_name)
