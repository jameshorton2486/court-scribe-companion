
"""
Review Options Section

Creates the AI content review options UI section
"""

import tkinter as tk
from tkinter import ttk

def create_review_options_section(parent, app):
    """Create the AI content review options section"""
    
    # AI Review options
    review_frame = ttk.LabelFrame(parent, text="AI Content Review", padding=10)
    review_frame.pack(fill=tk.X, pady=5)
    
    # AI Review options
    app.review_grammar = tk.BooleanVar(value=True)
    ttk.Checkbutton(review_frame, text="Check Grammar and Style", variable=app.review_grammar).grid(row=0, column=0, sticky=tk.W, pady=2)
    
    app.review_coherence = tk.BooleanVar(value=True)
    ttk.Checkbutton(review_frame, text="Check Content Coherence", variable=app.review_coherence).grid(row=1, column=0, sticky=tk.W, pady=2)
    
    app.suggest_improvements = tk.BooleanVar(value=True)
    ttk.Checkbutton(review_frame, text="Suggest Content Improvements", variable=app.suggest_improvements).grid(row=2, column=0, sticky=tk.W, pady=2)
    
    app.generate_toc_ai = tk.BooleanVar(value=True)
    ttk.Checkbutton(review_frame, text="Generate AI-Assisted Table of Contents", variable=app.generate_toc_ai).grid(row=3, column=0, sticky=tk.W, pady=2)
    
    return review_frame
