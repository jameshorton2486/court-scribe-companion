
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
      description: 'Optimized for legal and judicial documents with precise formatting and citations.',
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
    },
    {
      id: 'technical',
      name: 'Technical Documentation',
      description: 'Optimizes technical documentation with clear explanations and consistent terminology.',
      prompt: 'Enhance this technical documentation by improving clarity, ensuring consistent terminology, adding appropriate examples, and structuring content for easy reference. Maintain technical accuracy while making concepts more accessible.'
    },
    {
      id: 'book_rewrite',
      name: 'Book Rewriting',
      description: 'Complete book restructuring, refinement and enhancement for professional publication.',
      prompt: `Refine and enhance this book by improving readability, removing redundancies, strengthening transitions, and enhancing formatting consistency. Ensure it remains engaging, well-structured, and easy to navigate for readers.

Key Improvement Areas:
- Remove Redundancies: Avoid repeating case studies and examples. Instead, reference them once and link back where necessary.
- Enhance Readability & Structure: Break up large blocks of text with subheadings, bullet points, and numbered lists.
- Standardize Formatting & Style: Ensure consistent use of formatting for examples and key terms.
- Improve Practical Applications: Add more interactive elements and examples where appropriate.
- Clarify Technical References: Ensure all citations and references are accurate and consistently formatted.

Write in a clear, engaging, and professional tone while maintaining the original voice and intent of the author.`
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
