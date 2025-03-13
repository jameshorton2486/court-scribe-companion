
"""
Batch Processor Module

This module handles batch processing of multiple files
"""

import threading
import tkinter as tk
from tkinter import messagebox

def batch_process_all(app):
    """
    Start batch processing of all files in the input list
    
    Args:
        app: The application instance
    """
    if not app.input_files:
        messagebox.showerror("Error", "Please add at least one input file")
        return
    
    # Create a cancellable processing thread
    app.batch_processing_thread = threading.Thread(target=_batch_process_worker, args=(app,), daemon=True)
    app.is_processing = True
    app.processing_cancelled = False
    app.batch_processing_thread.start()

def _batch_process_worker(app):
    """
    Worker thread for batch processing
    
    Args:
        app: The application instance
    """
    try:
        total_files = len(app.input_files)
        app.log(f"Starting batch processing of {total_files} files...")
        
        for i, file_path in enumerate(app.input_files):
            # Check if processing was cancelled
            if app.processing_cancelled:
                app.log("Batch processing cancelled by user")
                break
                
            file_name = import_os().path.basename(file_path)
            app.log(f"Processing file {i+1}/{total_files}: {file_name}")
            app.update_progress((i / total_files) * 100, f"Processing {file_name}...")
            
            # Set current file and process it
            app.input_file.set(file_path)
            from modules.document.document_processor import load_document, process_document
            load_document(app)
            
            # Check if processing was cancelled
            if app.processing_cancelled:
                app.log("Batch processing cancelled by user")
                break
                
            process_document(app)
            
            # Save chapters for this file
            from modules.document.chapter_processor import save_all_chapters
            save_all_chapters(app)
        
        # Only show completion message if not cancelled
        if not app.processing_cancelled:
            app.update_progress(100, "Batch processing completed")
            app.log("All files processed successfully")
            messagebox.showinfo("Success", f"Processed {total_files} files successfully")
        
    except Exception as e:
        app.log(f"Error during batch processing: {str(e)}")
        app.update_progress(0, "Error during batch processing")
        messagebox.showerror("Error", f"Failed to process files: {str(e)}")
    finally:
        app.is_processing = False
        app.processing_cancelled = False

def import_os():
    """Import os module only when needed to avoid circular imports"""
    import os
    return os
