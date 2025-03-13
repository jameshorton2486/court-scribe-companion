
"""
File Actions Module

This module provides functions for file operations in the application.
"""

import tkinter as tk
from tkinter import filedialog, messagebox
import os

from .file_tab_actions.file_operations import update_file_listbox
from .file_tab_actions.batch_processor import batch_process_all

def add_files(app):
    """
    Open file dialog to select multiple files and add them to the file list
    
    Args:
        app: The application instance
    """
    # Open file dialog to select multiple files
    files = filedialog.askopenfilenames(
        title="Select Input Files",
        filetypes=[
            ("Document Files", "*.docx *.txt *.md"),
            ("Word Documents", "*.docx"),
            ("Text Files", "*.txt"),
            ("Markdown Files", "*.md"),
            ("All Files", "*.*")
        ]
    )
    
    # Add selected files to the list
    if files:
        added_count = 0
        for file in files:
            if file not in app.input_files:
                app.input_files.append(file)
                added_count += 1
        
        # Update the listbox
        update_file_listbox(app)
        app.log(f"Added {added_count} new files to the processing list")

def remove_file(app):
    """
    Remove selected files from the file list
    
    Args:
        app: The application instance
    """
    # Get selected files from listbox
    selected = app.file_listbox.curselection()
    if not selected:
        messagebox.showerror("Error", "Please select at least one file to remove")
        return
    
    removed_count = 0
    # Remove the selected files (in reverse to avoid index shifting)
    for index in sorted(selected, reverse=True):
        file_path = app.input_files[index]
        app.input_files.pop(index)
        removed_count += 1
    
    # Update the listbox
    update_file_listbox(app)
    app.log(f"Removed {removed_count} file(s) from the list")

# Export batch_process_all from the batch processor module
__all__ = ['add_files', 'remove_file', 'update_file_listbox', 'batch_process_all']
