
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateBook, isValidBook } from './BookValidator';
import { Book } from './BookTypes';
import * as PerformanceMonitor from './PerformanceMonitor';

// Mock dependencies
vi.mock('./PerformanceMonitor', () => ({
  processWithTiming: vi.fn((fn) => fn()),
}));

describe('BookValidator Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should perform complete validation on a real-world book structure', () => {
    // Create a realistic book structure with multiple chapters
    const book: Book = {
      id: 'test-book-123',
      title: 'Test Book Title',
      author: 'Test Author',
      coverImage: 'cover.jpg',
      description: 'This is a test book description that spans multiple lines.\nIt contains information about the book content.',
      language: 'en',
      publicationDate: '2023-01-01',
      publisher: 'Test Publisher',
      chapters: [
        {
          id: 'chapter-1',
          title: 'Introduction',
          content: '<h1>Introduction</h1><p>This is the introduction chapter.</p><p>It explains the purpose of the book.</p>'
        },
        {
          id: 'chapter-2',
          title: 'Main Content',
          content: '<h1>Main Content</h1><p>This is the main content chapter.</p><ul><li>Point 1</li><li>Point 2</li></ul>'
        },
        {
          id: 'chapter-3',
          title: 'Conclusion',
          content: '<h1>Conclusion</h1><p>This is the conclusion chapter.</p><blockquote>Important quote here</blockquote>'
        }
      ]
    };

    // Perform validation
    const errors = validateBook(book);
    expect(errors.length).toBe(0);
    expect(isValidBook(book)).toBe(true);
  });

  it('should validate a book with nested HTML structure', () => {
    // Create a book with complex HTML in chapters
    const bookWithComplexHtml: Book = {
      id: 'complex-html-book',
      title: 'Complex HTML Book',
      author: 'Test Author',
      chapters: [
        {
          id: 'chapter-1',
          title: 'Complex HTML',
          content: `
            <div class="chapter">
              <h1 id="title">Chapter Title</h1>
              <div class="section">
                <h2>Section 1</h2>
                <p>This is <strong>section 1</strong> content with <em>emphasis</em> and <a href="https://example.com">links</a>.</p>
                <table>
                  <thead><tr><th>Header 1</th><th>Header 2</th></tr></thead>
                  <tbody>
                    <tr><td>Cell 1,1</td><td>Cell 1,2</td></tr>
                    <tr><td>Cell 2,1</td><td>Cell 2,2</td></tr>
                  </tbody>
                </table>
              </div>
              <div class="section">
                <h2>Section 2</h2>
                <ul>
                  <li>Item 1</li>
                  <li>Item 2 with <code>inline code</code></li>
                </ul>
                <pre><code>function example() {
  return "code block";
}</code></pre>
              </div>
            </div>
          `
        }
      ]
    };

    const errors = validateBook(bookWithComplexHtml);
    expect(errors.length).toBe(0);
    expect(isValidBook(bookWithComplexHtml)).toBe(true);
  });

  it('should catch multiple issues in an invalid book', () => {
    // Create a book with multiple issues
    const invalidBook = {
      id: 'invalid-book',
      // Missing title
      chapters: [
        {
          // Missing id
          title: 'Chapter 1',
          content: '<p>This is content.</p>'
        },
        {
          id: 'chapter-2',
          // Missing title
          content: '<p>More content.<p>' // Unclosed tag
        }
      ]
    } as any;

    const errors = validateBook(invalidBook);
    expect(errors.length).toBeGreaterThan(2); // Should catch multiple issues
    expect(isValidBook(invalidBook)).toBe(false);
    
    // Check for specific errors
    expect(errors.some(e => e.code === 'MISSING_TITLE')).toBe(true);
    expect(errors.some(e => e.code === 'CHAPTER_MISSING_ID')).toBe(true);
    expect(errors.some(e => e.code === 'CHAPTER_MISSING_TITLE')).toBe(true);
    expect(errors.some(e => e.code === 'CHAPTER_INVALID_HTML')).toBe(true);
  });

  it('should handle performance monitoring during validation', () => {
    const validBook: Book = {
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
    };

    validateBook(validBook);
    expect(PerformanceMonitor.processWithTiming).toHaveBeenCalled();
  });

  it('should handle very large content gracefully', () => {
    // Generate a large HTML content string
    const generateLargeContent = () => {
      let content = '<div class="chapter">';
      for (let i = 0; i < 100; i++) {
        content += `<h2>Section ${i}</h2>`;
        content += `<p>Paragraph ${i} with some content. This is a test of large content handling.</p>`;
        content += '<ul>';
        for (let j = 0; j < 5; j++) {
          content += `<li>List item ${j} in section ${i}</li>`;
        }
        content += '</ul>';
      }
      content += '</div>';
      return content;
    };

    const largeBook: Book = {
      id: 'large-book',
      title: 'Large Book',
      author: 'Test Author',
      chapters: [
        {
          id: 'large-chapter',
          title: 'Large Chapter',
          content: generateLargeContent()
        }
      ]
    };

    const errors = validateBook(largeBook);
    expect(errors.length).toBe(0);
    expect(isValidBook(largeBook)).toBe(true);
  });
});
