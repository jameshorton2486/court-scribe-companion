
import io
import requests
from PIL import Image, ImageTk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg

def generate_chapter_visual(app, chapter):
    """Generate visual content (image or diagram) for a chapter."""
    try:
        if app.include_images.get():
            return generate_image(app, chapter)
        elif app.include_diagrams.get():
            return generate_diagram(app, chapter)
        return None
    except Exception as e:
        app.log(f"Error generating visual: {str(e)}")
        return None

def generate_image(app, chapter):
    """Generate an image for the chapter using OpenAI's DALL-E."""
    app.log("Generating image for chapter...")
    
    # Create a prompt for the image
    image_prompt = f"Create an image representing the key concepts in this chapter about {chapter['title']}."
    
    try:
        image_response = openai.images.generate(
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
        
        # Resize for display
        img = img.resize((400, 400), Image.LANCZOS)
        photo = ImageTk.PhotoImage(img)
        app.image_label.config(image=photo)
        app.image_label.image = photo  # Keep a reference
        
        # Return image data
        return {
            "type": "image",
            "data": img_response.content
        }
        
    except Exception as e:
        app.log(f"Error generating image: {str(e)}")
        return None

def generate_diagram(app, chapter):
    """Generate a diagram for the chapter."""
    app.log("Generating diagram for chapter...")
    
    try:
        fig, ax = plt.subplots(figsize=(8, 6))
        
        # Extract some data from the chapter to visualize
        # This is a simple example - in reality, you'd want to analyze the text
        # to create a meaningful chart based on the content
        data = [5, 7, 3, 8, 6]
        labels = ['Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5']
        
        ax.bar(labels, data)
        ax.set_title(f"Key Points in {chapter['title']}")
        ax.set_ylabel('Importance')
        
        # Save to BytesIO
        buf = io.BytesIO()
        canvas = FigureCanvasAgg(fig)
        canvas.print_png(buf)
        
        # Convert to PhotoImage for display
        buf.seek(0)
        img = Image.open(buf)
        img = img.resize((500, 400), Image.LANCZOS)
        photo = ImageTk.PhotoImage(img)
        app.image_label.config(image=photo)
        app.image_label.image = photo  # Keep a reference
        
        # Save diagram to include in docx
        buf.seek(0)
        diagram_data = {
            "type": "diagram",
            "data": buf.read()
        }
        plt.close(fig)
        
        return diagram_data
        
    except Exception as e:
        app.log(f"Error generating diagram: {str(e)}")
        return None
