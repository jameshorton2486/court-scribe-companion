
"""
Chapter Generation Module

This module provides functionality for generating book chapters
using AI models and formatting them appropriately for publication.

Components:
- generator: Core chapter generation logic
  - generateChapterFromOutline: Creates chapter content from an outline
  - expandExistingChapter: Enhances and expands existing chapter content
  - generateCreativeContent: Creates creative content based on parameters
  
- exporter: Export functionality for generated chapters
  - exportToHTML: Exports chapter to HTML format
  - exportToDocx: Exports chapter to Word document format
  - exportToPDF: Exports chapter to PDF format
  - batchExport: Exports multiple chapters in one operation
  
- visuals: Visual content generation for chapters
  - generateChapterHeader: Creates header images for chapters
  - generateIllustration: Creates illustrations based on chapter content
  - optimizeImages: Optimizes images for different output formats

The chapter generation module leverages AI models to create
high-quality, coherent, and engaging book chapters while 
maintaining consistency with the overall book style and voice.

Usage:
    from modules.ai.chapter_gen.generator import generate_chapter_content
    from modules.ai.chapter_gen.exporter import save_generated_chapter
    
    # Generate a chapter
    chapter_content = generate_chapter_content(outline, style_params)
    
    # Save the chapter
    save_generated_chapter(chapter_content, format='html')
"""

__version__ = '0.8.0'
__author__ = 'Court Reporter AI Team'

from modules.ai.chapter_gen.generator import generate_chapter_content
from modules.ai.chapter_gen.exporter import save_generated_chapter

# Define constants for configuration
DEFAULT_QUALITY_LEVEL = 3
DEFAULT_CREATIVITY_LEVEL = 2
MAX_TOKENS_PER_CHAPTER = 4000
