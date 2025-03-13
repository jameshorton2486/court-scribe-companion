
export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author?: string;
  coverImage?: string;
  description?: string;
  language?: string;
  publicationDate?: string;
  publisher?: string;
  chapters: Chapter[];
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  chapterIndex?: number;
}
