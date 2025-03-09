
import os
import openai
from tkinter import messagebox

def get_api_key(app):
    """Get OpenAI API key with improved handling of environment variables."""
    # First try to get API key from environment variables
    api_key = os.environ.get('OPENAI_API_KEY')
    
    # If not in environment, get from app
    if not api_key:
        api_key = app.openai_api_key.get().strip()
        if not api_key:
            app.log("No OpenAI API key found in environment or application")
            return None
    else:
        # Update the app's key field if found in environment
        if app.openai_api_key.get() != api_key:
            app.openai_api_key.set(api_key)
            app.log("Using OpenAI API key from environment variables")
    
    return api_key

def test_openai_connection(app):
    """Test connection to OpenAI API with improved error handling."""
    app.update_progress(10, "Testing OpenAI connection...")
    
    # Get API key with improved handling
    api_key = get_api_key(app)
    if not api_key:
        messagebox.showerror("Error", "No OpenAI API key found. Please set the OPENAI_API_KEY environment variable or enter it in the application.")
        app.update_progress(0, "OpenAI connection failed: No API key")
        return
    
    try:
        # Set up the client
        client = openai.OpenAI(api_key=api_key)
        
        # Simple test request
        app.log("Sending test request to OpenAI API...")
        response = client.chat.completions.create(
            model=app.openai_model.get(),
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello, this is a test message."}
            ],
            max_tokens=20
        )
        
        # Log response content for debugging
        app.log(f"Response received: {response.choices[0].message.content}")
        
        app.log("OpenAI connection test successful!")
        app.update_progress(100, "OpenAI connection successful")
        messagebox.showinfo("Success", "Successfully connected to OpenAI API using " + 
                          ("environment variable" if os.environ.get('OPENAI_API_KEY') else "application input"))
        
    except openai.RateLimitError as e:
        app.log(f"OpenAI rate limit error: {str(e)}")
        app.update_progress(0, "OpenAI connection failed: Rate limit exceeded")
        messagebox.showerror("Rate Limit Error", f"OpenAI API rate limit exceeded. Please try again later: {str(e)}")
    except openai.APIError as e:
        app.log(f"OpenAI API error: {str(e)}")
        app.update_progress(0, "OpenAI connection failed: API error")
        messagebox.showerror("API Error", f"OpenAI API error: {str(e)}")
    except openai.APIConnectionError as e:
        app.log(f"OpenAI connection error: {str(e)}")
        app.update_progress(0, "OpenAI connection failed: Connection error")
        messagebox.showerror("Connection Error", f"Failed to connect to OpenAI API: {str(e)}")
    except Exception as e:
        app.log(f"OpenAI connection error: {str(e)}")
        app.update_progress(0, "OpenAI connection failed")
        messagebox.showerror("Error", f"Failed to connect to OpenAI: {str(e)}")
