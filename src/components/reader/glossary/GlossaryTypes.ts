
/**
 * Represents a single term in the glossary
 */
export interface GlossaryTerm {
  /** Unique identifier for the term */
  id: string;
  /** The term or phrase being defined */
  term: string;
  /** Definition or explanation of the term */
  definition: string;
  /** Optional legal citation or reference */
  citation?: string;
  /** Main category the term belongs to */
  category: string;
  /** Optional subcategory for more specific classification */
  subcategory?: string;
}

/**
 * Represents a category with its terms and subcategories
 */
export interface GlossaryCategory {
  /** Display name of the category */
  name: string;
  /** Terms directly under this category (not in a subcategory) */
  terms: GlossaryTerm[];
  /** Map of subcategory names to arrays of terms */
  subcategories?: Record<string, GlossaryTerm[]>;
}

/**
 * Complete glossary structure with organized categories and terms
 */
export interface FormattedGlossary {
  /** Map of category names to category objects */
  [category: string]: GlossaryCategory;
}
