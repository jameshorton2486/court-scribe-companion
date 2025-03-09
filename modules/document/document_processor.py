
"""
Document Processor Module

This module serves as the main entry point for document processing functionality,
delegating to specialized processors for different document processing tasks.
"""

import threading
from tkinter import messagebox

# Import necessary processors
from modules.document.processor_core import process_document, _process_document_thread
from modules.document.batch_processor import _batch_process_documents
from modules.document.optimized_processors import (
    extract_chapters_optimized, 
    enhance_book_content_chunked,
    is_chapter_heading
)

# Re-export necessary functions for backwards compatibility
__all__ = [
    'process_document',
    '_process_document_thread',
    '_batch_process_documents',
    'extract_chapters_optimized',
    'enhance_book_content_chunked',
    'is_chapter_heading'
]
