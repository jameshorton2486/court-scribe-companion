
import { Book, Chapter } from '@/components/ebook-uploader/BookProcessor';
import { ChapterProcessingError } from '@/components/ebook-uploader/processors/ErrorHandler';

/**
 * Configuration options for book content enhancement
 */
export interface EnhancementOptions {
  // Grammar options
  /** Enable grammar checking and correction */
  enableGrammarCheck: boolean;
  /** Level of grammar correction (1-5, where 5 is most aggressive) */
  grammarLevel: number;
  /** Enable spelling checking and correction */
  enableSpellingCheck: boolean;
  
  // Content options
  /** Enable expansion of existing content */
  enableContentExpansion: boolean;
  /** Level of content expansion (1-5, where 5 adds most content) */
  expansionLevel: number;
  /** Target writing style for content enhancement */
  writingStyle: string;
  /** Improve clarity of existing content */
  improveClarity: boolean;
  
  // Formatting options
  /** Apply professional formatting to content */
  enableProfessionalFormatting: boolean;
  /** Font family to use for formatted content */
  fontFamily: string;
  /** Generate table of contents markers */
  generateTOC: boolean;
  /** Add chapter breaks in content */
  addChapterBreaks: boolean;
}

/**
 * Result of content enhancement process
 */
export interface EnhancementResult {
  /** Enhanced content text */
  content: string;
  /** Warnings generated during enhancement */
  warnings?: string[];
  /** Errors encountered during enhancement */
  errors?: ChapterProcessingError[];
  /** Time taken to process content in milliseconds */
  processingTime?: number;
}
