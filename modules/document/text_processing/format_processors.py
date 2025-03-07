
from bs4 import BeautifulSoup
import re
import unicodedata

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
