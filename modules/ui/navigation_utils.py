
import tkinter as tk

def on_chapter_select(app, event):
    if not app.chapters:
        return
            
    selection = app.chapter_listbox.curselection()
    if selection:
        index = selection[0]
        app.current_chapter_index = index
            
        # Display chapter title and update outline textarea
        chapter = app.chapters[index]
        app.outline_text.delete(1.0, tk.END)
        app.outline_text.insert(tk.END, f"Outline for: {chapter['title']}\n\n")
            
        # Clear preview
        app.preview_text.delete(1.0, tk.END)
            
        # Remove any image preview
        app.image_label.config(image=None)

def prev_chapter(app):
    if app.chapters and app.current_chapter_index > 0:
        app.current_chapter_index -= 1
        app.chapter_listbox.selection_clear(0, tk.END)
        app.chapter_listbox.selection_set(app.current_chapter_index)
        app.chapter_listbox.see(app.current_chapter_index)
        on_chapter_select(app, None)

def next_chapter(app):
    if app.chapters and app.current_chapter_index < len(app.chapters) - 1:
        app.current_chapter_index += 1
        app.chapter_listbox.selection_clear(0, tk.END)
        app.chapter_listbox.selection_set(app.current_chapter_index)
        app.chapter_listbox.see(app.current_chapter_index)
        on_chapter_select(app, None)
