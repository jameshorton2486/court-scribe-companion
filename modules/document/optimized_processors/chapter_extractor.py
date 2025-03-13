
"""
Optimized Chapter Extractor Module

This module provides memory-efficient chapter extraction for large documents.
"""

import re
import gc

def is_chapter_heading(text):
    """
    Detect if text is likely a chapter heading.
    
    Args:
        text: The text to check
        
    Returns:
        bool: True if the text appears to be a chapter heading
    """
    # Common chapter patterns
    patterns = [
        r'^chapter\s+\d+', 
        r'^section\s+\d+',
        r'^\d+\.\s+',
        r'^part\s+\d+'
    ]
    
    text_lower = text.lower().strip()
    
    # Check against patterns
    for pattern in patterns:
        if re.match(pattern, text_lower):
            return True
    
    return False

def extract_chapters_optimized(app):
    """
    Optimized chapter extraction for large documents.
    
    Args:
        app: The application instance containing UI elements and data
    """
    app.log.info("Using optimized chapter extraction for large document")
    
    # Process paragraphs in chunks to reduce memory usage
    chunk_size = 500  # Process 500 paragraphs at a time
    total_paragraphs = len(app.docx_content.paragraphs)
    chunks = (total_paragraphs + chunk_size - 1) // chunk_size  # Ceiling division
    
    # Create a temporary document structure for chapter detection
    from modules.document.format_handler import extract_chapters_from_headings
    
    # First pass: scan for headings to find chapter boundaries
    headings_found = []
    for i in range(chunks):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, total_paragraphs)
        
        # Scan this chunk for headings
        for j in range(start_idx, end_idx):
            para = app.docx_content.paragraphs[j]
            # Check if this paragraph is a heading
            if para.style.name.startswith('Heading') or is_chapter_heading(para.text):
                headings_found.append((j, para.text, para.style.name))
        
        # Update progress
        progress = 40 + (i / chunks) * 20
        app.update_progress(progress, f"Scanning document structure ({i+1}/{chunks})...")
    
    # If no headings found, fall back to standard extraction
    if not headings_found:
        app.log.warning("No headings found in large document, using standard extraction")
        from modules.document.chapter_extractor import extract_chapters
        extract_chapters(app)
        return
    
    # Second pass: build chapters from the located headings
    app.chapters = []
    for i in range(len(headings_found)):
        start_idx = headings_found[i][0]
        end_idx = headings_found[i+1][0] if i+1 < len(headings_found) else total_paragraphs
        
        chapter_title = headings_found[i][1]
        chapter_content = app.docx_content.paragraphs[start_idx:end_idx]
        
        app.chapters.append({
            'title': chapter_title,
            'content': chapter_content
        })
        
        # Update progress
        progress = 60 + (i / len(headings_found)) * 20
        app.update_progress(progress, f"Building chapter {i+1}/{len(headings_found)}...")
    
    app.log.info(f"Extracted {len(app.chapters)} chapters using optimized method")
