
"""
Encoding Utilities Module

This module provides utilities for detecting and handling text encoding issues.
"""

import re
import logging

# Set up logger for this module
logger = logging.getLogger(__name__)

def contains_encoding_issues(text):
    """
    Detect if text likely contains encoding issues
    
    Args:
        text: The text string to check
        
    Returns:
        True if encoding issues are detected, False otherwise
    """
    # Early return for empty or very short text
    if not text or len(text) < 5:
        return False
        
    # Pattern for suspicious sequences of symbols that might indicate encoding issues
    suspicious_patterns = [
        r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]{3,}',  # Control characters
        r'[\xC0-\xFF]{3,}',                       # High ASCII chars in sequence
        r'(\?{3,})',                              # Multiple question marks
        r'(�{2,})',                               # Unicode replacement chars
        r'(\]{3,}|\[{3,}|\){3,}|\({3,})',         # Multiple brackets in sequence
        r'([\\/@#$%^&*+=]{4,})'                   # Repeated special chars
    ]
    
    # Check for quick binary data detection
    if '\x00' in text:
        logger.debug("Binary data detected in text content")
        return True
    
    # Check for patterns
    for pattern in suspicious_patterns:
        if re.search(pattern, text):
            logger.debug(f"Suspicious encoding pattern detected: {pattern}")
            return True
    
    # Count non-printable characters
    non_printable = sum(1 for c in text if not c.isprintable() and not c.isspace())
    
    # If more than 15% of the text is non-printable, suspect encoding issues
    if len(text) > 20 and non_printable / len(text) > 0.15:
        logger.debug(f"High percentage of non-printable characters: {non_printable/len(text)*100:.2f}%")
        return True
    
    return False

def log_encoding_issues(text, file_path=None, logger=None):
    """
    Log information about encoding issues in text
    
    Args:
        text: The text to check for encoding issues
        file_path: Optional file path for context in logs
        logger: Optional logger to use
    
    Returns:
        True if encoding issues were detected and logged, False otherwise
    """
    if not logger:
        logger = logging.getLogger("encoding_issues")
    
    if contains_encoding_issues(text):
        context = f" in {file_path}" if file_path else ""
        logger.warning(f"Encoding issues detected{context}")
        
        # Log a sample of the problematic text
        sample = text[:100] + "..." if len(text) > 100 else text
        logger.debug(f"Sample text with issues: {sample}")
        return True
        
    return False

