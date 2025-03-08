
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  subcategory?: string;
  citation?: string;
}

export interface GlossaryCategory {
  name: string;
  subcategories?: { [key: string]: GlossaryTerm[] };
  terms: GlossaryTerm[];
}

export interface FormattedGlossary {
  [category: string]: GlossaryCategory;
}
