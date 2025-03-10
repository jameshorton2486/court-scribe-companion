
"""
Batch Operations Handler Module

This module manages batch processing operations for multiple documents.
"""

from modules.utils.error_handler import ErrorHandler
from modules.ui.handlers.operation_base import BaseOperationHandler

class BatchOperationHandler(BaseOperationHandler):
    """
    Handles batch processing operations
    
    This class encapsulates the logic for executing batch processing operations
    on multiple documents.
    """
    
    def batch_process_all(self):
        """
        Process all documents in the input list with validation
        
        This operation validates that input files exist,
        then processes each document in sequence.
        
        Returns:
            Thread handle for the background operation
        """
        try:
            # Verify input files exist
            ErrorHandler.validate_input(
                self.app.input_files,
                "Please add at least one input file"
            )
                
            self.app.log.info(f"Starting batch processing of {len(self.app.input_files)} files...")
            self.operation_results['batch_process'] = None
            
            # Import here to avoid circular imports
            from modules.ui.file_actions import batch_process_all
            thread = self.app.background_processor.run_with_progress(batch_process_all, self.app)
            return thread
        except ValueError:
            # Already handled by ErrorHandler
            return None
        except Exception as e:
            ErrorHandler.handle_processing_error(self.app, e, "batch process")
            return None
