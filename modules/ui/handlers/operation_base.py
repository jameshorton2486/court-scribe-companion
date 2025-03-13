
"""
Base Operation Handler Module

This module provides the base class for all operation handlers with common functionality.
"""

from modules.utils.error_handler import ErrorHandler
from modules.utils.encoding_utils import contains_encoding_issues, log_encoding_issues
import os
import logging
import time
import traceback
import gc
import psutil
from typing import Any, Dict, Optional, Tuple, Callable

class BaseOperationHandler:
    """
    Base class for all operation handlers
    
    This class provides common functionality for all operation handlers,
    including result tracking, error handling, and encoding issue detection.
    
    Attributes:
        app: The application instance containing UI elements and data
        operation_results: Dictionary tracking results of operations
    """
    
    def __init__(self, app):
        """
        Initialize the operation handler
        
        Args:
            app: The application instance
        """
        self.app = app
        self.operation_results = {}
        
        # Performance tracking
        self.operation_times = {}
        self.operation_memory = {}
        
        # Ensure Logs directory exists
        logs_dir = os.path.join(os.getcwd(), "Logs")
        if not os.path.exists(logs_dir):
            os.makedirs(logs_dir)
            print(f"Created Logs directory at: {logs_dir}")
        
        # Set up a file handler for logging encoding issues
        encoding_log_path = os.path.join(logs_dir, "encoding_issues.log")
        self.encoding_logger = logging.getLogger("encoding_issues")
        self.encoding_logger.setLevel(logging.INFO)
        
        # Create a file handler
        file_handler = logging.FileHandler(encoding_log_path)
        file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        self.encoding_logger.addHandler(file_handler)
        
        # Performance logger
        perf_log_path = os.path.join(logs_dir, "performance.log")
        self.perf_logger = logging.getLogger("performance")
        self.perf_logger.setLevel(logging.INFO)
        
        # Create a file handler for performance logging
        perf_handler = logging.FileHandler(perf_log_path)
        perf_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        self.perf_logger.addHandler(perf_handler)
    
    def get_operation_result(self, operation_name: str) -> Any:
        """
        Get the result of a specific operation
        
        Args:
            operation_name: Name of the operation to retrieve result for
            
        Returns:
            The result of the operation, or None if not available
        """
        return self.operation_results.get(operation_name)
    
    def check_for_encoding_issues(self, text: str) -> bool:
        """
        Check if text has encoding issues
        
        Args:
            text: The text to check
            
        Returns:
            True if encoding issues are detected, False otherwise
        """
        return contains_encoding_issues(text)
    
    def get_memory_usage(self) -> float:
        """
        Get current memory usage in MB
        
        Returns:
            Current memory usage in megabytes
        """
        try:
            process = psutil.Process(os.getpid())
            memory_info = process.memory_info()
            return memory_info.rss / (1024 * 1024)  # Convert to MB
        except Exception:
            return 0.0
    
    def log_document_info(self, document, file_path=None):
        """
        Log information about the processed document
        
        Args:
            document: The document object
            file_path: Optional file path of the document
        """
        try:
            if not hasattr(document, 'paragraphs'):
                return
                
            # Log basic document info
            self.app.log.info(f"Document has {len(document.paragraphs)} paragraphs")
            
            # Log file size if available
            if file_path and os.path.exists(file_path):
                file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
                self.app.log.info(f"Document file size: {file_size_mb:.2f} MB")
            
            # Sample a few paragraphs to check for encoding issues
            # Use limited sampling for better performance
            paragraph_count = len(document.paragraphs)
            sample_indices = []
            
            if paragraph_count <= 10:
                # For small documents, check all paragraphs
                sample_indices = list(range(paragraph_count))
            else:
                # For larger documents, check first, last, and some middle paragraphs
                sample_indices = [0, 1, 2, paragraph_count//4, paragraph_count//2, 
                                 (3*paragraph_count)//4, paragraph_count-3, 
                                 paragraph_count-2, paragraph_count-1]
                # Remove duplicates (important for smaller docs)
                sample_indices = list(set(sample_indices))
                # Ensure indices are valid
                sample_indices = [i for i in sample_indices if 0 <= i < paragraph_count]
                # Sort for readability in logs
                sample_indices.sort()
            
            # Extract and check samples
            samples = [document.paragraphs[i].text for i in sample_indices if document.paragraphs[i].text.strip()]
            
            # Check samples for encoding issues
            has_issues = False
            for i, sample in enumerate(samples):
                if contains_encoding_issues(sample):
                    has_issues = True
                    self.app.log.warning(f"Encoding issues detected in paragraph {sample_indices[i]}")
                    log_encoding_issues(sample, file_path, self.encoding_logger)
                    # Only log a limited number of issues to avoid performance problems
                    if i >= 2:  # Log at most 3 examples
                        self.app.log.warning(f"More encoding issues may exist. See log for details.")
                        break
            
            if has_issues:
                print("WARNING: Encoding issues detected in document. See 'Logs/encoding_issues.log' for details.")
                self.app.update_progress(self.app.progress_value.get(), "Document loaded with encoding issues")
                
        except Exception as e:
            self.app.log.error(f"Error logging document info: {str(e)}")
    
    def safe_execute_operation(self, operation_func: Callable, operation_name: str, 
                              show_message: bool = True, *args, **kwargs) -> Tuple[bool, Any]:
        """
        Safely execute an operation with error handling and performance tracking
        
        Args:
            operation_func: Function to execute
            operation_name: Name of the operation for logs and error messages
            show_message: Whether to show error/success message boxes
            *args, **kwargs: Arguments to pass to the operation function
        
        Returns:
            Tuple of (success_flag, result_or_error)
        """
        ErrorHandler.log_operation_start(operation_name)
        start_time = time.time()
        
        # Record initial memory
        initial_memory = self.get_memory_usage()
        peak_memory = initial_memory
        
        try:
            # Execute the operation
            result = operation_func(*args, **kwargs)
            
            # Log success and performance
            duration = time.time() - start_time
            current_memory = self.get_memory_usage()
            memory_diff = current_memory - initial_memory
            
            if current_memory > peak_memory:
                peak_memory = current_memory
            
            ErrorHandler.log_operation_complete(
                operation_name, 
                success=True, 
                duration=duration
            )
            
            # Log performance metrics
            self.perf_logger.info(
                f"Operation: {operation_name}, Duration: {duration:.2f}s, "
                f"Memory: initial={initial_memory:.2f}MB, final={current_memory:.2f}MB, "
                f"diff={memory_diff:.2f}MB, peak={peak_memory:.2f}MB"
            )
            
            # Store the result and metrics
            self.operation_results[operation_name] = result
            self.operation_times[operation_name] = duration
            self.operation_memory[operation_name] = {
                'initial': initial_memory,
                'final': current_memory,
                'diff': memory_diff,
                'peak': peak_memory
            }
            
            # Clean up memory for large operations
            if memory_diff > 50:  # If operation used >50MB, trigger garbage collection
                gc.collect()
                self.app.log.info(f"GC after {operation_name}: {self.get_memory_usage():.2f}MB")
            
            return True, result
            
        except Exception as e:
            # Handle the error
            duration = time.time() - start_time
            error_details = traceback.format_exc()
            current_memory = self.get_memory_usage()
            
            # Log the failure with performance metrics
            ErrorHandler.log_operation_complete(
                operation_name,
                success=False,
                duration=duration,
                details=str(e)
            )
            
            self.perf_logger.error(
                f"Failed operation: {operation_name}, Duration: {duration:.2f}s, "
                f"Memory: initial={initial_memory:.2f}MB, final={current_memory:.2f}MB, "
                f"diff={current_memory-initial_memory:.2f}MB"
            )
            
            # Use the ErrorHandler to handle the exception
            ErrorHandler.handle_processing_error(
                self.app, 
                e, 
                operation_name, 
                show_message=show_message
            )
            
            # Clean up memory after error
            gc.collect()
            
            return False, e
    
    def retry_operation(self, operation_func: Callable, operation_name: str, 
                       max_retries: int = 3, show_message: bool = True, *args, **kwargs) -> Tuple[bool, Any]:
        """
        Execute an operation with automatic retries and performance tracking
        
        Args:
            operation_func: Function to execute
            operation_name: Name of the operation for logs and error messages
            max_retries: Maximum number of retry attempts
            show_message: Whether to show error/success message boxes
            *args, **kwargs: Arguments to pass to the operation function
        
        Returns:
            Tuple of (success_flag, result_or_error)
        """
        retries = 0
        last_error = None
        retry_metrics = []
        
        while retries <= max_retries:
            if retries > 0:
                self.app.log.info(f"Retry attempt {retries} for {operation_name}")
                # Add exponential backoff delay
                delay = (2 ** retries) * 0.5  # 1s, 2s, 4s, etc.
                time.sleep(delay)
                
                # Force garbage collection before retry to clear any problematic state
                gc.collect()
            
            # Track operation metrics for this attempt
            attempt_start = time.time()
            initial_memory = self.get_memory_usage()
            
            success, result = self.safe_execute_operation(
                operation_func, 
                f"{operation_name} (attempt {retries+1})",
                show_message=False,
                *args, 
                **kwargs
            )
            
            # Record metrics for this attempt
            attempt_duration = time.time() - attempt_start
            final_memory = self.get_memory_usage()
            retry_metrics.append({
                'attempt': retries + 1,
                'success': success,
                'duration': attempt_duration,
                'memory_initial': initial_memory,
                'memory_final': final_memory,
                'memory_diff': final_memory - initial_memory
            })
            
            if success:
                # If we've had retries, log that we succeeded after retrying
                if retries > 0:
                    self.app.log.info(f"Operation {operation_name} succeeded after {retries} retries")
                    
                    # Log retry performance metrics
                    self.perf_logger.info(
                        f"Operation {operation_name} succeeded after {retries} retries. "
                        f"Final attempt: {attempt_duration:.2f}s, Memory: {final_memory:.2f}MB"
                    )
                
                # Store the final result
                self.operation_results[operation_name] = result
                return True, result
                
            last_error = result
            retries += 1
        
        # If we're here, all retries failed
        self.app.log.error(f"All {max_retries} retry attempts for {operation_name} failed")
        
        # Log comprehensive retry metrics
        self.perf_logger.error(
            f"Operation {operation_name} failed after {max_retries} retries. "
            f"Metrics: {retry_metrics}"
        )
        
        # Show message only at the end of all retries if requested
        if show_message:
            ErrorHandler.handle_processing_error(
                self.app, 
                last_error, 
                f"{operation_name} (after {max_retries} retries)", 
                show_message=True
            )
            
        return False, last_error
