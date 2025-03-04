
import threading
import tkinter as tk
from tkinter import messagebox
from docx import Document
import os

def load_document(app):
    if not app.input_file.get():
        messagebox.showerror("Error", "Please select an input file")
        return
    
    try:
        file_path = app.input_file.get()
        app.log(f"Loading document: {file_path}")
        app.update_progress(10, "Loading document...")
        
        # Check file extension to determine processing method
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext == '.docx':
            # Load the DOCX document
            doc = Document(file_path)
            app.docx_content = doc
            
            app.update_progress(50, "Extracting text...")
            # Extract text
            full_text = ""
            for para in doc.paragraphs:
                full_text += para.text + "\n"
            
            app.log(f"DOCX document loaded successfully. {len(doc.paragraphs)} paragraphs found.")
            
            # Set book title if not already set
            if not app.book_title.get():
                # Try to find title in the first few paragraphs
                for para in doc.paragraphs[:10]:
                    if para.style.name.startswith('Heading') or para.style.name.startswith('Title'):
                        app.book_title.set(para.text)
                        break
        
        elif file_ext in ['.txt', '.md']:
            # Load text file
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Create a Document object to maintain compatibility with existing code
            doc = Document()
            
            # Split the text content by lines and add as paragraphs
            lines = content.split('\n')
            for line in lines:
                if line.strip():  # Skip empty lines
                    para = doc.add_paragraph(line)
                    # If line starts with #, mark it as a heading
                    if line.strip().startswith('#'):
                        heading_level = min(len(line.strip()) - len(line.strip().lstrip('#')), 6)
                        para.style = f'Heading {heading_level}'
            
            app.docx_content = doc
            app.log(f"Text document loaded successfully. {len(doc.paragraphs)} paragraphs found.")
            
            # Set book title if not already set (use filename)
            if not app.book_title.get():
                filename = os.path.basename(file_path)
                title, _ = os.path.splitext(filename)
                app.book_title.set(title)
        
        else:
            messagebox.showerror("Error", f"Unsupported file format: {file_ext}")
            app.update_progress(0, "Error loading document")
            return
        
        app.update_progress(100, "Document loaded successfully")
        messagebox.showinfo("Success", "Document loaded successfully")
        
    except Exception as e:
        app.log(f"Error loading document: {str(e)}")
        messagebox.showerror("Error", f"Failed to load document: {str(e)}")
        app.update_progress(0, "Error loading document")

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
    try:
        app.log("Starting batch document processing...")
        app.update_progress(0, "Batch processing documents...")
        
        # Save current docx_content to restore after batch processing
        original_docx = app.docx_content
        original_input_file = app.input_file.get()
        
        total_files = len(app.input_files)
        for i, file_path in enumerate(app.input_files):
            # Update progress
            progress_pct = (i / total_files) * 100
            app.update_progress(progress_pct, f"Processing file {i+1} of {total_files}")
            app.log(f"Processing file: {file_path}")
            
            # Set current file
            app.input_file.set(file_path)
            
            # Load the document
            load_document(app)
            
            # Process the document
            _process_document_thread(app, show_message=False)
            
            # Save the processed chapters
            from modules.document.chapter_processor import save_all_chapters
            save_all_chapters(app)
        
        # Restore original docx_content
        app.docx_content = original_docx
        app.input_file.set(original_input_file)
        
        app.update_progress(100, "Batch processing completed")
        app.log("Batch document processing completed successfully")
        messagebox.showinfo("Success", "Batch document processing completed successfully")
        
    except Exception as e:
        app.log(f"Error in batch processing: {str(e)}")
        app.update_progress(0, "Error in batch processing")
        messagebox.showerror("Error", f"Failed to batch process documents: {str(e)}")

def _process_document_thread(app, show_message=True):
    from modules.document.text_processor import fix_text_encoding
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
        app.update_progress(40, "Extracting chapters...")
        app.chapters = []
        
        current_chapter = None
        chapter_content = []
        
        for para in app.docx_content.paragraphs:
            # Check if this is a heading (potential chapter title)
            if para.style.name.startswith('Heading 1') or para.style.name.startswith('Title'):
                # If we already have a chapter in progress, save it
                if current_chapter:
                    app.chapters.append({
                        'title': current_chapter,
                        'content': chapter_content
                    })
                
                # Start a new chapter
                current_chapter = para.text
                chapter_content = [para]
            elif current_chapter:
                # Add to current chapter
                chapter_content.append(para)
            
        # Add the last chapter if it exists
        if current_chapter:
            app.chapters.append({
                'title': current_chapter,
                'content': chapter_content
            })
        
        # If no chapters were found, create a single chapter with the book title
        if not app.chapters:
            app.log("No chapters found, creating a single chapter...")
            app.chapters.append({
                'title': app.book_title.get() or "Untitled Chapter",
                'content': app.docx_content.paragraphs
            })
        
        app.log(f"Extracted {len(app.chapters)} chapters")
        
        # Generate table of contents if selected
        if app.generate_toc.get():
            app.update_progress(60, "Generating table of contents...")
            app.toc = []
            
            for i, chapter in enumerate(app.chapters):
                app.toc.append({
                    'title': chapter['title'],
                    'level': 1,
                    'index': i
                })
                
                # Look for subheadings within the chapter
                for para in chapter['content']:
                    if para.style.name.startswith('Heading 2'):
                        app.toc.append({
                            'title': para.text,
                            'level': 2,
                            'index': i
                        })
            
            app.log(f"Generated table of contents with {len(app.toc)} entries")
        
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
