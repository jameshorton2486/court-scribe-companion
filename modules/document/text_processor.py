
def fix_text_encoding(app):
    app.log("Fixing text encoding issues...")
    
    # Common encoding issues to fix
    replacements = {
        '\u2018': "'",  # Left single quotation mark
        '\u2019': "'",  # Right single quotation mark
        '\u201c': '"',  # Left double quotation mark
        '\u201d': '"',  # Right double quotation mark
        '\u2013': '-',  # En dash
        '\u2014': '--', # Em dash
        '\u2026': '...', # Ellipsis
        '\u00a0': ' ',  # Non-breaking space
    }
    
    # Count of replacements made
    replacement_count = 0
    
    # Process each paragraph in the document
    for para in app.docx_content.paragraphs:
        original_text = para.text
        new_text = original_text
        
        # Apply all replacements
        for char, replacement in replacements.items():
            if char in new_text:
                new_text = new_text.replace(char, replacement)
        
        # If changes were made, update the paragraph text
        if new_text != original_text:
            # Count characters that were replaced
            for char in replacements:
                replacement_count += original_text.count(char)
            
            # Update paragraph text
            for run in para.runs:
                run_text = run.text
                for char, replacement in replacements.items():
                    if char in run_text:
                        run_text = run_text.replace(char, replacement)
                run.text = run_text
    
    app.log(f"Fixed {replacement_count} encoding issues")
