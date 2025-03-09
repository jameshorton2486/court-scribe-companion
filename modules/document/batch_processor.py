
"""
Batch Document Processing Module

This module provides functionality for processing multiple documents in batch mode,
with optimizations for memory usage and performance.
"""

import os
import time
import gc
import threading
from tkinter import messagebox

def _batch_process_documents(app):
    """Process multiple documents in batch with memory optimization and progress tracking.
    
    Args:
        app: The application instance containing UI elements and data
    """
    # Estimate document sizes to determine processing order
    file_sizes = [(file_path, os.path.getsize(file_path)) for file_path in app.input_files]
    
    # Sort files by size (process smaller files first for quicker feedback)
    sorted_files = sorted(file_sizes, key=lambda x: x[1])
    
    start_time = time.time()
    processed_count = 0
    
    for file_path, size in sorted_files:
        if app.status_manager.processing_cancelled:
            app.log.warning(f"Batch processing cancelled after {processed_count} files")
            break
        
        # Clear memory before processing large files
        if size > 10 * 1024 * 1024:  # If file is larger than 10MB
            gc.collect()
            app.log.info("Cleared memory before processing large file")
            
        app.input_file.set(file_path)
        filename = os.path.basename(file_path)
        
        # Update progress with estimated time
        if processed_count > 0:
            elapsed_time = time.time() - start_time
            avg_time_per_file = elapsed_time / processed_count
            estimated_remaining = avg_time_per_file * (len(sorted_files) - processed_count)
            minutes = int(estimated_remaining // 60)
            seconds = int(estimated_remaining % 60)
            time_str = f"{minutes}m {seconds}s" if minutes > 0 else f"{seconds}s"
            progress_message = f"Processing {filename}... (Est. remaining: {time_str})"
        else:
            progress_message = f"Processing {filename}..."
            
        progress_percent = (processed_count / len(sorted_files)) * 100
        app.update_progress(progress_percent, progress_message)
        
        # Reload the document for each file
        from modules.document.document_loader import load_document
        load_document(app)
        
        # Ensure document loaded successfully
        if not app.docx_content:
            app.log.warning(f"Skipping {file_path} due to load error.")
            continue
        
        # Update book title if needed
        filename = os.path.basename(file_path)
        title, _ = os.path.splitext(filename)
        app.book_title.set(title)
        
        # Process the document with chunking for large documents
        from modules.document.processor_core import _process_document_thread
        _process_document_thread(app, show_message=False)
        
        processed_count += 1
    
    total_time = time.time() - start_time
    app.update_progress(100, f"Batch processing completed in {total_time:.1f}s")
    app.log.info(f"Batch processing completed: {processed_count} files in {total_time:.1f} seconds")
    messagebox.showinfo("Success", f"Batch processing completed successfully: {processed_count} files in {total_time:.1f} seconds")
