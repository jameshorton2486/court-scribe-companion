
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { enhanceChapterContent, logEnhancementError } from './ContentEnhancementService';

describe('ContentEnhancementService', () => {
  beforeEach(() => {
    // Mock setTimeout for async functions
    vi.useFakeTimers();
    // Mock console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('enhanceChapterContent', () => {
    it('should enhance content with grammar corrections', async () => {
      // Start the timer to advance through the simulated API call
      const enhancementPromise = enhanceChapterContent('<p>i dont want to go</p>', 'grammar');
      
      // Fast-forward timer to complete all pending promises
      vi.runAllTimers();
      
      // Await the result after timers have run
      const result = await enhancementPromise;
      
      expect(result).toContain('<p>I don\'t want to go</p>');
    });
    
    it('should enhance content with expanded information', async () => {
      const enhancementPromise = enhanceChapterContent(
        '<p>First paragraph</p><p>Second paragraph</p>', 
        'expand'
      );
      
      vi.runAllTimers();
      const result = await enhancementPromise;
      
      expect(result).toContain('<p>First paragraph</p>');
      expect(result).toContain('expanded content');
      expect(result).toContain('<p>Second paragraph</p>');
    });
    
    it('should enhance content for clarity', async () => {
      const enhancementPromise = enhanceChapterContent(
        '<p>This is very really just basically a test</p>', 
        'clarity'
      );
      
      vi.runAllTimers();
      const result = await enhancementPromise;
      
      // Should remove unnecessary words like "very", "really", "just", "basically"
      expect(result).toContain('<p>This is a test</p>');
    });
    
    it('should enhance content with professional styling', async () => {
      const enhancementPromise = enhanceChapterContent(
        '<p>This is a good document with some bad formatting. It has big headings and small paragraphs.</p>', 
        'style'
      );
      
      vi.runAllTimers();
      const result = await enhancementPromise;
      
      // Should replace terms with more professional alternatives
      expect(result).toContain('excellent');
      expect(result).toContain('suboptimal');
      expect(result).toContain('substantial');
      expect(result).toContain('minimal');
    });
    
    it('should use custom prompt when provided', async () => {
      const customPrompt = 'Make this text more technical and add scientific terminology';
      const enhancementPromise = enhanceChapterContent(
        '<p>This is basic content</p>', 
        'style',
        customPrompt
      );
      
      vi.runAllTimers();
      const result = await enhancementPromise;
      
      expect(result).toContain('<em>Enhanced with custom prompt: </em>');
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Using custom prompt'));
    });
  });
  
  describe('logEnhancementError', () => {
    it('should log errors with context information', () => {
      const error = new Error('Test error');
      logEnhancementError(error, 'Grammar enhancement');
      
      expect(console.error).toHaveBeenCalledWith(
        'Enhancement error (Grammar enhancement):', 
        error
      );
      
      expect(console.error).toHaveBeenCalledWith(
        'Enhancement Error Details:',
        expect.stringContaining('Test error')
      );
    });
    
    it('should handle non-Error objects', () => {
      logEnhancementError('String error message', 'String context');
      
      expect(console.error).toHaveBeenCalledWith(
        'Enhancement error (String context):',
        'String error message'
      );
    });
  });
});
