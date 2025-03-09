
import threading
import io
import os
import re
import tkinter as tk
import openai
import requests
from PIL import Image, ImageTk
from tkinter import messagebox
from modules.ai.chapter_gen.visuals import generate_chapter_visual
from modules.ai.openai.api_client import get_api_key, validate_api_key

def generate_chapter_content(app):
    if not app.chapters:
        messagebox.showerror("Error", "No chapters available. Please process a document first.")
        return
    
    if app.current_chapter_index < 0 or app.current_chapter_index >= len(app.chapters):
        messagebox.showerror("Error", "Please select a valid chapter first.")
        return
    
    outline = app.outline_text.get(1.0, tk.END).strip()
    if not outline:
        messagebox.showerror("Error", "Please provide an outline for the chapter.")
        return
    
    # First try to get API key from environment variables
    api_key = get_api_key(app)
    if not api_key:
        messagebox.showerror("Error", "No OpenAI API key found. Please set the OPENAI_API_KEY environment variable or enter it in the application.")
        return
    
    # Basic validation before making the API call
    if not validate_api_key(api_key):
        app.log("Invalid OpenAI API key format")
        messagebox.showerror("Error", "The API key appears to be invalid. OpenAI API keys typically start with 'sk-'.")
        return
    
    # Start chapter generation in a separate thread
    threading.Thread(target=_generate_chapter_thread, args=(app, api_key), daemon=True).start()

def _generate_chapter_thread(app, api_key):
    try:
        chapter = app.chapters[app.current_chapter_index]
        app.log(f"Generating content for chapter: {chapter['title']}...")
        app.update_progress(0, "Starting chapter generation...")
        
        # Create the prompt for AI
        outline = app.outline_text.get(1.0, tk.END).strip()
        
        prompt = f"""Write a detailed chapter for a book with the following details:
        - Book title: {app.book_title.get()}
        - Chapter title: {chapter['title']}
        - Writing style: {app.writing_style.get()}
        
        Chapter outline:
        {outline}
        
        Please write a comprehensive chapter following this outline. The content should be detailed, well-structured, and professionally written.
        Include appropriate section headings for each major point in the outline.
        """
        
        # Setup OpenAI client
        client = openai.OpenAI(api_key=api_key)
        
        # Send to OpenAI
        app.update_progress(20, "Generating chapter content...")
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional book writer with expertise in creating detailed, engaging book chapters."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=4000
        )
        
        # Get chapter content
        chapter_content = response.choices[0].message.content
        
        # Generate image/diagram if requested
        image_data = None
        if app.include_images.get() or app.include_diagrams.get():
            app.update_progress(50, "Generating visual content...")
            image_data = generate_chapter_visual(app, chapter)
            
        # Display the content in the preview area
        app.preview_text.delete(1.0, tk.END)
        app.preview_text.insert(tk.END, chapter_content)
        
        # Save the generated content for later use
        chapter["generated_content"] = chapter_content
        if image_data:
            chapter["image_data"] = image_data
        
        app.update_progress(100, "Chapter generation completed")
        app.log("Chapter content generated successfully")
        messagebox.showinfo("Success", "Chapter content generated successfully")
        
    except openai.AuthenticationError as e:
        app.log(f"OpenAI authentication error: {str(e)}")
        app.update_progress(0, "Chapter generation failed: Authentication error")
        messagebox.showerror("Authentication Error", f"Invalid API key or not authorized: {str(e)}")
    except openai.RateLimitError as e:
        app.log(f"OpenAI rate limit error: {str(e)}")
        app.update_progress(0, "Chapter generation failed: Rate limit exceeded")
        messagebox.showerror("Rate Limit Error", f"OpenAI API rate limit exceeded. Please try again later: {str(e)}")
    except openai.APIError as e:
        app.log(f"OpenAI API error: {str(e)}")
        app.update_progress(0, "Chapter generation failed: API error")
        messagebox.showerror("API Error", f"OpenAI API error: {str(e)}")
    except openai.APIConnectionError as e:
        app.log(f"OpenAI connection error: {str(e)}")
        app.update_progress(0, "Chapter generation failed: Connection error")
        messagebox.showerror("Connection Error", f"Failed to connect to OpenAI API: {str(e)}")
    except Exception as e:
        app.log(f"Error generating chapter content: {str(e)}")
        app.update_progress(0, "Error in content generation")
        messagebox.showerror("Error", f"Failed to generate chapter content: {str(e)}")
