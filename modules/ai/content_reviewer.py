
import threading
import time
import os
import openai
from docx import Document
from tkinter import messagebox

def review_with_ai(app):
    if not app.chapters:
        messagebox.showerror("Error", "No chapters found. Please process a document first.")
        return
    
    api_key = app.openai_api_key.get()
    if not api_key:
        messagebox.showerror("Error", "Please enter an OpenAI API key")
        return
    
    openai.api_key = api_key
    
    # Start AI review in a separate thread
    threading.Thread(target=_review_with_ai_thread, args=(app,), daemon=True).start()

def _review_with_ai_thread(app):
    try:
        app.log("Starting AI content review...")
        app.update_progress(0, "Starting AI review...")
        
        total_chapters = len(app.chapters)
        review_results = []
        
        for i, chapter in enumerate(app.chapters):
            app.update_progress((i / total_chapters) * 100, f"Reviewing chapter {i+1} of {total_chapters}")
            app.log(f"Analyzing chapter: {chapter['title']}")
            
            # Extract all text from this chapter
            chapter_text = ""
            for para in chapter["content"]:
                chapter_text += para.text + "\n"
            
            # Build prompt based on selected options
            prompt = f"Review this book chapter titled '{chapter['title']}'. "
            
            if app.review_grammar.get():
                prompt += "Check for grammar and style issues. "
            
            if app.review_coherence.get():
                prompt += "Evaluate content coherence and logical flow. "
            
            if app.suggest_improvements.get():
                prompt += "Suggest specific improvements to enhance the content. "
            
            # Send to OpenAI
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a professional book editor with expertise in improving book content."},
                    {"role": "user", "content": prompt + "\n\nCHAPTER CONTENT:\n" + chapter_text}
                ],
                max_tokens=1000
            )
            
            # Store results
            ai_feedback = response.choices[0].message.content
            review_results.append({
                "chapter_title": chapter["title"],
                "feedback": ai_feedback
            })
            
            app.log(f"AI review completed for chapter: {chapter['title']}")
        
        # Create review document
        app.update_progress(90, "Creating review document...")
        
        review_doc = Document()
        review_doc.add_heading("AI Content Review", level=1)
        review_doc.add_paragraph(f"Book: {app.book_title.get()}")
        review_doc.add_paragraph(f"Author: {app.author_name.get()}")
        review_doc.add_paragraph(f"Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        for result in review_results:
            review_doc.add_heading(f"Chapter: {result['chapter_title']}", level=2)
            review_doc.add_paragraph(result["feedback"])
            review_doc.add_paragraph()  # Add space between reviews
        
        # Save review document
        os.makedirs(app.output_dir.get(), exist_ok=True)
        review_filepath = os.path.join(app.output_dir.get(), "AI_Review.docx")
        review_doc.save(review_filepath)
        
        app.update_progress(100, "AI review completed")
        app.log(f"AI review completed. Review document saved to {review_filepath}")
        messagebox.showinfo("Success", f"AI review completed. Review document saved to {review_filepath}")
        
    except Exception as e:
        app.log(f"Error during AI review: {str(e)}")
        app.update_progress(0, "Error during AI review")
        messagebox.showerror("Error", f"Failed to complete AI review: {str(e)}")
