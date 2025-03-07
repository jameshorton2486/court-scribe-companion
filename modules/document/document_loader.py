
import os
from docx import Document
from tkinter import messagebox
from modules.document.format_handler import (
    detect_file_format, load_docx_document, load_text_document,
    load_html_document, convert_html_to_document, convert_markdown_to_document
)

def load_document(app):
    if not app.input_file.get():
        messagebox.showerror("Error", "Please select an input file")
        return
    
    try:
        file_path = app.input_file.get()
        app.log(f"Loading document: {file_path}")
        app.update_progress(10, "Loading document...")
        
        # Detect file format
        file_format = detect_file_format(file_path)
        app.log(f"Detected file format: {file_format}")
        
        # Load document based on format
        if file_format == 'docx':
            # Load the DOCX document
            doc = load_docx_document(file_path)
            app.docx_content = doc
            
        elif file_format == 'txt':
            # Load text file
            content = load_text_document(file_path)
            
            # Create a Document object from text
            doc = Document()
            
            # Split the text content by lines and add as paragraphs
            lines = content.split('\n')
            for line in lines:
                if line.strip():  # Skip empty lines
                    para = doc.add_paragraph(line)
            
            app.docx_content = doc
            
        elif file_format == 'md':
            # Load markdown file
            content = load_text_document(file_path)
            
            # Convert markdown to Document
            doc = convert_markdown_to_document(content)
            app.docx_content = doc
            
        elif file_format == 'html':
            # Load HTML file
            soup = load_html_document(file_path)
            
            # Convert HTML to Document
            doc = convert_html_to_document(soup)
            app.docx_content = doc
            
        else:
            messagebox.showerror("Error", f"Unsupported file format: {file_format}")
            app.update_progress(0, "Error loading document")
            return
        
        app.update_progress(50, "Document loaded successfully")
        
        # Try to extract title from content or filename
        if not app.book_title.get():
            # First check if there's a Title style paragraph
            for para in doc.paragraphs[:10]:
                if para.style.name.startswith('Title') or para.style.name.startswith('Heading 1'):
                    app.book_title.set(para.text)
                    break
            
            # If still no title, use filename
            if not app.book_title.get():
                filename = os.path.basename(file_path)
                title, _ = os.path.splitext(filename)
                app.book_title.set(title)
        
        app.update_progress(100, "Document loaded successfully")
        app.log(f"Document loaded successfully with {len(doc.paragraphs)} paragraphs")
        messagebox.showinfo("Success", "Document loaded successfully")
        
    except Exception as e:
        app.log(f"Error loading document: {str(e)}")
        messagebox.showerror("Error", f"Failed to load document: {str(e)}")
        app.update_progress(0, "Error loading document")
