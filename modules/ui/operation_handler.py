
from tkinter import messagebox
from modules.document.document_loader import load_document
from modules.document.document_processor import process_document
from modules.document.chapter_processor import save_all_chapters, generate_complete_book
from modules.ui.file_actions import batch_process_all

class OperationHandler:
    """Handles document processing operations with improved error handling"""
    
    def __init__(self, app):
        self.app = app
        self.operation_results = {}
        
    def load_document(self):
        """Load a document from the selected file with enhanced validation"""
        # Check if we have files in the list
        if not self.app.input_files:
            self.app.log.warning("Attempted to load document with no input files")
            messagebox.showerror("Error", "Please add at least one input file")
            return
            
        # Get the selected file from the listbox or use the first one if none selected
        selected = self.app.file_listbox.curselection()
        if selected:
            file_index = selected[0]
            self.app.input_file.set(self.app.input_files[file_index])
        else:
            self.app.input_file.set(self.app.input_files[0])
        
        self.app.log.info(f"Loading document: {self.app.input_file.get()}")
        self.operation_results['load_document'] = None
        thread = self.app.background_processor.run_with_progress(load_document, self.app)
        return thread
    
    def process_document(self):
        """Process the loaded document with improved validation"""
        if not hasattr(self.app, 'docx_content') or not self.app.docx_content:
            self.app.log.warning("Attempted to process document before loading")
            messagebox.showerror("Error", "Please load a document first")
            return
            
        self.app.log.info("Processing document...")
        self.operation_results['process_document'] = None
        thread = self.app.background_processor.run_with_progress(process_document, self.app)
        return thread
    
    def save_all_chapters(self):
        """Save all chapters to files with validation"""
        if not hasattr(self.app, 'chapters') or not self.app.chapters:
            self.app.log.warning("Attempted to save chapters with no chapters available")
            messagebox.showerror("Error", "No chapters available to save. Please process a document first.")
            return
            
        self.app.log.info("Saving all chapters...")
        self.operation_results['save_chapters'] = None
        thread = self.app.background_processor.run_with_progress(save_all_chapters, self.app)
        return thread
    
    def generate_complete_book(self):
        """Generate a complete book from processed chapters with validation"""
        if not hasattr(self.app, 'chapters') or not self.app.chapters:
            self.app.log.warning("Attempted to generate book with no chapters available")
            messagebox.showerror("Error", "No chapters available. Please process a document first.")
            return
            
        self.app.log.info("Generating complete book...")
        self.operation_results['generate_book'] = None
        thread = self.app.background_processor.run_with_progress(generate_complete_book, self.app)
        return thread
    
    def batch_process_all(self):
        """Process all documents in the input list with validation"""
        if not self.app.input_files:
            self.app.log.warning("Attempted batch processing with no input files")
            messagebox.showerror("Error", "Please add at least one input file")
            return
            
        self.app.log.info(f"Starting batch processing of {len(self.app.input_files)} files...")
        self.operation_results['batch_process'] = None
        thread = self.app.background_processor.run_with_progress(batch_process_all, self.app)
        return thread
        
    def get_operation_result(self, operation_name):
        """Get the result of a specific operation"""
        return self.operation_results.get(operation_name)
