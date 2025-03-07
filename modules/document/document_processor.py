import threading
import tkinter as tk
from tkinter import messagebox
import os
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
    for file_path in app.input_files:
        app.input_file.set(file_path)
        
        # Reload the document for each file
        load_document(app)
        
        # Ensure document loaded successfully
        if not app.docx_content:
            app.log(f"Skipping {file_path} due to load error.")
            continue
        
        # Update book title if needed
        filename = os.path.basename(file_path)
        title, _ = os.path.splitext(filename)
        app.book_title.set(title)
        
        # Process the document
        _process_document_thread(app, show_message=False)
    
    app.update_progress(100, "Batch processing completed")
    app.log("Batch processing completed successfully")
    messagebox.showinfo("Success", "Batch processing completed successfully")

def _process_document_thread(app, show_message=True):
    from modules.document.content_enhancer import enhance_book_content
    
    try:
        app.log("Starting document processing...")
        app.update_progress(0, "Processing document...")
        
        # Check if output directory exists, create if not
        os.makedirs(app.output_dir.get(), exist_ok=True)
        
        app.log(f"Processing document: {app.input_file.get()}")
        app.log(f"Output directory: {app.output_dir.get()}")
        app.log(f"Book title: {app.book_title.get()}")
        app.log(f"Author: {app.author_name.get()}")
        
        # Fix encoding if selected
        if app.fix_encoding.get():
            app.update_progress(20, "Fixing text encoding...")
            fix_text_encoding(app)
        
        # Extract chapters
        extract_chapters(app)
        
        # Generate table of contents if selected
        if app.generate_toc.get():
            generate_table_of_contents(app)
        
        # Enhance content if selected
        if app.enhance_content.get():
            app.update_progress(80, "Enhancing book content...")
            enhance_book_content(app)
        
        # Update the chapter listbox
        app.chapter_listbox.delete(0, tk.END)
        for i, chapter in enumerate(app.chapters):
            app.chapter_listbox.insert(tk.END, f"Chapter {i+1}: {chapter['title']}")
        
        app.update_progress(100, "Document processing completed")
        app.log("Document processing completed successfully")
        
        if show_message:
            messagebox.showinfo("Success", "Document processing completed successfully")
        
    except Exception as e:
        app.log(f"Error processing document: {str(e)}")
        app.update_progress(0, "Error processing document")
        if show_message:
            messagebox.showerror("Error", f"Failed to process document: {str(e)}")
