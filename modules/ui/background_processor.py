
"""
Background Processor Module

This module provides a framework for running long operations in background threads,
with progress updates, cancellation support, and error handling.

Key Features:
- Non-blocking operations with UI updates
- Progress tracking and status reporting
- Cancellation support for long-running operations
- Comprehensive error handling with logging
- Completion callbacks for post-processing actions
- Memory management for long-running operations
"""

import threading
import traceback
import time
import os
import gc
import psutil
import logging
from typing import Callable, List, Optional, Any

class BackgroundProcessor:
    """
    Manager for background processing operations
    
    This class manages the execution of long-running operations in the background,
    with progress updates, error handling, and cancellation support. It helps
    maintain a responsive UI during lengthy operations.
    
    Attributes:
        app: The application instance
        current_thread: The currently running background thread
        is_processing: Flag indicating whether processing is active
        cancelled: Flag indicating whether the current operation has been cancelled
        completion_callbacks: List of functions to call when processing completes
    """
    
    def __init__(self, app):
        """
        Initialize the background processor
        
        Args:
            app: The application instance that provides UI update methods
                 (must have log and update_progress methods)
        """
        self.app = app
        self.current_thread = None
        self.is_processing = False
        self.cancelled = False
        self.completion_callbacks = []
        
        # Performance tracking
        self.start_time = None
        self.peak_memory = 0
        
        # Setup logging
        self._setup_logging()
    
    def _setup_logging(self):
        """Setup logging for the background processor"""
        # Ensure Logs directory exists
        logs_dir = os.path.join(os.getcwd(), "Logs")
        if not os.path.exists(logs_dir):
            os.makedirs(logs_dir)
            
        # Setup performance log
        self.perf_logger = logging.getLogger("performance")
        self.perf_logger.setLevel(logging.INFO)
        
        # Create a file handler for performance logging
        perf_handler = logging.FileHandler(os.path.join(logs_dir, "performance.log"))
        perf_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        self.perf_logger.addHandler(perf_handler)
    
    def run_with_progress(self, func: Callable, *args, **kwargs):
        """
        Run a function in a background thread with progress tracking
        
        This method starts the provided function in a background thread,
        allowing it to run without blocking the UI. It also sets up progress
        tracking and error handling.
        
        Args:
            func: The function to run in the background
            *args: Arguments to pass to the function
            **kwargs: Keyword arguments to pass to the function
            
        Returns:
            thread: The thread object (or None if another operation is in progress)
        
        Notes:
            - Only one background operation can be active at a time
            - Progress updates must be provided by the function via app.update_progress
            - Errors are caught and logged
        """
        if self.is_processing:
            self.app.log("Cannot start new operation - another operation is in progress")
            return None
        
        # Set up processing state
        self.is_processing = True
        self.cancelled = False
        self.completion_callbacks = []
        
        # Reset performance tracking
        self.start_time = time.time()
        self.peak_memory = 0
        
        # Perform garbage collection before starting new operation
        collected = gc.collect()
        self.app.log(f"Garbage collected {collected} objects before starting operation")
        
        # Create and start the thread
        thread = threading.Thread(target=self._thread_wrapper, args=(func, args, kwargs), daemon=True)
        self.current_thread = thread
        thread.start()
        
        # Start a monitoring thread to keep the UI responsive and monitor resources
        threading.Thread(target=self._monitor_thread, daemon=True).start()
        
        print(f"Started background operation: {func.__name__}")
        
        return thread
    
    def _thread_wrapper(self, func: Callable, args: tuple, kwargs: dict) -> Any:
        """
        Wrapper for the background thread function
        
        This internal method wraps the user-provided function with additional
        functionality for timing, progress tracking, error handling, and
        completion callbacks.
        
        Args:
            func: The function to run
            args: Arguments to pass to the function
            kwargs: Keyword arguments to pass to the function
            
        Returns:
            The result of the wrapped function
            
        Raises:
            Re-raises any exceptions from the wrapped function after logging
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
            
            # Log completion time and peak memory usage
            self.app.log(f"Operation completed in {processing_time:.2f}s: {func.__name__}")
            self.perf_logger.info(
                f"Operation: {func.__name__}, Time: {processing_time:.2f}s, "
                f"Peak Memory: {self.peak_memory / (1024*1024):.2f} MB"
            )
            
            # Run completion callbacks
            for callback in self.completion_callbacks:
                try:
                    callback()
                except Exception as e:
                    self.app.log(f"Error in completion callback: {str(e)}")
            
            # Clean up memory after operation
            collected = gc.collect()
            self.app.log(f"Garbage collected {collected} objects after operation")
            
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
        
        This internal method runs in a separate thread to monitor the progress
        of the background operation, handle cancellation, and ensure the UI
        is updated appropriately.
        """
        update_interval = 0.5  # seconds between updates
        last_update = time.time()
        
        while self.is_processing and self.current_thread and self.current_thread.is_alive():
            # Check if the operation was cancelled
            if self.cancelled:
                self.app.log("Operation cancelled")
                self.app.update_progress(0, "Operation cancelled")
                self.is_processing = False
                break
            
            # Monitor resource usage periodically
            current_time = time.time()
            if current_time - last_update >= update_interval:
                # Check memory usage
                try:
                    process = psutil.Process(os.getpid())
                    memory_info = process.memory_info()
                    current_memory = memory_info.rss
                    
                    # Update peak memory if current usage is higher
                    if current_memory > self.peak_memory:
                        self.peak_memory = current_memory
                        
                    # Log excessive memory usage
                    memory_mb = current_memory / (1024 * 1024)
                    if memory_mb > 500:  # Warn if using more than 500MB
                        self.app.log(f"WARNING: High memory usage: {memory_mb:.2f} MB")
                    
                    # Check if operation is running for too long
                    elapsed_time = time.time() - self.start_time
                    if elapsed_time > 300:  # 5 minutes
                        self.app.log(f"WARNING: Operation running for {elapsed_time:.1f} seconds")
                        
                except Exception as e:
                    # Don't interrupt the monitoring if resource check fails
                    pass
                    
                last_update = current_time
            
            # Sleep briefly to avoid consuming too much CPU
            time.sleep(0.1)
        
        # Final status update
        if not self.cancelled and not self.is_processing:
            # If the operation completed normally, make sure the progress bar is at 100%
            current_progress = self.app.progress_value.get() if hasattr(self.app, 'progress_value') else 0
            if current_progress < 100:
                self.app.update_progress(100, "Operation completed")
    
    def cancel_current_operation(self) -> bool:
        """
        Cancel the current background operation
        
        Sets the cancelled flag, which the monitor thread will detect and
        handle appropriately.
        
        Returns:
            bool: True if an operation was cancelled, False if no operation was running
        """
        if self.is_processing:
            self.cancelled = True
            self.app.log("Cancelling operation...")
            
            # Perform cleanup to release resources
            gc.collect()
            
            return True
        return False
    
    def add_completion_callback(self, callback: Callable[[], None]):
        """
        Add a callback to be executed when the current operation completes
        
        The callback will be executed after the main operation finishes,
        regardless of whether it succeeded or failed.
        
        Args:
            callback: The function to call when the operation completes
                     (should take no arguments)
        """
        self.completion_callbacks.append(callback)

