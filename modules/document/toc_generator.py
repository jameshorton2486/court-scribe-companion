
def generate_table_of_contents(app):
    """Generate table of contents from chapters."""
    if not app.generate_toc.get():
        return None
        
    app.update_progress(60, "Generating table of contents...")
    app.toc = []
    
    # Process all chapters
    for i, chapter in enumerate(app.chapters):
        _process_chapter_for_toc(app, chapter, i)
    
    app.log(f"Generated table of contents with {len(app.toc)} entries")
    return app.toc

def _process_chapter_for_toc(app, chapter, index):
    """Process a single chapter for the table of contents."""
    # Add chapter entry
    app.toc.append({
        'title': chapter['title'],
        'level': 1,
        'index': index
    })
    
    # Process subheadings in this chapter
    _process_subheadings_for_toc(app, chapter, index)

def _process_subheadings_for_toc(app, chapter, chapter_index):
    """Process subheadings within a chapter for the table of contents."""
    for para in chapter['content']:
        if para.style.name.startswith('Heading 2'):
            app.toc.append({
                'title': para.text,
                'level': 2,
                'index': chapter_index
            })
        elif para.style.name.startswith('Heading 3'):
            app.toc.append({
                'title': para.text,
                'level': 3,
                'index': chapter_index
            })
