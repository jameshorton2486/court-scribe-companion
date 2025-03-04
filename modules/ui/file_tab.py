
import tkinter as tk
from tkinter import ttk, filedialog

def create_file_tab(parent, app):
    # File input section
    file_frame = ttk.LabelFrame(parent, text="File Selection", padding=10)
    file_frame.pack(fill=tk.X, pady=5)
    
    # Add a listbox to display multiple selected files
    ttk.Label(file_frame, text="Input Files:").grid(row=0, column=0, sticky=tk.W, pady=5)
    
    # Create a frame to hold the listbox and scrollbar
    list_frame = ttk.Frame(file_frame)
    list_frame.grid(row=0, column=1, padx=5, pady=5, sticky=tk.W+tk.E)
    
    # Add scrollbar
    scrollbar = ttk.Scrollbar(list_frame)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    # Create listbox for files
    app.file_listbox = tk.Listbox(list_frame, width=45, height=5, yscrollcommand=scrollbar.set)
    app.file_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    scrollbar.config(command=app.file_listbox.yview)
    
    # Buttons for file operations
    file_btn_frame = ttk.Frame(file_frame)
    file_btn_frame.grid(row=0, column=2, padx=5, pady=5)
    
    ttk.Button(file_btn_frame, text="Add DOCX...", command=app.browse_input_file).pack(fill=tk.X, pady=2)
    ttk.Button(file_btn_frame, text="Add TXT...", command=app.browse_text_file).pack(fill=tk.X, pady=2)
    ttk.Button(file_btn_frame, text="Remove Selected", command=app.remove_selected_file).pack(fill=tk.X, pady=2)
    
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
    
    # Batch processing option
    app.batch_process = tk.BooleanVar(value=False)
    ttk.Checkbutton(options_frame, text="Batch Process All Files", variable=app.batch_process).grid(row=4, column=0, sticky=tk.W, pady=2)
    
    # Action buttons
    button_frame = ttk.Frame(parent)
    button_frame.pack(fill=tk.X, pady=10)
    
    ttk.Button(button_frame, text="Load Selected Document", command=app.load_document, width=20).pack(side=tk.LEFT, padx=5)
    ttk.Button(button_frame, text="Process Document", command=app.process_document, width=20).pack(side=tk.LEFT, padx=5)
    ttk.Button(button_frame, text="Save All Chapters", command=app.save_all_chapters, width=20).pack(side=tk.LEFT, padx=5)
    ttk.Button(button_frame, text="Generate Complete Book", command=app.generate_complete_book, width=20).pack(side=tk.LEFT, padx=5)

    # Add helper methods to app
    def browse_input_file():
        file_paths = filedialog.askopenfilenames(
            filetypes=[("Word Documents", "*.docx"), ("All Files", "*.*")]
        )
        if file_paths:
            for file_path in file_paths:
                # Check if file is already in the list
                if file_path not in app.input_files:
                    app.input_files.append(file_path)
                    app.file_listbox.insert(tk.END, file_path)
                    
            # Try to extract title from first filename if no title set
            if not app.book_title.get() and len(app.input_files) > 0:
                import os
                filename = os.path.basename(app.input_files[0])
                title, _ = os.path.splitext(filename)
                app.book_title.set(title)
    
    def browse_text_file():
        file_paths = filedialog.askopenfilenames(
            filetypes=[("Text Files", "*.txt"), ("Markdown", "*.md"), ("All Files", "*.*")]
        )
        if file_paths:
            for file_path in file_paths:
                # Check if file is already in the list
                if file_path not in app.input_files:
                    app.input_files.append(file_path)
                    app.file_listbox.insert(tk.END, file_path)
                    
            # Try to extract title from first filename if no title set
            if not app.book_title.get() and len(app.input_files) > 0:
                import os
                filename = os.path.basename(app.input_files[0])
                title, _ = os.path.splitext(filename)
                app.book_title.set(title)
    
    def remove_selected_file():
        try:
            # Get selected indices
            selected_indices = app.file_listbox.curselection()
            
            # Remove files in reverse order to avoid index shifting
            for index in sorted(selected_indices, reverse=True):
                file_path = app.file_listbox.get(index)
                app.input_files.remove(file_path)
                app.file_listbox.delete(index)
                
        except Exception as e:
            print(f"Error removing file: {e}")
    
    def browse_output_dir():
        dir_path = filedialog.askdirectory()
        if dir_path:
            app.output_dir.set(dir_path)
    
    # Attach methods to app
    app.browse_input_file = browse_input_file
    app.browse_text_file = browse_text_file
    app.remove_selected_file = remove_selected_file
    app.browse_output_dir = browse_output_dir
