
import { Book } from '@/components/ebook-uploader/EbookUploader';

/**
 * Schema interface defining the expected structure of a valid book
 */
interface BookValidationSchema {
  id: string;
  title: string;
  chapters: { id: string; title: string; content: string }[];
}

/**
 * Validates that a book object has the correct structure and required properties
 * 
 * @param book - The book object to validate
 * @returns Boolean indicating if the book structure is valid
 */
export const validateBook = (book: any): boolean => {
  if (!book || typeof book !== 'object') return false;
  if (typeof book.id !== 'string' || !book.id) return false;
  if (typeof book.title !== 'string' || !book.title) return false;
  
  if (!Array.isArray(book.chapters)) return false;
  
  // Validate each chapter more thoroughly
  for (const chapter of book.chapters) {
    if (!chapter || typeof chapter !== 'object') return false;
    if (typeof chapter.id !== 'string' || !chapter.id) return false;
    if (typeof chapter.title !== 'string') return false;
    
    // Check content type but allow empty content
    if (chapter.content && typeof chapter.content !== 'string') return false;
    
    // Additional security checks for chapter IDs (prevent injection)
    if (!/^[a-zA-Z0-9_-]+$/.test(chapter.id)) return false;
  }
  
  return true;
};

/**
 * Sanitizes HTML content by removing potentially dangerous scripts and event handlers
 * 
 * @param html - The HTML content to sanitize
 * @returns Sanitized HTML content
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Remove all script tags and their contents
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove all event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove base tags that could change the base URL
  sanitized = sanitized.replace(/<base\b[^>]*>/gi, '');
  
  // Remove meta refresh tags
  sanitized = sanitized.replace(/<meta\b[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, '');
  
  // Sanitize URLs in links and images to prevent javascript: protocol attacks
  sanitized = sanitized.replace(/\bhref\s*=\s*["']?javascript:/gi, 'href="unsafe:');
  sanitized = sanitized.replace(/\bsrc\s*=\s*["']?javascript:/gi, 'src="unsafe:');
  
  return sanitized;
};

/**
 * Validates and sanitizes user input string
 * 
 * @param input - User input string to be sanitized
 * @param maxLength - Maximum allowed length
 * @returns Sanitized string
 */
export const sanitizeUserInput = (input: string, maxLength = 1000): string => {
  if (!input) return '';
  
  // Trim whitespace and limit length
  let sanitized = input.trim().slice(0, maxLength);
  
  // Convert potentially problematic characters
  sanitized = sanitized
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
  
  return sanitized;
};

/**
 * Validates a file before processing to ensure it's of an allowed type and size
 * 
 * @param file - File object to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSizeMB - Maximum file size in MB
 * @returns Object with validation result and error message if applicable
 */
export const validateFile = (
  file: File, 
  allowedTypes: string[] = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/html', 'text/markdown'],
  maxSizeMB: number = 50
): { valid: boolean; message?: string } => {
  // Check if file exists
  if (!file) {
    return { valid: false, message: 'No file provided' };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: `Invalid file type. Allowed types: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}` 
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      message: `File too large. Maximum size: ${maxSizeMB}MB` 
    };
  }
  
  return { valid: true };
};

