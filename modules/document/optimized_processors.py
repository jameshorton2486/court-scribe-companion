
"""
Optimized Document Processors Module

This module provides specialized processors optimized for large documents,
with memory-efficient chunk processing and progress tracking.
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
    import re
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

def enhance_book_content_chunked(app):
    """
    Process content enhancement in chunks for large documents.
    
    Args:
        app: The application instance containing UI elements and data
    """
    from modules.document.content_enhancer import enhance_chapter_content
    
    app.log.info("Using chunked content enhancement for large document")
    
    total_chapters = len(app.chapters)
    for i, chapter in enumerate(app.chapters):
        # Update progress
        progress = 80 + (i / total_chapters) * 15
        app.update_progress(progress, f"Enhancing chapter {i+1}/{total_chapters}...")
        
        # For very large chapters, process in sections
        content_paragraphs = chapter['content']
        if len(content_paragraphs) > 200:  # If chapter has more than 200 paragraphs
            app.log.info(f"Processing large chapter {i+1} in sections ({len(content_paragraphs)} paragraphs)")
            
            # Process the chapter in sections
            section_size = 100
            sections = (len(content_paragraphs) + section_size - 1) // section_size
            
            for j in range(sections):
                start_idx = j * section_size
                end_idx = min((j + 1) * section_size, len(content_paragraphs))
                
                # Process this section
                section_paras = content_paragraphs[start_idx:end_idx]
                enhance_chapter_content(app, section_paras)
                
                # Update section progress
                section_progress = progress + (j / sections) * (15 / total_chapters)
                app.update_progress(section_progress, 
                                  f"Enhancing chapter {i+1}/{total_chapters} - section {j+1}/{sections}...")
                
                # Force garbage collection between sections
                if j % 2 == 0:
                    gc.collect()
        else:
            # Process smaller chapters normally
            enhance_chapter_content(app, content_paragraphs)
