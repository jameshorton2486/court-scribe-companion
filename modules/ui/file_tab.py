
"""
File Tab Module

This module creates the file tab in the BookProcessor application,
which allows users to select, manage, and process document files.
"""

import tkinter as tk
from modules.ui.file_tab_ui import (
    create_file_list_section,
    create_metadata_section, 
    create_options_section,
    create_action_buttons
)
from modules.ui.file_tab_actions import (
    browse_input_file,
    browse_text_file,
    remove_selected_file,
    browse_output_dir,
    update_file_listbox
)

def create_file_tab(parent, app):
    """
    Create the file tab interface with all its components.
    
    Args:
        parent: The parent frame to contain the tab
        app: The application instance
    """
    # Attach file operation methods to app
    app.browse_input_file = lambda: browse_input_file(app)
    app.browse_text_file = lambda: browse_text_file(app)
    app.remove_selected_file = lambda: remove_selected_file(app)
    app.browse_output_dir = lambda: browse_output_dir(app)
    app.update_file_listbox = lambda: update_file_listbox(app)
    app.update_file_count = lambda value: app.file_count_var.set(value)
    
    # Create UI sections
    create_file_list_section(parent, app)
    create_metadata_section(parent, app)
    create_options_section(parent, app)
    create_action_buttons(parent, app)
