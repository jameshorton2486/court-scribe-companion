
from modules.document.format_handler import (
    extract_chapters_from_headings, detect_chapter_patterns
)

def extract_chapters(app):
    """Extract chapters from loaded document using multiple detection methods."""
    app.update_progress(40, "Extracting chapters...")
    app.chapters = []
    
    # First try to extract based on heading styles
    heading_chapters = extract_chapters_from_headings(
        app.docx_content,
        min_heading_level=1,
        max_heading_level=2
    )
    
    if heading_chapters:
        app.log(f"Found {len(heading_chapters)} chapters based on headings")
        app.chapters = heading_chapters
    else:
        app.log("No chapters found by heading analysis, trying pattern detection...")
        
        # Try to detect chapter patterns
        chapter_indices = detect_chapter_patterns(app.docx_content)
        
        if chapter_indices:
            app.log(f"Found {len(chapter_indices)} potential chapter patterns")
            
            # Convert chapter indices to chapters
            for i, idx in enumerate(chapter_indices):
                # Determine end index (start of next chapter or end of document)
                end_idx = chapter_indices[i+1] if i+1 < len(chapter_indices) else len(app.docx_content.paragraphs)
                
                chapter_title = app.docx_content.paragraphs[idx].text
                chapter_content = app.docx_content.paragraphs[idx:end_idx]
                
                app.chapters.append({
                    'title': chapter_title,
                    'content': chapter_content
                })
        else:
            # If no patterns found, try to split by blank lines
            app.log("No chapter patterns found, splitting by logical sections...")
            
            current_chapter = None
            chapter_content = []
            section_break_count = 0
            
            for i, para in enumerate(app.docx_content.paragraphs):
                # Check if this paragraph is empty (potential section break)
                if not para.text.strip():
                    section_break_count += 1
                else:
                    # If we have consecutive blank lines and text after, potential new section
                    if section_break_count >= 2 and i > 0:
                        # If we have content already, save as chapter
                        if current_chapter and chapter_content:
                            app.chapters.append({
                                'title': current_chapter,
                                'content': chapter_content
                            })
                            
                            # Start new chapter with this paragraph as title
                            current_chapter = para.text
                            chapter_content = [para]
                        else:
                            # First chapter
                            current_chapter = para.text
                            chapter_content = [para]
                    else:
                        # Continue current chapter
                        if current_chapter:
                            chapter_content.append(para)
                        else:
                            # First paragraph becomes chapter title
                            current_chapter = para.text
                            chapter_content = [para]
                    
                    # Reset section break counter
                    section_break_count = 0
            
            # Add the last chapter if it exists
            if current_chapter and chapter_content:
                app.chapters.append({
                    'title': current_chapter,
                    'content': chapter_content
                })
    
    # If no chapters were found by any method, create a single chapter
    if not app.chapters:
        app.log("No chapters found with any method, creating a single chapter...")
        app.chapters.append({
            'title': app.book_title.get() or "Untitled Chapter",
            'content': app.docx_content.paragraphs
        })
    
    app.log(f"Extracted {len(app.chapters)} chapters")
    return app.chapters
