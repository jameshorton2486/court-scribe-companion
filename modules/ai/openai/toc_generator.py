
import json
import openai
from tkinter import messagebox
from modules.ai.openai.api_client import get_api_key

def generate_ai_toc(app):
    """Generate a table of contents using AI with improved error handling."""
    if not hasattr(app, 'chapters') or not app.chapters:
        messagebox.showerror("Error", "No chapters available for TOC generation")
        return
    
    app.log("Generating AI-assisted table of contents...")
    app.update_progress(0, "Starting AI TOC generation...")
    
    # Get API key with improved handling
    api_key = get_api_key(app)
    if not api_key:
        messagebox.showerror("Error", "No OpenAI API key available")
        app.log("No OpenAI API key available")
        app.update_progress(0, "AI TOC generation failed: No API key")
        return
    
    # Set up the client
    client = openai.OpenAI(api_key=api_key)
    
    try:
        # Prepare chapter titles and excerpts for TOC generation
        toc_input = []
        
        for i, chapter in enumerate(app.chapters):
            # Get chapter title
            title = chapter['title']
            
            # Get a brief excerpt (first 200 chars) from the chapter content
            excerpt = ""
            for para in chapter['content'][1:5]:  # Skip title para, take next few
                excerpt += para.text + " "
                if len(excerpt) > 200:
                    excerpt = excerpt[:200] + "..."
                    break
            
            toc_input.append(f"Chapter {i+1}: {title}\nExcerpt: {excerpt}\n")
        
        # Combine all chapter info
        all_chapters_info = "\n".join(toc_input)
        
        # Call OpenAI API to generate TOC
        system_prompt = "You are an expert book editor specialized in creating detailed tables of contents. Analyze the chapter titles and excerpts to create a hierarchical table of contents with main sections and subsections."
        
        user_prompt = f"Based on these chapter titles and excerpts, please generate a detailed table of contents with appropriate hierarchy for a book titled '{app.book_title.get()}':\n\n{all_chapters_info}\n\nFormat your response as a JSON array with each entry having 'title', 'level' (1 for main entries, 2 for sub-entries, 3 for sub-sub-entries), and 'chapter_index' properties."
        
        app.log("Sending TOC generation request to OpenAI...")
        model = app.openai_model.get()
        app.log(f"Using model: {model}")
        
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=2000,
            temperature=0.3
        )
        
        # Extract TOC from response
        toc_response = response.choices[0].message.content.strip()
        
        # Try to parse the JSON response
        try:
            # Look for JSON array in the response
            json_start = toc_response.find('[')
            json_end = toc_response.rfind(']') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = toc_response[json_start:json_end]
                ai_toc = json.loads(json_str)
                
                # Update the app's TOC
                app.toc = []
                for item in ai_toc:
                    toc_item = {
                        'title': item['title'],
                        'level': item['level'],
                        'index': item.get('chapter_index', 0)
                    }
                    app.toc.append(toc_item)
                
                app.log(f"AI-generated TOC with {len(app.toc)} entries")
                app.update_progress(100, "AI TOC generation completed")
                messagebox.showinfo("Success", "AI-assisted table of contents generated successfully")
                return True
            else:
                app.log("Could not find valid JSON in API response")
                app.update_progress(0, "AI TOC generation failed: Invalid response format")
                messagebox.showerror("Error", "Failed to generate TOC: invalid response format")
                return False
                
        except json.JSONDecodeError as e:
            app.log(f"Error parsing TOC JSON: {str(e)}")
            app.log(f"Raw response: {toc_response}")
            app.update_progress(0, "AI TOC generation failed: JSON parse error")
            messagebox.showerror("Error", "Failed to parse AI-generated TOC")
            return False
        
    except openai.RateLimitError as e:
        app.log(f"OpenAI rate limit error: {str(e)}")
        app.update_progress(0, "AI TOC generation failed: Rate limit exceeded")
        messagebox.showerror("Rate Limit Error", f"OpenAI API rate limit exceeded. Please try again later: {str(e)}")
        return False
    except (openai.APIError, openai.APIConnectionError) as e:
        app.log(f"API error in TOC generation: {str(e)}")
        app.update_progress(0, f"AI TOC generation failed: {type(e).__name__}")
        messagebox.showerror("API Error", f"OpenAI API error: {str(e)}")
        return False
    except Exception as e:
        app.log(f"Error in AI TOC generation: {str(e)}")
        app.update_progress(0, "AI TOC generation failed")
        messagebox.showerror("Error", f"Failed to generate AI TOC: {str(e)}")
        return False
