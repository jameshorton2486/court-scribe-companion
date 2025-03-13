
/**
 * Security utilities for input validation and sanitization
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes text content to prevent XSS attacks
 * 
 * @param content - Text content to sanitize
 * @returns Sanitized content
 */
export const sanitizeTextContent = (content: string): string => {
  // Handle null/undefined content
  if (!content) {
    return '';
  }
  
  // Validate input type
  if (typeof content !== 'string') {
    console.error('Invalid content type provided to sanitizeTextContent');
    return '';
  }
  
  try {
    // Use DOMPurify to sanitize HTML content
    // This removes potentially malicious scripts and attributes
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'i', 'em', 'strong', 'u', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ol', 'ul', 'li', 'blockquote', 'code', 'pre', 'hr', 'div', 'span'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'style'],
      FORBID_CONTENTS: ['style', 'script', 'iframe', 'form', 'object', 'embed'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'object', 'embed', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'eval'],
      ALLOW_DATA_ATTR: false
    });
    
    return sanitized;
  } catch (error) {
    console.error('Error sanitizing content:', error);
    // If sanitization fails, strip all HTML tags as a fallback
    return content.replace(/<[^>]*>?/gm, '');
  }
};

/**
 * Validates if a string matches the OpenAI API key format
 * 
 * @param apiKey - API key to validate
 * @returns Whether the API key has valid format
 */
export const validateApiKeyFormat = (apiKey: string): boolean => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  // OpenAI API keys typically start with "sk-" and are 51 characters long
  return apiKey.startsWith('sk-') && apiKey.length >= 30;
};

/**
 * Validates filename for security risks (path traversal, etc.)
 * 
 * @param filename - Filename to validate
 * @returns Sanitized filename
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return 'document';
  }
  
  // Remove path traversal components
  const sanitized = filename
    .replace(/\.\.\//g, '')
    .replace(/\\/g, '')
    .replace(/\//g, '')
    .replace(/[<>:"|?*]/g, '_');
  
  return sanitized || 'document';
};

/**
 * Validates user input string
 * 
 * @param input - User input to validate
 * @param maxLength - Maximum allowed length
 * @returns Validated input or truncated input
 */
export const validateUserInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Truncate if too long
  if (input.length > maxLength) {
    return input.substring(0, maxLength);
  }
  
  return input;
};

/**
 * Creates a RegExpMatchArray from a string array for compatibility
 * This helps with type compatibility in test files
 */
export const createRegExpMatchArray = (matches: string[]): RegExpMatchArray => {
  if (!matches || !Array.isArray(matches)) {
    return [''] as RegExpMatchArray;
  }
  
  const result = [...matches] as RegExpMatchArray;
  // Ensure the array has the minimum properties expected of a RegExpMatchArray
  result.index = 0;
  result.input = '';
  result.groups = undefined;
  
  return result;
};
