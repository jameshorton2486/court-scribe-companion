
import threading
import tkinter as tk
from tkinter import messagebox
import traceback
import sys
import time
import queue
import gc

class BackgroundProcessor:
    """Handles running operations in background threads with progress updates and improved error handling"""
    
    def __init__(self, app):
        self.app = app
        self.current_threads = []
        self.max_concurrent_threads = 2  # Limit concurrent operations
        self.processing_queue = queue.Queue()
        self.thread_monitor = None
        self.memory_threshold_mb = 500  # Memory threshold for garbage collection (MB)
        
    def run_with_progress(self, func, *args, **kwargs):
        """Run a function with progress indication in a background thread with enhanced error handling"""
        self.app.status_manager.is_processing = True
        self.app.status_manager.processing_cancelled = False
        self.app.update_progress(1, "Starting operation...")
        self.app.status_manager.start_time = self.app.status_manager.start_time or 0
        
        # Get name of the function for better error reporting
        func_name = getattr(func, "__name__", "unknown function")
        
        # If we've reached max threads, queue the operation instead of starting it
        if len(self.current_threads) >= self.max_concurrent_threads:
            self.app.log.info(f"Queuing operation: {func_name} (waiting for resource availability)")
            self.processing_queue.put((func, args, kwargs))
            return None
        
        thread = self._create_worker_thread(func, func_name, args, kwargs)
        self.current_threads.append(thread)
        
        # Start thread monitor if needed
        if self.thread_monitor is None or not self.thread_monitor.is_alive():
            self.thread_monitor = threading.Thread(target=self._monitor_threads, daemon=True)
            self.thread_monitor.start()
            
        thread.start()
        return thread
    
    def _create_worker_thread(self, func, func_name, args, kwargs):
        """Create a worker thread for the function"""
        def worker():
            start_time = time.time()
            try:
                self.app.log.info(f"Starting background operation: {func_name}")
                
                # Check memory usage periodically during processing
                self._check_memory_usage()
                
                result = func(*args, **kwargs)
                
                # Calculate and log execution time
                execution_time = time.time() - start_time
                self.app.log.info(f"Operation {func_name} completed in {execution_time:.2f} seconds")
                
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
                    
                # Start next queued task if available
                self._process_next_in_queue()
        
        thread = threading.Thread(target=worker)
        thread.daemon = True
        return thread
    
    def _process_next_in_queue(self):
        """Process the next operation in the queue if one exists"""
        if not self.processing_queue.empty():
            try:
                func, args, kwargs = self.processing_queue.get(block=False)
                func_name = getattr(func, "__name__", "unknown function")
                self.app.log.info(f"Starting queued operation: {func_name}")
                
                thread = self._create_worker_thread(func, func_name, args, kwargs)
                self.current_threads.append(thread)
                thread.start()
            except queue.Empty:
                pass
    
    def _monitor_threads(self):
        """Monitor active threads and manage resources"""
        while True:
            # Check if there are any active threads
            if not self.current_threads:
                # If no active threads and queue is empty, exit monitor
                if self.processing_queue.empty():
                    break
            
            # Check for memory optimization
            self._check_memory_usage()
            
            # Sleep before checking again
            time.sleep(2)
    
    def _check_memory_usage(self):
        """Check memory usage and optimize if needed"""
        try:
            import psutil
            
            # Get current memory usage
            process = psutil.Process()
            memory_info = process.memory_info()
            memory_mb = memory_info.rss / (1024 * 1024)
            
            # If memory usage exceeds threshold, force garbage collection
            if memory_mb > self.memory_threshold_mb:
                self.app.log.warning(f"High memory usage detected ({memory_mb:.1f} MB). Optimizing memory...")
                gc.collect()
                
                # Log the new memory usage after optimization
                memory_info = process.memory_info()
                new_memory_mb = memory_info.rss / (1024 * 1024)
                self.app.log.info(f"Memory optimized: {memory_mb:.1f} MB → {new_memory_mb:.1f} MB")
        except ImportError:
            # psutil not available, skip memory check
            pass
    
    def cancel_all_operations(self):
        """Cancel all running operations"""
        if self.current_threads:
            self.app.status_manager.processing_cancelled = True
            self.app.log.warning(f"Cancelling {len(self.current_threads)} operations")
            self.app.update_progress(0, "Operations cancelled")
            
            # Clear the processing queue
            while not self.processing_queue.empty():
                try:
                    self.processing_queue.get(block=False)
                except queue.Empty:
                    break
            
            # We don't actually stop the threads (as Python doesn't really support that)
            # but we set a flag that the operations should check
