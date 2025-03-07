
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
    
    # API Model selection
    ttk.Label(api_frame, text="OpenAI Model:").grid(row=2, column=0, sticky=tk.W, pady=5)
    
    # Create a model selection combobox
    app.openai_model = tk.StringVar(value="gpt-3.5-turbo")
    model_combo = ttk.Combobox(api_frame, textvariable=app.openai_model, width=20)
    model_combo['values'] = ("gpt-3.5-turbo", "gpt-4", "gpt-4-turbo")
    model_combo.grid(row=2, column=1, sticky=tk.W, padx=5, pady=5)
    
    # Test API key button
    ttk.Button(api_frame, text="Test API Connection", command=app.test_openai_connection).grid(row=2, column=2, padx=5, pady=5)
    
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
    
    # AI Enhancement Options
    enhance_frame = ttk.LabelFrame(parent, text="AI Content Enhancement", padding=10)
    enhance_frame.pack(fill=tk.X, pady=5)
    
    # Enhancement types
    ttk.Label(enhance_frame, text="Enhancement Type:").grid(row=0, column=0, sticky=tk.W, pady=5)
    
    app.enhancement_type = tk.StringVar(value="grammar")
    
    ttk.Radiobutton(
        enhance_frame, 
        text="Grammar & Style", 
        variable=app.enhancement_type, 
        value="grammar"
    ).grid(row=0, column=1, sticky=tk.W, pady=2)
    
    ttk.Radiobutton(
        enhance_frame, 
        text="Expand Content", 
        variable=app.enhancement_type, 
        value="expand"
    ).grid(row=1, column=1, sticky=tk.W, pady=2)
    
    ttk.Radiobutton(
        enhance_frame, 
        text="Simplify Content", 
        variable=app.enhancement_type, 
        value="simplify"
    ).grid(row=2, column=1, sticky=tk.W, pady=2)
    
    # Enhancement intensity
    ttk.Label(enhance_frame, text="Enhancement Intensity:").grid(row=3, column=0, sticky=tk.W, pady=5)
    
    app.enhancement_intensity = tk.DoubleVar(value=0.5)
    intensity_scale = ttk.Scale(
        enhance_frame, 
        from_=0.1, 
        to=1.0, 
        orient=tk.HORIZONTAL, 
        variable=app.enhancement_intensity, 
        length=200
    )
    intensity_scale.grid(row=3, column=1, sticky=tk.W, pady=2)
    
    intensity_label = ttk.Label(enhance_frame, text="Medium")
    intensity_label.grid(row=3, column=2, sticky=tk.W, pady=2)
    
    # Update intensity label when slider moves
    def update_intensity_label(event):
        value = app.enhancement_intensity.get()
        if value < 0.3:
            intensity_label.config(text="Subtle")
        elif value < 0.7:
            intensity_label.config(text="Medium")
        else:
            intensity_label.config(text="Strong")
    
    intensity_scale.bind("<Motion>", update_intensity_label)
    
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
    
    # Add this new function to app
    app.apply_ai_enhancement = lambda enhancement_type: (
        apply_ai_enhancement(app, enhancement_type)
    )
    
    # Function to apply AI enhancement to current chapter
    def apply_ai_enhancement(app, enhancement_type):
        # Import here to avoid circular imports
        from modules.document.content_enhancer import apply_ai_enhancements
        
        # Get selected chapter
        selected = app.chapter_listbox.curselection()
        if not selected:
            app.log("No chapter selected for enhancement")
            return
        
        chapter_idx = selected[0]
        apply_ai_enhancements(app, chapter_idx, enhancement_type)
