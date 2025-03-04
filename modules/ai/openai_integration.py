
import openai
from tkinter import messagebox

def test_openai_connection(app):
    api_key = app.openai_api_key.get()
    if not api_key:
        messagebox.showerror("Error", "Please enter an OpenAI API key")
        return
    
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
