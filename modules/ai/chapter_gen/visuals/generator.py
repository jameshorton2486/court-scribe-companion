
import os
from modules.ai.chapter_gen.visuals.image_generator import generate_image
from modules.ai.chapter_gen.visuals.diagram_generator import generate_diagram

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
