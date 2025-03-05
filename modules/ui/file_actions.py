
import tkinter as tk
from tkinter import filedialog, messagebox
import os

def add_files(app):
    # Open file dialog to select multiple files
    files = filedialog.askopenfilenames(
        title="Select Input Files",
        filetypes=[
            ("Document Files", "*.docx *.txt *.md"),
            ("Word Documents", "*.docx"),
            ("Text Files", "*.txt"),
            ("Markdown Files", "*.md"),
            ("All Files", "*.*")
        ]
    )
    
    # Add selected files to the list
    if files:
        for file in files:
            if file not in app.input_files:
                app.input_files.append(file)
        
        # Update the listbox
        update_file_listbox(app)
        app.log(f"Added {len(files)} files to the processing list")

def remove_file(app):
    # Get selected file from listbox
    selected = app.file_listbox.curselection()
    if not selected:
        messagebox.showerror("Error", "Please select a file to remove")
        return
    
    file_index = selected[0]
    file_path = app.input_files[file_index]
    
    # Remove the file from the list
    app.input_files.pop(file_index)
    
    # Update the listbox
    update_file_listbox(app)
    app.log(f"Removed file: {file_path}")

def update_file_listbox(app):
    # Clear the listbox
    app.file_listbox.delete(0, tk.END)
    
    # Add all files to the listbox
    for file in app.input_files:
        # Get just the filename without the full path
        filename = os.path.basename(file)
        app.file_listbox.insert(tk.END, filename)

def batch_process_all(app):
    if not app.input_files:
        messagebox.showerror("Error", "Please add at least one input file")
        return
    
    try:
        total_files = len(app.input_files)
        app.log(f"Starting batch processing of {total_files} files...")
        
        for i, file_path in enumerate(app.input_files):
            file_name = os.path.basename(file_path)
            app.log(f"Processing file {i+1}/{total_files}: {file_name}")
            app.update_progress((i / total_files) * 100, f"Processing {file_name}...")
            
            # Set current file and process it
            app.input_file.set(file_path)
            from modules.document.document_processor import load_document, process_document
            load_document(app)
            process_document(app)
            
            # Save chapters for this file
            from modules.document.chapter_processor import save_all_chapters
            save_all_chapters(app)
        
        app.update_progress(100, "Batch processing completed")
        app.log("All files processed successfully")
        messagebox.showinfo("Success", f"Processed {total_files} files successfully")
        
    except Exception as e:
        app.log(f"Error during batch processing: {str(e)}")
        app.update_progress(0, "Error during batch processing")
        messagebox.showerror("Error", f"Failed to process files: {str(e)}")
