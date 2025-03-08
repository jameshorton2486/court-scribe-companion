
import { FormattedGlossary } from './GlossaryTypes';

export function renderGlossaryToHtml(glossary: FormattedGlossary): string {
  let html = '<div class="glossary-container">';
  
  // Convert the formatted glossary to HTML with accordions
  Object.values(glossary).forEach(category => {
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
}
