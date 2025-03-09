
import { describe, it, expect, vi } from 'vitest';
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
      title: 'Test Book'
    } as Book;

    const errors = validateBook(book);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.code === 'INVALID_CHAPTERS')).toBe(true);
  });

  it('should validate a book with empty chapters', () => {
    const book = {
      id: 'test-id',
      title: 'Test Book',
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
      chapters: [
        { 
          id: 'chapter-1', 
          title: 'Chapter 1', 
          content: '<p>This is the content of chapter 1.</p>' 
        }
      ]
    } as Book;

    expect(isValidBook(validBook)).toBe(true);
  });

  it('should detect HTML issues in chapter content', () => {
    const bookWithBadHtml = {
      id: 'test-id',
      title: 'Test Book',
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
});
