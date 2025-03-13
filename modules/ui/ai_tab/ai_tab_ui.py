
"""
AI Tab UI Module

Creates the user interface for the AI functionality tab
"""

import tkinter as tk
from tkinter import ttk
import os
from .sections.api_config import create_api_config_section
from .sections.review_options import create_review_options_section
from .sections.enhancement_options import create_enhancement_options_section
from .sections.error_handling import create_error_handling_section
from .sections.action_buttons import create_action_buttons

def create_ai_tab(parent, app):
    """Create the complete AI tab with all sections"""
    
    # Create each section of the AI tab
    create_api_config_section(parent, app)
    create_review_options_section(parent, app)
    create_enhancement_options_section(parent, app)
    create_error_handling_section(parent, app)
    create_action_buttons(parent, app)
    
    # Add the enhancement function to app
    app.apply_ai_enhancement = lambda enhancement_type: (
        apply_ai_enhancement(app, enhancement_type)
    )

def apply_ai_enhancement(app, enhancement_type):
    """Apply AI enhancement to current chapter"""
    # Import here to avoid circular imports
    from modules.document.content_enhancer import apply_ai_enhancements
    
    # Get selected chapter
    selected = app.chapter_listbox.curselection()
    if not selected:
        app.log("No chapter selected for enhancement")
        return
    
    chapter_idx = selected[0]
    apply_ai_enhancements(app, chapter_idx, enhancement_type)
