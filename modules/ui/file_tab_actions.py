
"""
File Tab Actions Module

This module provides action handlers for file operations in the file tab,
such as browsing for files, adding and removing files, and updating the file list display.
"""

import tkinter as tk
from tkinter import filedialog
import os

def browse_input_file(app):
    """Browse for document files and add them to the processing list."""
    file_paths = filedialog.askopenfilenames(
        filetypes=[("Document Files", "*.docx *.txt *.md"), ("Word Documents", "*.docx"), ("All Files", "*.*")]
    )
    if file_paths:
        for file_path in file_paths:
            # Check if file is already in the list
            if file_path not in app.input_files:
                app.input_files.append(file_path)
                
        # Try to extract title from first filename if no title set
        if not app.book_title.get() and len(app.input_files) > 0:
            filename = os.path.basename(app.input_files[0])
            title, _ = os.path.splitext(filename)
            app.book_title.set(title)
            
        # Update the file list display
        update_file_listbox(app)
        app.log(f"Added {len(file_paths)} file(s) to the processing list")

def browse_text_file(app):
    """Browse for text files and add them to the processing list."""
    file_paths = filedialog.askopenfilenames(
        filetypes=[("Text Files", "*.txt"), ("Markdown", "*.md"), ("All Files", "*.*")]
    )
    if file_paths:
        for file_path in file_paths:
            # Check if file is already in the list
            if file_path not in app.input_files:
                app.input_files.append(file_path)
                
        # Update the file list display
        update_file_listbox(app)
        app.log(f"Added {len(file_paths)} text file(s) to the processing list")

def remove_selected_file(app):
    """Remove selected files from the processing list."""
    try:
        # Get selected indices
        selected_indices = app.file_listbox.curselection()
        
        if not selected_indices:
            app.log("No files selected for removal")
            return
            
        # Remove files in reverse order to avoid index shifting
        for index in sorted(selected_indices, reverse=True):
            file_path = app.input_files[index]
            app.input_files.remove(file_path)
            app.log(f"Removed: {os.path.basename(file_path)}")
            
        # Update the file list display
        update_file_listbox(app)
            
    except Exception as e:
        app.log(f"Error removing file: {e}")

def browse_output_dir(app):
    """Browse for output directory and set it."""
    dir_path = filedialog.askdirectory()
    if dir_path:
        app.output_dir.set(dir_path)
        app.log(f"Output directory set to: {dir_path}")

def update_file_listbox(app):
    """Update the file listbox with current files and their sizes."""
    # Clear the listbox
    app.file_listbox.delete(0, tk.END)
    
    # Add all files to the listbox with icons and file info
    for file_path in app.input_files:
        filename = os.path.basename(file_path)
        file_size = os.path.getsize(file_path) / 1024  # size in KB
        file_info = f"{filename} ({file_size:.1f} KB)"
        app.file_listbox.insert(tk.END, file_info)
        
    # Update file count label
    app.update_file_count(f"Files: {len(app.input_files)}")

def select_all_files(app):
    """Select all files in the listbox."""
    app.file_listbox.selection_set(0, tk.END)

def deselect_all_files(app):
    """Deselect all files in the listbox."""
    app.file_listbox.selection_clear(0, tk.END)
