
import openai
import os
from tkinter import messagebox

def test_openai_connection(app):
    # First try to get API key from environment variables
    api_key = os.environ.get('OPENAI_API_KEY')
    
    # Check if API key exists in environment
    if not api_key:
        api_key = app.openai_api_key.get()
        if not api_key:
            messagebox.showerror("Error", "No OpenAI API key found. Please set the OPENAI_API_KEY environment variable or enter it in the application.")
            return
    else:
        # If we found it in environment, update the app's key field and inform user
        app.openai_api_key.set(api_key)
        app.log("Using OpenAI API key from environment variables")
    
    app.update_progress(10, "Testing OpenAI connection...")
    
    try:
        # Set the API key
        openai.api_key = api_key
        
        # Simple test request
        app.log("Sending test request to OpenAI API...")
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
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
        
    except Exception as e:
        app.log(f"OpenAI connection error: {str(e)}")
        app.update_progress(0, "OpenAI connection failed")
        messagebox.showerror("Error", f"Failed to connect to OpenAI: {str(e)}")
