
"""
Document Processing Module

This module handles all document-related operations, including loading,
parsing, processing, and optimizing document content.

Submodules:
- document_loader: Loading documents from various file formats
- text_processor: Basic text processing utilities
- chapter_extractor: Extracting chapters from document content
- content_enhancer: Enhancing document content for better readability
- batch_processor: Processing multiple documents in batch mode
- optimized_processors: Optimized versions of processors for large documents
- processor_core: Core document processing logic
- format_handler: Handling different document formats
- toc_generator: Generating tables of contents for documents

Usage:
    from modules.document.document_loader import load_document
    from modules.document.processor_core import process_document
    
    doc = load_document("path/to/file.docx")
    processed_doc = process_document(doc)
"""

# Import core functionality for easier access
from .document_loader import load_document
from .processor_core import process_document
from .chapter_extractor import extract_chapters
from .content_enhancer import enhance_book_content
from .optimized_processors import extract_chapters_optimized, enhance_book_content_chunked

__all__ = [
    'load_document',
    'process_document',
    'extract_chapters',
    'extract_chapters_optimized',
    'enhance_book_content',
    'enhance_book_content_chunked'
]
