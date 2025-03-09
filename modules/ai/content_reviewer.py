
import threading
import time
import os
from docx import Document
from tkinter import messagebox
from modules.ai.openai.content_reviewer import review_with_ai as openai_review

def review_with_ai(app):
    """
    Wrapper function for AI content review functionality.
    Delegates to the OpenAI implementation in a separate thread.
    """
    if not app.chapters:
        messagebox.showerror("Error", "No chapters found. Please process a document first.")
        return
    
    # Start AI review in a separate thread
    threading.Thread(target=_review_with_ai_thread, args=(app,), daemon=True).start()

def _review_with_ai_thread(app):
    """Thread function to perform AI review."""
    try:
        app.log("Starting AI content review...")
        app.update_progress(0, "Starting AI review...")
        
        # Call the implementation from the openai module
        openai_review(app)
        
    except Exception as e:
        app.log(f"Error during AI review: {str(e)}")
        app.update_progress(0, "Error during AI review")
        messagebox.showerror("Error", f"Failed to complete AI review: {str(e)}")
