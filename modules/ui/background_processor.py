
import threading
import traceback
import time
import os

class BackgroundProcessor:
    """
    Manager for background processing operations
    
    This class manages the execution of long-running operations in the background,
    with progress updates and cancellation support.
    """
    
    def __init__(self, app):
        """
        Initialize the background processor
        
        Args:
            app: The application instance
        """
        self.app = app
        self.current_thread = None
        self.is_processing = False
        self.cancelled = False
        self.completion_callbacks = []
        
        # Ensure Logs directory exists
        logs_dir = os.path.join(os.getcwd(), "Logs")
        if not os.path.exists(logs_dir):
            os.makedirs(logs_dir)
    
    def run_with_progress(self, func, *args, **kwargs):
        """
        Run a function in a background thread with progress tracking
        
        Args:
            func: The function to run
            *args: Arguments to pass to the function
            **kwargs: Keyword arguments to pass to the function
            
        Returns:
            The thread object
        """
        if self.is_processing:
            self.app.log("Cannot start new operation - another operation is in progress")
            return None
        
        # Set up processing state
        self.is_processing = True
        self.cancelled = False
        self.completion_callbacks = []
        
        # Create and start the thread
        thread = threading.Thread(target=self._thread_wrapper, args=(func, args, kwargs), daemon=True)
        self.current_thread = thread
        thread.start()
        
        # Start a monitoring thread to keep the UI responsive
        threading.Thread(target=self._monitor_thread, daemon=True).start()
        
        print(f"Started background operation: {func.__name__}")
        
        return thread
    
    def _thread_wrapper(self, func, args, kwargs):
        """
        Wrapper for the background thread function
        
        Args:
            func: The function to run
            args: Arguments to pass to the function
            kwargs: Keyword arguments to pass to the function
        """
        start_time = time.time()
        self.app.log(f"Starting background operation: {func.__name__}")
        
        try:
            # Reset the progress indicators
            self.app.update_progress(0, f"Starting {func.__name__}...")
            
            # Call the function with the provided arguments
            result = func(*args, **kwargs)
            
            # Mark processing as complete
            self.is_processing = False
            processing_time = time.time() - start_time
            
            # Log completion time
            self.app.log(f"Operation completed in {processing_time:.2f}s: {func.__name__}")
            
            # Run completion callbacks
            for callback in self.completion_callbacks:
                try:
                    callback()
                except Exception as e:
                    self.app.log(f"Error in completion callback: {str(e)}")
            
            return result
            
        except Exception as e:
            self.is_processing = False
            
            # Get the full traceback
            tb = traceback.format_exc()
            
            # Log the error with traceback
            self.app.log(f"Error in background operation: {str(e)}")
            
            # Write detailed error to log file
            try:
                log_file = os.path.join(os.getcwd(), "Logs", "error_log.txt")
                with open(log_file, "a") as f:
                    f.write(f"--- Error in {func.__name__} at {time.strftime('%Y-%m-%d %H:%M:%S')} ---\n")
                    f.write(tb)
                    f.write("\n\n")
            except Exception as log_error:
                self.app.log(f"Could not write to error log: {str(log_error)}")
            
            # Update the UI
            self.app.update_progress(0, f"Error in {func.__name__}: {str(e)}")
            
            # Re-raise the exception
            raise
    
    def _monitor_thread(self):
        """
        Monitor the background thread and update the UI
        """
        while self.is_processing and self.current_thread and self.current_thread.is_alive():
            # Check if the operation was cancelled
            if self.cancelled:
                self.app.log("Operation cancelled")
                self.app.update_progress(0, "Operation cancelled")
                self.is_processing = False
                break
            
            # Sleep briefly to avoid consuming too much CPU
            time.sleep(0.1)
        
        # Final status update
        if not self.cancelled and not self.is_processing:
            # If the operation completed normally, make sure the progress bar is at 100%
            current_progress = self.app.progress_value.get()
            if current_progress < 100:
                self.app.update_progress(100, "Operation completed")
    
    def cancel_current_operation(self):
        """
        Cancel the current background operation
        """
        if self.is_processing:
            self.cancelled = True
            self.app.log("Cancelling operation...")
            return True
        return False
    
    def add_completion_callback(self, callback):
        """
        Add a callback to be executed when the current operation completes
        
        Args:
            callback: The function to call when the operation completes
        """
        self.completion_callbacks.append(callback)
