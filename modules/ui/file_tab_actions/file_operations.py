
"""
File Operations Module

Functions for file manipulation and listbox management.
"""

import os
import tkinter as tk
import logging
from modules.utils.error_handler import ErrorHandler

# Set up logger for this module
logger = logging.getLogger(__name__)

def remove_selected_file(app):
    """Remove selected files from the processing list."""
    try:
        # Get selected indices
        selected_indices = app.file_listbox.curselection()
        
        if not selected_indices:
            app.log("No files selected for removal")
            print("No files selected for removal")
            return
            
        logger.info(f"Removing {len(selected_indices)} selected file(s)")
        print(f"Removing {len(selected_indices)} selected file(s)...")
        
        # Remove files in reverse order to avoid index shifting
        for index in sorted(selected_indices, reverse=True):
            file_path = app.input_files[index]
            app.input_files.remove(file_path)
            app.log(f"Removed: {os.path.basename(file_path)}")
            logger.debug(f"Removed file: {file_path}")
            
        # Update the file list display
        update_file_listbox(app)
        print("Files successfully removed")
            
    except Exception as e:
        ErrorHandler.handle_io_error(app, e, "remove selected files")

def update_file_listbox(app):
    """Update the file listbox with current files and their sizes."""
    try:
        logger.debug("Updating file listbox display")
        
        # Clear the listbox
        app.file_listbox.delete(0, tk.END)
        
        # Add all files to the listbox with icons and file info
        for file_path in app.input_files:
            try:
                filename = os.path.basename(file_path)
                
                # Get file size with error handling
                try:
                    file_size = os.path.getsize(file_path) / 1024  # size in KB
                    file_info = f"{filename} ({file_size:.1f} KB)"
                except OSError:
                    app.log.warning(f"Could not get size for file: {filename}")
                    file_info = f"{filename} (size unknown)"
                    
                app.file_listbox.insert(tk.END, file_info)
            except Exception as e:
                logger.warning(f"Error adding file to listbox: {str(e)}")
                app.log.warning(f"Error displaying file: {file_path}")
        
        # Update file count label
        file_count = len(app.input_files)
        app.update_file_count(f"Files: {file_count}")
        logger.debug(f"Updated file list display with {file_count} files")
        
    except Exception as e:
        ErrorHandler.handle_processing_error(app, e, "update file list display")
