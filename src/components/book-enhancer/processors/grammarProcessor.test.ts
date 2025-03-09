
import { describe, it, expect } from 'vitest';
import { applyGrammarCorrections, detectSpellingErrors } from './grammarProcessor';

describe('grammarProcessor', () => {
  describe('applyGrammarCorrections', () => {
    it('should fix basic grammar issues at level 1', () => {
      const originalText = 'i am testing this  text. it has multiple  spaces. dont forget punctuation';
      const corrected = applyGrammarCorrections(originalText, 1);
      
      // Check capitalization and spacing fixes
      expect(corrected).toContain('I am testing');
      expect(corrected).not.toContain('  '); // No double spaces
      expect(corrected).toContain('It has multiple');
      expect(corrected).toContain('punctuation');
    });
    
    it('should fix contractions at level 2', () => {
      const originalText = 'You cant do that. They dont understand. Youre going too fast.';
      const corrected = applyGrammarCorrections(originalText, 2);
      
      expect(corrected).toContain("can't");
      expect(corrected).toContain("don't");
      expect(corrected).toContain("You're");
    });
    
    it('should fix advanced grammar issues at level 3', () => {
      const originalText = 'I could of done it. There is less books here. Due to the fact that it is raining.';
      const corrected = applyGrammarCorrections(originalText, 3);
      
      expect(corrected).toContain('could have');
      expect(corrected).toContain('fewer books');
      expect(corrected).toContain('Because');
      expect(corrected).not.toContain('Due to the fact that');
    });
    
    it('should handle multiple paragraph text', () => {
      const originalText = 'this is paragraph one.\n\nthis is paragraph two.';
      const corrected = applyGrammarCorrections(originalText, 2);
      
      expect(corrected).toContain('This is paragraph one');
      expect(corrected).toContain('This is paragraph two');
    });
  });
  
  describe('detectSpellingErrors', () => {
    it('should detect common misspellings', () => {
      const text = 'I recieve too many emails. The seperate account is for work.';
      const errors = detectSpellingErrors(text);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.word === 'recieve')).toBe(true);
      expect(errors.some(e => e.word === 'seperate')).toBe(true);
    });
    
    it('should return empty array for text with no known errors', () => {
      const text = 'This text has no common spelling errors.';
      const errors = detectSpellingErrors(text);
      
      expect(errors.length).toBe(0);
    });
  });
});
