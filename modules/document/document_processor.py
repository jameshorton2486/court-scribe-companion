
import threading
import tkinter as tk
from tkinter import messagebox
import os
import time
import gc
from modules.document.document_loader import load_document
from modules.document.chapter_extractor import extract_chapters
from modules.document.toc_generator import generate_table_of_contents
from modules.document.text_processor import fix_text_encoding

def process_document(app):
    if not app.docx_content:
        messagebox.showerror("Error", "Please load a document first")
        return
    
    # If batch processing is enabled, process all files
    if app.batch_process.get() and len(app.input_files) > 1:
        threading.Thread(target=_batch_process_documents, args=(app,), daemon=True).start()
    else:
        # Process single document
        threading.Thread(target=_process_document_thread, args=(app,), daemon=True).start()

def _batch_process_documents(app):
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
        _process_document_thread(app, show_message=False)
        
        processed_count += 1
    
    total_time = time.time() - start_time
    app.update_progress(100, f"Batch processing completed in {total_time:.1f}s")
    app.log.info(f"Batch processing completed: {processed_count} files in {total_time:.1f} seconds")
    messagebox.showinfo("Success", f"Batch processing completed successfully: {processed_count} files in {total_time:.1f} seconds")

def _process_document_thread(app, show_message=True):
    from modules.document.content_enhancer import enhance_book_content
    
    try:
        start_time = time.time()
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
        
        # Fix encoding if selected
        if app.fix_encoding.get():
            app.update_progress(20, "Fixing text encoding...")
            fix_text_encoding(app)
        
        # Extract chapters with optimizations for large documents
        app.update_progress(40, "Extracting chapters...")
        if is_large_document:
            # Process chapters in chunks
            extract_chapters_optimized(app)
        else:
            extract_chapters(app)
        
        # Generate table of contents if selected
        if app.generate_toc.get():
            app.update_progress(60, "Generating table of contents...")
            generate_table_of_contents(app)
        
        # Enhance content if selected
        if app.enhance_content.get():
            app.update_progress(80, "Enhancing book content...")
            if is_large_document:
                # Process content enhancement in chunks
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
        app.log.error(f"Error processing document: {str(e)}")
        app.update_progress(0, "Error processing document")
        if show_message:
            messagebox.showerror("Error", f"Failed to process document: {str(e)}")

def extract_chapters_optimized(app):
    """Optimized chapter extraction for large documents"""
    app.log.info("Using optimized chapter extraction for large document")
    
    # Process paragraphs in chunks to reduce memory usage
    chunk_size = 500  # Process 500 paragraphs at a time
    total_paragraphs = len(app.docx_content.paragraphs)
    chunks = (total_paragraphs + chunk_size - 1) // chunk_size  # Ceiling division
    
    # Create a temporary document structure for chapter detection
    from modules.document.format_handler import extract_chapters_from_headings
    
    # First pass: scan for headings to find chapter boundaries
    headings_found = []
    for i in range(chunks):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, total_paragraphs)
        
        # Scan this chunk for headings
        for j in range(start_idx, end_idx):
            para = app.docx_content.paragraphs[j]
            # Check if this paragraph is a heading
            if para.style.name.startswith('Heading') or is_chapter_heading(para.text):
                headings_found.append((j, para.text, para.style.name))
        
        # Update progress
        progress = 40 + (i / chunks) * 20
        app.update_progress(progress, f"Scanning document structure ({i+1}/{chunks})...")
    
    # If no headings found, fall back to standard extraction
    if not headings_found:
        app.log.warning("No headings found in large document, using standard extraction")
        extract_chapters(app)
        return
    
    # Second pass: build chapters from the located headings
    app.chapters = []
    for i in range(len(headings_found)):
        start_idx = headings_found[i][0]
        end_idx = headings_found[i+1][0] if i+1 < len(headings_found) else total_paragraphs
        
        chapter_title = headings_found[i][1]
        chapter_content = app.docx_content.paragraphs[start_idx:end_idx]
        
        app.chapters.append({
            'title': chapter_title,
            'content': chapter_content
        })
        
        # Update progress
        progress = 60 + (i / len(headings_found)) * 20
        app.update_progress(progress, f"Building chapter {i+1}/{len(headings_found)}...")
    
    app.log.info(f"Extracted {len(app.chapters)} chapters using optimized method")

def is_chapter_heading(text):
    """Detect if text is likely a chapter heading"""
    import re
    # Common chapter patterns
    patterns = [
        r'^chapter\s+\d+', 
        r'^section\s+\d+',
        r'^\d+\.\s+',
        r'^part\s+\d+'
    ]
    
    text_lower = text.lower().strip()
    
    # Check against patterns
    for pattern in patterns:
        if re.match(pattern, text_lower):
            return True
    
    return False

def enhance_book_content_chunked(app):
    """Process content enhancement in chunks for large documents"""
    from modules.document.content_enhancer import enhance_chapter_content
    
    app.log.info("Using chunked content enhancement for large document")
    
    total_chapters = len(app.chapters)
    for i, chapter in enumerate(app.chapters):
        # Update progress
        progress = 80 + (i / total_chapters) * 15
        app.update_progress(progress, f"Enhancing chapter {i+1}/{total_chapters}...")
        
        # For very large chapters, process in sections
        content_paragraphs = chapter['content']
        if len(content_paragraphs) > 200:  # If chapter has more than 200 paragraphs
            app.log.info(f"Processing large chapter {i+1} in sections ({len(content_paragraphs)} paragraphs)")
            
            # Process the chapter in sections
            section_size = 100
            sections = (len(content_paragraphs) + section_size - 1) // section_size
            
            for j in range(sections):
                start_idx = j * section_size
                end_idx = min((j + 1) * section_size, len(content_paragraphs))
                
                # Process this section
                section_paras = content_paragraphs[start_idx:end_idx]
                enhance_chapter_content(app, section_paras)
                
                # Update section progress
                section_progress = progress + (j / sections) * (15 / total_chapters)
                app.update_progress(section_progress, 
                                  f"Enhancing chapter {i+1}/{total_chapters} - section {j+1}/{sections}...")
                
                # Force garbage collection between sections
                if j % 2 == 0:
                    gc.collect()
        else:
            # Process smaller chapters normally
            enhance_chapter_content(app, content_paragraphs)
