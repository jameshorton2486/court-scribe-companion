
/**
 * Book Types Module
 * 
 * Centralized type definitions for book-related data structures.
 */

import { Chapter } from './ChapterProcessor';
import { ChapterProcessingError } from './ErrorHandler';

/**
 * Represents a book with metadata and chapters
 */
export type Book = {
  /** Unique identifier for the book */
  id: string;
  /** Book title */
  title: string;
  /** Book author */
  author: string;
  /** Array of chapters in the book */
  chapters: Chapter[];
  /** Optional array of processing errors encountered */
  processingErrors?: ChapterProcessingError[];
};
