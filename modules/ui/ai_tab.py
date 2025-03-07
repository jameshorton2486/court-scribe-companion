
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
    model_combo['values'] = ("gpt-3.5-turbo", "gpt-4", "gpt-4o")
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
    
    ttk.Radiobutton(
        enhance_frame, 
        text="Change Writing Style", 
        variable=app.enhancement_type, 
        value="style"
    ).grid(row=3, column=1, sticky=tk.W, pady=2)
    
    # Style options (only visible when style is selected)
    app.style_type = tk.StringVar(value="professional")
    
    def update_style_frame():
        if app.enhancement_type.get() == "style":
            style_frame.grid(row=4, column=1, sticky=tk.W, pady=2)
        else:
            style_frame.grid_forget()
    
    style_frame = ttk.Frame(enhance_frame)
    
    ttk.Radiobutton(
        style_frame, 
        text="Professional", 
        variable=app.style_type, 
        value="professional"
    ).grid(row=0, column=0, sticky=tk.W, pady=2, padx=(15, 5))
    
    ttk.Radiobutton(
        style_frame, 
        text="Academic", 
        variable=app.style_type, 
        value="academic"
    ).grid(row=0, column=1, sticky=tk.W, pady=2, padx=5)
    
    ttk.Radiobutton(
        style_frame, 
        text="Conversational", 
        variable=app.style_type, 
        value="conversational"
    ).grid(row=1, column=0, sticky=tk.W, pady=2, padx=(15, 5))
    
    ttk.Radiobutton(
        style_frame, 
        text="Storytelling", 
        variable=app.style_type, 
        value="storytelling"
    ).grid(row=1, column=1, sticky=tk.W, pady=2, padx=5)
    
    # Bind the radiobutton change to update the style frame visibility
    for rb in enhance_frame.winfo_children():
        if isinstance(rb, ttk.Radiobutton) and rb['variable'] == str(app.enhancement_type):
            rb.configure(command=update_style_frame)
    
    # Enhancement intensity
    ttk.Label(enhance_frame, text="Enhancement Intensity:").grid(row=5, column=0, sticky=tk.W, pady=5)
    
    app.enhancement_intensity = tk.DoubleVar(value=0.5)
    intensity_scale = ttk.Scale(
        enhance_frame, 
        from_=0.1, 
        to=1.0, 
        orient=tk.HORIZONTAL, 
        variable=app.enhancement_intensity, 
        length=200
    )
    intensity_scale.grid(row=5, column=1, sticky=tk.W, pady=2)
    
    app.intensity_label = ttk.Label(enhance_frame, text="Medium")
    app.intensity_label.grid(row=5, column=2, sticky=tk.W, pady=2)
    
    # Update intensity label when slider moves
    def update_intensity_label(event=None):
        value = app.enhancement_intensity.get()
        if value < 0.3:
            app.intensity_label.config(text="Subtle")
        elif value < 0.7:
            app.intensity_label.config(text="Medium")
        else:
            app.intensity_label.config(text="Strong")
    
    intensity_scale.bind("<Motion>", update_intensity_label)
    update_intensity_label()  # Initialize label
    
    # Error handling options
    error_frame = ttk.LabelFrame(parent, text="Error Handling Options", padding=10)
    error_frame.pack(fill=tk.X, pady=5)
    
    app.retry_on_error = tk.BooleanVar(value=True)
    ttk.Checkbutton(
        error_frame, 
        text="Retry API calls on rate limit errors", 
        variable=app.retry_on_error
    ).grid(row=0, column=0, sticky=tk.W, pady=2)
    
    app.max_retries = tk.IntVar(value=3)
    ttk.Label(error_frame, text="Maximum retries:").grid(row=1, column=0, sticky=tk.W, pady=2)
    retry_spin = ttk.Spinbox(error_frame, from_=1, to=5, textvariable=app.max_retries, width=5)
    retry_spin.grid(row=1, column=1, sticky=tk.W, pady=2, padx=5)
    
    app.fallback_to_local = tk.BooleanVar(value=True)
    ttk.Checkbutton(
        error_frame, 
        text="Fall back to local processing if API fails", 
        variable=app.fallback_to_local
    ).grid(row=2, column=0, columnspan=2, sticky=tk.W, pady=2)
    
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
