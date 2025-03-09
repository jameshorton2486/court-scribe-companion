
import { describe, it, expect } from 'vitest';
import { applyProfessionalFormatting } from './formattingProcessor';

describe('formattingProcessor', () => {
  describe('applyProfessionalFormatting', () => {
    it('should apply font family classes to elements', () => {
      const content = '<h1>Title</h1><p>Paragraph</p>';
      const options = {
        fontFamily: 'serif',
        generateTOC: false,
        addChapterBreaks: false
      };
      
      const formatted = applyProfessionalFormatting(content, options);
      
      expect(formatted).toContain('font-serif');
      expect(formatted).toContain('<h1 class="text-4xl font-bold mb-8 mt-10 font-serif"');
      expect(formatted).toContain('<p class="mb-4 leading-relaxed font-serif">');
    });
    
    it('should add TOC data attributes when generateTOC is true', () => {
      const content = '<h1 id="title">Title</h1><h2 id="subtitle">Subtitle</h2>';
      const options = {
        fontFamily: 'sans',
        generateTOC: true,
        addChapterBreaks: false
      };
      
      const formatted = applyProfessionalFormatting(content, options);
      
      expect(formatted).toContain('data-toc-item="true"');
      expect(formatted).toContain('data-toc-level="1"');
      expect(formatted).toContain('data-toc-level="2"');
    });
    
    it('should add page breaks when addChapterBreaks is true', () => {
      const content = '<h1>Chapter 1</h1><p>Content</p>';
      const options = {
        fontFamily: 'mono',
        generateTOC: false,
        addChapterBreaks: true
      };
      
      const formatted = applyProfessionalFormatting(content, options);
      
      expect(formatted).toContain('<div class="page-break-before"></div>');
    });
    
    it('should handle multiple formatting options together', () => {
      const content = '<h1 id="ch1">Chapter 1</h1><p>Content</p><ul><li>Item</li></ul>';
      const options = {
        fontFamily: 'sans',
        generateTOC: true,
        addChapterBreaks: true
      };
      
      const formatted = applyProfessionalFormatting(content, options);
      
      expect(formatted).toContain('font-sans');
      expect(formatted).toContain('data-toc-item="true"');
      expect(formatted).toContain('<div class="page-break-before"></div>');
      expect(formatted).toContain('<ul class="list-disc pl-6 mb-4 font-sans">');
    });
  });
});
