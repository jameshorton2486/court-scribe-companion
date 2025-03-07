
import openai
import os
from tkinter import messagebox

def test_openai_connection(app):
    # First try to get API key from environment variables
    api_key = os.environ.get('OPENAI_API_KEY')
    
    # If not in environment, use the one from the application
    if not api_key:
        api_key = app.openai_api_key.get()
        if not api_key:
            messagebox.showerror("Error", "No OpenAI API key found. Please set the OPENAI_API_KEY environment variable or enter it in the application.")
            return
    else:
        # If we found it in environment, update the app's key field
        app.openai_api_key.set(api_key)
        app.log("Using OpenAI API key from environment variables")
    
    app.update_progress(0, "Testing OpenAI connection...")
    
    try:
        # Set the API key
        openai.api_key = api_key
        
        # Simple test request
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello, this is a test message."}
            ],
            max_tokens=20
        )
        
        app.log("OpenAI connection test successful!")
        app.update_progress(100, "OpenAI connection successful")
        messagebox.showinfo("Success", "Successfully connected to OpenAI API")
        
    except Exception as e:
        app.log(f"OpenAI connection error: {str(e)}")
        app.update_progress(0, "OpenAI connection failed")
        messagebox.showerror("Error", f"Failed to connect to OpenAI: {str(e)}")
