
import tkinter as tk
from tkinter import filedialog, messagebox
import os
import threading

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
        added_count = 0
        for file in files:
            if file not in app.input_files:
                app.input_files.append(file)
                added_count += 1
        
        # Update the listbox
        update_file_listbox(app)
        app.log(f"Added {added_count} new files to the processing list")

def remove_file(app):
    # Get selected files from listbox
    selected = app.file_listbox.curselection()
    if not selected:
        messagebox.showerror("Error", "Please select at least one file to remove")
        return
    
    removed_count = 0
    # Remove the selected files (in reverse to avoid index shifting)
    for index in sorted(selected, reverse=True):
        file_path = app.input_files[index]
        app.input_files.pop(index)
        removed_count += 1
    
    # Update the listbox
    update_file_listbox(app)
    app.log(f"Removed {removed_count} file(s) from the list")

def update_file_listbox(app):
    # Clear the listbox
    app.file_listbox.delete(0, tk.END)
    
    # Add all files to the listbox with file size information
    for file in app.input_files:
        # Get just the filename without the full path
        filename = os.path.basename(file)
        # Get file size in KB or MB as appropriate
        file_size = os.path.getsize(file)
        if file_size < 1024 * 1024:  # Less than 1MB
            size_str = f"{file_size/1024:.1f} KB"
        else:
            size_str = f"{file_size/(1024*1024):.1f} MB"
        
        # Add file with size to listbox
        app.file_listbox.insert(tk.END, f"{filename} ({size_str})")

def batch_process_all(app):
    if not app.input_files:
        messagebox.showerror("Error", "Please add at least one input file")
        return
    
    # Create a cancellable processing thread
    app.batch_processing_thread = threading.Thread(target=_batch_process_worker, args=(app,), daemon=True)
    app.is_processing = True
    app.processing_cancelled = False
    app.batch_processing_thread.start()

def _batch_process_worker(app):
    try:
        total_files = len(app.input_files)
        app.log(f"Starting batch processing of {total_files} files...")
        
        for i, file_path in enumerate(app.input_files):
            # Check if processing was cancelled
            if app.processing_cancelled:
                app.log("Batch processing cancelled by user")
                break
                
            file_name = os.path.basename(file_path)
            app.log(f"Processing file {i+1}/{total_files}: {file_name}")
            app.update_progress((i / total_files) * 100, f"Processing {file_name}...")
            
            # Set current file and process it
            app.input_file.set(file_path)
            from modules.document.document_processor import load_document, process_document
            load_document(app)
            
            # Check if processing was cancelled
            if app.processing_cancelled:
                app.log("Batch processing cancelled by user")
                break
                
            process_document(app)
            
            # Save chapters for this file
            from modules.document.chapter_processor import save_all_chapters
            save_all_chapters(app)
        
        # Only show completion message if not cancelled
        if not app.processing_cancelled:
            app.update_progress(100, "Batch processing completed")
            app.log("All files processed successfully")
            messagebox.showinfo("Success", f"Processed {total_files} files successfully")
        
    except Exception as e:
        app.log(f"Error during batch processing: {str(e)}")
        app.update_progress(0, "Error during batch processing")
        messagebox.showerror("Error", f"Failed to process files: {str(e)}")
    finally:
        app.is_processing = False
        app.processing_cancelled = False
