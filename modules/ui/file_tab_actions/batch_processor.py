
"""
Batch Processing Module

This module provides batch processing functionality for the file tab,
allowing users to process multiple files sequentially with progress tracking.
"""

import tkinter as tk
import threading
import os
from tkinter import messagebox
import logging

# Set up logger for this module
logger = logging.getLogger(__name__)

def batch_process_all(app):
    """
    Process all loaded files in batch mode
    
    Args:
        app: The application instance
    """
    if not app.input_files:
        messagebox.showerror("Error", "No files loaded. Please add files first.")
        logger.warning("Batch processing attempted with no files")
        return
        
    if not app.output_dir.get():
        messagebox.showerror("Error", "No output directory selected. Please select an output directory.")
        logger.warning("Batch processing attempted with no output directory")
        return
        
    # Confirm batch processing
    response = messagebox.askyesno(
        "Batch Processing",
        f"This will process all {len(app.input_files)} files using current settings.\nContinue?",
        icon="warning"
    )
    
    if not response:
        logger.info("Batch processing cancelled by user")
        return
        
    # Start processing in a separate thread
    threading.Thread(
        target=_batch_process_thread,
        args=(app,),
        daemon=True
    ).start()
    
def _batch_process_thread(app):
    """
    Thread function to process all files in batch mode
    
    Args:
        app: The application instance
    """
    try:
        total_files = len(app.input_files)
        app.log(f"Starting batch processing of {total_files} files...")
        app.update_progress(0, "Starting batch processing...")
        
        # Process each file
        for idx, file_path in enumerate(app.input_files):
            filename = os.path.basename(file_path)
            progress_pct = int((idx / total_files) * 100)
            
            app.log(f"Processing file {idx+1} of {total_files}: {filename}")
            app.update_progress(progress_pct, f"Processing {filename}...")
            
            # Call the document processor
            # We import here to avoid circular imports
            from modules.document.document_processor import _batch_process_documents
            
            # Process the current file
            _batch_process_documents(app, [file_path])
            
        # Update progress when complete
        app.update_progress(100, "Batch processing complete")
        app.log("Batch processing completed successfully")
        messagebox.showinfo("Batch Processing", "All files processed successfully")
        
    except Exception as e:
        app.log(f"Error during batch processing: {str(e)}")
        app.update_progress(0, "Error during batch processing")
        messagebox.showerror("Error", f"Failed to complete batch processing: {str(e)}")
        logger.error(f"Batch processing error: {str(e)}", exc_info=True)
