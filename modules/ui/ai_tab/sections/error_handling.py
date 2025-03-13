
"""
Error Handling Section

Creates the error handling options UI section
"""

import tkinter as tk
from tkinter import ttk

def create_error_handling_section(parent, app):
    """Create the error handling options section"""
    
    # Error handling options
    error_frame = ttk.LabelFrame(parent, text="Error Handling Options", padding=10)
    error_frame.pack(fill=tk.X, pady=5)
    
    app.retry_on_error = tk.BooleanVar(value=True)
    ttk.Checkbutton(
        error_frame, 
        text="Retry API calls on rate limit errors", 
        variable=app.retry_on_error
    ).grid(row=0, column=0, sticky=tk.W, pady=2)
    
    app.max_retries = tk.IntVar(value=3)
    ttk.Label(error_frame, text="Maximum retries:").grid(row=1, column=0, sticky=tk.W, pady=2)
    retry_spin = ttk.Spinbox(error_frame, from_=1, to=5, textvariable=app.max_retries, width=5)
    retry_spin.grid(row=1, column=1, sticky=tk.W, pady=2, padx=5)
    
    app.fallback_to_local = tk.BooleanVar(value=True)
    ttk.Checkbutton(
        error_frame, 
        text="Fall back to local processing if API fails", 
        variable=app.fallback_to_local
    ).grid(row=2, column=0, columnspan=2, sticky=tk.W, pady=2)
    
    # Add batch error handling section
    ttk.Separator(error_frame, orient="horizontal").grid(row=3, column=0, columnspan=2, sticky=tk.EW, pady=5)
    
    app.continue_batch_on_error = tk.BooleanVar(value=True)
    ttk.Checkbutton(
        error_frame, 
        text="Continue batch processing if individual files fail", 
        variable=app.continue_batch_on_error
    ).grid(row=4, column=0, columnspan=2, sticky=tk.W, pady=2)
    
    app.log_batch_errors = tk.BooleanVar(value=True)
    ttk.Checkbutton(
        error_frame, 
        text="Log detailed error reports for failed batch items", 
        variable=app.log_batch_errors
    ).grid(row=5, column=0, columnspan=2, sticky=tk.W, pady=2)
    
    return error_frame
