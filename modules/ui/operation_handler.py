
"""
Operation Handler Module

This module manages document processing operations with error handling,
threading, and user feedback mechanisms.
"""

from tkinter import messagebox
from modules.utils.error_handler import ErrorHandler

class OperationHandler:
    """
    Handles document processing operations with improved error handling
    
    This class encapsulates the logic for executing document processing operations,
    including validation, error handling, and result tracking.
    
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
        
    def load_document(self):
        """
        Load a document from the selected file with enhanced validation
        
        This operation validates input, selects the appropriate file,
        and loads the document content.
        
        Returns:
            Thread handle for the background operation
        """
        try:
            # Check if we have files in the list
            ErrorHandler.validate_input(self.app.input_files, "Please add at least one input file")
                
            # Get the selected file from the listbox or use the first one if none selected
            selected = self.app.file_listbox.curselection()
            if selected:
                file_index = selected[0]
                self.app.input_file.set(self.app.input_files[file_index])
            else:
                self.app.input_file.set(self.app.input_files[0])
            
            self.app.log.info(f"Loading document: {self.app.input_file.get()}")
            self.operation_results['load_document'] = None
            
            # Import here to avoid circular imports
            from modules.document.document_loader import load_document
            thread = self.app.background_processor.run_with_progress(load_document, self.app)
            return thread
        except ValueError:
            # Already handled by ErrorHandler
            return None
        except Exception as e:
            ErrorHandler.handle_processing_error(self.app, e, "load document")
            return None
    
    def process_document(self):
        """
        Process the loaded document with improved validation
        
        This operation validates that a document has been loaded,
        then processes it to extract content and structure.
        
        Returns:
            Thread handle for the background operation
        """
        try:
            # Check if document is loaded
            ErrorHandler.validate_input(
                hasattr(self.app, 'docx_content') and self.app.docx_content,
                "Please load a document first"
            )
                
            self.app.log.info("Processing document...")
            self.operation_results['process_document'] = None
            
            # Import here to avoid circular imports
            from modules.document.document_processor import process_document
            thread = self.app.background_processor.run_with_progress(process_document, self.app)
            return thread
        except ValueError:
            # Already handled by ErrorHandler
            return None
        except Exception as e:
            ErrorHandler.handle_processing_error(self.app, e, "process document")
            return None
    
    def save_all_chapters(self):
        """
        Save all chapters to files with validation
        
        This operation validates that chapters exist,
        then saves each chapter as a separate file.
        
        Returns:
            Thread handle for the background operation
        """
        try:
            # Verify chapters exist
            ErrorHandler.validate_input(
                hasattr(self.app, 'chapters') and self.app.chapters,
                "No chapters available to save. Please process a document first."
            )
                
            self.app.log.info("Saving all chapters...")
            self.operation_results['save_chapters'] = None
            
            # Import here to avoid circular imports
            from modules.document.chapter_processor import save_all_chapters
            thread = self.app.background_processor.run_with_progress(save_all_chapters, self.app)
            return thread
        except ValueError:
            # Already handled by ErrorHandler
            return None
        except Exception as e:
            ErrorHandler.handle_processing_error(self.app, e, "save chapters")
            return None
    
    def generate_complete_book(self):
        """
        Generate a complete book from processed chapters with validation
        
        This operation validates that chapters exist,
        then combines them into a single document with formatting.
        
        Returns:
            Thread handle for the background operation
        """
        try:
            # Verify chapters exist
            ErrorHandler.validate_input(
                hasattr(self.app, 'chapters') and self.app.chapters,
                "No chapters available. Please process a document first."
            )
                
            self.app.log.info("Generating complete book...")
            self.operation_results['generate_book'] = None
            
            # Import here to avoid circular imports
            from modules.document.chapter_processor import generate_complete_book
            thread = self.app.background_processor.run_with_progress(generate_complete_book, self.app)
            return thread
        except ValueError:
            # Already handled by ErrorHandler
            return None
        except Exception as e:
            ErrorHandler.handle_processing_error(self.app, e, "generate book")
            return None
    
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
        
    def get_operation_result(self, operation_name):
        """
        Get the result of a specific operation
        
        Args:
            operation_name: Name of the operation to retrieve result for
            
        Returns:
            The result of the operation, or None if not available
        """
        return self.operation_results.get(operation_name)
