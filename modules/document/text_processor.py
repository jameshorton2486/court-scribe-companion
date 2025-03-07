
from bs4 import BeautifulSoup
import re
import unicodedata
import chardet

def detect_encoding(text_bytes):
    """Detect encoding of text bytes."""
    try:
        result = chardet.detect(text_bytes)
        encoding = result['encoding'] or 'utf-8'
        confidence = result['confidence']
        return encoding, confidence
    except:
        return 'utf-8', 0.0

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
        # Additional characters
        '\u2039': '<',  # Single left-pointing angle quotation mark
        '\u203a': '>',  # Single right-pointing angle quotation mark
        '\u00ab': '<<', # Left-pointing double angle quotation mark
        '\u00bb': '>>', # Right-pointing double angle quotation mark
        '\u2212': '-',  # Minus sign
        '\u00b7': '·',  # Middle dot
        '\u00b0': '°',  # Degree sign
        '\u00b9': '¹',  # Superscript one
        '\u00b2': '²',  # Superscript two
        '\u00b3': '³',  # Superscript three
        '\u00f7': '/',  # Division sign
        '\u00d7': 'x',  # Multiplication sign
        '\u2248': '~',  # Almost equal to
        '\u00b1': '+/-',# Plus-minus sign
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

def clean_html_content(html_content):
    """Clean HTML content by removing scripts, styles, and unnecessary tags."""
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove scripts, styles, and comments
        for element in soup(['script', 'style']):
            element.decompose()
        
        # Remove comments
        for comment in soup.find_all(text=lambda text: isinstance(text, str) and text.strip().startswith('<!--')):
            comment.extract()
        
        # Get text content
        text = soup.get_text(separator=' ')
        
        # Fix multiple spaces and newlines
        text = re.sub(r'\n+', '\n', text)
        text = re.sub(r' +', ' ', text)
        
        # Fix encoding issues
        text = unicodedata.normalize('NFKD', text)
        
        return text.strip()
    except Exception as e:
        print(f"Error cleaning HTML: {str(e)}")
        return html_content  # Return original if cleaning fails

def extract_text_from_markdown(markdown_content):
    """Extract text from markdown content, preserving headings and basic structure."""
    try:
        # Preserve headings (convert ### to Heading 3 etc.)
        lines = []
        for line in markdown_content.split('\n'):
            # Handle headings
            heading_match = re.match(r'^(#{1,6})\s+(.+)$', line)
            if heading_match:
                level = len(heading_match.group(1))
                text = heading_match.group(2)
                lines.append(f"Heading {level}: {text}")
            # Handle list items
            elif line.strip().startswith(('- ', '* ', '+ ')):
                item_text = line.strip()[2:].strip()
                lines.append(f"• {item_text}")
            # Handle numbered lists
            elif re.match(r'^\d+\.\s+', line.strip()):
                item_text = re.sub(r'^\d+\.\s+', '', line.strip())
                lines.append(f"• {item_text}")
            # Handle code blocks
            elif line.strip().startswith('```'):
                lines.append('Code block:')
            # Handle blockquotes
            elif line.strip().startswith('>'):
                quote_text = line.strip()[1:].strip()
                lines.append(f"Quote: {quote_text}")
            else:
                lines.append(line)
        
        return '\n'.join(lines)
    except Exception as e:
        print(f"Error processing markdown: {str(e)}")
        return markdown_content  # Return original if processing fails

def normalize_whitespace(text):
    """Normalize whitespace in text by collapsing multiple spaces and removing extra newlines."""
    try:
        # Replace multiple spaces with a single space
        text = re.sub(r' +', ' ', text)
        # Replace multiple newlines with double newline (paragraph break)
        text = re.sub(r'\n{3,}', '\n\n', text)
        # Ensure consistent line endings
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        return text.strip()
    except Exception as e:
        print(f"Error normalizing whitespace: {str(e)}")
        return text  # Return original if normalization fails

def preprocess_text_file(file_content, file_encoding=None):
    """Preprocess text file content with encoding detection and normalization."""
    try:
        # If content is bytes and no encoding specified, detect it
        if isinstance(file_content, bytes) and not file_encoding:
            detected_encoding, confidence = detect_encoding(file_content)
            if confidence > 0.7:
                file_encoding = detected_encoding
            else:
                # Try common encodings if detection confidence is low
                for enc in ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']:
                    try:
                        decoded = file_content.decode(enc)
                        file_encoding = enc
                        break
                    except UnicodeDecodeError:
                        continue
            
            # Fall back to utf-8 if nothing worked
            if not file_encoding:
                file_encoding = 'utf-8'
            
            try:
                file_content = file_content.decode(file_encoding, errors='replace')
            except (UnicodeDecodeError, LookupError):
                file_content = file_content.decode('utf-8', errors='replace')
        
        # If content is already a string, just proceed with normalization
        if isinstance(file_content, str):
            # Normalize unicode characters
            file_content = unicodedata.normalize('NFKD', file_content)
            
            # Fix common issues
            file_content = normalize_whitespace(file_content)
            
            return file_content
            
        return file_content  # In case it's neither bytes nor string
    except Exception as e:
        print(f"Error preprocessing text file: {str(e)}")
        # Try to return a string version somehow
        if isinstance(file_content, bytes):
            return file_content.decode('utf-8', errors='replace')
        return str(file_content)
