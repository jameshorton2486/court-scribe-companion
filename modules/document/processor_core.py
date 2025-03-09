
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
        app.log.info("Starting document processing...")
        app.update_progress(0, "Processing document...")
        
        # Check if output directory exists, create if not
        import os
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
        
        # Fix encoding if selected
        if app.fix_encoding.get():
            app.update_progress(20, "Fixing text encoding...")
            from modules.document.text_processor import fix_text_encoding
            fix_text_encoding(app)
        
        # Extract chapters with optimizations for large documents
        app.update_progress(40, "Extracting chapters...")
        if is_large_document:
            # Process chapters in chunks
            from modules.document.optimized_processors import extract_chapters_optimized
            extract_chapters_optimized(app)
        else:
            from modules.document.chapter_extractor import extract_chapters
            extract_chapters(app)
        
        # Generate table of contents if selected
        if app.generate_toc.get():
            app.update_progress(60, "Generating table of contents...")
            from modules.document.toc_generator import generate_table_of_contents
            generate_table_of_contents(app)
        
        # Enhance content if selected
        if app.enhance_content.get():
            app.update_progress(80, "Enhancing book content...")
            if is_large_document:
                # Process content enhancement in chunks
                from modules.document.optimized_processors import enhance_book_content_chunked
                enhance_book_content_chunked(app)
            else:
                enhance_book_content(app)
        
        # Update the chapter listbox
        app.chapter_listbox.delete(0, tk.END)
        for i, chapter in enumerate(app.chapters):
            app.chapter_listbox.insert(tk.END, f"Chapter {i+1}: {chapter['title']}")
        
        # Calculate and log processing time
        processing_time = time.time() - start_time
        app.log.info(f"Document processing completed in {processing_time:.2f} seconds")
        app.update_progress(100, f"Document processing completed in {processing_time:.2f}s")
        
        if show_message:
            messagebox.showinfo("Success", f"Document processing completed successfully in {processing_time:.2f} seconds")
        
        # Force garbage collection after processing
        gc.collect()
        
    except Exception as e:
        ErrorHandler.handle_processing_error(app, e, "document processing", show_message)
