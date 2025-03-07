
def generate_table_of_contents(app):
    """Generate table of contents from chapters."""
    if not app.generate_toc.get():
        return None
        
    app.update_progress(60, "Generating table of contents...")
    app.toc = []
    
    for i, chapter in enumerate(app.chapters):
        app.toc.append({
            'title': chapter['title'],
            'level': 1,
            'index': i
        })
        
        # Look for subheadings within the chapter
        for para in chapter['content']:
            if para.style.name.startswith('Heading 2'):
                app.toc.append({
                    'title': para.text,
                    'level': 2,
                    'index': i
                })
            elif para.style.name.startswith('Heading 3'):
                app.toc.append({
                    'title': para.text,
                    'level': 3,
                    'index': i
                })
    
    app.log(f"Generated table of contents with {len(app.toc)} entries")
    return app.toc
