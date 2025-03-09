
"""
Security Utilities

This module provides security-related utility functions for input validation,
content sanitization, and other security measures.
"""

import re
import os
import secrets
import hashlib
import json
from typing import Any, Dict, List, Optional, Union, Set, Tuple
import bleach
from bleach.sanitizer import ALLOWED_TAGS, ALLOWED_ATTRIBUTES

# Expanded lists of allowed HTML tags and attributes for sanitization
SAFE_TAGS = set(ALLOWED_TAGS).union({
    'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'small', 'sup', 'sub', 'hr', 'cite', 'code', 'pre'
})

SAFE_ATTRIBUTES = dict(ALLOWED_ATTRIBUTES)
SAFE_ATTRIBUTES.update({
    'a': ['href', 'title', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'p': ['style'],
    'span': ['style'],
    'div': ['style'],
    '*': ['class']
})

# Patterns for input validation
FILENAME_PATTERN = re.compile(r'^[a-zA-Z0-9_\-][a-zA-Z0-9_\-\.]*$')
PATH_TRAVERSAL_PATTERN = re.compile(r'\.\.|/\.|\./')
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')


def sanitize_html(content: str) -> str:
    """
    Sanitize HTML content by removing potentially malicious tags and attributes.
    
    Args:
        content: The HTML content to sanitize
        
    Returns:
        Sanitized HTML content
    """
    if not content:
        return ""
    
    # Use bleach to sanitize HTML
    clean_content = bleach.clean(
        content,
        tags=SAFE_TAGS,
        attributes=SAFE_ATTRIBUTES,
        strip=True
    )
    
    return clean_content


def sanitize_filename(filename: str) -> str:
    """
    Sanitize a filename to prevent directory traversal attacks.
    
    Args:
        filename: The filename to sanitize
        
    Returns:
        Sanitized filename
    """
    if not filename:
        return ""
    
    # Remove path traversal patterns
    if PATH_TRAVERSAL_PATTERN.search(filename):
        filename = os.path.basename(filename)
    
    # Check if the filename is valid
    if not FILENAME_PATTERN.match(filename):
        filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', filename)
    
    return filename


def validate_input(
    value: str, 
    min_length: int = 0, 
    max_length: int = 1000, 
    pattern: Optional[re.Pattern] = None
) -> Tuple[bool, str]:
    """
    Validate user input based on length and pattern constraints.
    
    Args:
        value: The input string to validate
        min_length: Minimum allowed length
        max_length: Maximum allowed length
        pattern: Regex pattern the input must match
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not isinstance(value, str):
        return False, "Input must be a string"
    
    if len(value) < min_length:
        return False, f"Input must be at least {min_length} characters"
    
    if len(value) > max_length:
        return False, f"Input must be at most {max_length} characters"
    
    if pattern and not pattern.match(value):
        return False, "Input format is invalid"
    
    return True, ""


def generate_secure_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure random token.
    
    Args:
        length: Length of the token in bytes
        
    Returns:
        Secure token as a hex string
    """
    return secrets.token_hex(length)


def hash_password(password: str, salt: Optional[str] = None) -> Tuple[str, str]:
    """
    Hash a password using a secure algorithm with salt.
    
    Args:
        password: The password to hash
        salt: Optional salt to use (generates one if not provided)
        
    Returns:
        Tuple of (password_hash, salt)
    """
    if not salt:
        salt = secrets.token_hex(16)
    
    # Combine password and salt, then hash
    password_hash = hashlib.pbkdf2_hmac(
        'sha256', 
        password.encode('utf-8'), 
        salt.encode('utf-8'), 
        100000  # Number of iterations
    ).hex()
    
    return password_hash, salt


def sanitize_json_input(json_data: str) -> Optional[Dict[str, Any]]:
    """
    Sanitize and validate JSON input.
    
    Args:
        json_data: JSON string to sanitize
        
    Returns:
        Parsed JSON as a dictionary or None if invalid
    """
    try:
        # Parse JSON
        parsed_data = json.loads(json_data)
        
        # Ensure it's a dictionary
        if not isinstance(parsed_data, dict):
            return None
        
        return parsed_data
    except (json.JSONDecodeError, TypeError):
        return None
