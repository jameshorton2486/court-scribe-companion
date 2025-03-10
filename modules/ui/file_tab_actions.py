
"""
File Tab Actions Module

This module provides action handlers for file operations in the file tab,
such as browsing for files, adding and removing files, and updating the file list display.
"""

import tkinter as tk
from tkinter import filedialog
import os
import logging
from modules.utils.error_handler import ErrorHandler

# Set up logger for this module
logger = logging.getLogger(__name__)

def browse_input_file(app):
    """Browse for document files and add them to the processing list."""
    try:
        logger.info("Opening file selection dialog for document files")
        print("Opening file browser for document files...")
        
        file_paths = filedialog.askopenfilenames(
            filetypes=[("Document Files", "*.docx *.txt *.md"), ("Word Documents", "*.docx"), ("All Files", "*.*")]
        )
        
        if file_paths:
            logger.info(f"Selected {len(file_paths)} document file(s)")
            print(f"Selected {len(file_paths)} document file(s)")
            
            files_added = 0
            for file_path in file_paths:
                # Check if file exists and is readable
                if not os.path.exists(file_path):
                    app.log.warning(f"File does not exist: {file_path}")
                    continue
                    
                if not os.access(file_path, os.R_OK):
                    app.log.warning(f"File not readable: {file_path}")
                    continue
                
                # Check if file is already in the list
                if file_path not in app.input_files:
                    app.input_files.append(file_path)
                    files_added += 1
                    logger.debug(f"Added file: {file_path}")
                else:
                    app.log.info(f"File already in list: {os.path.basename(file_path)}")
                    
            # Try to extract title from first filename if no title set
            if not app.book_title.get() and len(app.input_files) > 0:
                filename = os.path.basename(app.input_files[0])
                title, _ = os.path.splitext(filename)
                app.book_title.set(title)
                logger.info(f"Auto-set book title to: {title}")
                
            # Update the file list display
            update_file_listbox(app)
            
            if files_added > 0:
                app.log(f"Added {files_added} file(s) to the processing list")
                print(f"Added {files_added} file(s) to the processing list")
            else:
                app.log.info("No new files added to the processing list")
                print("No new files were added to the processing list")
        else:
            logger.info("File selection cancelled or no files selected")
            print("File selection cancelled or no files selected")
            
    except Exception as e:
        ErrorHandler.handle_io_error(app, e, "browse for document files")

def browse_text_file(app):
    """Browse for text files and add them to the processing list."""
    try:
        logger.info("Opening file selection dialog for text files")
        print("Opening file browser for text files...")
        
        file_paths = filedialog.askopenfilenames(
            filetypes=[("Text Files", "*.txt"), ("Markdown", "*.md"), ("All Files", "*.*")]
        )
        
        if file_paths:
            logger.info(f"Selected {len(file_paths)} text file(s)")
            print(f"Selected {len(file_paths)} text file(s)")
            
            files_added = 0
            for file_path in file_paths:
                # Check if file exists and is readable
                if not os.path.exists(file_path):
                    app.log.warning(f"File does not exist: {file_path}")
                    continue
                    
                if not os.access(file_path, os.R_OK):
                    app.log.warning(f"File not readable: {file_path}")
                    continue
                
                # Check if file is already in the list
                if file_path not in app.input_files:
                    app.input_files.append(file_path)
                    files_added += 1
                    logger.debug(f"Added file: {file_path}")
                else:
                    app.log.info(f"File already in list: {os.path.basename(file_path)}")
                    
            # Update the file list display
            update_file_listbox(app)
            
            if files_added > 0:
                app.log(f"Added {files_added} text file(s) to the processing list")
                print(f"Added {files_added} text file(s) to the processing list")
            else:
                app.log.info("No new files added to the processing list")
                print("No new files were added to the processing list")
        else:
            logger.info("File selection cancelled or no files selected")
            print("File selection cancelled or no files selected")
            
    except Exception as e:
        ErrorHandler.handle_io_error(app, e, "browse for text files")

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

def browse_output_dir(app):
    """Browse for output directory and set it."""
    try:
        logger.info("Opening directory selection dialog for output")
        print("Opening directory browser for output folder...")
        
        dir_path = filedialog.askdirectory()
        if dir_path:
            # Verify directory is writable
            if not os.access(dir_path, os.W_OK):
                app.log.warning(f"Selected directory is not writable: {dir_path}")
                app.log("Selected directory is not writable. Please choose another directory.")
                print(f"WARNING: Selected directory is not writable: {dir_path}")
                return
                
            app.output_dir.set(dir_path)
            app.log(f"Output directory set to: {dir_path}")
            logger.info(f"Output directory set to: {dir_path}")
            print(f"Output directory set to: {dir_path}")
        else:
            logger.info("Directory selection cancelled")
            print("Directory selection cancelled")
            
    except Exception as e:
        ErrorHandler.handle_io_error(app, e, "browse for output directory")

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

def select_all_files(app):
    """Select all files in the listbox."""
    try:
        if app.file_listbox.size() > 0:
            app.file_listbox.selection_set(0, tk.END)
            logger.debug("Selected all files in listbox")
            print(f"Selected all {app.file_listbox.size()} files")
        else:
            print("No files to select")
    except Exception as e:
        ErrorHandler.handle_processing_error(app, e, "select all files")

def deselect_all_files(app):
    """Deselect all files in the listbox."""
    try:
        app.file_listbox.selection_clear(0, tk.END)
        logger.debug("Deselected all files in listbox")
        print("Deselected all files")
    except Exception as e:
        ErrorHandler.handle_processing_error(app, e, "deselect all files")
