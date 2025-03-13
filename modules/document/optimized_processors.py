
"""
Optimized Document Processors Module

This module provides specialized processors optimized for large documents,
with memory-efficient chunk processing and progress tracking.
"""

from .optimized_processors.chapter_extractor import extract_chapters_optimized, is_chapter_heading
from .optimized_processors.content_enhancer import enhance_book_content_chunked

# Re-export for backward compatibility
__all__ = [
    'extract_chapters_optimized',
    'enhance_book_content_chunked',
    'is_chapter_heading'
]
