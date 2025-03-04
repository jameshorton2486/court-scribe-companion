
import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import os
import re
import docx
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
import time
import threading

class BookProcessor:
    def __init__(self, root):
        self.root = root
        self.root.title("Book Processor")
        self.root.geometry("900x700")
        self.root.configure(bg="#f0f0f0")
        
        # Setup variables
        self.input_file = tk.StringVar()
        self.output_dir = tk.StringVar()
        self.book_title = tk.StringVar()
        self.author_name = tk.StringVar()
        self.current_status = tk.StringVar(value="Ready")
        self.progress_value = tk.DoubleVar(value=0.0)
        
        # Default output directory is 'output' in current directory
        default_output = os.path.join(os.getcwd(), "output")
        self.output_dir.set(default_output)
        
        # Document storage
        self.docx_content = None
        self.chapters = []
        self.toc = []
        
        # Create the main frame
        self.create_widgets()
    
    def create_widgets(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding=10)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # File input section
        file_frame = ttk.LabelFrame(main_frame, text="File Selection", padding=10)
        file_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(file_frame, text="Input DOCX File:").grid(row=0, column=0, sticky=tk.W, pady=5)
        ttk.Entry(file_frame, textvariable=self.input_file, width=50).grid(row=0, column=1, padx=5, pady=5)
        ttk.Button(file_frame, text="Browse...", command=self.browse_input_file).grid(row=0, column=2, padx=5, pady=5)
        
        ttk.Label(file_frame, text="Output Directory:").grid(row=1, column=0, sticky=tk.W, pady=5)
        ttk.Entry(file_frame, textvariable=self.output_dir, width=50).grid(row=1, column=1, padx=5, pady=5)
        ttk.Button(file_frame, text="Browse...", command=self.browse_output_dir).grid(row=1, column=2, padx=5, pady=5)
        
        # Book metadata section
        metadata_frame = ttk.LabelFrame(main_frame, text="Book Metadata", padding=10)
        metadata_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(metadata_frame, text="Book Title:").grid(row=0, column=0, sticky=tk.W, pady=5)
        ttk.Entry(metadata_frame, textvariable=self.book_title, width=50).grid(row=0, column=1, padx=5, pady=5)
        
        ttk.Label(metadata_frame, text="Author Name:").grid(row=1, column=0, sticky=tk.W, pady=5)
        ttk.Entry(metadata_frame, textvariable=self.author_name, width=50).grid(row=1, column=1, padx=5, pady=5)
        
        # Processing options section
        options_frame = ttk.LabelFrame(main_frame, text="Processing Options", padding=10)
        options_frame.pack(fill=tk.X, pady=5)
        
        # Add checkboxes for different processing options
        self.fix_encoding = tk.BooleanVar(value=True)
        ttk.Checkbutton(options_frame, text="Fix Text Encoding Issues", variable=self.fix_encoding).grid(row=0, column=0, sticky=tk.W, pady=2)
        
        self.generate_toc = tk.BooleanVar(value=True)
        ttk.Checkbutton(options_frame, text="Generate Table of Contents", variable=self.generate_toc).grid(row=1, column=0, sticky=tk.W, pady=2)
        
        self.create_chapters = tk.BooleanVar(value=True)
        ttk.Checkbutton(options_frame, text="Create Chapter Outlines", variable=self.create_chapters).grid(row=2, column=0, sticky=tk.W, pady=2)
        
        self.enhance_content = tk.BooleanVar(value=False)
        ttk.Checkbutton(options_frame, text="Enhance Book Content (Experimental)", variable=self.enhance_content).grid(row=3, column=0, sticky=tk.W, pady=2)
        
        # Action buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(fill=tk.X, pady=10)
        
        ttk.Button(button_frame, text="Load Document", command=self.load_document, width=20).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Process Document", command=self.process_document, width=20).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Save All Chapters", command=self.save_all_chapters, width=20).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Generate Complete Book", command=self.generate_complete_book, width=20).pack(side=tk.LEFT, padx=5)
        
        # Progress display
        progress_frame = ttk.Frame(main_frame)
        progress_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(progress_frame, text="Status:").pack(side=tk.LEFT, padx=5)
        ttk.Label(progress_frame, textvariable=self.current_status).pack(side=tk.LEFT, padx=5)
        
        self.progress_bar = ttk.Progressbar(progress_frame, variable=self.progress_value, length=400, mode="determinate")
        self.progress_bar.pack(side=tk.RIGHT, padx=5)
        
        # Log display
        log_frame = ttk.LabelFrame(main_frame, text="Processing Log", padding=10)
        log_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.log_text = scrolledtext.ScrolledText(log_frame, width=80, height=15)
        self.log_text.pack(fill=tk.BOTH, expand=True)
        self.log_text.config(state=tk.DISABLED)
    
    def browse_input_file(self):
        file_path = filedialog.askopenfilename(
            filetypes=[("Word Documents", "*.docx"), ("All Files", "*.*")]
        )
        if file_path:
            self.input_file.set(file_path)
            # Try to extract title from filename
            filename = os.path.basename(file_path)
            title, _ = os.path.splitext(filename)
            if not self.book_title.get():
                self.book_title.set(title)
    
    def browse_output_dir(self):
        dir_path = filedialog.askdirectory()
        if dir_path:
            self.output_dir.set(dir_path)
    
    def log(self, message):
        self.log_text.config(state=tk.NORMAL)
        self.log_text.insert(tk.END, f"{message}\n")
        self.log_text.see(tk.END)
        self.log_text.config(state=tk.DISABLED)
        self.root.update()
    
    def update_progress(self, value, status=None):
        self.progress_value.set(value)
        if status:
            self.current_status.set(status)
        self.root.update()
    
    def load_document(self):
        if not self.input_file.get():
            messagebox.showerror("Error", "Please select an input file")
            return
        
        try:
            self.log(f"Loading document: {self.input_file.get()}")
            self.update_progress(10, "Loading document...")
            
            # Load the document
            doc = Document(self.input_file.get())
            self.docx_content = doc
            
            self.update_progress(50, "Extracting text...")
            # Extract text
            full_text = ""
            for para in doc.paragraphs:
                full_text += para.text + "\n"
            
            self.log(f"Document loaded successfully. {len(doc.paragraphs)} paragraphs found.")
            
            # Set book title if not already set
            if not self.book_title.get():
                # Try to find title in the first few paragraphs
                for para in doc.paragraphs[:10]:
                    if para.style.name.startswith('Heading') or para.style.name.startswith('Title'):
                        self.book_title.set(para.text)
                        break
            
            self.update_progress(100, "Document loaded successfully")
            messagebox.showinfo("Success", "Document loaded successfully")
            
        except Exception as e:
            self.log(f"Error loading document: {str(e)}")
            messagebox.showerror("Error", f"Failed to load document: {str(e)}")
            self.update_progress(0, "Error loading document")
    
    def process_document(self):
        if not self.docx_content:
            messagebox.showerror("Error", "Please load a document first")
            return
        
        # Start processing in a separate thread to avoid freezing the UI
        threading.Thread(target=self._process_document_thread, daemon=True).start()
    
    def _process_document_thread(self):
        try:
            self.log("Starting document processing...")
            self.update_progress(0, "Processing started...")
            
            # Extract headings and create chapter structure
            self.chapters = []
            current_chapter = {"title": "", "content": [], "level": 0}
            
            # Function to identify if a paragraph is a chapter heading
            def is_chapter_heading(para):
                # Check if paragraph style is a heading
                if para.style.name.startswith('Heading'):
                    return True
                
                # Check for common chapter indicators
                text = para.text.strip().lower()
                if (text.startswith('chapter') or 
                    re.match(r'^chapter\s+\d+', text) or 
                    re.match(r'^\d+\.', text)):
                    return True
                
                # Check if it's short and followed by a substantial paragraph
                if (len(text) < 50 and 
                    para.text.isupper() and 
                    len(para.text) > 0):
                    return True
                
                return False
            
            total_paragraphs = len(self.docx_content.paragraphs)
            self.log(f"Processing {total_paragraphs} paragraphs...")
            
            for i, para in enumerate(self.docx_content.paragraphs):
                # Update progress periodically
                if i % 20 == 0:
                    self.update_progress(i / total_paragraphs * 100, f"Processing paragraph {i} of {total_paragraphs}")
                
                if is_chapter_heading(para) and para.text.strip():
                    # If we've collected content for a previous chapter, save it
                    if current_chapter["title"] and current_chapter["content"]:
                        self.chapters.append(current_chapter)
                    
                    # Start a new chapter
                    level = int(para.style.name[-1]) if para.style.name[-1].isdigit() else 1
                    current_chapter = {
                        "title": para.text.strip(),
                        "content": [para],
                        "level": level
                    }
                else:
                    # Add to current chapter
                    if current_chapter["title"]:
                        current_chapter["content"].append(para)
                    elif para.text.strip():  # This might be content before the first chapter
                        # Create an introduction chapter if needed
                        if not self.chapters and not current_chapter["title"]:
                            current_chapter = {
                                "title": "Introduction",
                                "content": [para],
                                "level": 1
                            }
                        else:
                            current_chapter["content"].append(para)
            
            # Add the last chapter if not empty
            if current_chapter["title"] and current_chapter["content"]:
                self.chapters.append(current_chapter)
            
            self.log(f"Identified {len(self.chapters)} chapters")
            
            # Generate table of contents
            if self.generate_toc.get():
                self.update_progress(80, "Generating Table of Contents...")
                self.toc = []
                for i, chapter in enumerate(self.chapters):
                    self.toc.append({
                        "title": chapter["title"],
                        "level": chapter["level"],
                        "index": i
                    })
                self.log(f"Generated TOC with {len(self.toc)} entries")
            
            # Fix encoding issues if selected
            if self.fix_encoding.get():
                self.update_progress(90, "Fixing text encoding issues...")
                self.fix_text_encoding()
            
            # Enhance content if selected
            if self.enhance_content.get():
                self.update_progress(95, "Enhancing content...")
                self.enhance_book_content()
            
            self.update_progress(100, "Processing completed")
            self.log("Document processing completed successfully")
            messagebox.showinfo("Success", "Document processing completed successfully")
            
        except Exception as e:
            self.log(f"Error processing document: {str(e)}")
            messagebox.showerror("Error", f"Failed to process document: {str(e)}")
            self.update_progress(0, "Error during processing")
    
    def fix_text_encoding(self):
        """Fix common encoding issues in text"""
        common_fixes = {
            "\u2019": "'",  # Right single quotation mark
            "\u2018": "'",  # Left single quotation mark
            "\u201c": '"',  # Left double quotation mark
            "\u201d": '"',  # Right double quotation mark
            "\u2013": "-",  # En dash
            "\u2014": "--", # Em dash
            "\u2026": "...", # Ellipsis
            "\u00a0": " ",  # Non-breaking space
        }
        
        for i, chapter in enumerate(self.chapters):
            self.log(f"Fixing encoding in chapter: {chapter['title']}")
            for j, para in enumerate(chapter["content"]):
                original_text = para.text
                fixed_text = original_text
                
                for char, replacement in common_fixes.items():
                    fixed_text = fixed_text.replace(char, replacement)
                
                # Only update if changes were made
                if fixed_text != original_text:
                    para.text = fixed_text
    
    def enhance_book_content(self):
        """Simple enhancement of book content - placeholder for more advanced processing"""
        self.log("Content enhancement is experimental - making simple improvements")
        
        # Simple enhancements we can do without AI
        for chapter in self.chapters:
            # Fix double spaces
            for para in chapter["content"]:
                if para.text:
                    para.text = re.sub(r'\s{2,}', ' ', para.text)
                    
                    # Fix capitalization at beginning of sentences
                    para.text = re.sub(r'(?<=[.!?])\s+([a-z])', lambda m: f" {m.group(1).upper()}", para.text)
    
    def save_all_chapters(self):
        if not self.chapters:
            messagebox.showerror("Error", "No chapters to save. Please process a document first.")
            return
        
        # Make sure output directory exists
        os.makedirs(self.output_dir.get(), exist_ok=True)
        
        self.log("Saving individual chapters...")
        self.update_progress(0, "Saving chapters...")
        
        for i, chapter in enumerate(self.chapters):
            progress = (i / len(self.chapters)) * 100
            self.update_progress(progress, f"Saving chapter {i+1} of {len(self.chapters)}")
            
            # Create sanitized filename
            safe_title = re.sub(r'[^\w\s-]', '', chapter["title"]).strip().replace(' ', '_')
            filename = f"{i+1:02d}_{safe_title}.docx"
            filepath = os.path.join(self.output_dir.get(), filename)
            
            try:
                # Create a new document for this chapter
                doc = Document()
                
                # Add title
                title_para = doc.add_paragraph()
                title_run = title_para.add_run(chapter["title"])
                title_run.bold = True
                title_run.font.size = Pt(16)
                title_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
                
                # Add content
                for para in chapter["content"][1:]:  # Skip the title paragraph
                    if para.text.strip():
                        p = doc.add_paragraph(para.text)
                
                # Save the document
                doc.save(filepath)
                self.log(f"Saved chapter to {filepath}")
                
            except Exception as e:
                self.log(f"Error saving chapter {i+1}: {str(e)}")
        
        self.update_progress(100, "All chapters saved")
        messagebox.showinfo("Success", f"All chapters saved to {self.output_dir.get()}")
    
    def generate_complete_book(self):
        if not self.chapters:
            messagebox.showerror("Error", "No chapters to compile. Please process a document first.")
            return
        
        # Make sure output directory exists
        os.makedirs(self.output_dir.get(), exist_ok=True)
        
        try:
            self.log("Generating complete book...")
            self.update_progress(0, "Generating complete book...")
            
            # Create a new document
            doc = Document()
            
            # Add title page
            title_para = doc.add_paragraph()
            title_run = title_para.add_run(self.book_title.get() or "Untitled Book")
            title_run.bold = True
            title_run.font.size = Pt(24)
            title_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            
            # Add author if provided
            if self.author_name.get():
                author_para = doc.add_paragraph()
                author_run = author_para.add_run(f"By {self.author_name.get()}")
                author_run.italic = True
                author_run.font.size = Pt(16)
                author_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            
            # Add a page break after title page
            doc.add_page_break()
            
            # Add table of contents if generated
            if self.toc:
                toc_heading = doc.add_heading("Table of Contents", level=1)
                toc_heading.alignment = WD_ALIGN_PARAGRAPH.CENTER
                
                for entry in self.toc:
                    # Indent based on level
                    indent = "    " * (entry["level"] - 1)
                    toc_para = doc.add_paragraph()
                    toc_para.add_run(f"{indent}{entry['title']}")
                
                # Add page break after TOC
                doc.add_page_break()
            
            # Add chapters
            for i, chapter in enumerate(self.chapters):
                self.update_progress((i / len(self.chapters)) * 100, 
                                     f"Adding chapter {i+1} of {len(self.chapters)}")
                
                # Add chapter heading
                heading = doc.add_heading(chapter["title"], level=chapter["level"])
                
                # Add chapter content
                for para in chapter["content"][1:]:  # Skip the title paragraph
                    if para.text.strip():
                        doc.add_paragraph(para.text)
                
                # Add page break between chapters (except the last one)
                if i < len(self.chapters) - 1:
                    doc.add_page_break()
            
            # Save the complete book
            book_filename = f"{self.book_title.get() or 'Book'}_complete.docx"
            book_filepath = os.path.join(self.output_dir.get(), book_filename)
            doc.save(book_filepath)
            
            self.update_progress(100, "Book generated successfully")
            self.log(f"Complete book saved to {book_filepath}")
            messagebox.showinfo("Success", f"Complete book generated successfully: {book_filepath}")
            
        except Exception as e:
            self.log(f"Error generating complete book: {str(e)}")
            messagebox.showerror("Error", f"Failed to generate complete book: {str(e)}")
            self.update_progress(0, "Error generating book")


if __name__ == "__main__":
    root = tk.Tk()
    app = BookProcessor(root)
    root.mainloop()
