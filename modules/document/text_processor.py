import unicodedata
import re
from modules.document.text_processing.encoding import detect_encoding, normalize_whitespace
from modules.document.text_processing.replacements import get_character_replacements
from modules.utils.encoding_utils import contains_encoding_issues

def fix_text_encoding(app):
    app.log.info("Fixing text encoding issues...")
    
    # Get character replacements
    replacements = get_character_replacements()
    
    # Count of replacements made
    replacement_count = 0
    has_encoding_issues = False
    
    # Process each paragraph in the document
    for para in app.docx_content.paragraphs:
        original_text = para.text
        
        # Check for encoding issues (suspicious patterns of characters)
        if contains_encoding_issues(original_text):
            has_encoding_issues = True
            
        # Apply aggressive encoding fixes
        new_text = original_text
        
        # Apply all basic replacements
        for char, replacement in replacements.items():
            if char in new_text:
                new_text = new_text.replace(char, replacement)
        
        # Use unicodedata to normalize text
        new_text = unicodedata.normalize('NFKD', new_text)
        
        # Additional encoding fixes for common issues
        new_text = fix_common_encoding_issues(new_text)
        
        # Fix XML/HTML entities
        new_text = fix_html_entities(new_text)
        
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
                run_text = fix_common_encoding_issues(run_text)
                run_text = fix_html_entities(run_text)
                run.text = run_text
    
    # Log fix results
    if has_encoding_issues:
        app.log.warning(f"Detected potential encoding issues in document. Applied {replacement_count} fixes.")
    else:
        app.log.info(f"Fixed {replacement_count} encoding issues")
    
    return has_encoding_issues

def fix_common_encoding_issues(text):
    """Fix common encoding issues"""
    # Replace common problematic sequences
    replacements = [
        ('�', ''),             # Remove replacement character
        ('Â', ''),             # Common UTF-8 over Latin-1 issue
        ('\x00', ''),          # Null bytes
        ('\r\n', '\n'),        # Normalize line endings
        ('\r', '\n'),          # Convert CR to LF
        ('��', "'"),           # Common apostrophe issue
        ('â€™', "'"),          # Smartquote as UTF-8 bytes interpreted as Latin-1
        ('â€œ', '"'),          # Left double quote
        ('â€', '"'),           # Right double quote
        ('Ã©', 'é'),           # Common Latin-1/UTF-8 mix for é
        ('Ã¨', 'è'),           # Common Latin-1/UTF-8 mix for è
        ('Ã ', 'à'),           # Common Latin-1/UTF-8 mix for à
        ('Ã¢', 'â'),           # Common Latin-1/UTF-8 mix for â
        ('Ã§', 'ç'),           # Common Latin-1/UTF-8 mix for ç
    ]
    
    for bad, good in replacements:
        text = text.replace(bad, good)
    
    # Remove control characters
    text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
    
    return text

def fix_html_entities(text):
    """Fix HTML/XML entities in text"""
    from html import unescape
    
    # Common XML entities
    entities = {
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&quot;': '"',
        '&apos;': "'",
        '&#39;': "'",
        '&#34;': '"',
    }
    
    # Replace common entities
    for entity, replacement in entities.items():
        text = text.replace(entity, replacement)
    
    # Use HTML unescape for other entities
    try:
        text = unescape(text)
    except Exception:
        # If unescape fails, at least we tried the common replacements
        pass
    
    return text

# Re-export these functions so they can be imported from text_processor
def preprocess_text_file(file_content, file_encoding=None):
    from modules.document.text_processing.encoding import preprocess_text_file as preprocess
    return preprocess(file_content, file_encoding)
