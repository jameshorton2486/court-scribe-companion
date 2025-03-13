
"""
File Tab Actions Module

This module provides action handlers for file operations in the file tab,
such as browsing for files, adding and removing files, and updating the file list display.
"""

from .file_browser import browse_input_file, browse_text_file, browse_output_dir
from .file_operations import remove_selected_file, update_file_listbox
from .selection_operations import select_all_files, deselect_all_files

__all__ = [
    'browse_input_file',
    'browse_text_file',
    'remove_selected_file',
    'browse_output_dir',
    'update_file_listbox',
    'select_all_files',
    'deselect_all_files'
]
