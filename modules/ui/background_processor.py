
import threading
import tkinter as tk
from tkinter import messagebox
import traceback
import sys

class BackgroundProcessor:
    """Handles running operations in background threads with progress updates and improved error handling"""
    
    def __init__(self, app):
        self.app = app
        self.current_threads = []
        
    def run_with_progress(self, func, *args, **kwargs):
        """Run a function with progress indication in a background thread with enhanced error handling"""
        self.app.status_manager.is_processing = True
        self.app.status_manager.processing_cancelled = False
        self.app.update_progress(1, "Starting operation...")
        self.app.status_manager.start_time = self.app.status_manager.start_time or 0
        
        # Get name of the function for better error reporting
        func_name = getattr(func, "__name__", "unknown function")
        
        def worker():
            try:
                self.app.log.info(f"Starting background operation: {func_name}")
                result = func(*args, **kwargs)
                return result
            except Exception as e:
                # Get detailed exception information including traceback
                exc_type, exc_value, exc_traceback = sys.exc_info()
                tb_lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
                tb_text = ''.join(tb_lines)
                
                # Log the detailed error
                self.app.log.error(f"Error in {func_name}: {str(e)}")
                self.app.log.debug(f"Traceback:\n{tb_text}")
                
                # Show error to user
                error_msg = f"An error occurred during {func_name}:\n{str(e)}"
                messagebox.showerror("Operation Error", error_msg)
                
                return None
            finally:
                if not self.app.status_manager.processing_cancelled:
                    self.app.update_progress(100, f"Operation {func_name} completed")
                self.app.status_manager.is_processing = False
                
                # Remove this thread from the active threads list
                if thread in self.current_threads:
                    self.current_threads.remove(thread)
        
        thread = threading.Thread(target=worker)
        thread.daemon = True
        self.current_threads.append(thread)
        thread.start()
        return thread
    
    def cancel_all_operations(self):
        """Cancel all running operations"""
        if self.current_threads:
            self.app.status_manager.processing_cancelled = True
            self.app.log.warning(f"Cancelling {len(self.current_threads)} operations")
            self.app.update_progress(0, "Operations cancelled")
            # We don't actually stop the threads (as Python doesn't really support that)
            # but we set a flag that the operations should check
