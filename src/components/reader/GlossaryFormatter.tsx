
import React, { useEffect, useState } from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  subcategory?: string;
  citation?: string;
}

interface GlossaryCategory {
  name: string;
  subcategories?: { [key: string]: GlossaryTerm[] };
  terms: GlossaryTerm[];
}

interface FormattedGlossary {
  [category: string]: GlossaryCategory;
}

export function formatGlossaryContent(content: string): string {
  // Parse the content to identify glossary terms
  try {
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
    
    // Generate HTML from the structured data
    let html = '<div class="glossary-container">';
    
    // Convert the formatted glossary to HTML with accordions
    Object.values(formattedGlossary).forEach(category => {
      html += `<div class="glossary-category">
        <h2 class="text-2xl font-bold mt-6 mb-3">${category.name}</h2>`;
      
      // Add terms without subcategories
      if (category.terms.length > 0) {
        html += '<div class="space-y-4">';
        category.terms.forEach(term => {
          html += `
            <div class="glossary-term p-4 rounded-md border">
              <h3 class="text-xl font-semibold flex items-center">
                ${term.term}
                ${term.citation ? `<span class="ml-2 text-sm text-muted-foreground">[${term.citation}]</span>` : ''}
              </h3>
              <p class="mt-1 text-muted-foreground">${term.definition}</p>
            </div>`;
        });
        html += '</div>';
      }
      
      // Add subcategories if any
      if (category.subcategories && Object.keys(category.subcategories).length > 0) {
        Object.entries(category.subcategories).forEach(([subcategoryName, terms]) => {
          html += `<div class="glossary-subcategory mt-4">
            <h3 class="text-xl font-medium mb-3">${subcategoryName}</h3>
            <div class="space-y-4">`;
            
          terms.forEach(term => {
            html += `
              <div class="glossary-term p-4 rounded-md border">
                <h3 class="text-xl font-semibold flex items-center">
                  ${term.term}
                  ${term.citation ? `<span class="ml-2 text-sm text-muted-foreground">[${term.citation}]</span>` : ''}
                </h3>
                <p class="mt-1 text-muted-foreground">${term.definition}</p>
              </div>`;
          });
          
          html += '</div></div>';
        });
      }
      
      html += '</div>';
    });
    
    html += '</div>';
    return html;
  } catch (error) {
    console.error('Error formatting glossary:', error);
    return content; // Return original content if parsing fails
  }
}

interface GlossaryFormatterProps {
  content: string;
}

const GlossaryFormatter: React.FC<GlossaryFormatterProps> = ({ content }) => {
  const [formattedContent, setFormattedContent] = useState('');
  
  useEffect(() => {
    if (content && isGlossaryContent(content)) {
      setFormattedContent(formatGlossaryContent(content));
    } else {
      setFormattedContent(content);
    }
  }, [content]);
  
  // Check if content appears to be a glossary
  const isGlossaryContent = (text: string): boolean => {
    // Look for patterns like roman numerals and numbered lists
    const containsRomanNumerals = /^[IVX]+\.\s+/m.test(text);
    const containsNumberedTerms = /^\d+\.\s+[A-Za-z]/m.test(text);
    
    return containsRomanNumerals || containsNumberedTerms;
  };
  
  return (
    <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
  );
};

export default GlossaryFormatter;
