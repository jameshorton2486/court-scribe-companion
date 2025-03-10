
"""
File Tab UI Module

This module contains functions to create the UI components for the file tab,
including file list, metadata input fields, and processing options.
"""

import tkinter as tk
from tkinter import ttk
from tkinter import font as tkFont
from modules.ui.file_tab_actions import browse_input_file, browse_text_file, remove_selected_file, browse_output_dir, select_all_files, deselect_all_files

def create_file_list_section(parent, app):
    """Create the file list section of the file tab."""
    file_frame = ttk.LabelFrame(parent, text="File Selection", padding=10)
    file_frame.pack(fill=tk.X, pady=5)
    
    # Title and file count
    header_frame = ttk.Frame(file_frame)
    header_frame.grid(row=0, column=0, columnspan=3, sticky=tk.W+tk.E, pady=(0, 5))
    
    ttk.Label(header_frame, text="Input Files:").pack(side=tk.LEFT)
    
    # File count display
    app.file_count_var = tk.StringVar(value="Files: 0")
    ttk.Label(header_frame, textvariable=app.file_count_var).pack(side=tk.RIGHT)
    
    # Create a frame to hold the listbox and scrollbar
    list_frame = ttk.Frame(file_frame)
    list_frame.grid(row=1, column=0, columnspan=2, padx=5, pady=5, sticky=tk.W+tk.E+tk.N+tk.S)
    list_frame.columnconfigure(0, weight=1)
    list_frame.rowconfigure(0, weight=1)
    
    # Create a frame for the scrollbars
    scrollbar_frame = ttk.Frame(list_frame)
    scrollbar_frame.grid(row=0, column=1, sticky=tk.N+tk.S)
    
    # Add vertical scrollbar
    y_scrollbar = ttk.Scrollbar(scrollbar_frame)
    y_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    # Create listbox for files with improved styling
    custom_font = tkFont.Font(family="Arial", size=10)
    app.file_listbox = tk.Listbox(
        list_frame, 
        width=45, 
        height=8, 
        yscrollcommand=y_scrollbar.set,
        selectmode=tk.EXTENDED,
        font=custom_font,
        activestyle='dotbox',
        bg='white',
        fg='black',
        selectbackground='#0078D7',
        selectforeground='white'
    )
    app.file_listbox.grid(row=0, column=0, sticky=tk.N+tk.S+tk.E+tk.W)
    y_scrollbar.config(command=app.file_listbox.yview)
    
    # Selection controls
    selection_frame = ttk.Frame(file_frame)
    selection_frame.grid(row=2, column=0, columnspan=2, sticky=tk.W, pady=(0, 5))
    
    ttk.Button(selection_frame, text="Select All", command=lambda: select_all_files(app), width=10).pack(side=tk.LEFT, padx=(0, 5))
    ttk.Button(selection_frame, text="Deselect All", command=lambda: deselect_all_files(app), width=10).pack(side=tk.LEFT)
    
    # Buttons for file operations with icons
    file_btn_frame = ttk.Frame(file_frame)
    file_btn_frame.grid(row=1, column=2, padx=5, pady=5, sticky=tk.N)
    
    # Create styled buttons
    style = ttk.Style()
    style.configure('Action.TButton', font=('Arial', 10))
    
    ttk.Button(
        file_btn_frame, 
        text="Add DOCX Files", 
        command=lambda: browse_input_file(app),
        style='Action.TButton'
    ).pack(fill=tk.X, pady=2)
    
    ttk.Button(
        file_btn_frame, 
        text="Add Text Files", 
        command=lambda: browse_text_file(app),
        style='Action.TButton'
    ).pack(fill=tk.X, pady=2)
    
    ttk.Button(
        file_btn_frame, 
        text="Remove Selected", 
        command=lambda: remove_selected_file(app),
        style='Action.TButton'
    ).pack(fill=tk.X, pady=2)
    
    # Output directory selection
    output_frame = ttk.Frame(file_frame)
    output_frame.grid(row=3, column=0, columnspan=3, sticky=tk.W+tk.E, pady=5)
    
    ttk.Label(output_frame, text="Output Directory:").grid(row=0, column=0, sticky=tk.W, pady=5)
    ttk.Entry(output_frame, textvariable=app.output_dir, width=50).grid(row=0, column=1, padx=5, pady=5, sticky=tk.W+tk.E)
    ttk.Button(output_frame, text="Browse...", command=lambda: browse_output_dir(app)).grid(row=0, column=2, padx=5, pady=5)
    
    return file_frame

def create_metadata_section(parent, app):
    """Create the book metadata section of the file tab."""
    metadata_frame = ttk.LabelFrame(parent, text="Book Metadata", padding=10)
    metadata_frame.pack(fill=tk.X, pady=5)
    
    ttk.Label(metadata_frame, text="Book Title:").grid(row=0, column=0, sticky=tk.W, pady=5)
    ttk.Entry(metadata_frame, textvariable=app.book_title, width=50).grid(row=0, column=1, padx=5, pady=5, sticky=tk.W+tk.E)
    
    ttk.Label(metadata_frame, text="Author Name:").grid(row=1, column=0, sticky=tk.W, pady=5)
    ttk.Entry(metadata_frame, textvariable=app.author_name, width=50).grid(row=1, column=1, padx=5, pady=5, sticky=tk.W+tk.E)
    
    return metadata_frame

def create_options_section(parent, app):
    """Create the processing options section of the file tab."""
    options_frame = ttk.LabelFrame(parent, text="Processing Options", padding=10)
    options_frame.pack(fill=tk.X, pady=5)
    
    # Create a 2-column grid for options
    left_options = ttk.Frame(options_frame)
    left_options.pack(side=tk.LEFT, fill=tk.X, expand=True)
    
    right_options = ttk.Frame(options_frame)
    right_options.pack(side=tk.RIGHT, fill=tk.X, expand=True)
    
    # Add checkboxes for different processing options
    app.fix_encoding = tk.BooleanVar(value=True)
    ttk.Checkbutton(left_options, text="Fix Text Encoding Issues", variable=app.fix_encoding).pack(anchor=tk.W, pady=2)
    
    app.generate_toc = tk.BooleanVar(value=True)
    ttk.Checkbutton(left_options, text="Generate Table of Contents", variable=app.generate_toc).pack(anchor=tk.W, pady=2)
    
    app.create_chapters = tk.BooleanVar(value=True)
    ttk.Checkbutton(right_options, text="Create Chapter Outlines", variable=app.create_chapters).pack(anchor=tk.W, pady=2)
    
    app.enhance_content = tk.BooleanVar(value=False)
    ttk.Checkbutton(right_options, text="Enhance Book Content (Experimental)", variable=app.enhance_content).pack(anchor=tk.W, pady=2)
    
    # Batch processing option with additional info
    batch_frame = ttk.Frame(options_frame)
    batch_frame.pack(fill=tk.X, pady=(10, 0))
    
    app.batch_process = tk.BooleanVar(value=False)
    ttk.Checkbutton(batch_frame, text="Batch Process All Files", variable=app.batch_process).pack(side=tk.LEFT, pady=2)
    ttk.Label(batch_frame, text="(Processes all files in sequence)", font=("Arial", 8)).pack(side=tk.LEFT, padx=(5, 0))
    
    return options_frame

def create_action_buttons(parent, app):
    """Create the action buttons section of the file tab."""
    button_frame = ttk.Frame(parent)
    button_frame.pack(fill=tk.X, pady=10)
    
    style = ttk.Style()
    style.configure('Action.TButton', font=('Arial', 10, 'bold'))
    
    ttk.Button(button_frame, text="Load Selected Document", command=app.load_document, width=20, style='Action.TButton').pack(side=tk.LEFT, padx=5)
    ttk.Button(button_frame, text="Process Document", command=app.process_document, width=20, style='Action.TButton').pack(side=tk.LEFT, padx=5)
    ttk.Button(button_frame, text="Save All Chapters", command=app.save_all_chapters, width=20, style='Action.TButton').pack(side=tk.LEFT, padx=5)
    ttk.Button(button_frame, text="Generate Complete Book", command=app.generate_complete_book, width=20, style='Action.TButton').pack(side=tk.LEFT, padx=5)
    
    return button_frame
