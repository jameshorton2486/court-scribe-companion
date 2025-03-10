import { Chapter } from '@/components/document/DocumentUploader';

// Types for grammar processing
export type GrammarError = {
  type: 'spelling' | 'grammar' | 'punctuation';
  word: string;
  index: number;
  suggestion: string;
};

export type GrammarAnalysisResult = {
  errors: GrammarError[];
  score: number; // 0-100 score for grammar quality
  suggestions: string[];
};

// Main function to analyze grammar in chapter content
export const analyzeGrammar = (chapter: Chapter): GrammarAnalysisResult => {
  const content = stripHtmlTags(chapter.content);
  
  // Detect various types of errors
  const spellingErrors = detectSpellingErrors(content);
  const grammarErrors = detectGrammarErrors(content);
  const punctuationErrors = detectPunctuationErrors(content);
  
  // Combine all errors
  const allErrors = [
    ...spellingErrors.map(err => ({ ...err, type: 'spelling' as const })),
    ...grammarErrors.map(err => ({ ...err, type: 'grammar' as const })),
    ...punctuationErrors.map(err => ({ ...err, type: 'punctuation' as const }))
  ];
  
  // Calculate grammar score (100 - deductions based on errors)
  const baseScore = 100;
  const deduction = Math.min(allErrors.length * 5, 70); // Cap deduction at 70 points
  const score = baseScore - deduction;
  
  // Generate overall suggestions
  const suggestions = generateSuggestions(content, allErrors);
  
  return {
    errors: allErrors,
    score,
    suggestions
  };
};

// Function to detect common spelling errors in text
export const detectSpellingErrors = (text: string): Array<{word: string, index: number, suggestion: string}> => {
  // Define some common misspellings
  const commonMisspellings: Record<string, string> = {
    'definately': 'definitely',
    'seperate': 'separate',
    'occured': 'occurred',
    'recieve': 'receive',
    'untill': 'until',
    'accomodate': 'accommodate',
    'acknowlege': 'acknowledge',
    'accross': 'across',
    'agressive': 'aggressive',
    'apparant': 'apparent',
    'aquire': 'acquire',
    'arguement': 'argument',
    'basicly': 'basically',
    'begining': 'beginning',
    'beleive': 'believe',
    'commitee': 'committee',
    'concieve': 'conceive',
    // ... more common misspellings
  };
  
  // Simple word extraction - this is a simplified version
  const words = text.match(/\b\w+\b/g) || [];
  const errors: Array<{word: string, index: number, suggestion: string}> = [];
  
  words.forEach((word: string) => {
    // Fix: Explicitly type word as string to ensure toLowerCase exists
    const lowerWord = word.toLowerCase();
    if (commonMisspellings[lowerWord]) {
      const index = text.indexOf(word);
      if (index !== -1) {
        errors.push({ 
          word, 
          index,
          suggestion: commonMisspellings[lowerWord]
        });
      }
    }
  });
  
  return errors;
};

// Function to detect grammar errors
export const detectGrammarErrors = (text: string): Array<{word: string, index: number, suggestion: string}> => {
  const errors: Array<{word: string, index: number, suggestion: string}> = [];
  
  // Check for subject-verb agreement issues (simplified)
  const subjectVerbPatterns = [
    { pattern: /they is\b/gi, replacement: 'they are' },
    { pattern: /he are\b/gi, replacement: 'he is' },
    { pattern: /she are\b/gi, replacement: 'she is' },
    { pattern: /it are\b/gi, replacement: 'it is' },
    { pattern: /we is\b/gi, replacement: 'we are' },
    { pattern: /you is\b/gi, replacement: 'you are' },
  ];
  
  subjectVerbPatterns.forEach(({ pattern, replacement }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      errors.push({
        word: match[0],
        index: match.index,
        suggestion: replacement
      });
    }
  });
  
  // Check for double negatives
  const doubleNegativePattern = /\b(not|no|never|nobody|nothing|nowhere|neither)\b.*\b(not|no|never|nobody|nothing|nowhere|neither)\b/gi;
  let match;
  while ((match = doubleNegativePattern.exec(text)) !== null) {
    errors.push({
      word: match[0],
      index: match.index,
      suggestion: 'Consider removing one negative to avoid double negation'
    });
  }
  
  return errors;
};

// Function to detect punctuation errors
export const detectPunctuationErrors = (text: string): Array<{word: string, index: number, suggestion: string}> => {
  const errors: Array<{word: string, index: number, suggestion: string}> = [];
  
  // Check for missing periods at end of sentences
  const sentenceEndPattern = /\b[A-Z][^.!?]*(?<![.!?])\s+[A-Z]/g;
  let match;
  while ((match = sentenceEndPattern.exec(text)) !== null) {
    errors.push({
      word: match[0],
      index: match.index,
      suggestion: 'Consider adding a period at the end of this sentence'
    });
  }
  
  // Check for multiple punctuation
  const multiPunctuationPattern = /[.!?]{2,}/g;
  while ((match = multiPunctuationPattern.exec(text)) !== null) {
    errors.push({
      word: match[0],
      index: match.index,
      suggestion: 'Use a single punctuation mark'
    });
  }
  
  // Check for spaces before punctuation
  const spaceBeforePunctuationPattern = /\s+[,.!?;:]/g;
  while ((match = spaceBeforePunctuationPattern.exec(text)) !== null) {
    errors.push({
      word: match[0],
      index: match.index,
      suggestion: 'Remove space before punctuation'
    });
  }
  
  return errors;
};

// Helper function to strip HTML tags for text analysis
export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

// Generate overall suggestions based on errors
export const generateSuggestions = (
  text: string, 
  errors: Array<{type: string, word: string, index: number, suggestion: string}>
): string[] => {
  const suggestions: string[] = [];
  
  // Count error types
  const errorCounts: Record<string, number> = {};
  errors.forEach(error => {
    errorCounts[error.type] = (errorCounts[error.type] || 0) + 1;
  });
  
  // Generate suggestions based on error frequency
  if (errorCounts['spelling'] > 5) {
    suggestions.push('Consider using a spell checker to fix multiple spelling errors');
  }
  
  if (errorCounts['grammar'] > 3) {
    suggestions.push('Review subject-verb agreement throughout the text');
  }
  
  if (errorCounts['punctuation'] > 3) {
    suggestions.push('Check punctuation usage, especially at the end of sentences');
  }
  
  // Check for passive voice (simplified)
  const passiveVoiceCount = (text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || []).length;
  if (passiveVoiceCount > 3) {
    suggestions.push('Consider using active voice instead of passive voice for clearer writing');
  }
  
  // Check for sentence length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 25).length;
  if (longSentences > 2) {
    suggestions.push('Consider breaking up long sentences for improved readability');
  }
  
  return suggestions;
};

// Apply grammar fixes to content
export const applyGrammarFixes = (content: string, errors: GrammarError[]): string => {
  // Sort errors by index in reverse order to avoid index shifting when replacing
  const sortedErrors = [...errors].sort((a, b) => b.index - a.index);
  
  let fixedContent = content;
  sortedErrors.forEach(error => {
    // Only apply automatic fixes for spelling and certain grammar errors
    if (error.type === 'spelling' || 
        (error.type === 'grammar' && !error.suggestion.startsWith('Consider'))) {
      const before = fixedContent.substring(0, error.index);
      const after = fixedContent.substring(error.index + error.word.length);
      fixedContent = before + error.suggestion + after;
    }
  });
  
  return fixedContent;
};
