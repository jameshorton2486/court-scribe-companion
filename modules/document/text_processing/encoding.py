
import unicodedata
import chardet
import re

def detect_encoding(text_bytes):
    """Detect encoding of text bytes."""
    try:
        result = chardet.detect(text_bytes)
        encoding = result['encoding'] or 'utf-8'
        confidence = result['confidence']
        return encoding, confidence
    except:
        return 'utf-8', 0.0

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
