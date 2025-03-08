
import { Book } from '@/components/ebook-uploader/EbookUploader';

interface BookValidationSchema {
  id: string;
  title: string;
  chapters: { id: string; title: string; content: string }[];
}

export const validateBook = (book: any): boolean => {
  if (!book || typeof book !== 'object') return false;
  if (typeof book.id !== 'string' || !book.id) return false;
  if (typeof book.title !== 'string' || !book.title) return false;
  
  if (!Array.isArray(book.chapters)) return false;
  
  for (const chapter of book.chapters) {
    if (!chapter || typeof chapter !== 'object') return false;
    if (typeof chapter.id !== 'string' || !chapter.id) return false;
    if (typeof chapter.title !== 'string') return false;
    
    if (chapter.content && typeof chapter.content !== 'string') return false;
  }
  
  return true;
};

export const sanitizeHtml = (html: string): string => {
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  return sanitized;
};
