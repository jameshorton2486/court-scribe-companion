
import os
import logging
import openai
from tkinter import messagebox

# Set up logger for this module
logger = logging.getLogger(__name__)

def get_api_key(app):
    """Get OpenAI API key with improved handling of environment variables."""
    logger.debug("Retrieving OpenAI API key")
    print("Retrieving OpenAI API key...")
    
    # First try to get API key from environment variables
    api_key = os.environ.get('OPENAI_API_KEY')
    
    # If not in environment, get from app
    if not api_key:
        api_key = app.openai_api_key.get().strip()
        if not api_key:
            logger.warning("No OpenAI API key found in environment or application")
            app.log("No OpenAI API key found in environment or application")
            print("WARNING: No OpenAI API key found in environment or application")
            return None
        else:
            logger.info("Using OpenAI API key from application input")
            print("Using OpenAI API key from application input")
    else:
        # Update the app's key field if found in environment
        if app.openai_api_key.get() != api_key:
            app.openai_api_key.set(api_key)
            logger.info("Using OpenAI API key from environment variables")
            app.log("Using OpenAI API key from environment variables")
            print("Using OpenAI API key from environment variables")
    
    # Basic validation
    if not validate_api_key(api_key):
        logger.warning("API key found but appears to be invalid")
        print("WARNING: API key found but appears to be invalid")
    
    return api_key

def validate_api_key(api_key):
    """Validate that the API key has the correct format."""
    if not api_key:
        return False
        
    # Basic validation - most OpenAI keys start with 'sk-' and have a minimum length
    if not api_key.startswith('sk-') or len(api_key) < 20:
        return False
        
    return True

def test_openai_connection(app):
    """Test connection to OpenAI API with improved error handling."""
    logger.info("Testing OpenAI API connection")
    print("Testing OpenAI API connection...")
    app.update_progress(10, "Testing OpenAI connection...")
    
    # Get API key with improved handling
    api_key = get_api_key(app)
    if not api_key:
        error_msg = "No OpenAI API key found. Please set the OPENAI_API_KEY environment variable or enter it in the application."
        logger.error(error_msg)
        messagebox.showerror("Error", error_msg)
        app.update_progress(0, "OpenAI connection failed: No API key")
        print("ERROR: No OpenAI API key available")
        return False
    
    # Basic validation before making the API call
    if not validate_api_key(api_key):
        error_msg = "The API key appears to be invalid. OpenAI API keys typically start with 'sk-'."
        logger.error(error_msg)
        app.log("Invalid OpenAI API key format")
        messagebox.showerror("Error", error_msg)
        app.update_progress(0, "OpenAI connection failed: Invalid API key format")
        print("ERROR: Invalid OpenAI API key format")
        return False
    
    try:
        # Set up the client - removing any proxy configuration that might be causing issues
        logger.info(f"Creating OpenAI client with model: {app.openai_model.get()}")
        print(f"Creating OpenAI client with model: {app.openai_model.get()}")
        client = openai.OpenAI(api_key=api_key)
        
        # Simple test request
        app.log("Sending test request to OpenAI API...")
        print("Sending test request to OpenAI API...")
        logger.info("Sending test request to OpenAI API")
        
        app.update_progress(30, "Sending test request to OpenAI...")
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
        logger.info(f"Test response received: {response.choices[0].message.content}")
        
        app.log("OpenAI connection test successful!")
        logger.info("OpenAI connection test successful")
        app.update_progress(100, "OpenAI connection successful")
        print("SUCCESS: OpenAI connection test successful!")
        
        api_source = "environment variable" if os.environ.get('OPENAI_API_KEY') else "application input"
        messagebox.showinfo("Success", "Successfully connected to OpenAI API using " + api_source)
        return True
        
    except openai.AuthenticationError as e:
        error_msg = f"Invalid API key or not authorized: {str(e)}"
        app.log(f"OpenAI authentication error: {str(e)}")
        logger.error(f"OpenAI authentication error: {str(e)}")
        app.update_progress(0, "OpenAI connection failed: Authentication error")
        print(f"ERROR: OpenAI authentication failed: {str(e)}")
        messagebox.showerror("Authentication Error", error_msg)
        
    except openai.RateLimitError as e:
        error_msg = f"OpenAI API rate limit exceeded. Please try again later: {str(e)}"
        app.log(f"OpenAI rate limit error: {str(e)}")
        logger.error(f"OpenAI rate limit error: {str(e)}")
        app.update_progress(0, "OpenAI connection failed: Rate limit exceeded")
        print(f"ERROR: OpenAI rate limit exceeded: {str(e)}")
        messagebox.showerror("Rate Limit Error", error_msg)
        
    except openai.APIError as e:
        error_msg = f"OpenAI API error: {str(e)}"
        app.log(f"OpenAI API error: {str(e)}")
        logger.error(f"OpenAI API error: {str(e)}")
        app.update_progress(0, "OpenAI connection failed: API error")
        print(f"ERROR: OpenAI API error: {str(e)}")
        messagebox.showerror("API Error", error_msg)
        
    except openai.APIConnectionError as e:
        error_msg = f"Failed to connect to OpenAI API: {str(e)}"
        app.log(f"OpenAI connection error: {str(e)}")
        logger.error(f"OpenAI connection error: {str(e)}")
        app.update_progress(0, "OpenAI connection failed: Connection error")
        print(f"ERROR: Failed to connect to OpenAI API: {str(e)}")
        messagebox.showerror("Connection Error", error_msg)
        
    except Exception as e:
        error_msg = f"Failed to connect to OpenAI: {str(e)}"
        app.log(f"OpenAI connection error: {str(e)}")
        logger.error(f"Unexpected error during OpenAI connection test: {str(e)}", exc_info=True)
        app.update_progress(0, "OpenAI connection failed")
        print(f"ERROR: OpenAI connection test failed: {str(e)}")
        messagebox.showerror("Error", error_msg)
    
    return False
