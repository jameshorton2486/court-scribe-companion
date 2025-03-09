
import io
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg
from PIL import Image, ImageTk

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
        # Use the updated resampling constant for Pillow 10+
        img = img.resize((500, 400), Image.Resampling.LANCZOS)
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
