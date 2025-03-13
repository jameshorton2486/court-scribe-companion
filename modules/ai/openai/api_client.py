
"""
OpenAI API Client Module

This module provides utilities for interacting with the OpenAI API,
including authentication, connection testing, and error handling.
"""

import os
import logging
import time
import openai
from tkinter import messagebox

# Set up logger for this module
logger = logging.getLogger(__name__)

def get_api_key(app):
    """
    Get OpenAI API key with improved handling of environment variables.
    
    Args:
        app: The application instance
    
    Returns:
        str: The OpenAI API key, or None if not found
    """
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
    """
    Validate that the API key has the correct format.
    
    Args:
        api_key: The API key to validate
    
    Returns:
        bool: True if key format looks valid, False otherwise
    """
    if not api_key:
        return False
        
    # Basic validation - most OpenAI keys start with 'sk-' and have a minimum length
    if not api_key.startswith('sk-') or len(api_key) < 20:
        return False
        
    return True

def test_openai_connection(app):
    """
    Test connection to OpenAI API with improved error handling.
    
    Args:
        app: The application instance
    
    Returns:
        bool: True if connection successful, False otherwise
    """
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
    
    # Set up retry logic
    max_retries = app.max_retries.get() if hasattr(app, 'max_retries') else 3
    retry_count = 0
    base_delay = 1  # Base delay in seconds for exponential backoff
    
    while retry_count <= max_retries:
        try:
            # Add retry information to progress
            retry_msg = f" (retry {retry_count}/{max_retries})" if retry_count > 0 else ""
            app.update_progress(30, f"Sending test request to OpenAI{retry_msg}...")
            
            # Set up the client
            logger.info(f"Creating OpenAI client with model: {app.openai_model.get()}")
            print(f"Creating OpenAI client with model: {app.openai_model.get()}")
            client = openai.OpenAI(api_key=api_key)
            
            # Simple test request
            app.log("Sending test request to OpenAI API...")
            print("Sending test request to OpenAI API...")
            logger.info("Sending test request to OpenAI API")
            
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
            
        except openai.RateLimitError as e:
            retry_count += 1
            error_msg = f"OpenAI API rate limit exceeded: {str(e)}"
            app.log(f"OpenAI rate limit error: {str(e)}")
            logger.warning(f"OpenAI rate limit error (attempt {retry_count}/{max_retries}): {str(e)}")
            
            # Only retry if retry option is enabled and we haven't hit max retries
            if not hasattr(app, 'retry_on_error') or not app.retry_on_error.get() or retry_count > max_retries:
                app.update_progress(0, "OpenAI connection failed: Rate limit exceeded")
                print(f"ERROR: OpenAI rate limit exceeded: {str(e)}")
                messagebox.showerror("Rate Limit Error", error_msg + "\n\nTry again later.")
                return False
            
            # Calculate backoff delay with jitter (random variation)
            import random
            delay = (base_delay * (2 ** retry_count)) + (random.random() * 0.5)
            delay = min(delay, 30)  # Cap at 30 seconds
            
            app.log(f"Rate limit exceeded. Retrying in {delay:.1f} seconds...")
            app.update_progress(30, f"Rate limit exceeded. Retrying in {delay:.1f}s...")
            time.sleep(delay)
            continue
            
        except openai.APIError as e:
            error_msg = f"OpenAI API error: {str(e)}"
            app.log(f"OpenAI API error: {str(e)}")
            logger.error(f"OpenAI API error: {str(e)}")
            app.update_progress(0, "OpenAI connection failed: API error")
            print(f"ERROR: OpenAI API error: {str(e)}")
            messagebox.showerror("API Error", error_msg)
            
            # Check if this error is retryable
            if "retryable" in str(e).lower() and hasattr(app, 'retry_on_error') and app.retry_on_error.get() and retry_count < max_retries:
                retry_count += 1
                delay = base_delay * (2 ** retry_count)
                app.log(f"Retryable API error. Retrying in {delay:.1f} seconds...")
                time.sleep(delay)
                continue
                
            return False
            
        except openai.AuthenticationError as e:
            # Authentication errors are not retryable
            error_msg = f"Invalid API key or not authorized: {str(e)}"
            app.log(f"OpenAI authentication error: {str(e)}")
            logger.error(f"OpenAI authentication error: {str(e)}")
            app.update_progress(0, "OpenAI connection failed: Authentication error")
            print(f"ERROR: OpenAI authentication failed: {str(e)}")
            messagebox.showerror("Authentication Error", error_msg)
            return False
            
        except openai.APIConnectionError as e:
            error_msg = f"Failed to connect to OpenAI API: {str(e)}"
            app.log(f"OpenAI connection error: {str(e)}")
            logger.error(f"OpenAI connection error: {str(e)}")
            app.update_progress(0, "OpenAI connection failed: Connection error")
            print(f"ERROR: Failed to connect to OpenAI API: {str(e)}")
            
            # Connection errors are typically retryable
            if hasattr(app, 'retry_on_error') and app.retry_on_error.get() and retry_count < max_retries:
                retry_count += 1
                delay = base_delay * (2 ** retry_count)
                app.log(f"Connection error. Retrying in {delay:.1f} seconds...")
                app.update_progress(30, f"Connection error. Retrying in {delay:.1f}s...")
                time.sleep(delay)
                continue
                
            messagebox.showerror("Connection Error", error_msg)
            return False
            
        except Exception as e:
            error_msg = f"Failed to connect to OpenAI: {str(e)}"
            app.log(f"OpenAI connection error: {str(e)}")
            logger.error(f"Unexpected error during OpenAI connection test: {str(e)}", exc_info=True)
            app.update_progress(0, "OpenAI connection failed")
            print(f"ERROR: OpenAI connection test failed: {str(e)}")
            
            # Unknown errors are generally not retryable
            messagebox.showerror("Error", error_msg)
            return False
    
    # If we get here, we've exceeded max retries
    error_msg = f"Failed to connect to OpenAI after {max_retries} attempts"
    app.log(error_msg)
    logger.error(error_msg)
    app.update_progress(0, "OpenAI connection failed: Max retries exceeded")
    messagebox.showerror("Error", error_msg)
    return False

def execute_with_retry(app, api_function, *args, **kwargs):
    """
    Execute an OpenAI API call with automatic retry logic for rate limits and transient errors.
    
    Args:
        app: Application instance
        api_function: The OpenAI API function to call
        *args, **kwargs: Arguments to pass to the API function
        
    Returns:
        API response if successful, raises exception after all retries fail
    """
    max_retries = app.max_retries.get() if hasattr(app, 'retry_on_error') and app.retry_on_error.get() else 0
    retry_count = 0
    base_delay = 1  # Base delay in seconds
    
    while True:
        try:
            return api_function(*args, **kwargs)
            
        except openai.RateLimitError as e:
            retry_count += 1
            if retry_count > max_retries:
                logger.error(f"Rate limit exceeded, max retries ({max_retries}) reached: {str(e)}")
                raise
                
            delay = base_delay * (2 ** retry_count)
            logger.warning(f"Rate limit exceeded (attempt {retry_count}/{max_retries}). Retrying in {delay:.1f}s")
            app.log(f"Rate limit exceeded. Retrying in {delay:.1f}s...")
            time.sleep(delay)
            
        except openai.APIError as e:
            if "retryable" in str(e).lower() and retry_count < max_retries:
                retry_count += 1
                delay = base_delay * (2 ** retry_count)
                logger.warning(f"Retryable API error (attempt {retry_count}/{max_retries}). Retrying in {delay:.1f}s")
                app.log(f"API error. Retrying in {delay:.1f}s...")
                time.sleep(delay)
            else:
                logger.error(f"Non-retryable API error: {str(e)}")
                raise
                
        except openai.APIConnectionError as e:
            if retry_count < max_retries:
                retry_count += 1
                delay = base_delay * (2 ** retry_count)
                logger.warning(f"API connection error (attempt {retry_count}/{max_retries}). Retrying in {delay:.1f}s")
                app.log(f"Connection error. Retrying in {delay:.1f}s...")
                time.sleep(delay)
            else:
                logger.error(f"API connection error, max retries reached: {str(e)}")
                raise
