
import tkinter as tk
from tkinter import ttk, messagebox, filedialog, scrolledtext
from modules.ui.file_tab import create_file_tab
from modules.ui.ai_tab import create_ai_tab
from modules.ui.chapter_tab import create_chapter_tab
from modules.ui.navigation_utils import on_chapter_select, prev_chapter, next_chapter
from modules.document.document_processor import load_document, process_document
from modules.document.chapter_processor import save_all_chapters, generate_complete_book
from modules.ui.file_actions import add_files, remove_file, update_file_listbox, batch_process_all
import threading
import time

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
        self.is_processing = False
        
        # Default output directory is 'output' in current directory
        import os
        default_output = os.path.join(os.getcwd(), "output")
        self.output_dir.set(default_output)
        
        # Document storage
        self.docx_content = None
        self.chapters = []
        self.toc = []
        self.current_chapter_index = 0
        
        # Create the main frame
        self.create_widgets()
    
    def create_widgets(self):
        # Main frame with notebook (tabs)
        main_frame = ttk.Frame(self.root, padding=10)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        notebook = ttk.Notebook(main_frame)
        notebook.pack(fill=tk.BOTH, expand=True)
        
        # Tab 1: File Processing
        file_tab = ttk.Frame(notebook, padding=10)
        notebook.add(file_tab, text="File Processing")
        
        # Tab 2: AI Enhancement
        ai_tab = ttk.Frame(notebook, padding=10)
        notebook.add(ai_tab, text="AI Enhancement")
        
        # Tab 3: Chapter Generation
        chapter_tab = ttk.Frame(notebook, padding=10)
        notebook.add(chapter_tab, text="Chapter Generation")
        
        # File tab contents
        create_file_tab(file_tab, self)
        
        # AI Enhancement tab contents
        create_ai_tab(ai_tab, self)
        
        # Chapter Generation tab contents
        create_chapter_tab(chapter_tab, self)
        
        # Log display (shared across tabs)
        log_frame = ttk.LabelFrame(main_frame, text="Processing Log", padding=10)
        log_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.log_text = scrolledtext.ScrolledText(log_frame, width=80, height=10)
        self.log_text.pack(fill=tk.BOTH, expand=True)
        self.log_text.config(state=tk.DISABLED)
        
        # Progress and status (shared across tabs)
        progress_frame = ttk.Frame(main_frame)
        progress_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(progress_frame, text="Status:").pack(side=tk.LEFT, padx=5)
        self.status_label = ttk.Label(progress_frame, textvariable=self.current_status, width=30, anchor=tk.W)
        self.status_label.pack(side=tk.LEFT, padx=5)
        
        # New spinner for indicating activity
        self.spinner_label = ttk.Label(progress_frame, text="")
        self.spinner_label.pack(side=tk.LEFT, padx=5)
        
        self.progress_bar = ttk.Progressbar(progress_frame, variable=self.progress_value, length=400, mode="determinate")
        self.progress_bar.pack(side=tk.RIGHT, padx=5)
        
        # Create cancel button for long-running operations
        self.cancel_button = ttk.Button(progress_frame, text="Cancel", command=self.cancel_operation, state=tk.DISABLED)
        self.cancel_button.pack(side=tk.RIGHT, padx=5)
    
    def log(self, message):
        self.log_text.config(state=tk.NORMAL)
        self.log_text.insert(tk.END, f"{message}\n")
        self.log_text.see(tk.END)
        self.log_text.config(state=tk.DISABLED)
        self.root.update()
    
    def update_progress(self, value, status=None):
        self.progress_value.set(value)
        if status:
            self.current_status.set(status)
        if value > 0 and value < 100:
            self.cancel_button.config(state=tk.NORMAL)
            if not self.is_processing:
                self.is_processing = True
                self.start_spinner()
        else:
            self.cancel_button.config(state=tk.DISABLED)
            self.is_processing = False
            self.stop_spinner()
        self.root.update()
    
    def start_spinner(self):
        """Start the spinner animation for long-running tasks"""
        self.spinner_chars = ["|", "/", "-", "\\"]
        self.spinner_index = 0
        self.update_spinner()
    
    def update_spinner(self):
        """Update the spinner animation"""
        if self.is_processing:
            self.spinner_label.config(text=f" {self.spinner_chars[self.spinner_index]} ")
            self.spinner_index = (self.spinner_index + 1) % len(self.spinner_chars)
            self.root.after(100, self.update_spinner)
    
    def stop_spinner(self):
        """Stop the spinner animation"""
        self.spinner_label.config(text="")
    
    def cancel_operation(self):
        """Cancel the current operation"""
        if self.is_processing:
            result = messagebox.askyesno("Cancel Operation", 
                                          "Are you sure you want to cancel the current operation?")
            if result:
                self.log("Operation cancelled by user")
                self.update_progress(0, "Operation cancelled")
                self.is_processing = False
    
    def run_with_progress(self, func, *args, **kwargs):
        """Run a function with progress indication"""
        self.is_processing = True
        self.update_progress(1, "Starting operation...")
        
        def worker():
            try:
                func(*args, **kwargs)
            except Exception as e:
                self.log(f"Error: {str(e)}")
                messagebox.showerror("Error", str(e))
            finally:
                self.update_progress(100, "Operation completed")
                self.is_processing = False
        
        thread = threading.Thread(target=worker)
        thread.daemon = True
        thread.start()
    
    # Core document processing methods
    def load_document(self):
        # Check if we have files in the list
        if not self.input_files:
            messagebox.showerror("Error", "Please add at least one input file")
            return
            
        # Get the selected file from the listbox or use the first one if none selected
        selected = self.file_listbox.curselection()
        if selected:
            file_index = selected[0]
            self.input_file.set(self.input_files[file_index])
        else:
            self.input_file.set(self.input_files[0])
        
        self.run_with_progress(load_document, self)
    
    # Delegate to file action methods
    def add_files(self):
        add_files(self)
    
    def remove_file(self):
        remove_file(self)
    
    def update_file_listbox(self):
        update_file_listbox(self)
    
    def batch_process_all(self):
        self.run_with_progress(batch_process_all, self)
    
    # Document processing methods
    def process_document(self):
        self.run_with_progress(process_document, self)
    
    def save_all_chapters(self):
        self.run_with_progress(save_all_chapters, self)
    
    def generate_complete_book(self):
        self.run_with_progress(generate_complete_book, self)
    
    # AI-related methods
    from modules.ai.openai_integration import test_openai_connection
    from modules.ai.content_reviewer import review_with_ai
    from modules.ai.toc_generator import generate_ai_toc
    from modules.ai.chapter_generator import generate_chapter_content, save_generated_chapter
