
"""
Action Buttons Section

Creates the AI action buttons UI section
"""

import tkinter as tk
from tkinter import ttk

def create_action_buttons(parent, app):
    """Create the AI action buttons section"""
    
    # Action buttons
    ai_button_frame = ttk.Frame(parent)
    ai_button_frame.pack(fill=tk.X, pady=10)
    
    ttk.Button(ai_button_frame, text="Review Content with AI", command=app.review_with_ai, width=25).pack(side=tk.LEFT, padx=5)
    ttk.Button(ai_button_frame, text="Generate AI Table of Contents", command=app.generate_ai_toc, width=25).pack(side=tk.LEFT, padx=5)
    
    # Apply AI Enhancement button
    ttk.Button(
        ai_button_frame, 
        text="Enhance Current Chapter with AI", 
        command=lambda: app.apply_ai_enhancement(app.enhancement_type.get()), 
        width=25
    ).pack(side=tk.LEFT, padx=5)
    
    return ai_button_frame
