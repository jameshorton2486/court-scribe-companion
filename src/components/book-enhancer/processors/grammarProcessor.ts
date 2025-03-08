
export const applyGrammarCorrections = (text: string, grammarLevel: number): string => {
  let correctedText = text
    .replace(/\s\s+/g, ' ')                          // Fix multiple spaces
    .replace(/\bi\b/g, 'I')                          // Capitalize "i"
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
  
  if (grammarLevel >= 2) {
    correctedText = correctedText
      .replace(/\b(dont|cant|wont|didnt|isnt|arent|wouldnt|couldnt|shouldnt|hasnt|havent|doesnt)\b/gi, 
        match => match.slice(0, -1) + "'" + match.slice(-1)) // Add apostrophes
      .replace(/\byou're\b/gi, "you're")
      .replace(/\bthey're\b/gi, "they're")
      .replace(/\bthere's\b/gi, "there's")
      .replace(/\bit's\b/gi, "it's")
      .replace(/\bwe're\b/gi, "we're")
      .replace(/([^.!?:;])\s+\n\s+/g, '$1.\n')       // Add periods before line breaks if missing
      .replace(/ - /g, " — ")                         // Convert hyphens to em dashes
      .replace(/(\w)'(\w)/g, "$1'$2");               // Fix apostrophes in contractions
  }
  
  if (grammarLevel >= 3) {
    correctedText = correctedText
      .replace(/\b(could of|should of|would of|must of)\b/gi, match => 
        match.replace(' of', ' have'))                // Fix "could of" to "could have"
      .replace(/\b(less)\s+(\w+s)\b/gi, "fewer $2")   // "less books" to "fewer books"
      .replace(/\b(amount)\s+of\s+(\w+s)\b/gi, "number of $2") // "amount of people" to "number of people"
      .replace(/\bas\s+such\b/gi, "therefore")        // Improve formal language
      .replace(/\bin order to\b/gi, "to")             // More concise
      .replace(/\b(very|really|extremely)\s+(\w+)\b/gi, "$2") // Remove intensifiers for cleaner prose
      .replace(/\bnot only\.\.\.\s*but also\b/gi, "both...and"); // Fix correlative conjunctions
  }
  
  return correctedText;
};
