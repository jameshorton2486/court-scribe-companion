
import tkinter as tk
from tkinter import ttk, messagebox
from modules.ui.file_tab import create_file_tab
from modules.ui.ai_tab import create_ai_tab
from modules.ui.chapter_tab import create_chapter_tab
from modules.document.document_processor import load_document, process_document
from modules.document.chapter_processor import save_all_chapters, generate_complete_book
from modules.ai.openai_integration import test_openai_connection
from modules.ai.content_reviewer import review_with_ai
from modules.ai.toc_generator import generate_ai_toc
from modules.ai.chapter_generator import generate_chapter_content, save_generated_chapter

class BookProcessor:
    def __init__(self, root):
        self.root = root
        self.root.title("Book Processor")
        self.root.geometry("1000x800")
        self.root.configure(bg="#f0f0f0")
        
        # Setup variables
        self.input_file = tk.StringVar()
        self.output_dir = tk.StringVar()
        self.book_title = tk.StringVar()
        self.author_name = tk.StringVar()
        self.current_status = tk.StringVar(value="Ready")
        self.progress_value = tk.DoubleVar(value=0.0)
        self.openai_api_key = tk.StringVar()
        self.chapter_outline = tk.StringVar()
        
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
        from tkinter import scrolledtext
        log_frame = ttk.LabelFrame(main_frame, text="Processing Log", padding=10)
        log_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.log_text = scrolledtext.ScrolledText(log_frame, width=80, height=10)
        self.log_text.pack(fill=tk.BOTH, expand=True)
        self.log_text.config(state=tk.DISABLED)
        
        # Progress and status (shared across tabs)
        progress_frame = ttk.Frame(main_frame)
        progress_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(progress_frame, text="Status:").pack(side=tk.LEFT, padx=5)
        ttk.Label(progress_frame, textvariable=self.current_status).pack(side=tk.LEFT, padx=5)
        
        self.progress_bar = ttk.Progressbar(progress_frame, variable=self.progress_value, length=400, mode="determinate")
        self.progress_bar.pack(side=tk.RIGHT, padx=5)
    
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
        self.root.update()
    
    # Connect UI actions to their respective modules
    def load_document(self):
        load_document(self)
    
    def process_document(self):
        process_document(self)
    
    def save_all_chapters(self):
        save_all_chapters(self)
    
    def generate_complete_book(self):
        generate_complete_book(self)
    
    def test_openai_connection(self):
        test_openai_connection(self)
    
    def review_with_ai(self):
        review_with_ai(self)
    
    def generate_ai_toc(self):
        generate_ai_toc(self)
    
    def on_chapter_select(self, event):
        if not self.chapters:
            return
            
        selection = self.chapter_listbox.curselection()
        if selection:
            index = selection[0]
            self.current_chapter_index = index
            
            # Display chapter title and update outline textarea
            chapter = self.chapters[index]
            self.outline_text.delete(1.0, tk.END)
            self.outline_text.insert(tk.END, f"Outline for: {chapter['title']}\n\n")
            
            # Clear preview
            self.preview_text.delete(1.0, tk.END)
            
            # Remove any image preview
            self.image_label.config(image=None)
    
    def prev_chapter(self):
        if self.chapters and self.current_chapter_index > 0:
            self.current_chapter_index -= 1
            self.chapter_listbox.selection_clear(0, tk.END)
            self.chapter_listbox.selection_set(self.current_chapter_index)
            self.chapter_listbox.see(self.current_chapter_index)
            self.on_chapter_select(None)
    
    def next_chapter(self):
        if self.chapters and self.current_chapter_index < len(self.chapters) - 1:
            self.current_chapter_index += 1
            self.chapter_listbox.selection_clear(0, tk.END)
            self.chapter_listbox.selection_set(self.current_chapter_index)
            self.chapter_listbox.see(self.current_chapter_index)
            self.on_chapter_select(None)
    
    def generate_chapter_content(self):
        generate_chapter_content(self)
    
    def save_generated_chapter(self):
        save_generated_chapter(self)
