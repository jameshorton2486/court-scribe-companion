
"""
API Configuration Section

Creates the OpenAI API configuration UI section
"""

import tkinter as tk
from tkinter import ttk
import os

def create_api_config_section(parent, app):
    """Create the OpenAI API configuration section"""
    
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
    
    # API Model selection
    ttk.Label(api_frame, text="OpenAI Model:").grid(row=2, column=0, sticky=tk.W, pady=5)
    
    # Create a model selection combobox
    app.openai_model = tk.StringVar(value="gpt-3.5-turbo")
    model_combo = ttk.Combobox(api_frame, textvariable=app.openai_model, width=20)
    model_combo['values'] = ("gpt-3.5-turbo", "gpt-4", "gpt-4o")
    model_combo.grid(row=2, column=1, sticky=tk.W, padx=5, pady=5)
    
    # Test API key button
    ttk.Button(api_frame, text="Test API Connection", command=app.test_openai_connection).grid(row=2, column=2, padx=5, pady=5)
    
    return api_frame
