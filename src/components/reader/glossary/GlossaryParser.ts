
import { GlossaryTerm, FormattedGlossary } from './GlossaryTypes';

/**
 * Parses raw glossary content text into a structured format
 * 
 * This function processes plain text content that follows a specific format:
 * - Roman numerals for main categories (I., II., etc.)
 * - Letters for subcategories (A., B., etc.)
 * - Numbers for terms (1., 2., etc.)
 * 
 * @param content - Raw glossary text content
 * @returns Structured glossary object with categories, subcategories, and terms
 */
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

/**
 * Determines if content appears to be a glossary based on formatting patterns
 * 
 * @param text - Text content to analyze
 * @returns Boolean indicating if the content resembles a glossary
 */
export const isGlossaryContent = (text: string): boolean => {
  // Look for patterns like roman numerals and numbered lists
  const containsRomanNumerals = /^[IVX]+\.\s+/m.test(text);
  const containsNumberedTerms = /^\d+\.\s+[A-Za-z]/m.test(text);
  
  return containsRomanNumerals || containsNumberedTerms;
};

/**
 * Extracts all glossary terms from chapter content for highlighting
 * 
 * @param content - Chapter HTML content to analyze
 * @param glossaryTerms - List of all available glossary terms
 * @returns Array of terms found in the content
 */
export const extractGlossaryTermsFromContent = (
  content: string,
  glossaryTerms: GlossaryTerm[]
): GlossaryTerm[] => {
  if (!content || !glossaryTerms || glossaryTerms.length === 0) {
    return [];
  }
  
  // Remove HTML tags to get plain text
  const plainContent = content.replace(/<[^>]+>/g, ' ').toLowerCase();
  
  // Find terms that appear in the content
  return glossaryTerms.filter(term => {
    // Look for whole word matches (with word boundaries)
    const termRegex = new RegExp(`\\b${term.term.toLowerCase()}\\b`, 'i');
    return termRegex.test(plainContent);
  });
};

/**
 * Creates a highlighted HTML version of the content with glossary terms marked
 * 
 * @param content - HTML content to process
 * @param termsToHighlight - Glossary terms to highlight in the content
 * @returns HTML content with glossary terms highlighted
 */
export const highlightGlossaryTerms = (
  content: string,
  termsToHighlight: GlossaryTerm[]
): string => {
  if (!content || !termsToHighlight || termsToHighlight.length === 0) {
    return content;
  }
  
  let highlightedContent = content;
  
  // Sort terms by length (longest first) to avoid nested highlights
  const sortedTerms = [...termsToHighlight].sort(
    (a, b) => b.term.length - a.term.length
  );
  
  // Process the content as HTML, only replacing text nodes
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = highlightedContent;
  
  // Function to process text nodes
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent || '';
      let textLower = text.toLowerCase();
      let outputHtml = '';
      let lastIndex = 0;
      
      // Look for each term in the text
      sortedTerms.forEach(term => {
        const termLower = term.term.toLowerCase();
        let index = textLower.indexOf(termLower, lastIndex);
        
        while (index !== -1) {
          // Check if it's a whole word
          const beforeChar = index === 0 ? ' ' : textLower.charAt(index - 1);
          const afterChar = index + termLower.length >= textLower.length 
            ? ' ' 
            : textLower.charAt(index + termLower.length);
          const isWholeWord = /\W/.test(beforeChar) && /\W/.test(afterChar);
          
          if (isWholeWord) {
            // Add text before the term
            outputHtml += text.substring(lastIndex, index);
            
            // Add highlighted term
            const actualTerm = text.substring(index, index + term.term.length);
            outputHtml += `<span class="glossary-term" data-term-id="${term.id}">${actualTerm}</span>`;
            
            lastIndex = index + term.term.length;
          }
          
          // Look for next occurrence
          index = textLower.indexOf(termLower, index + 1);
        }
      });
      
      // Add remaining text
      outputHtml += text.substring(lastIndex);
      
      // Replace the node if changes were made
      if (outputHtml !== text) {
        const tempSpan = document.createElement('span');
        tempSpan.innerHTML = outputHtml;
        
        const fragment = document.createDocumentFragment();
        while (tempSpan.firstChild) {
          fragment.appendChild(tempSpan.firstChild);
        }
        
        const parent = node.parentNode;
        if (parent) {
          parent.replaceChild(fragment, node);
          return true;
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Don't process script, style, or already processed terms
      const element = node as Element;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName) ||
          element.classList.contains('glossary-term')) {
        return false;
      }
      
      // Process child nodes
      const childNodes = [...node.childNodes];
      let modified = false;
      
      for (const child of childNodes) {
        modified = processNode(child) || modified;
      }
      
      return modified;
    }
    
    return false;
  };
  
  // Process all nodes
  processNode(tempDiv);
  
  return tempDiv.innerHTML;
};
