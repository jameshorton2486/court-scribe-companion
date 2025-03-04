
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
        app.log(f"Loading document: {app.input_file.get()}")
        app.update_progress(10, "Loading document...")
        
        # Load the document
        doc = Document(app.input_file.get())
        app.docx_content = doc
        
        app.update_progress(50, "Extracting text...")
        # Extract text
        full_text = ""
        for para in doc.paragraphs:
            full_text += para.text + "\n"
        
        app.log(f"Document loaded successfully. {len(doc.paragraphs)} paragraphs found.")
        
        # Set book title if not already set
        if not app.book_title.get():
            # Try to find title in the first few paragraphs
            for para in doc.paragraphs[:10]:
                if para.style.name.startswith('Heading') or para.style.name.startswith('Title'):
                    app.book_title.set(para.text)
                    break
        
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
    
    # Start processing in a separate thread to avoid freezing the UI
    threading.Thread(target=_process_document_thread, args=(app,), daemon=True).start()

def _process_document_thread(app):
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
        messagebox.showinfo("Success", "Document processing completed successfully")
        
    except Exception as e:
        app.log(f"Error processing document: {str(e)}")
        app.update_progress(0, "Error processing document")
        messagebox.showerror("Error", f"Failed to process document: {str(e)}")
