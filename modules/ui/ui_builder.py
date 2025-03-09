
"""
UI Builder Module

This module handles the creation and layout of the application's
graphical user interface components. It provides functions to construct
the main UI framework, tabs, and shared elements like logging and progress
indicators.

The module follows a composition pattern, where each part of the UI is
built by specialized functions, promoting code reuse and maintainability.
"""

import tkinter as tk
from tkinter import ttk, scrolledtext
from modules.ui.file_tab import create_file_tab
from modules.ui.ai_tab import create_ai_tab
from modules.ui.chapter_tab import create_chapter_tab
from modules.ui.log_manager import LogManager

def create_main_ui(app):
    """
    Create the main UI components for the BookProcessor application.
    
    This function sets up the main application window, creates tabs for
    different functionality areas, and configures shared UI elements
    like the log display and progress indicators.
    
    Args:
        app: The application instance to configure UI for
    """
    # Main frame with notebook (tabs)
    main_frame = ttk.Frame(app.root, padding=10)
    main_frame.pack(fill=tk.BOTH, expand=True)
    
    # Create notebook for tabbed interface
    notebook = ttk.Notebook(main_frame)
    notebook.pack(fill=tk.BOTH, expand=True)
    
    # Tab 1: File Processing
    file_tab = ttk.Frame(notebook, padding=10)
    notebook.add(file_tab, text="File Processing")
    
    # Tab 2: AI Enhancement
    ai_tab = ttk.Frame(notebook, padding=10)
    notebook.add(ai_tab, text="AI Enhancement")
    
    # Tab 3: Chapter Generation
    chapter_tab = ttk.Frame(notebook, padding=10)
    notebook.add(chapter_tab, text="Chapter Generation")
    
    # Create tab contents using specialized functions
    create_file_tab(file_tab, app)
    create_ai_tab(ai_tab, app)
    create_chapter_tab(chapter_tab, app)
    
    # Create shared UI components
    _create_log_section(main_frame, app)
    _create_progress_section(main_frame, app)

def _create_log_section(parent, app):
    """
    Create the logging section of the UI.
    
    Args:
        parent: The parent frame to contain the log section
        app: The application instance
    """
    log_frame = ttk.LabelFrame(parent, text="Processing Log", padding=10)
    log_frame.pack(fill=tk.BOTH, expand=True, pady=5)
    
    app.log_text = scrolledtext.ScrolledText(log_frame, width=80, height=10)
    app.log_text.pack(fill=tk.BOTH, expand=True)
    app.log_text.config(state=tk.DISABLED)
    
    # Initialize log manager
    app.log_manager = LogManager(app.log_text)

def _create_progress_section(parent, app):
    """
    Create the progress and status section of the UI.
    
    Args:
        parent: The parent frame to contain the progress section
        app: The application instance
    """
    progress_frame = ttk.Frame(parent)
    progress_frame.pack(fill=tk.X, pady=5)
    
    # Status indicator with improved layout
    status_section = ttk.Frame(progress_frame)
    status_section.pack(side=tk.LEFT, fill=tk.X, expand=True)
    
    ttk.Label(status_section, text="Status:").pack(side=tk.LEFT, padx=5)
    app.status_label = ttk.Label(status_section, textvariable=app.current_status, width=30, anchor=tk.W)
    app.status_label.pack(side=tk.LEFT, padx=5)
    
    # New spinner for indicating activity
    app.spinner_label = ttk.Label(status_section, text="")
    app.spinner_label.pack(side=tk.LEFT, padx=5)
    
    # Progress controls
    progress_controls = ttk.Frame(progress_frame)
    progress_controls.pack(side=tk.RIGHT, fill=tk.X)
    
    app.progress_bar = ttk.Progressbar(progress_controls, variable=app.progress_value, length=400, mode="determinate")
    app.progress_bar.pack(side=tk.RIGHT, padx=5)
    
    # Create cancel button for long-running operations
    app.cancel_button = ttk.Button(progress_controls, text="Cancel", command=app.cancel_operation, state=tk.DISABLED)
    app.cancel_button.pack(side=tk.RIGHT, padx=5)
    
    # Elapsed time indicator
    app.time_label = ttk.Label(progress_controls, textvariable=app.status_manager.elapsed_time)
    app.time_label.pack(side=tk.RIGHT, padx=10)
    
    # Set UI elements for status manager
    app.status_manager.set_ui_elements(app.spinner_label, app.cancel_button, app.time_label)
