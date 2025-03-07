
import tkinter as tk
from tkinter import ttk
import os

def create_ai_tab(parent, app):
    # OpenAI API Key
    api_frame = ttk.LabelFrame(parent, text="OpenAI Configuration", padding=10)
    api_frame.pack(fill=tk.X, pady=5)
    
    # Check if API key is in environment variables
    env_api_key = os.environ.get('OPENAI_API_KEY', '')
    if env_api_key:
        app.openai_api_key.set(env_api_key)
        env_status = ttk.Label(api_frame, text="✓ Using API key from environment variables", foreground="green")
        env_status.grid(row=0, column=0, columnspan=3, sticky=tk.W, pady=5)
    else:
        env_status = ttk.Label(api_frame, text="⚠ No API key found in environment variables", foreground="orange")
        env_status.grid(row=0, column=0, columnspan=3, sticky=tk.W, pady=5)
    
    ttk.Label(api_frame, text="OpenAI API Key:").grid(row=1, column=0, sticky=tk.W, pady=5)
    api_entry = ttk.Entry(api_frame, textvariable=app.openai_api_key, width=50, show="*")
    api_entry.grid(row=1, column=1, padx=5, pady=5)
    
    # Toggle button to show/hide API key
    app.show_api_key = tk.BooleanVar(value=False)
    def toggle_api_key_visibility():
        if app.show_api_key.get():
            api_entry.config(show="")
        else:
            api_entry.config(show="*")
    
    ttk.Checkbutton(api_frame, text="Show API Key", variable=app.show_api_key, command=toggle_api_key_visibility).grid(row=1, column=2, padx=5, pady=5)
    
    # Test API key button
    ttk.Button(api_frame, text="Test API Connection", command=app.test_openai_connection).grid(row=2, column=1, padx=5, pady=5)
    
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
    
    # Action buttons
    ai_button_frame = ttk.Frame(parent)
    ai_button_frame.pack(fill=tk.X, pady=10)
    
    ttk.Button(ai_button_frame, text="Review Content with AI", command=app.review_with_ai, width=25).pack(side=tk.LEFT, padx=5)
    ttk.Button(ai_button_frame, text="Generate AI Table of Contents", command=app.generate_ai_toc, width=25).pack(side=tk.LEFT, padx=5)
