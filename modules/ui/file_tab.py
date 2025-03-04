
import tkinter as tk
from tkinter import ttk, filedialog

def create_file_tab(parent, app):
    # File input section
    file_frame = ttk.LabelFrame(parent, text="File Selection", padding=10)
    file_frame.pack(fill=tk.X, pady=5)
    
    ttk.Label(file_frame, text="Input DOCX File:").grid(row=0, column=0, sticky=tk.W, pady=5)
    ttk.Entry(file_frame, textvariable=app.input_file, width=50).grid(row=0, column=1, padx=5, pady=5)
    ttk.Button(file_frame, text="Browse...", command=app.browse_input_file).grid(row=0, column=2, padx=5, pady=5)
    
    ttk.Label(file_frame, text="Output Directory:").grid(row=1, column=0, sticky=tk.W, pady=5)
    ttk.Entry(file_frame, textvariable=app.output_dir, width=50).grid(row=1, column=1, padx=5, pady=5)
    ttk.Button(file_frame, text="Browse...", command=app.browse_output_dir).grid(row=1, column=2, padx=5, pady=5)
    
    # Book metadata section
    metadata_frame = ttk.LabelFrame(parent, text="Book Metadata", padding=10)
    metadata_frame.pack(fill=tk.X, pady=5)
    
    ttk.Label(metadata_frame, text="Book Title:").grid(row=0, column=0, sticky=tk.W, pady=5)
    ttk.Entry(metadata_frame, textvariable=app.book_title, width=50).grid(row=0, column=1, padx=5, pady=5)
    
    ttk.Label(metadata_frame, text="Author Name:").grid(row=1, column=0, sticky=tk.W, pady=5)
    ttk.Entry(metadata_frame, textvariable=app.author_name, width=50).grid(row=1, column=1, padx=5, pady=5)
    
    # Processing options section
    options_frame = ttk.LabelFrame(parent, text="Processing Options", padding=10)
    options_frame.pack(fill=tk.X, pady=5)
    
    # Add checkboxes for different processing options
    app.fix_encoding = tk.BooleanVar(value=True)
    ttk.Checkbutton(options_frame, text="Fix Text Encoding Issues", variable=app.fix_encoding).grid(row=0, column=0, sticky=tk.W, pady=2)
    
    app.generate_toc = tk.BooleanVar(value=True)
    ttk.Checkbutton(options_frame, text="Generate Table of Contents", variable=app.generate_toc).grid(row=1, column=0, sticky=tk.W, pady=2)
    
    app.create_chapters = tk.BooleanVar(value=True)
    ttk.Checkbutton(options_frame, text="Create Chapter Outlines", variable=app.create_chapters).grid(row=2, column=0, sticky=tk.W, pady=2)
    
    app.enhance_content = tk.BooleanVar(value=False)
    ttk.Checkbutton(options_frame, text="Enhance Book Content (Experimental)", variable=app.enhance_content).grid(row=3, column=0, sticky=tk.W, pady=2)
    
    # Action buttons
    button_frame = ttk.Frame(parent)
    button_frame.pack(fill=tk.X, pady=10)
    
    ttk.Button(button_frame, text="Load Document", command=app.load_document, width=20).pack(side=tk.LEFT, padx=5)
    ttk.Button(button_frame, text="Process Document", command=app.process_document, width=20).pack(side=tk.LEFT, padx=5)
    ttk.Button(button_frame, text="Save All Chapters", command=app.save_all_chapters, width=20).pack(side=tk.LEFT, padx=5)
    ttk.Button(button_frame, text="Generate Complete Book", command=app.generate_complete_book, width=20).pack(side=tk.LEFT, padx=5)

    # Add helper methods to app
    def browse_input_file():
        file_path = filedialog.askopenfilename(
            filetypes=[("Word Documents", "*.docx"), ("All Files", "*.*")]
        )
        if file_path:
            app.input_file.set(file_path)
            # Try to extract title from filename
            import os
            filename = os.path.basename(file_path)
            title, _ = os.path.splitext(filename)
            if not app.book_title.get():
                app.book_title.set(title)
    
    def browse_output_dir():
        dir_path = filedialog.askdirectory()
        if dir_path:
            app.output_dir.set(dir_path)
    
    # Attach methods to app
    app.browse_input_file = browse_input_file
    app.browse_output_dir = browse_output_dir
