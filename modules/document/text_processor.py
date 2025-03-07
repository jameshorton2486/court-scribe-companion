
import unicodedata
from modules.document.text_processing.encoding import detect_encoding, normalize_whitespace
from modules.document.text_processing.replacements import get_character_replacements
from modules.document.text_processing.format_processors import clean_html_content, extract_text_from_markdown

def fix_text_encoding(app):
    app.log("Fixing text encoding issues...")
    
    # Get character replacements
    replacements = get_character_replacements()
    
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
        
        # Use unicodedata to normalize and further clean the text
        new_text = unicodedata.normalize('NFKD', new_text)
        
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
                # Normalize run text
                run_text = unicodedata.normalize('NFKD', run_text)
                run.text = run_text
    
    app.log(f"Fixed {replacement_count} encoding issues")

# Re-export these functions so they can be imported from text_processor
def preprocess_text_file(file_content, file_encoding=None):
    from modules.document.text_processing.encoding import preprocess_text_file as preprocess
    return preprocess(file_content, file_encoding)
