
from tkinter import messagebox
from modules.document.document_loader import load_document
from modules.document.document_processor import process_document
from modules.document.chapter_processor import save_all_chapters, generate_complete_book
from modules.ui.file_actions import batch_process_all

class OperationHandler:
    """Handles document processing operations"""
    
    def __init__(self, app):
        self.app = app
        
    def load_document(self):
        """Load a document from the selected file"""
        # Check if we have files in the list
        if not self.app.input_files:
            messagebox.showerror("Error", "Please add at least one input file")
            return
            
        # Get the selected file from the listbox or use the first one if none selected
        selected = self.app.file_listbox.curselection()
        if selected:
            file_index = selected[0]
            self.app.input_file.set(self.app.input_files[file_index])
        else:
            self.app.input_file.set(self.app.input_files[0])
        
        self.app.background_processor.run_with_progress(load_document, self.app)
    
    def process_document(self):
        """Process the loaded document"""
        self.app.background_processor.run_with_progress(process_document, self.app)
    
    def save_all_chapters(self):
        """Save all chapters to files"""
        self.app.background_processor.run_with_progress(save_all_chapters, self.app)
    
    def generate_complete_book(self):
        """Generate a complete book from processed chapters"""
        self.app.background_processor.run_with_progress(generate_complete_book, self.app)
    
    def batch_process_all(self):
        """Process all documents in the input list"""
        self.app.background_processor.run_with_progress(batch_process_all, self.app)
