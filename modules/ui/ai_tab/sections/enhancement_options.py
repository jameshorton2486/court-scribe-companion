
"""
Enhancement Options Section

Creates the AI content enhancement options UI section
"""

import tkinter as tk
from tkinter import ttk

def create_enhancement_options_section(parent, app):
    """Create the AI content enhancement options section"""
    
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
    
    return enhance_frame
