
/**
 * Document Processor Module
 * 
 * Processes document content into a structured document with chapters,
 * handling encoding issues and providing error reporting.
 */

import { Chapter, Document } from './DocumentUploader';
import { fixEncodingIssues, detectEncodingIssues } from './utils/encodingUtils';
import { extractChapters } from './utils/chapterExtractor';

/**
 * Process document content into a structured document with chapters
 */
export const processDocument = (
  title: string,
  author: string,
  content: string
): Document => {
  // Validate inputs
  if (!content || content.trim().length === 0) {
    throw new Error('Document content is empty');
  }
  
  if (!title || title.trim().length === 0) {
    console.warn('Document title is empty, using placeholder');
    title = 'Untitled Document';
  }
  
  // Generate a simple ID from title
  const id = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  
  // Check for encoding issues before processing
  const hasEncodingIssues = detectEncodingIssues(content);
  if (hasEncodingIssues) {
    console.warn('Encoding issues detected in document content. Attempting to fix...');
  }
  
  // Fix encoding issues before processing
  const cleanedContent = fixEncodingIssues(content);
  
  // Extract chapters from content
  let chapters: Chapter[] = [];
  
  try {
    chapters = extractChapters(cleanedContent);
    
    // Check if we actually got chapters
    if (chapters.length === 0) {
      console.warn('No chapters detected in the document. Creating a single chapter.');
      
      // Create a single default chapter with all content
      chapters = [{
        id: '1',
        title: title || 'Full Content',
        content: cleanedContent
      }];
    }
    
    console.log(`Successfully extracted ${chapters.length} chapters from document`);
    
  } catch (error) {
    console.error('Error extracting chapters:', error);
    
    // Fallback: create a single chapter with all content
    chapters = [{
      id: '1',
      title: 'Document Content',
      content: cleanedContent
    }];
    
    console.log('Using fallback single chapter due to extraction error');
  }
  
  return {
    id,
    title,
    author: author || 'Unknown Author',
    chapters
  };
};

/**
 * Validates document content before processing
 * 
 * @param content The document content to validate
 * @returns Object containing validation result and any error messages
 */
export const validateDocument = (content: string): { 
  isValid: boolean; 
  messages: string[]; 
} => {
  const messages: string[] = [];
  
  // Check if content is empty
  if (!content || content.trim().length === 0) {
    messages.push('Document content is empty');
    return { isValid: false, messages };
  }
  
  // Check content length
  if (content.length < 100) {
    messages.push('Document content is too short (less than 100 characters)');
  }
  
  // Check for encoding issues
  if (detectEncodingIssues(content)) {
    messages.push('Encoding issues detected in document content');
  }
  
  // Check if content seems to be binary/non-text data
  const binaryPattern = /[\x00-\x08\x0E-\x1F\x7F]{10,}/;
  if (binaryPattern.test(content)) {
    messages.push('Document appears to contain binary/non-text data');
  }
  
  return {
    isValid: messages.length === 0,
    messages
  };
};

export { fixEncodingIssues, detectEncodingIssues };
