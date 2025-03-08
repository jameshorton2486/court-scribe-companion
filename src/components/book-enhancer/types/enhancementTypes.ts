
import { Book, Chapter } from '@/components/ebook-uploader/BookProcessor';
import { ChapterProcessingError } from '@/components/ebook-uploader/processors/ErrorHandler';

export interface EnhancementOptions {
  // Grammar options
  enableGrammarCheck: boolean;
  grammarLevel: number;
  enableSpellingCheck: boolean;
  
  // Content options
  enableContentExpansion: boolean;
  expansionLevel: number;
  writingStyle: string;
  improveClarity: boolean;
  
  // Formatting options
  enableProfessionalFormatting: boolean;
  fontFamily: string;
  generateTOC: boolean;
  addChapterBreaks: boolean;
}

export interface EnhancementResult {
  content: string;
  warnings?: string[];
  errors?: ChapterProcessingError[];
  processingTime?: number;
}
