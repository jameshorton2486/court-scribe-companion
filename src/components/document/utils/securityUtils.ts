
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 
      'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'blockquote',
      'img', 'span', 'section', 'article'
    ],
    ALLOWED_ATTR: [
      'href', 'name', 'target', 'src', 'alt', 'class', 'id', 'style'
    ]
  });
};

/**
 * Sanitize text content to prevent injection attacks
 */
export const sanitizeTextContent = (input: string): string => {
  return input.trim();
};

/**
 * Sanitize a string input to prevent injection attacks
 */
export const sanitizeInput = (input: string): string => {
  return input.trim();
};

/**
 * Validate API key format (basic check for OpenAI format)
 */
export const isValidApiKey = (apiKey: string): boolean => {
  // OpenAI API keys typically start with 'sk-' and are around 51 characters long
  return /^sk-[a-zA-Z0-9]{48}$/.test(apiKey);
};

/**
 * Validate API key format - same as isValidApiKey but with a different name
 * to maintain backward compatibility
 */
export const validateApiKeyFormat = (apiKey: string): boolean => {
  return isValidApiKey(apiKey);
};

/**
 * Helper to create a RegExpMatchArray for testing
 */
export const createRegExpMatchArray = (matches: string[]): RegExpMatchArray => {
  // Create a basic array with the matches
  const matchArray = [...matches] as RegExpMatchArray;
  
  // Add index and input properties to satisfy RegExpMatchArray interface
  matchArray.index = 0;
  matchArray.input = matches[0] || '';
  matchArray.groups = undefined;
  
  return matchArray;
};
