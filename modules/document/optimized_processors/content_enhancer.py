
"""
Optimized Content Enhancer Module

This module provides memory-efficient content enhancement for large documents.
"""

import gc

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
