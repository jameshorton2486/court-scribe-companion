
"""
Base Operation Handler Module

This module provides the base class for all operation handlers with common functionality.
"""

from modules.utils.error_handler import ErrorHandler
from modules.utils.encoding_utils import contains_encoding_issues, log_encoding_issues
import os
import logging

class BaseOperationHandler:
    """
    Base class for all operation handlers
    
    This class provides common functionality for all operation handlers,
    including result tracking, error handling, and encoding issue detection.
    
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
        
        # Ensure Logs directory exists
        logs_dir = os.path.join(os.getcwd(), "Logs")
        if not os.path.exists(logs_dir):
            os.makedirs(logs_dir)
            print(f"Created Logs directory at: {logs_dir}")
        
        # Set up a file handler for logging encoding issues
        encoding_log_path = os.path.join(logs_dir, "encoding_issues.log")
        self.encoding_logger = logging.getLogger("encoding_issues")
        self.encoding_logger.setLevel(logging.INFO)
        
        # Create a file handler
        file_handler = logging.FileHandler(encoding_log_path)
        file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        self.encoding_logger.addHandler(file_handler)
    
    def get_operation_result(self, operation_name):
        """
        Get the result of a specific operation
        
        Args:
            operation_name: Name of the operation to retrieve result for
            
        Returns:
            The result of the operation, or None if not available
        """
        return self.operation_results.get(operation_name)
    
    def check_for_encoding_issues(self, text):
        """
        Check if text has encoding issues
        
        Args:
            text: The text to check
            
        Returns:
            True if encoding issues are detected, False otherwise
        """
        return contains_encoding_issues(text)
    
    def log_document_info(self, document, file_path=None):
        """
        Log information about the processed document
        
        Args:
            document: The document object
            file_path: Optional file path of the document
        """
        try:
            if not hasattr(document, 'paragraphs'):
                return
                
            # Log basic document info
            self.app.log.info(f"Document has {len(document.paragraphs)} paragraphs")
            
            # Sample a few paragraphs to check for encoding issues
            sample_size = min(10, len(document.paragraphs))
            samples = [p.text for p in document.paragraphs[:sample_size] if p.text.strip()]
            
            # Check samples for encoding issues
            has_issues = False
            for i, sample in enumerate(samples):
                if contains_encoding_issues(sample):
                    has_issues = True
                    self.app.log.warning(f"Encoding issues detected in paragraph {i}")
                    log_encoding_issues(sample, file_path, self.encoding_logger)
                    break
            
            if has_issues:
                print("WARNING: Encoding issues detected in document. See 'Logs/encoding_issues.log' for details.")
                self.app.update_progress(self.app.progress_value.get(), "Document loaded with encoding issues")
                
        except Exception as e:
            self.app.log.error(f"Error logging document info: {str(e)}")

