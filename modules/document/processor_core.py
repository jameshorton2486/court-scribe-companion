
"""
Document Processor Core Module

This module provides the core functionality for processing document content,
including single document processing and thread management.
"""

import threading
import tkinter as tk
from tkinter import messagebox
import time
import gc
import os
import traceback
from modules.utils.error_handler import ErrorHandler

def process_document(app):
    """
    Process a document with optional batch processing support.
    
    Args:
        app: The application instance containing UI elements and data
    """
    # Validate input
    try:
        ErrorHandler.validate_input(app.docx_content, "Please load a document first")
        
        # If batch processing is enabled, process all files
        if app.batch_process.get() and len(app.input_files) > 1:
            from modules.document.batch_processor import _batch_process_documents
            threading.Thread(target=_batch_process_documents, args=(app,), daemon=True).start()
        else:
            # Process single document
            threading.Thread(target=_process_document_thread, args=(app,), daemon=True).start()
    except ValueError as e:
        # Input validation errors are already handled by the ErrorHandler
        pass
    except Exception as e:
        ErrorHandler.handle_processing_error(app, e, "document processing setup")

def _process_document_thread(app, show_message=True):
    """
    Process a single document in a separate thread.
    
    Args:
        app: The application instance containing UI elements and data
        show_message: Whether to show completion message
    """
    from modules.document.content_enhancer import enhance_book_content
    
    try:
        start_time = time.time()
        ErrorHandler.log_operation_start("document processing")
        
        app.log.info("Starting document processing...")
        app.update_progress(0, "Processing document...")
        
        # Check if output directory exists, create if not
        os.makedirs(app.output_dir.get(), exist_ok=True)
        
        app.log.info(f"Processing document: {app.input_file.get()}")
        app.log.info(f"Output directory: {app.output_dir.get()}")
        app.log.info(f"Book title: {app.book_title.get()}")
        app.log.info(f"Author: {app.author_name.get()}")
        
        # Estimate document size for optimization
        doc_size = len(app.docx_content.paragraphs)
        is_large_document = doc_size > 1000  # Consider documents with >1000 paragraphs as large
        
        if is_large_document:
            app.log.info(f"Large document detected: {doc_size} paragraphs. Enabling optimizations.")
        
        # Process document with appropriate methods based on size
        _perform_document_processing(app, is_large_document)
        
        # Update the chapter listbox
        app.chapter_listbox.delete(0, tk.END)
        for i, chapter in enumerate(app.chapters):
            app.chapter_listbox.insert(tk.END, f"Chapter {i+1}: {chapter['title']}")
        
        # Calculate and log processing time
        processing_time = time.time() - start_time
        app.log.info(f"Document processing completed in {processing_time:.2f} seconds")
        app.update_progress(100, f"Document processing completed in {processing_time:.2f}s")
        
        # Log operation completion
        ErrorHandler.log_operation_complete(
            "document processing", 
            success=True,
            duration=processing_time
        )
        
        if show_message:
            messagebox.showinfo("Success", f"Document processing completed successfully in {processing_time:.2f} seconds")
        
        # Force garbage collection after processing
        gc.collect()
        
    except Exception as e:
        # Log the detailed error
        error_details = traceback.format_exc()
        app.log.error(f"Document processing error details: {error_details}")
        
        # Calculate processing time even for failed operations
        try:
            processing_time = time.time() - start_time
            ErrorHandler.log_operation_complete(
                "document processing", 
                success=False,
                duration=processing_time,
                details=str(e)
            )
        except:
            ErrorHandler.log_operation_complete(
                "document processing", 
                success=False,
                details=str(e)
            )
        
        # Handle the error
        ErrorHandler.handle_processing_error(app, e, "document processing", show_message)

def _perform_document_processing(app, is_large_document):
    """
    Execute the actual document processing steps, using optimized methods for large documents.
    
    Args:
        app: The application instance
        is_large_document: Whether the document is considered large
    """
    # Setup progress tracking
    total_steps = 0
    current_step = 0
    
    # Count steps based on selected operations
    if app.fix_encoding.get():
        total_steps += 1
    total_steps += 1  # Chapter extraction is always done
    if app.generate_toc.get():
        total_steps += 1
    if app.enhance_content.get():
        total_steps += 1
    
    progress_increment = 100 / total_steps if total_steps > 0 else 100
    
    try:
        # Fix encoding if selected
        if app.fix_encoding.get():
            current_step += 1
            progress = current_step * progress_increment
            app.update_progress(progress, "Fixing text encoding...")
            
            from modules.document.text_processor import fix_text_encoding
            encoding_issues = fix_text_encoding(app)
            
            if encoding_issues:
                app.log.warning("Encoding issues were detected and fixed. Review the document for any remaining issues.")
        
        # Extract chapters with optimizations for large documents
        current_step += 1
        progress = current_step * progress_increment
        app.update_progress(progress, "Extracting chapters...")
        
        if is_large_document:
            # Process chapters in chunks
            from modules.document.optimized_processors import extract_chapters_optimized
            extract_chapters_optimized(app)
        else:
            from modules.document.chapter_extractor import extract_chapters
            extract_chapters(app)
        
        # Check if chapters were successfully extracted
        if not app.chapters or len(app.chapters) == 0:
            app.log.warning("No chapters were detected in the document.")
            app.update_progress(progress, "Warning: No chapters detected")
        else:
            app.log.info(f"Successfully extracted {len(app.chapters)} chapters")
        
        # Generate table of contents if selected
        if app.generate_toc.get():
            current_step += 1
            progress = current_step * progress_increment
            app.update_progress(progress, "Generating table of contents...")
            
            from modules.document.toc_generator import generate_table_of_contents
            generate_table_of_contents(app)
        
        # Enhance content if selected
        if app.enhance_content.get():
            current_step += 1
            progress = current_step * progress_increment
            app.update_progress(progress, "Enhancing book content...")
            
            if is_large_document:
                # Process content enhancement in chunks
                from modules.document.optimized_processors import enhance_book_content_chunked
                enhance_book_content_chunked(app)
            else:
                from modules.document.content_enhancer import enhance_book_content
                enhance_book_content(app)
    
    except Exception as e:
        # Log specific step that failed
        app.log.error(f"Error during processing step {current_step}/{total_steps}: {str(e)}")
        # Re-raise to be caught by the calling function
        raise
