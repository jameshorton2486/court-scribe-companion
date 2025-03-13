
"""
Batch Processing Module

This module provides batch processing functionality for the file tab,
allowing users to process multiple files sequentially with progress tracking
and comprehensive error handling.

Key Features:
- Sequential processing of multiple input files
- Progress tracking and status updates
- Configurable error handling (continue on error, stop on error)
- Detailed error logging and reporting
- Recovery mechanisms for failed operations
"""

import tkinter as tk
import threading
import os
import time
from tkinter import messagebox
import logging
import traceback
from modules.utils.error_handler import ErrorHandler

# Set up logger for this module
logger = logging.getLogger(__name__)

def batch_process_all(app):
    """
    Process all loaded files in batch mode
    
    This function initiates the batch processing of all files that have been
    loaded into the application. It performs validation checks, confirms with
    the user, and then starts a background thread to handle the processing.
    
    Args:
        app: The application instance containing UI elements and data
             including input_files, output_dir, and UI controls
    
    Returns:
        None
    
    Notes:
        - Processing is done in a separate thread to keep the UI responsive
        - Progress updates are sent to the UI during processing
        - Errors are logged and optionally displayed to the user
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
    
    This function handles the actual processing of files in a background thread.
    It tracks progress, handles errors according to settings, and generates
    detailed error reports when needed.
    
    Args:
        app: The application instance
    
    Notes:
        - Processes each file sequentially
        - Tracks success and failure counts
        - Creates error reports if enabled
        - Updates UI with progress information
    """
    try:
        total_files = len(app.input_files)
        app.log(f"Starting batch processing of {total_files} files...")
        app.update_progress(0, "Starting batch processing...")
        
        # Create error report file if needed
        error_log = None
        error_count = 0
        success_count = 0
        skipped_count = 0
        
        if app.log_batch_errors.get():
            logs_dir = os.path.join(os.getcwd(), "Logs")
            os.makedirs(logs_dir, exist_ok=True)
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            error_log_path = os.path.join(logs_dir, f"batch_errors_{timestamp}.log")
            error_log = open(error_log_path, "w")
            error_log.write(f"Batch Processing Error Report - {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            error_log.write(f"Total files to process: {total_files}\n\n")
            
            app.log(f"Batch error log created at: {error_log_path}")
        
        # Process each file
        for idx, file_path in enumerate(app.input_files):
            filename = os.path.basename(file_path)
            progress_pct = int((idx / total_files) * 100)
            
            app.log(f"Processing file {idx+1} of {total_files}: {filename}")
            app.update_progress(progress_pct, f"Processing {filename}...")
            
            try:
                # Import here to avoid circular imports
                from modules.document.document_processor import _batch_process_documents
                
                # Process the current file
                result = _batch_process_documents(app, [file_path], show_message=False)
                
                if result:
                    success_count += 1
                    app.log(f"Successfully processed: {filename}")
                else:
                    error_count += 1
                    app.log(f"Error processing: {filename}")
                    
                    if error_log:
                        error_log.write(f"File: {file_path}\n")
                        error_log.write(f"Status: Failed\n")
                        error_log.write(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                
            except Exception as e:
                error_count += 1
                error_msg = str(e)
                error_details = traceback.format_exc()
                
                app.log(f"Error processing file {filename}: {error_msg}")
                logger.error(f"Batch processing error for file {file_path}: {error_msg}")
                logger.debug(f"Error details: {error_details}")
                
                if error_log:
                    error_log.write(f"File: {file_path}\n")
                    error_log.write(f"Status: Exception\n")
                    error_log.write(f"Error: {error_msg}\n")
                    error_log.write(f"Details:\n{error_details}\n\n")
                
                # If we should stop on errors, break the loop
                if not app.continue_batch_on_error.get():
                    app.log("Batch processing stopped due to error")
                    break
        
        # Close error log if it was opened
        if error_log:
            error_log.write(f"\nSummary:\n")
            error_log.write(f"Total files: {total_files}\n")
            error_log.write(f"Successfully processed: {success_count}\n")
            error_log.write(f"Failed: {error_count}\n")
            error_log.write(f"Skipped: {skipped_count}\n")
            error_log.close()
        
        # Update progress when complete
        app.update_progress(100, "Batch processing complete")
        app.log(f"Batch processing completed. Success: {success_count}, Errors: {error_count}, Skipped: {skipped_count}")
        
        summary_message = f"Batch processing complete:\n\n" \
                          f"Total files: {total_files}\n" \
                          f"Successfully processed: {success_count}\n" \
                          f"Failed: {error_count}\n" \
                          f"Skipped: {skipped_count}"
                          
        if error_count > 0 and app.log_batch_errors.get():
            summary_message += f"\n\nError details have been logged to:\n{error_log_path}"
            
        messagebox.showinfo("Batch Processing", summary_message)
        
    except Exception as e:
        app.log(f"Critical error during batch processing: {str(e)}")
        app.update_progress(0, "Error during batch processing")
        messagebox.showerror("Error", f"Failed to complete batch processing: {str(e)}")
        logger.error(f"Batch processing error: {str(e)}", exc_info=True)
        
        # Close error log if it's open
        if 'error_log' in locals() and error_log is not None:
            error_log.write(f"\nCritical Error: {str(e)}\n")
            error_log.write(f"Details:\n{traceback.format_exc()}\n")
            error_log.close()
