
import { describe, it, expect } from 'vitest';
import { 
  sectionPatterns, 
  isHeading, 
  getChapterTitle, 
  getChapterContentHeader 
} from './chapterPatterns';

describe('chapterPatterns', () => {
  describe('isHeading', () => {
    it('should detect "Chapter X: Title" format', () => {
      expect(isHeading('Chapter 1: Introduction', sectionPatterns)).toBe(true);
      expect(isHeading('CHAPTER 10: Advanced Topics', sectionPatterns)).toBe(true);
      expect(isHeading('chapter 5: Methods', sectionPatterns)).toBe(true);
    });
    
    it('should detect numbered headings', () => {
      expect(isHeading('1. Introduction', sectionPatterns)).toBe(true);
      expect(isHeading('10. Conclusion', sectionPatterns)).toBe(true);
      expect(isHeading('5.Data Analysis', sectionPatterns)).toBe(true);
    });
    
    it('should detect subsection headings', () => {
      expect(isHeading('1.1 Background', sectionPatterns)).toBe(true);
      expect(isHeading('3.4 Research Method', sectionPatterns)).toBe(true);
    });
    
    it('should detect appendix headings', () => {
      expect(isHeading('Appendix A: Supplementary Data', sectionPatterns)).toBe(true);
      expect(isHeading('APPENDIX B: Survey Questions', sectionPatterns)).toBe(true);
    });
    
    it('should detect letter-based headings', () => {
      expect(isHeading('A. Introduction', sectionPatterns)).toBe(true);
      expect(isHeading('B: Research Background', sectionPatterns)).toBe(true);
    });
    
    it('should detect back matter and index headings', () => {
      expect(isHeading('Back Matter: References', sectionPatterns)).toBe(true);
      expect(isHeading('Index: Terms', sectionPatterns)).toBe(true);
    });
    
    it('should not detect regular text as headings', () => {
      expect(isHeading('This is a paragraph of text.', sectionPatterns)).toBe(false);
      expect(isHeading('The Chapter 1 explains the basics.', sectionPatterns)).toBe(false);
      expect(isHeading('I wrote 1.5 pages of notes.', sectionPatterns)).toBe(false);
    });
  });
  
  describe('getChapterTitle', () => {
    it('should format regular chapter titles correctly', () => {
      const match = ['Chapter 1: Introduction', '1', 'Introduction'];
      expect(getChapterTitle(match, false, false)).toBe('Chapter 1: Introduction');
    });
    
    it('should format appendix titles correctly', () => {
      const match = ['Appendix A: Data', 'A', 'Data'];
      expect(getChapterTitle(match, true, false)).toBe('Appendix A: Data');
    });
    
    it('should format back matter titles correctly', () => {
      const match = ['Back Matter: References', 'Back Matter', 'References'];
      expect(getChapterTitle(match, false, true)).toBe('References');
    });
    
    it('should handle missing title in capture groups', () => {
      const match = ['Chapter 1:', '1', undefined];
      expect(getChapterTitle(match, false, false)).toBe('Chapter 1: ');
      
      const appendixMatch = ['Appendix B', 'B', undefined];
      expect(getChapterTitle(appendixMatch, true, false)).toBe('Appendix B: Untitled');
    });
  });
  
  describe('getChapterContentHeader', () => {
    it('should generate HTML heading for regular chapters', () => {
      const match = ['Chapter 1: Introduction', '1', 'Introduction'];
      const header = getChapterContentHeader(match, false, false);
      expect(header).toBe('<h2>Chapter 1: Introduction</h2>\n');
    });
    
    it('should generate HTML heading for appendices', () => {
      const match = ['Appendix A: Data', 'A', 'Data'];
      const header = getChapterContentHeader(match, true, false);
      expect(header).toBe('<h2>Appendix A: Data</h2>\n');
    });
    
    it('should generate HTML heading for back matter', () => {
      const match = ['Back Matter: References', 'Back Matter', 'References'];
      const header = getChapterContentHeader(match, false, true);
      expect(header).toBe('<h2>References</h2>\n');
    });
    
    it('should handle missing title in appendix', () => {
      const match = ['Appendix C', 'C', undefined];
      const header = getChapterContentHeader(match, true, false);
      expect(header).toBe('<h2>Appendix C: Untitled</h2>\n');
    });
  });
});
