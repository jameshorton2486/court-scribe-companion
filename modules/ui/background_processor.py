
import threading
import tkinter as tk
from tkinter import messagebox

class BackgroundProcessor:
    """Handles running operations in background threads with progress updates"""
    
    def __init__(self, app):
        self.app = app
        
    def run_with_progress(self, func, *args, **kwargs):
        """Run a function with progress indication in a background thread"""
        self.app.status_manager.is_processing = True
        self.app.status_manager.processing_cancelled = False
        self.app.update_progress(1, "Starting operation...")
        self.app.status_manager.start_time = self.app.status_manager.start_time or 0
        
        def worker():
            try:
                func(*args, **kwargs)
            except Exception as e:
                self.app.log(f"Error: {str(e)}")
                messagebox.showerror("Error", str(e))
            finally:
                if not self.app.status_manager.processing_cancelled:
                    self.app.update_progress(100, "Operation completed")
                self.app.status_manager.is_processing = False
        
        thread = threading.Thread(target=worker)
        thread.daemon = True
        thread.start()
