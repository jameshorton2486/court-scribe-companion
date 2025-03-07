
import tkinter as tk
from tkinter import ttk, messagebox
import os
from modules.ui.file_tab import create_file_tab
from modules.ui.ai_tab import create_ai_tab
from modules.ui.chapter_tab import create_chapter_tab
from modules.ui.navigation_utils import on_chapter_select, prev_chapter, next_chapter
from modules.ui.file_actions import add_files, remove_file, update_file_listbox
from modules.ui.status_manager import StatusManager
from modules.ui.log_manager import LogManager
from modules.ui.background_processor import BackgroundProcessor
from modules.ui.operation_handler import OperationHandler
from modules.ui.ui_builder import create_main_ui

class BookProcessor:
    def __init__(self, root):
        self.root = root
        self.root.title("Book Processor")
        self.root.geometry("1000x800")
        self.root.configure(bg="#f0f0f0")
        
        # Setup variables
        self.input_file = tk.StringVar()
        self.input_files = []
        self.output_dir = tk.StringVar()
        self.book_title = tk.StringVar()
        self.author_name = tk.StringVar()
        self.current_status = tk.StringVar(value="Ready")
        self.progress_value = tk.DoubleVar(value=0.0)
        self.openai_api_key = tk.StringVar()
        self.chapter_outline = tk.StringVar()
        
        # Default output directory is 'output' in current directory
        default_output = os.path.join(os.getcwd(), "output")
        self.output_dir.set(default_output)
        
        # Create managers and handlers
        self.status_manager = StatusManager(self.root, self.current_status, self.progress_value)
        self.background_processor = BackgroundProcessor(self)
        self.operation_handler = OperationHandler(self)
        
        # Document storage
        self.docx_content = None
        self.chapters = []
        self.toc = []
        self.current_chapter_index = 0
        
        # Create the main frame
        create_main_ui(self)
    
    def log(self, message):
        """Add a message to the log"""
        self.log_manager.log(message)
    
    def update_progress(self, value, status=None):
        """Update progress bar and status"""
        self.status_manager.update_progress(value, status)
    
    def cancel_operation(self):
        """Cancel the current operation"""
        if self.status_manager.is_processing:
            result = messagebox.askyesno("Cancel Operation", 
                                          "Are you sure you want to cancel the current operation?")
            if result:
                self.log("Operation cancelled by user")
                self.update_progress(0, "Operation cancelled")
                self.status_manager.set_cancelled(True)
    
    def run_with_progress(self, func, *args, **kwargs):
        """Run a function with progress indication"""
        self.background_processor.run_with_progress(func, *args, **kwargs)
    
    # Core document processing methods
    def load_document(self):
        self.operation_handler.load_document()
    
    # Delegate to file action methods
    def add_files(self):
        add_files(self)
    
    def remove_file(self):
        remove_file(self)
    
    def update_file_listbox(self):
        update_file_listbox(self)
    
    def batch_process_all(self):
        self.operation_handler.batch_process_all()
    
    # Document processing methods
    def process_document(self):
        self.operation_handler.process_document()
    
    def save_all_chapters(self):
        self.operation_handler.save_all_chapters()
    
    def generate_complete_book(self):
        self.operation_handler.generate_complete_book()
    
    # Navigation methods
    def on_chapter_select(self, event):
        on_chapter_select(self, event)
    
    def prev_chapter(self):
        prev_chapter(self)
    
    def next_chapter(self):
        next_chapter(self)
    
    # AI-related methods
    from modules.ai.openai_integration import test_openai_connection
    from modules.ai.content_reviewer import review_with_ai
    from modules.ai.toc_generator import generate_ai_toc
    from modules.ai.chapter_gen.generator import generate_chapter_content
    from modules.ai.chapter_gen.exporter import save_generated_chapter
