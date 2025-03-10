
"""
Operation Handler Module

This module provides a unified interface for all document processing operations
by coordinating specialized operation handlers.
"""

from modules.ui.handlers.document_operations import DocumentOperationHandler
from modules.ui.handlers.chapter_operations import ChapterOperationHandler
from modules.ui.handlers.batch_operations import BatchOperationHandler

class OperationHandler:
    """
    Coordinates all operation handlers to provide a unified interface
    
    This class delegates operations to specialized handlers based on the
    operation type, while providing a consistent interface to the application.
    
    Attributes:
        app: The application instance containing UI elements and data
        document_handler: Handler for document operations
        chapter_handler: Handler for chapter operations
        batch_handler: Handler for batch operations
    """
    
    def __init__(self, app):
        """
        Initialize the operation handler system
        
        Args:
            app: The application instance
        """
        self.app = app
        self.document_handler = DocumentOperationHandler(app)
        self.chapter_handler = ChapterOperationHandler(app)
        self.batch_handler = BatchOperationHandler(app)
        self.operation_results = {}
    
    # Document operations
    def load_document(self):
        """Delegate to document handler"""
        return self.document_handler.load_document()
    
    def process_document(self):
        """Delegate to document handler"""
        return self.document_handler.process_document()
    
    # Chapter operations
    def save_all_chapters(self):
        """Delegate to chapter handler"""
        return self.chapter_handler.save_all_chapters()
    
    def generate_complete_book(self):
        """Delegate to chapter handler"""
        return self.chapter_handler.generate_complete_book()
    
    # Batch operations
    def batch_process_all(self):
        """Delegate to batch handler"""
        return self.batch_handler.batch_process_all()
    
    def get_operation_result(self, operation_name):
        """
        Get the result of a specific operation from the appropriate handler
        
        Args:
            operation_name: Name of the operation to retrieve result for
            
        Returns:
            The result of the operation, or None if not available
        """
        # Check each handler for the result
        result = self.document_handler.get_operation_result(operation_name)
        if result is not None:
            return result
            
        result = self.chapter_handler.get_operation_result(operation_name)
        if result is not None:
            return result
            
        result = self.batch_handler.get_operation_result(operation_name)
        if result is not None:
            return result
            
        # Fall back to the local operation_results
        return self.operation_results.get(operation_name)
