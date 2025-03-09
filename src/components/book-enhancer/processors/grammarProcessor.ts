
/**
 * Grammar and spelling correction processor
 * 
 * This module provides functions to enhance text content by correcting grammar,
 * spelling, and improving readability based on configurable levels of correction.
 */

/**
 * Applies grammar and spelling corrections to text content
 * 
 * This function applies various text corrections based on the specified grammar level:
 * - Level 1: Basic corrections (spacing, capitalization, obvious errors)
 * - Level 2: Intermediate corrections (contractions, punctuation)
 * - Level 3: Advanced corrections (style improvements, common phrase fixes)
 * 
 * @param text - The text content to correct
 * @param grammarLevel - The intensity level of corrections (1-3)
 * @returns Corrected text content
 */
export const applyGrammarCorrections = (text: string, grammarLevel: number): string => {
  let correctedText = text;
  
  // Apply basic corrections (Level 1)
  correctedText = correctedText
    .replace(/\s\s+/g, ' ')                          // Fix multiple spaces
    .replace(/\bi\b/g, 'I')                          // Capitalize standalone "i"
    .replace(/([.!?])\s*(\w)/g, (_, p, w) => `${p} ${w.toUpperCase()}`) // Capitalize after sentence
    .replace(/\b(i'm|i'll|i've|i'd)\b/gi, match => match[0].toUpperCase() + match.slice(1)) // Fix I contractions
    .replace(/(\w)\s+([,.!?:;])/g, '$1$2')           // Fix space before punctuation
    .replace(/([,.!?:;])\s*/g, '$1 ')                // Ensure space after punctuation
    .replace(/\s+\./g, '.')                          // Fix space before period
    .replace(/\.\./g, '.')                           // Fix double periods
    .replace(/\s*\n\s*/g, '\n')                      // Fix spacing around new lines
    .replace(/([.!?])\s+([a-z])/g, (_, p, l) => `${p} ${l.toUpperCase()}`) // Capitalize after periods
    .replace(/"\s*(.+?)\s*"/g, '"$1"')               // Fix spacing in quotes
    .replace(/"\s*(.+?)\s*"/g, '"$1"')               // Fix spacing in quotes
    .replace(/'\s*(.+?)\s*'/g, "'$1'");              // Fix spacing in single quotes
  
  // Apply intermediate corrections (Level 2+)
  if (grammarLevel >= 2) {
    correctedText = correctedText
      // Fix common contractions
      .replace(/\b(dont|cant|wont|didnt|isnt|arent|wouldnt|couldnt|shouldnt|hasnt|havent|doesnt)\b/gi, 
        match => match.slice(0, -1) + "'" + match.slice(-1)) 
      // Fix pronouns with contractions
      .replace(/\byoure\b/gi, "you're")
      .replace(/\btheyre\b/gi, "they're")
      .replace(/\btheres\b/gi, "there's")
      .replace(/\bits\b/gi, "it's")
      .replace(/\bwere\b/gi, "we're")
      // Fix sentence endings
      .replace(/([^.!?:;])\s+\n\s+/g, '$1.\n')
      // Improve typography
      .replace(/ - /g, " — ")
      // Fix apostrophes
      .replace(/(\w)'(\w)/g, "$1'$2");
  }
  
  // Apply advanced corrections (Level 3+)
  if (grammarLevel >= 3) {
    correctedText = correctedText
      // Fix common grammar errors
      .replace(/\b(could of|should of|would of|must of)\b/gi, match => 
        match.replace(' of', ' have'))
      // Fix "less" vs "fewer"
      .replace(/\b(less)\s+(\w+s)\b/gi, "fewer $2")
      // Fix "amount" vs "number"
      .replace(/\b(amount)\s+of\s+(\w+s)\b/gi, "number of $2")
      // Improve formal language
      .replace(/\bas\s+such\b/gi, "therefore")
      // More concise wording
      .replace(/\bin order to\b/gi, "to")
      // Remove intensifiers for cleaner prose
      .replace(/\b(very|really|extremely)\s+(\w+)\b/gi, "$2")
      // Fix correlative conjunctions
      .replace(/\bnot only\.\.\.\s*but also\b/gi, "both...and")
      // Convert passive voice to active where detectable
      .replace(/\bis being ([a-z]+ed)\b/gi, "is $1")
      .replace(/\bwas being ([a-z]+ed)\b/gi, "was $1")
      // Fix commonly misused words
      .replace(/\b(effect)\s+change\b/gi, "affect change")
      .replace(/\b(then)\s+again\b/gi, "though")
      .replace(/\bat\s+this\s+point\s+in\s+time\b/gi, "now")
      .replace(/\bdue\s+to\s+the\s+fact\s+that\b/gi, "because")
      .replace(/\bfor\s+all\s+intents\s+and\s+purposes\b/gi, "essentially");
  }
  
  return correctedText;
};

/**
 * Detects potential spelling errors in text
 * 
 * @param text - The text to check for spelling errors
 * @returns Array of potential misspelled words with positions
 */
export const detectSpellingErrors = (text: string): Array<{word: string, index: number}> => {
  // This is a simplified implementation
  // In a real application, this would use a dictionary or spellcheck API
  const commonMisspellings: Record<string, boolean> = {
    'teh': true,
    'recieve': true,
    'seperate': true,
    'occured': true,
    'accomodate': true,
    'definately': true,
    'embarass': true,
    'gaurd': true,
    'wierd': true,
    'priviledge': true,
    'concious': true,
  };
  
  const words = text.match(/\b\w+\b/g) || [];
  const errors: Array<{word: string, index: number}> = [];
  
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    if (commonMisspellings[lowerWord]) {
      const index = text.indexOf(word);
      if (index !== -1) {
        errors.push({ word, index });
      }
    }
  });
  
  return errors;
};

/**
 * Applies suggested corrections to misspelled words
 * 
 * @param text - The original text
 * @param corrections - Array of corrections to apply
 * @returns Text with applied corrections
 */
export const applySpellingCorrections = (
  text: string, 
  corrections: Array<{original: string, correction: string, index: number}>
): string => {
  let result = text;
  
  // Sort corrections by index in reverse order to avoid offset issues
  corrections.sort((a, b) => b.index - a.index);
  
  corrections.forEach(correction => {
    const { original, correction: corrected, index } = correction;
    result = result.substring(0, index) + corrected + result.substring(index + original.length);
  });
  
  return result;
};
