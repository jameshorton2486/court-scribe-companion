
from bs4 import BeautifulSoup
import re
import unicodedata
import logging
from typing import Optional

def clean_html_content(html_content):
    """Clean HTML content by removing scripts, styles, and unnecessary tags."""
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove scripts, styles, and comments
        for element in soup(['script', 'style', 'iframe', 'object', 'embed']):
            element.decompose()
        
        # Remove comments
        for comment in soup.find_all(text=lambda text: isinstance(text, str) and text.strip().startswith('<!--')):
            comment.extract()
        
        # Remove all on* attributes (onclick, onload, etc)
        for tag in soup.find_all(True):
            for attr in list(tag.attrs):
                if attr.startswith('on'):
                    del tag[attr]
        
        # Remove dangerous links
        for a in soup.find_all('a', href=True):
            if a['href'].startswith('javascript:'):
                a['href'] = '#'
        
        # Get text content
        text = soup.get_text(separator=' ')
        
        # Fix multiple spaces and newlines
        text = re.sub(r'\n+', '\n', text)
        text = re.sub(r' +', ' ', text)
        
        # Fix encoding issues
        text = unicodedata.normalize('NFKD', text)
        
        return text.strip()
    except Exception as e:
        logging.error(f"Error cleaning HTML: {str(e)}")
        return html_content  # Return original if cleaning fails

def extract_text_from_markdown(markdown_content):
    """Extract text from markdown content, preserving headings and basic structure."""
    try:
        # Check if content is None or empty
        if not markdown_content:
            return ""
            
        # Validate input type
        if not isinstance(markdown_content, str):
            logging.warning(f"Invalid markdown content type: {type(markdown_content)}")
            return str(markdown_content)
            
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
        logging.error(f"Error processing markdown: {str(e)}")
        return markdown_content if isinstance(markdown_content, str) else ""

def validate_file_content(file_content: str, file_type: str) -> tuple[bool, Optional[str]]:
    """
    Validates file content for security threats
    
    Args:
        file_content: The content of the file as string
        file_type: The file type/extension (e.g., 'txt', 'html', 'md', 'docx')
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        # Basic checks for all file types
        if not file_content:
            return False, "File is empty"
            
        # Check for reasonable file size to prevent DoS
        if len(file_content) > 50 * 1024 * 1024:  # 50MB limit
            return False, "File is too large"
            
        # Check for null bytes (potential binary file)
        if '\x00' in file_content:
            return False, "File contains invalid binary data"
            
        # Specific checks for HTML content
        if file_type == 'html':
            # Check for potential malicious scripts
            if re.search(r'<script.*?>.*?</script>', file_content, re.DOTALL | re.IGNORECASE):
                return False, "File contains potentially unsafe script tags"
                
            # Check for potential malicious objects
            if re.search(r'<object.*?>.*?</object>', file_content, re.DOTALL | re.IGNORECASE):
                return False, "File contains potentially unsafe object tags"
                
            # Check for iframe exploitation
            if re.search(r'<iframe.*?>.*?</iframe>', file_content, re.DOTALL | re.IGNORECASE):
                return False, "File contains potentially unsafe iframe tags"
                
        return True, None
        
    except Exception as e:
        logging.error(f"Error validating file content: {str(e)}")
        return False, f"Error validating file content: {str(e)}"
