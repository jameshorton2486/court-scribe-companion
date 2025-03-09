
import os
import time
import openai
from docx import Document
from tkinter import messagebox
from modules.ai.openai.api_client import get_api_key

def review_with_ai(app):
    """Review document content with AI to provide feedback and suggestions with improved error handling."""
    if not hasattr(app, 'chapters') or not app.chapters:
        messagebox.showerror("Error", "No chapters available for review")
        return
    
    app.log("Starting AI content review...")
    app.update_progress(0, "Starting AI content review...")
    
    # Get API key with improved handling
    api_key = get_api_key(app)
    if not api_key:
        messagebox.showerror("Error", "No OpenAI API key available")
        app.log("No OpenAI API key available")
        app.update_progress(0, "AI review failed: No API key")
        return
    
    # Set up the client
    client = openai.OpenAI(api_key=api_key)
    
    try:
        # Analyze each chapter and compile feedback
        all_feedback = []
        total_chapters = len(app.chapters)
        
        for i, chapter in enumerate(app.chapters):
            app.update_progress((i / total_chapters) * 100, f"Reviewing chapter {i+1} of {total_chapters}")
            
            # Get chapter content
            chapter_text = "\n".join([p.text for p in chapter['content']])
            
            # Prepare review parameters based on user selections
            review_params = []
            if app.review_grammar.get():
                review_params.append("grammar and style")
            if app.review_coherence.get():
                review_params.append("content coherence and flow")
            if app.suggest_improvements.get():
                review_params.append("content improvement suggestions")
            
            review_focus = ", ".join(review_params)
            
            # Skip if no review parameters selected
            if not review_params:
                app.log(f"Skipping chapter {i+1} (no review parameters selected)")
                continue
            
            # Call OpenAI API for review
            system_prompt = "You are an expert editor and writing coach. Provide a concise, helpful review of the text focusing on the requested aspects. Be specific and constructive with your feedback."
            
            user_prompt = f"Please review this text and provide feedback on {review_focus}. The text is chapter {i+1} ('{chapter['title']}') of the book '{app.book_title.get()}':\n\n{chapter_text}\n\nFormat your response as a JSON object with sections for each requested review aspect, with 'issues' (array of specific issues) and 'suggestions' (array of improvement ideas) for each section."
            
            app.log(f"Sending review request for chapter {i+1} to OpenAI...")
            model = app.openai_model.get()
            
            try:
                response = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=2000,
                    temperature=0.3
                )
                
                # Process review feedback
                feedback = response.choices[0].message.content.strip()
                all_feedback.append(f"## Chapter {i+1}: {chapter['title']}\n\n{feedback}\n\n")
            except openai.RateLimitError as e:
                app.log(f"Rate limit exceeded for chapter {i+1}: {str(e)}")
                all_feedback.append(f"## Chapter {i+1}: {chapter['title']}\n\n*Error: API rate limit exceeded for this chapter.*\n\n")
                # Continue with next chapter instead of stopping the whole process
                time.sleep(5)  # Wait a bit before next request
                continue
        
        # Combine all feedback
        combined_feedback = "\n".join(all_feedback)
        
        # Create a report document
        report_doc = Document()
        
        # Add title
        report_doc.add_heading(f"AI Review Report: {app.book_title.get()}", level=1)
        
        # Add review content
        for line in combined_feedback.split('\n'):
            # Check if line is a heading
            if line.startswith('##'):
                level = line.count('#')
                report_doc.add_heading(line.lstrip('#').strip(), level=level)
            else:
                report_doc.add_paragraph(line)
        
        # Save the report
        report_filename = f"{app.book_title.get().replace(' ', '_')}_AI_Review.docx"
        
        # Ensure output directory exists
        os.makedirs(app.output_dir.get(), exist_ok=True)
        
        report_path = os.path.join(app.output_dir.get(), report_filename)
        report_doc.save(report_path)
        
        app.update_progress(100, "AI review completed")
        app.log(f"AI review completed and saved to: {report_path}")
        messagebox.showinfo("Success", f"AI review completed and saved to: {report_path}")
        
    except openai.RateLimitError as e:
        app.log(f"OpenAI rate limit error: {str(e)}")
        app.update_progress(0, "AI review failed: Rate limit exceeded")
        messagebox.showerror("Rate Limit Error", f"OpenAI API rate limit exceeded. Please try again later: {str(e)}")
    except (openai.APIError, openai.APIConnectionError) as e:
        app.log(f"API error in AI review: {str(e)}")
        app.update_progress(0, f"AI review failed: {type(e).__name__}")
        messagebox.showerror("API Error", f"OpenAI API error: {str(e)}")
    except Exception as e:
        app.log(f"Error in AI review: {str(e)}")
        app.update_progress(0, "AI review failed")
        messagebox.showerror("Error", f"Failed to complete AI review: {str(e)}")
