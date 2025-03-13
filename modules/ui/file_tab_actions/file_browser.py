
"""
File Browser Operations

Functions for browsing and selecting files in the file tab.
"""

import os
import logging
from tkinter import filedialog
from modules.utils.error_handler import ErrorHandler
from .file_operations import update_file_listbox

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
