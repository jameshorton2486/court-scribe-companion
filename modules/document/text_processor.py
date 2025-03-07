
from bs4 import BeautifulSoup
import re

def fix_text_encoding(app):
    app.log("Fixing text encoding issues...")
    
    # Enhanced list of common encoding issues to fix
    replacements = {
        # Smart quotes and apostrophes
        '\u2018': "'",  # Left single quotation mark
        '\u2019': "'",  # Right single quotation mark
        '\u201c': '"',  # Left double quotation mark
        '\u201d': '"',  # Right double quotation mark
        # Dashes and hyphens
        '\u2013': '-',  # En dash
        '\u2014': '--', # Em dash
        '\u2015': '--', # Horizontal bar
        # Other common special characters
        '\u2026': '...', # Ellipsis
        '\u00a0': ' ',  # Non-breaking space
        '\u00ad': '',   # Soft hyphen
        '\u200b': '',   # Zero-width space
        '\u200e': '',   # Left-to-right mark
        '\u200f': '',   # Right-to-left mark
        # Currency symbols
        '\u20ac': 'EUR', # Euro sign
        '\u00a3': 'GBP', # Pound sign
        '\u00a5': 'JPY', # Yen sign
        # Bullet points and list characters
        '\u2022': '*',  # Bullet
        '\u2023': '>',  # Triangular bullet
        '\u25e6': 'o',  # White bullet
        '\u2043': '-',  # Hyphen bullet
        # Typographic symbols
        '\u00ae': '(R)', # Registered trademark
        '\u2122': '(TM)', # Trademark
        '\u00a9': '(C)', # Copyright
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

def clean_html_content(html_content):
    """Clean HTML content by removing scripts, styles, and unnecessary tags."""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remove scripts, styles, and comments
    for element in soup(['script', 'style']):
        element.decompose()
    
    # Get text content
    text = soup.get_text()
    
    # Fix multiple spaces and newlines
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r' +', ' ', text)
    
    return text.strip()

def extract_text_from_markdown(markdown_content):
    """Extract text from markdown content, preserving headings and basic structure."""
    # Preserve headings (convert ### to Heading 3 etc.)
    lines = []
    for line in markdown_content.split('\n'):
        # Handle headings
        heading_match = re.match(r'^(#{1,6})\s+(.+)$', line)
        if heading_match:
            level = len(heading_match.group(1))
            text = heading_match.group(2)
            lines.append(f"Heading {level}: {text}")
        else:
            lines.append(line)
    
    return '\n'.join(lines)

def normalize_whitespace(text):
    """Normalize whitespace in text by collapsing multiple spaces and removing extra newlines."""
    # Replace multiple spaces with a single space
    text = re.sub(r' +', ' ', text)
    # Replace multiple newlines with double newline (paragraph break)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()
