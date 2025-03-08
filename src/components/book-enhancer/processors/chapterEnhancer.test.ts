
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhanceChapterContent } from './chapterEnhancer';
import { applyGrammarCorrections } from './grammarProcessor';
import { applyProfessionalFormatting } from './formattingProcessor';
import * as enhancementUtils from '../utils/enhancementUtils';
import * as errorHandlingUtils from '@/utils/errorHandlingUtils';

// Mock dependencies
vi.mock('./grammarProcessor', () => ({
  applyGrammarCorrections: vi.fn(content => content + ' [grammar corrected]'),
}));

vi.mock('./formattingProcessor', () => ({
  applyProfessionalFormatting: vi.fn((content, options) => 
    content + ` [formatting applied with ${options.fontFamily}]`),
}));

vi.mock('../utils/enhancementUtils', () => ({
  trackProcessingTime: vi.fn(async (fn) => ({ 
    result: await fn(), 
    processingTime: 100 
  })),
}));

vi.mock('@/utils/errorHandlingUtils', () => ({
  handleError: vi.fn(error => ({ 
    message: 'Error occurred', 
    details: error.message, 
    originalError: error 
  })),
}));

describe('chapterEnhancer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should apply grammar corrections when enabled', async () => {
    const options = {
      enableGrammarCheck: true,
      enableSpellingCheck: true,
      grammarLevel: 2,
      enableContentExpansion: false,
      expansionLevel: 1, // Added missing property
      enableProfessionalFormatting: false,
      fontFamily: 'serif',
      generateTOC: false,
      addChapterBreaks: false,
      writingStyle: 'standard', // Added missing property
      improveClarity: false // Added missing property
    };

    const result = await enhanceChapterContent('Original content', options);
    
    expect(applyGrammarCorrections).toHaveBeenCalledWith('Original content', 2);
    expect(result.content).toContain('[grammar corrected]');
  });

  it('should apply professional formatting when enabled', async () => {
    const options = {
      enableGrammarCheck: false,
      enableSpellingCheck: false,
      grammarLevel: 1,
      enableContentExpansion: false,
      expansionLevel: 1, // Added missing property
      enableProfessionalFormatting: true,
      fontFamily: 'sans',
      generateTOC: true,
      addChapterBreaks: true,
      writingStyle: 'standard', // Added missing property
      improveClarity: false // Added missing property
    };

    const result = await enhanceChapterContent('Original content', options);
    
    expect(applyProfessionalFormatting).toHaveBeenCalledWith(
      'Original content',
      { fontFamily: 'sans', generateTOC: true, addChapterBreaks: true }
    );
    expect(result.content).toContain('[formatting applied with sans]');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(applyGrammarCorrections).mockImplementation(() => {
      throw new Error('Grammar processing failed');
    });

    const options = {
      enableGrammarCheck: true,
      enableSpellingCheck: true,
      grammarLevel: 2,
      enableContentExpansion: false,
      expansionLevel: 1, // Added missing property
      enableProfessionalFormatting: false,
      fontFamily: 'serif',
      generateTOC: false,
      addChapterBreaks: false,
      writingStyle: 'standard', // Added missing property
      improveClarity: false // Added missing property
    };

    const result = await enhanceChapterContent('Original content', options);
    
    expect(errorHandlingUtils.handleError).toHaveBeenCalled();
    expect(result.content).toBe('Original content');
    expect(result.errors).toBeDefined();
    expect(result.errors![0].code).toBe('ENHANCEMENT_FAILED');
  });

  it('should expand content when enabled', async () => {
    const options = {
      enableGrammarCheck: false,
      enableSpellingCheck: false,
      grammarLevel: 1,
      enableContentExpansion: true,
      expansionLevel: 2,
      enableProfessionalFormatting: false,
      fontFamily: 'serif',
      generateTOC: false,
      addChapterBreaks: false,
      writingStyle: 'standard', // Added missing property
      improveClarity: false // Added missing property
    };

    const result = await enhanceChapterContent('<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>', options);
    
    expect(result.content).toContain('expanded content');
    expect(enhancementUtils.trackProcessingTime).toHaveBeenCalled();
  });
});
