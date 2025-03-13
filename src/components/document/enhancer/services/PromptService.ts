/**
 * Service for managing enhancement prompts
 */

/**
 * Default prompt templates for book enhancement
 */
export const getPromptTemplates = () => {
  return [
    {
      id: 'default',
      name: 'Standard Enhancement',
      description: 'Basic document enhancement focusing on grammar, clarity, and style.',
      prompt: 'Enhance this document by improving grammar, clarity, and professional style while maintaining the original meaning and content structure.'
    },
    {
      id: 'judicial',
      name: 'Judicial Writing',
      description: 'Optimize for legal and judicial documents with precise formatting and citations.',
      prompt: `Refine and enhance this document by improving readability, removing redundancies, strengthening transitions, and enhancing formatting consistency. Ensure it remains engaging, well-structured, and easy to navigate for court reporters.

Key Improvement Areas:
- Remove Redundancies: Avoid repeating case studies and streamline discussions on formatting rules.
- Enhance Readability & Structure: Break up large blocks of text with subheadings and improve section transitions.
- Standardize Formatting & Style: Ensure consistent use of formatting for examples and key terms.
- Improve Practical Applications: Add more interactive examples and checklists.
- Clarify Legal & Technical References: Ensure all legal citation styles are accurate and consistently formatted.

Write in a clear, engaging, and professional tone while maintaining proper legal formatting where applicable.`
    },
    {
      id: 'legal-publishing',
      name: 'Legal Publishing & Court Reporting',
      description: 'Comprehensive enhancement for legal publishing materials, particularly court reporting resources.',
      prompt: `You are an experienced editorial AI specializing in legal publishing, particularly for court reporting resources. Carefully review and rewrite the entire book, including front matter (title page, dedication, preface, introduction, acknowledgments, table of contents), main content (all sections and subsections), and back matter (appendices, index, disclaimers, reader surveys, resource sections).

Your Rewrite Must:

Preserve All Essential Content
- Maintain section headings, subsections, bullet points, legal examples, case studies, and essential guidelines.
- Do not omit important instructional content, but reorganize and refine where necessary for clarity and cohesion.

Enhance Readability & Professional Tone
- Use clear, engaging, and authoritative language suitable for a legal professional audience.
- Break up dense content into well-structured paragraphs, making it digestible while maintaining depth.
- Ensure technical terms are properly explained while maintaining a professional and sophisticated style.

Refine, Expand & Correct
- Improve sentence structure and logical flow for optimal comprehension.
- Expand explanations where necessary to reinforce key learning points.
- Provide additional insights into punctuation accuracy in legal transcription, reinforcing its role in judicial integrity.
- Ensure proper legal terminology, citation formatting, and adherence to industry standards.

Improve the Table of Contents & Structural Clarity
- Format the Table of Contents for easy navigation, improving visual structure and clarity.
- Ensure each section is logically sequenced, making it easy for readers to locate relevant content.

Polish the Dedication, Preface, and Introduction
- Craft an engaging, inspiring dedication that acknowledges the vital work of court reporters, stenographers, and transcriptionists.
- Ensure the preface effectively introduces the book's purpose, its importance to legal professionals, and what readers will gain.
- Structure the introduction to clearly outline the critical role of punctuation in legal transcription, emphasizing its impact on judicial fairness and accuracy.

Ensure Accuracy in Disclaimers & Legal Statements
- Verify that all legal disclaimers are correctly stated, ensuring compliance with legal and ethical standards.
- Maintain all copyright notices while making them more concise and professional if needed.

Enhance Formatting for Maximum Readability
- Use consistent heading styles, bullet points, and numbered lists where appropriate.
- Ensure clean paragraph breaks, proper indentation, and spacing for improved reading flow.
- Implement typographical refinements for better visual appeal and usability.`
    },
    {
      id: 'academic',
      name: 'Academic Paper',
      description: 'Formats text according to academic standards with proper citations and terminology.',
      prompt: 'Enhance this document following academic writing standards. Ensure proper citation format, academic terminology, clear argumentation, and maintain a formal scholarly tone throughout.'
    },
    {
      id: 'creative',
      name: 'Creative Writing',
      description: 'Enhances narrative flow, descriptive language, and character development.',
      prompt: 'Enhance this creative text by improving narrative flow, enriching descriptive language, developing characters more fully, and creating more engaging dialogue while preserving the original story and author\'s voice.'
    }
  ];
};

/**
 * Save a custom book prompt to localStorage 
 */
export const saveCustomBookPrompt = (bookTitle: string, prompt: string): void => {
  try {
    // Get existing prompts or initialize empty object
    const existingPromptsJSON = localStorage.getItem('custom_book_prompts');
    const bookPrompts = existingPromptsJSON ? JSON.parse(existingPromptsJSON) : {};
    
    // Add or update prompt for this book
    bookPrompts[bookTitle] = prompt;
    
    // Save back to localStorage
    localStorage.setItem('custom_book_prompts', JSON.stringify(bookPrompts));
    
    console.log(`Saved custom prompt for book: ${bookTitle}`);
  } catch (error) {
    console.error('Failed to save custom book prompt:', error);
  }
};

/**
 * Get custom book prompt from localStorage
 */
export const getCustomBookPrompt = (bookTitle: string): string | null => {
  try {
    const existingPromptsJSON = localStorage.getItem('custom_book_prompts');
    if (!existingPromptsJSON) return null;
    
    const bookPrompts = JSON.parse(existingPromptsJSON);
    return bookPrompts[bookTitle] || null;
  } catch (error) {
    console.error('Failed to retrieve custom book prompt:', error);
    return null;
  }
};

/**
 * Get all saved custom book prompts
 */
export const getAllCustomBookPrompts = (): Record<string, string> => {
  try {
    const existingPromptsJSON = localStorage.getItem('custom_book_prompts');
    return existingPromptsJSON ? JSON.parse(existingPromptsJSON) : {};
  } catch (error) {
    console.error('Failed to retrieve custom book prompts:', error);
    return {};
  }
};
