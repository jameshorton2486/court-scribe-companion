
"""
Chapter visuals module - preserved for backward compatibility
"""
from modules.ai.chapter_gen.visuals.generator import generate_chapter_visual
from modules.ai.chapter_gen.visuals.image_generator import generate_image
from modules.ai.chapter_gen.visuals.diagram_generator import generate_diagram

# Re-export functions for backward compatibility
__all__ = [
    'generate_chapter_visual',
    'generate_image',
    'generate_diagram'
]
