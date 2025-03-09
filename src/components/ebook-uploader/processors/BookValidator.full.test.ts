
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateBook, isValidBook } from './BookValidator';
import { Book } from './BookTypes';
import * as PerformanceMonitor from './PerformanceMonitor';

// Mock dependencies
vi.mock('./PerformanceMonitor', () => ({
  processWithTiming: vi.fn((fn) => fn()),
}));

describe('BookValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return errors for a null book', () => {
    const errors = validateBook(null);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].code).toBe('INVALID_BOOK');
  });

  it('should validate a book with missing required properties', () => {
    const book = {
      id: '',
      chapters: []
    } as Book;

    const errors = validateBook(book);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.code === 'MISSING_TITLE')).toBe(true);
  });

  it('should validate a book with missing chapters', () => {
    const book = {
      id: 'test-id',
      title: 'Test Book',
      author: 'Test Author'
    } as Book;

    const errors = validateBook(book);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.code === 'INVALID_CHAPTERS')).toBe(true);
  });

  it('should validate a book with empty chapters', () => {
    const book = {
      id: 'test-id',
      title: 'Test Book',
      author: 'Test Author',
      chapters: []
    } as Book;

    const errors = validateBook(book);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.code === 'NO_CHAPTERS')).toBe(true);
  });

  it('should validate a book with invalid chapters', () => {
    const book = {
      id: 'test-id',
      title: 'Test Book',
      author: 'Test Author',
      chapters: [
        { title: 'Chapter 1' },
        { id: 'chapter-2' }
      ]
    } as any;

    const errors = validateBook(book);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.code === 'CHAPTER_MISSING_ID')).toBe(true);
    expect(errors.some(e => e.code === 'CHAPTER_MISSING_TITLE')).toBe(true);
  });

  it('should identify a valid book', () => {
    const validBook = {
      id: 'test-id',
      title: 'Test Book',
      author: 'Test Author',
      chapters: [
        { 
          id: 'chapter-1', 
          title: 'Chapter 1', 
          content: '<p>This is the content of chapter 1.</p>' 
        }
      ]
    } as Book;

    expect(isValidBook(validBook)).toBe(true);
    const errors = validateBook(validBook);
    expect(errors.length).toBe(0);
  });

  it('should detect HTML issues in chapter content', () => {
    const bookWithBadHtml = {
      id: 'test-id',
      title: 'Test Book',
      author: 'Test Author',
      chapters: [
        { 
          id: 'chapter-1', 
          title: 'Chapter 1', 
          content: '<p>This is unclosed content of chapter 1.' 
        }
      ]
    } as Book;

    const errors = validateBook(bookWithBadHtml);
    expect(errors.some(e => e.code === 'CHAPTER_INVALID_HTML')).toBe(true);
  });
  
  it('should optimize validation for large books', () => {
    // Create a book with many chapters
    const largeBook = {
      id: 'test-id',
      title: 'Large Test Book',
      author: 'Test Author',
      chapters: Array(25).fill(0).map((_, i) => ({
        id: `chapter-${i}`,
        title: `Chapter ${i}`,
        content: `<p>Content for chapter ${i}</p>`
      }))
    } as Book;
    
    const errors = validateBook(largeBook);
    expect(errors.length).toBe(0);
    expect(isValidBook(largeBook)).toBe(true);
  });
  
  it('should detect issues with very large content', () => {
    // Create a book with one chapter with very large content
    const largeContentBook = {
      id: 'test-id',
      title: 'Large Content Book',
      author: 'Test Author',
      chapters: [
        {
          id: 'chapter-1',
          title: 'Chapter 1',
          content: '<p>' + 'a'.repeat(600000) + '</p>'
        }
      ]
    } as Book;
    
    const errors = validateBook(largeContentBook);
    expect(errors.length).toBe(0);
    expect(isValidBook(largeContentBook)).toBe(true);
  });
});
