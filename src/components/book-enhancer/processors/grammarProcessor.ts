
/**
 * Grammar and Spelling Correction Module
 *
 * This module enhances text content by correcting grammar,
 * spelling, and improving readability based on configurable correction levels.
 */

export enum GrammarLevel {
  Basic = 1,
  Intermediate = 2,
  Advanced = 3,
}

export interface SpellingError {
  word: string;
  index: number;
}

export interface SpellingCorrection {
  original: string;
  correction: string;
  index: number;
}

// Define the GrammarError type interface that was missing and causing TypeScript errors
export type GrammarError = {
  type: 'spelling' | 'grammar' | 'punctuation';
  word: string;
  index: number;
  suggestion: string;
};

const commonMisspellings: Record<string, string> = {
  teh: 'the',
  recieve: 'receive',
  seperate: 'separate',
  occured: 'occurred',
  accomodate: 'accommodate',
  definately: 'definitely',
  embarass: 'embarrass',
  gaurd: 'guard',
  wierd: 'weird',
  priviledge: 'privilege',
  concious: 'conscious',
  occurence: 'occurrence',
  possable: 'possible',
  alot: 'a lot',
}

export const applyGrammarCorrections = (
  text: string,
  grammarLevel: GrammarLevel = GrammarLevel.Basic
): string => {
  if (typeof text !== 'string' || !text.trim()) return '';

  let correctedText = text;

  // Basic corrections
  correctedText = correctedText
    .replace(/\s+/g, ' ')
    .replace(/\s([.,!?;:])/g, '$1')
    .replace(/\.\.+/g, '.')
    .replace(/\bi\b/g, 'I')
    .replace(/\b(i'm|i'll|i've|i'd)\b/gi, (m) => `I${m.slice(1)}`)
    .replace(/([.!?]\s+)([a-z])/g, (_, s, c) => `${s}${c.toUpperCase()}`);

  if (grammarLevel >= GrammarLevel.Intermediate) {
    correctedText = correctedText
      .replace(/\b(youre|theyre|theres)\b/gi, (m) => `${m.slice(0, -2)}'re`)
      .replace(/\b(its|were)\s+(going|doing|being|not|a|the)\b/gi, (_, w, next) => `${w === 'its' ? "it's" : "we're"} ${next}`)
      .replace(/\b(can|should|would|did|does)n?t\b/gi, "$1n't")
      .replace(/ - /g, '—');
  }

  if (grammarLevel >= GrammarLevel.Advanced) {
    const advancedCorrections: [RegExp, string][] = [
      [/\b(amount) of (\w+s)\b/gi, 'number of $2'],
      [/\b(amount)\s+of\s+(people|items|things)\b/gi, 'number of $2'],
      [/\b(effect change)\b/gi, 'affect change'],
      [/\b(then change)\b/gi, 'than change'],
      [/\b(for all intents and purposes)\b/gi, 'essentially'],
      [/\b(at this point in time)\b/gi, 'now'],
      [/\bin order to\b/gi, 'to'],
      [/\breturn back\b/gi, 'return'],
    ];

    for (const [pattern, replacement] of advancedCorrections) {
      correctedText = correctedText.replace(pattern, replacement);
    }
  }

  return correctedText;
};

export const detectSpellingErrors = (text: string): SpellingError[] => {
  const errors: SpellingError[] = [];
  const wordRegex = /\b([a-z]+)\b/gi;
  let match;

  while ((match = wordRegex.exec(text))) {
    const wordLower = match[1].toLowerCase();
    if (commonMisspellings[wordLower]) {
      errors.push({ word: match[1], index: match.index });
    }
  }

  return errors;
};

export const generateSpellingCorrections = (
  errors: SpellingError[]
): SpellingCorrection[] =>
  errors.map((error) => ({
    original: error.word,
    correction: commonMisspellings[error.word.toLowerCase()] || error.word,
    index: error.index,
  }));

export const applySpellingCorrections = (
  text: string,
  corrections: SpellingCorrection[]
): string => {
  if (!corrections.length) return text;

  // Apply corrections from end to start to avoid indexing issues
  corrections
    .sort((a, b) => b.index - a.index)
    .forEach(({ original, correction, index }) => {
      text = `${text.slice(0, index)}${correction}${text.slice(index + original.length)}`;
    });

  return text;
};

export const correctText = (
  text: string,
  grammarLevel: GrammarLevel = GrammarLevel.Basic
): string => {
  const grammarCorrected = applyGrammarCorrections(text, grammarLevel);
  const spellingErrors = detectSpellingErrors(grammarCorrected);
  const spellingCorrections = generateSpellingCorrections(spellingErrors);
  return applySpellingCorrections(grammarCorrected, spellingCorrections);
};

// Maintain backward compatibility for existing code that may use these functions
export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

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
