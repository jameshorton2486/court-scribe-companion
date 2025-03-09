
import io
import os
import requests
from PIL import Image, ImageTk
import openai
from modules.ai.openai.api_client import get_api_key, validate_api_key

def generate_image(app, chapter):
    """Generate an image for the chapter using OpenAI's DALL-E."""
    app.log("Generating image for chapter...")
    
    # Create a prompt for the image
    image_prompt = f"Create an image representing the key concepts in this chapter about {chapter['title']}."
    
    try:
        # First try to get API key from environment variables
        api_key = get_api_key(app)
        if not api_key:
            app.log("No OpenAI API key found")
            return None
        
        # Basic validation before making the API call
        if not validate_api_key(api_key):
            app.log("Invalid OpenAI API key format")
            return None
        
        # Setup OpenAI client - removing any proxy configuration that might be causing issues
        client = openai.OpenAI(api_key=api_key)
        
        image_response = client.images.generate(
            model="dall-e-3",
            prompt=image_prompt,
            size="1024x1024",
            n=1
        )
        
        # Get the image URL
        image_url = image_response.data[0].url
        app.log(f"Image generated successfully")
        
        # Download the image
        img_response = requests.get(image_url)
        img = Image.open(io.BytesIO(img_response.content))
        
        # Resize for display using Lanczos resampling (renamed in Pillow 10.0.0+)
        img = img.resize((400, 400), Image.Resampling.LANCZOS)
        photo = ImageTk.PhotoImage(img)
        app.image_label.config(image=photo)
        app.image_label.image = photo  # Keep a reference
        
        # Return image data
        return {
            "type": "image",
            "data": img_response.content
        }
        
    except openai.AuthenticationError as e:
        app.log(f"OpenAI authentication error: {str(e)}")
    except openai.RateLimitError as e:
        app.log(f"OpenAI rate limit error: {str(e)}")
    except openai.APIError as e:
        app.log(f"OpenAI API error: {str(e)}")
    except openai.APIConnectionError as e:
        app.log(f"OpenAI connection error: {str(e)}")
    except Exception as e:
        app.log(f"Error generating image: {str(e)}")
    
    return None
