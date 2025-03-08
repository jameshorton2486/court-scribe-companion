
import { GlossaryTerm, FormattedGlossary } from './GlossaryTypes';

export function parseGlossaryContent(content: string): FormattedGlossary {
  const lines = content.split('\n');
  const formattedGlossary: FormattedGlossary = {};
  let currentCategory = '';
  let currentSubcategory = '';
  
  // First pass: Extract categories, subcategories, terms and definitions
  const glossaryTerms: GlossaryTerm[] = [];
  let termId = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Roman numeral pattern for main categories (e.g., "I. Core Criminal Concepts")
    const categoryMatch = line.match(/^([IVX]+)\.\s+(.*)/);
    if (categoryMatch) {
      currentCategory = categoryMatch[2];
      currentSubcategory = '';
      // Initialize category if it doesn't exist
      if (!formattedGlossary[currentCategory]) {
        formattedGlossary[currentCategory] = {
          name: currentCategory,
          terms: [],
          subcategories: {}
        };
      }
      continue;
    }
    
    // Subcategory patterns (e.g., "A. Violent Crimes")
    const subcategoryMatch = line.match(/^([A-Z])\.\s+(.*)/);
    if (subcategoryMatch) {
      currentSubcategory = subcategoryMatch[2];
      continue;
    }
    
    // Term patterns (e.g., "1. Actus Reus")
    const termMatch = line.match(/^(\d+)\.\s+(.*?)(\d+)?$/);
    if (termMatch) {
      const term = termMatch[2].split(/\d+$/)[0].trim(); // Remove trailing numbers if any
      
      // Get definition from next line
      let definition = '';
      if (i + 1 < lines.length) {
        definition = lines[i + 1].trim();
      }
      
      // Extract citation if available
      const citationMatch = termMatch[2].match(/(\d+)$/);
      const citation = citationMatch ? citationMatch[1] : undefined;
      
      glossaryTerms.push({
        id: `term-${termId++}`,
        term,
        definition,
        category: currentCategory,
        subcategory: currentSubcategory || undefined,
        citation
      });
      
      continue;
    }
  }
  
  // Second pass: Organize terms into categories and subcategories
  glossaryTerms.forEach(term => {
    if (!formattedGlossary[term.category]) {
      formattedGlossary[term.category] = {
        name: term.category,
        terms: [],
        subcategories: {}
      };
    }
    
    if (term.subcategory) {
      if (!formattedGlossary[term.category].subcategories) {
        formattedGlossary[term.category].subcategories = {};
      }
      
      if (!formattedGlossary[term.category].subcategories![term.subcategory]) {
        formattedGlossary[term.category].subcategories![term.subcategory] = [];
      }
      
      formattedGlossary[term.category].subcategories![term.subcategory].push(term);
    } else {
      formattedGlossary[term.category].terms.push(term);
    }
  });
  
  return formattedGlossary;
}

// Check if content appears to be a glossary
export const isGlossaryContent = (text: string): boolean => {
  // Look for patterns like roman numerals and numbered lists
  const containsRomanNumerals = /^[IVX]+\.\s+/m.test(text);
  const containsNumberedTerms = /^\d+\.\s+[A-Za-z]/m.test(text);
  
  return containsRomanNumerals || containsNumberedTerms;
};
