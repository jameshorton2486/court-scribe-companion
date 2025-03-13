
"""
Batch Document Processing Module

This module provides functionality for processing multiple documents in batch mode,
with optimizations for memory usage and performance.
"""

import os
import time
import gc
import threading
import psutil
from typing import List, Dict, Any
from tkinter import messagebox
from modules.utils.error_handler import ErrorHandler

def _get_memory_usage() -> float:
    """
    Get current memory usage in MB
    
    Returns:
        Current memory usage in megabytes
    """
    try:
        process = psutil.Process(os.getpid())
        memory_info = process.memory_info()
        return memory_info.rss / (1024 * 1024)  # Convert to MB
    except Exception:
        return 0.0

def _batch_process_documents(app):
    """Process multiple documents in batch with memory optimization and progress tracking.
    
    Args:
        app: The application instance containing UI elements and data
    """
    try:
        # Estimate document sizes to determine processing order
        file_sizes = [(file_path, os.path.getsize(file_path)) for file_path in app.input_files]
        
        # Sort files by size (process smaller files first for quicker feedback)
        sorted_files = sorted(file_sizes, key=lambda x: x[1])
        
        # Performance tracking
        start_time = time.time()
        processed_count = 0
        error_count = 0
        memory_before = _get_memory_usage()
        peak_memory = memory_before
        
        # Log start of batch processing
        app.log.info(f"Starting batch processing of {len(sorted_files)} files. Initial memory: {memory_before:.2f} MB")
        
        # Group files into batches based on size to optimize memory usage
        # Large files are processed individually to prevent memory issues
        batches = []
        current_batch = []
        current_batch_size = 0
        
        # Batch files based on size thresholds
        for file_path, size in sorted_files:
            # Process very large files individually (>100MB)
            if size > 100 * 1024 * 1024:
                if current_batch:
                    batches.append(current_batch)
                    current_batch = []
                    current_batch_size = 0
                batches.append([(file_path, size)])
            # For medium and small files, batch until reaching ~200MB total
            elif current_batch_size + size > 200 * 1024 * 1024:
                batches.append(current_batch)
                current_batch = [(file_path, size)]
                current_batch_size = size
            else:
                current_batch.append((file_path, size))
                current_batch_size += size
        
        # Add final batch if not empty
        if current_batch:
            batches.append(current_batch)
        
        # Process each batch
        for batch_index, batch in enumerate(batches):
            # Check if processing has been cancelled
            if app.status_manager.processing_cancelled:
                app.log.warning(f"Batch processing cancelled after {processed_count} files")
                break
            
            # Force garbage collection between batches
            if batch_index > 0:
                objects_collected = gc.collect(generation=2)  # Full collection
                app.log.info(f"GC between batches: {objects_collected} objects collected")
                
                # Log memory usage
                current_memory = _get_memory_usage()
                app.log.info(f"Memory after GC: {current_memory:.2f} MB")
                
                # Update peak memory tracking
                if current_memory > peak_memory:
                    peak_memory = current_memory
            
            # Process files in current batch
            for file_path, size in batch:
                try:
                    # Check memory before processing each file
                    current_memory = _get_memory_usage()
                    if current_memory > peak_memory:
                        peak_memory = current_memory
                    
                    # Clear memory before processing large files
                    if size > 10 * 1024 * 1024:  # If file is larger than 10MB
                        gc.collect()
                        app.log.info(f"Cleared memory before processing large file: {current_memory:.2f} MB")
                    
                    # Set current file
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
                        progress_message = f"Processing {filename}... (Est. remaining: {time_str}, Mem: {current_memory:.1f} MB)"
                    else:
                        progress_message = f"Processing {filename}... (Mem: {current_memory:.1f} MB)"
                    
                    progress_percent = (processed_count / len(sorted_files)) * 100
                    app.update_progress(progress_percent, progress_message)
                    
                    # Reload the document for each file
                    from modules.document.document_loader import load_document
                    load_document(app)
                    
                    # Ensure document loaded successfully
                    if not app.docx_content:
                        app.log.warning(f"Skipping {file_path} due to load error.")
                        error_count += 1
                        continue
                    
                    # Update book title if needed
                    filename = os.path.basename(file_path)
                    title, _ = os.path.splitext(filename)
                    app.book_title.set(title)
                    
                    # Process the document with chunking for large documents
                    from modules.document.processor_core import _process_document_thread
                    _process_document_thread(app, show_message=False)
                    
                    # Manually release document resources
                    if hasattr(app, 'docx_content'):
                        app.docx_content = None
                    
                    processed_count += 1
                    
                    # Force GC after processing very large files
                    if size > 50 * 1024 * 1024:
                        gc.collect()
                        app.log.info(f"GC after large file: Memory now {_get_memory_usage():.2f} MB")
                    
                except Exception as e:
                    error_count += 1
                    ErrorHandler.handle_processing_error(app, e, f"processing {file_path}", False)
                    app.log.error(f"Error processing {file_path}: {str(e)}")
                    # Continue with next file despite errors
        
        # Final garbage collection and memory report
        gc.collect()
        final_memory = _get_memory_usage()
        memory_diff = final_memory - memory_before
        
        # Show final status
        total_time = time.time() - start_time
        status_message = f"Batch processing completed in {total_time:.1f}s"
        
        if error_count > 0:
            status_message += f" with {error_count} errors"
            
        app.update_progress(100, status_message)
        app.log.info(
            f"Batch processing completed: {processed_count} files in {total_time:.1f} seconds, "
            f"{error_count} errors. Memory: peak={peak_memory:.2f}MB, final={final_memory:.2f}MB, "
            f"diff={memory_diff:.2f}MB"
        )
        
        if error_count > 0:
            messagebox.showwarning("Batch Processing", 
                f"Batch processing completed with {error_count} errors. {processed_count} files processed successfully.")
        else:
            messagebox.showinfo("Success", 
                f"Batch processing completed successfully: {processed_count} files in {total_time:.1f} seconds")
            
    except Exception as e:
        ErrorHandler.handle_processing_error(app, e, "batch processing")
