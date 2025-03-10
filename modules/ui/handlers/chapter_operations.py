
"""
Chapter Operations Handler Module

This module manages chapter-related operations such as saving chapters and generating books.
"""

from modules.utils.error_handler import ErrorHandler
from modules.ui.handlers.operation_base import BaseOperationHandler

class ChapterOperationHandler(BaseOperationHandler):
    """
    Handles chapter-related operations
    
    This class encapsulates the logic for executing chapter-related operations,
    including saving chapters and generating complete books.
    """
    
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
