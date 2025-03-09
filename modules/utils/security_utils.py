
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
import logging
import uuid
import base64
from typing import Any, Dict, List, Optional, Union, Set, Tuple, Callable
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
URL_PATTERN = re.compile(r'^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$')
STRONG_PASSWORD_PATTERN = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')


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
    pattern: Optional[re.Pattern] = None,
    custom_validator: Optional[Callable[[str], Tuple[bool, str]]] = None
) -> Tuple[bool, str]:
    """
    Validate user input based on length and pattern constraints.
    
    Args:
        value: The input string to validate
        min_length: Minimum allowed length
        max_length: Maximum allowed length
        pattern: Regex pattern the input must match
        custom_validator: Optional custom validation function
        
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
    
    # Apply custom validator if provided
    if custom_validator:
        return custom_validator(value)
    
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


def validate_url(url: str) -> Tuple[bool, str]:
    """
    Validate a URL to ensure it has the correct format and is secure.
    
    Args:
        url: The URL to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not url:
        return False, "URL cannot be empty"
    
    if not URL_PATTERN.match(url):
        return False, "URL format is invalid"
    
    # Ensure URL uses HTTPS
    if not url.startswith('https://'):
        return False, "URL must use HTTPS for security"
    
    return True, ""


def validate_password_strength(password: str) -> Tuple[bool, str]:
    """
    Validate password strength based on complexity requirements.
    
    Args:
        password: The password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not STRONG_PASSWORD_PATTERN.match(password):
        return False, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    
    return True, ""


def generate_secure_id() -> str:
    """
    Generate a secure unique identifier.
    
    Returns:
        A UUID string
    """
    return str(uuid.uuid4())


def secure_compare(a: str, b: str) -> bool:
    """
    Compare two strings in a way that is resistant to timing attacks.
    
    Args:
        a: First string
        b: Second string
        
    Returns:
        True if the strings are equal, False otherwise
    """
    return secrets.compare_digest(a, b)


def encrypt_sensitive_data(data: str, key: bytes) -> str:
    """
    Encrypt sensitive data using a secure encryption algorithm.
    
    Args:
        data: Data to encrypt
        key: Encryption key
        
    Returns:
        Encrypted data as a base64 string
    """
    try:
        from cryptography.fernet import Fernet
        
        # Create a Fernet cipher
        cipher = Fernet(key)
        
        # Encrypt the data
        encrypted_data = cipher.encrypt(data.encode('utf-8'))
        
        # Convert to base64 for storage/transmission
        return base64.b64encode(encrypted_data).decode('utf-8')
    except ImportError:
        logging.warning("Cryptography package not available. Data not encrypted.")
        return base64.b64encode(data.encode('utf-8')).decode('utf-8')


def decrypt_sensitive_data(encrypted_data: str, key: bytes) -> str:
    """
    Decrypt sensitive data.
    
    Args:
        encrypted_data: Encrypted data as a base64 string
        key: Decryption key
        
    Returns:
        Decrypted data
    """
    try:
        from cryptography.fernet import Fernet
        
        # Create a Fernet cipher
        cipher = Fernet(key)
        
        # Decode from base64
        decoded_data = base64.b64decode(encrypted_data)
        
        # Decrypt the data
        decrypted_data = cipher.decrypt(decoded_data)
        
        return decrypted_data.decode('utf-8')
    except ImportError:
        logging.warning("Cryptography package not available. Returning raw data.")
        return base64.b64decode(encrypted_data).decode('utf-8')


def validate_content_type(content_type: str, allowed_types: List[str]) -> bool:
    """
    Validate if a content type is in the list of allowed types.
    
    Args:
        content_type: The content type to validate
        allowed_types: List of allowed content types
        
    Returns:
        True if content type is allowed, False otherwise
    """
    return content_type in allowed_types


def sanitize_filename_and_path(file_path: str) -> str:
    """
    Sanitize a file path to prevent path traversal attacks.
    
    Args:
        file_path: The file path to sanitize
        
    Returns:
        Sanitized file path
    """
    # Normalize the path
    normalized_path = os.path.normpath(file_path)
    
    # Split path into components
    path_components = normalized_path.split(os.sep)
    
    # Filter out dangerous components
    safe_components = [
        component for component in path_components
        if component and component not in ('.', '..', '')
    ]
    
    # Sanitize each filename component
    safe_components = [sanitize_filename(component) for component in safe_components]
    
    # Rejoin the path
    return os.path.join(*safe_components) if safe_components else ""
