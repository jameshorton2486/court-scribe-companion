
"""
Selection Operations Module

Functions for managing file selections in the listbox.
"""

import tkinter as tk
import logging
from modules.utils.error_handler import ErrorHandler

# Set up logger for this module
logger = logging.getLogger(__name__)

def select_all_files(app):
    """Select all files in the listbox."""
    try:
        if app.file_listbox.size() > 0:
            app.file_listbox.selection_set(0, tk.END)
            logger.debug("Selected all files in listbox")
            print(f"Selected all {app.file_listbox.size()} files")
        else:
            print("No files to select")
    except Exception as e:
        ErrorHandler.handle_processing_error(app, e, "select all files")

def deselect_all_files(app):
    """Deselect all files in the listbox."""
    try:
        app.file_listbox.selection_clear(0, tk.END)
        logger.debug("Deselected all files in listbox")
        print("Deselected all files")
    except Exception as e:
        ErrorHandler.handle_processing_error(app, e, "deselect all files")
