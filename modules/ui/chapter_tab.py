
import tkinter as tk
from tkinter import ttk, scrolledtext

def create_chapter_tab(parent, app):
    # Chapter selection section
    chapter_select_frame = ttk.LabelFrame(parent, text="Chapter Selection", padding=10)
    chapter_select_frame.pack(fill=tk.X, pady=5)
    
    app.chapter_list = tk.StringVar()
    app.chapter_listbox = tk.Listbox(chapter_select_frame, height=5, width=80)
    app.chapter_listbox.pack(fill=tk.X, padx=5, pady=5)
    app.chapter_listbox.bind('<<ListboxSelect>>', app.on_chapter_select)
    
    # Navigation buttons
    nav_frame = ttk.Frame(chapter_select_frame)
    nav_frame.pack(fill=tk.X, pady=5)
    
    ttk.Button(nav_frame, text="Previous Chapter", command=app.prev_chapter).pack(side=tk.LEFT, padx=5)
    ttk.Button(nav_frame, text="Next Chapter", command=app.next_chapter).pack(side=tk.LEFT, padx=5)
    
    # Chapter outline section
    outline_frame = ttk.LabelFrame(parent, text="Chapter Outline", padding=10)
    outline_frame.pack(fill=tk.BOTH, expand=True, pady=5)
    
    app.outline_text = scrolledtext.ScrolledText(outline_frame, width=80, height=5)
    app.outline_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
    
    # Chapter generation options
    gen_options_frame = ttk.LabelFrame(parent, text="Generation Options", padding=10)
    gen_options_frame.pack(fill=tk.X, pady=5)
    
    app.include_images = tk.BooleanVar(value=True)
    ttk.Checkbutton(gen_options_frame, text="Include Images in Generated Content", variable=app.include_images).grid(row=0, column=0, sticky=tk.W, pady=2)
    
    app.include_diagrams = tk.BooleanVar(value=True)
    ttk.Checkbutton(gen_options_frame, text="Include Diagrams/Charts", variable=app.include_diagrams).grid(row=1, column=0, sticky=tk.W, pady=2)
    
    app.writing_style = tk.StringVar(value="informative")
    ttk.Label(gen_options_frame, text="Writing Style:").grid(row=2, column=0, sticky=tk.W, pady=5)
    style_combo = ttk.Combobox(gen_options_frame, textvariable=app.writing_style, state="readonly")
    style_combo['values'] = ('informative', 'academic', 'conversational', 'narrative', 'technical')
    style_combo.grid(row=2, column=1, padx=5, pady=5)
    
    # Generation buttons
    gen_button_frame = ttk.Frame(parent)
    gen_button_frame.pack(fill=tk.X, pady=10)
    
    ttk.Button(gen_button_frame, text="Generate Chapter Content", command=app.generate_chapter_content, width=25).pack(side=tk.LEFT, padx=5)
    ttk.Button(gen_button_frame, text="Save Generated Content", command=app.save_generated_chapter, width=25).pack(side=tk.LEFT, padx=5)
    
    # Preview frame for generated content
    preview_frame = ttk.LabelFrame(parent, text="Content Preview", padding=10)
    preview_frame.pack(fill=tk.BOTH, expand=True, pady=5)
    
    app.preview_text = scrolledtext.ScrolledText(preview_frame, width=80, height=10)
    app.preview_text.pack(fill=tk.BOTH, expand=True)
    
    # Image preview
    app.image_preview_frame = ttk.Frame(preview_frame)
    app.image_preview_frame.pack(fill=tk.X, pady=5)
    app.image_label = ttk.Label(app.image_preview_frame)
    app.image_label.pack(pady=5)
