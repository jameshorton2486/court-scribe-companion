
"""
AI Tab UI Module

This module creates the AI tab interface, composing the various sections
"""

import tkinter as tk
from tkinter import ttk

from .sections.api_config import create_api_config
from .sections.enhancement_options import create_enhancement_options
from .sections.review_options import create_review_options
from .sections.action_buttons import create_action_buttons
from .sections.error_handling import setup_error_handling

def create_ai_tab(tab, app):
    """Create the AI enhancement tab"""
    
    # Set up variables
    app.openai_model = tk.StringVar(value="gpt-3.5-turbo")
    app.enhancement_type = tk.StringVar(value="grammar")
    app.style_type = tk.StringVar(value="professional")
    app.enhancement_intensity = tk.DoubleVar(value=0.5)
    
    # Review options
    app.review_grammar = tk.BooleanVar(value=True)
    app.review_coherence = tk.BooleanVar(value=True)
    app.suggest_improvements = tk.BooleanVar(value=True)
    
    # Create AI API configuration section
    api_frame = create_api_config(tab, app)
    api_frame.pack(fill=tk.X, pady=10)
    
    # Create review options section
    review_frame = create_review_options(tab, app)
    review_frame.pack(fill=tk.X, pady=10)
    
    # Create enhancement options section
    enhance_frame = create_enhancement_options(tab, app)
    enhance_frame.pack(fill=tk.X, pady=10)
    
    # Create action buttons section
    button_frame = create_action_buttons(tab, app)
    button_frame.pack(fill=tk.X, pady=10)
    
    # Setup error handling and validation
    setup_error_handling(app)
    
    return tab
