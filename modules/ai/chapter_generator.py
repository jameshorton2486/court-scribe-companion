
"""
This module is a wrapper around the refactored chapter generation code.
It maintains backward compatibility with existing code that imports from this module.
"""

from modules.ai.chapter_gen.generator import generate_chapter_content, _generate_chapter_thread
from modules.ai.chapter_gen.exporter import save_generated_chapter
from modules.ai.chapter_gen.visuals import generate_chapter_visual, generate_image, generate_diagram

# Re-export the functions to maintain backward compatibility
__all__ = [
    'generate_chapter_content',
    '_generate_chapter_thread',
    'save_generated_chapter'
]
