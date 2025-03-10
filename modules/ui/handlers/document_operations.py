
"""
Document Operations Handler Module

This module manages document loading and processing operations.
"""

from modules.utils.error_handler import ErrorHandler
from modules.ui.handlers.operation_base import BaseOperationHandler
from tkinter import messagebox
import os

class DocumentOperationHandler(BaseOperationHandler):
    """
    Handles document loading and processing operations
    
    This class encapsulates the logic for loading and processing documents,
    including validation, error handling, and encoding issue detection.
    """
    
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
            
            file_path = self.app.input_file.get()
            print(f"Loading document: {os.path.basename(file_path)}")
            self.app.log.info(f"Loading document: {file_path}")
            self.operation_results['load_document'] = None
            
            # Import here to avoid circular imports
            from modules.document.document_loader import load_document
            thread = self.app.background_processor.run_with_progress(load_document, self.app)
            
            # After loading, check for encoding issues
            def check_encoding_after_load():
                if hasattr(self.app, 'docx_content') and self.app.docx_content:
                    self.log_document_info(self.app.docx_content, file_path)
            
            # Set a callback to run after thread completion
            self.app.background_processor.add_completion_callback(check_encoding_after_load)
            
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
                
            print(f"Processing document: {self.app.book_title.get() or 'Untitled'}")
            self.app.log.info("Processing document...")
            self.operation_results['process_document'] = None
            
            # Check for encoding issues before processing
            if hasattr(self.app, 'docx_content'):
                samples = [p.text for p in self.app.docx_content.paragraphs[:10] if p.text.strip()]
                for sample in samples:
                    if self.check_for_encoding_issues(sample):
                        result = messagebox.askyesno(
                            "Encoding Issues Detected", 
                            "Potential encoding issues detected in the document. "
                            "Text may appear garbled or contain strange characters. "
                            "Would you like to apply automatic encoding fixes?"
                        )
                        if result:
                            print("Applying automatic encoding fixes...")
                            self.app.fix_encoding.set(True)
                        break
            
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
