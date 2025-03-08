
/**
 * Applies professional formatting to book content
 * 
 * This function enhances the HTML content by adding appropriate CSS classes
 * for typography, spacing, and layout according to the specified options.
 * 
 * @param content - The HTML content to format
 * @param options - Formatting options including font family and structure settings
 * @returns Formatted HTML content with applied styling
 */
export const applyProfessionalFormatting = (
  content: string, 
  options: { 
    fontFamily: string, 
    generateTOC: boolean, 
    addChapterBreaks: boolean 
  }
): string => {
  let formattedContent = content;
  
  const fontClass = `font-${options.fontFamily}`;
  
  formattedContent = formattedContent
    .replace(/<h1/g, `<h1 class="text-4xl font-bold mb-8 mt-10 ${fontClass}"`)
    .replace(/<h2/g, `<h2 class="text-3xl font-semibold mb-6 mt-8 ${fontClass}"`)
    .replace(/<h3/g, `<h3 class="text-2xl font-medium mb-4 mt-6 ${fontClass}"`)
    .replace(/<h4/g, `<h4 class="text-xl font-medium mb-3 mt-5 ${fontClass}"`)
    .replace(/<p>/g, `<p class="mb-4 leading-relaxed ${fontClass}">`)
    .replace(/<ul>/g, `<ul class="list-disc pl-6 mb-4 ${fontClass}">`)
    .replace(/<ol>/g, `<ol class="list-decimal pl-6 mb-4 ${fontClass}">`)
    .replace(/<blockquote>/g, `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 ${fontClass}">`);
  
  if (options.generateTOC) {
    formattedContent = formattedContent
      .replace(/<h([1-3]) id="([^"]+)"([^>]*)>/g, 
        (_, level, id, attrs) => `<h${level} id="${id}"${attrs} data-toc-item="true" data-toc-level="${level}">`);
  }
  
  if (options.addChapterBreaks) {
    formattedContent = `<div class="page-break-before"></div>${formattedContent}`;
  }
  
  return formattedContent;
};
