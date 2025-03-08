
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { toast } from 'sonner';
import { validateBook, sanitizeHtml } from '@/utils/validationUtils';

export type StorageType = 'localStorage' | 'sessionStorage';

const STORAGE_KEY = 'court-reporter-ebooks';
const TOKEN_KEY = 'court-reporter-access-token';
const STORAGE_TEST_KEY = 'court-reporter-storage-test';

export const generateAccessToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getSavedBooks = (storageType: StorageType = 'localStorage'): Book[] => {
  try {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    
    const token = storage.getItem(TOKEN_KEY);
    if (!token) {
      storage.setItem(TOKEN_KEY, generateAccessToken());
    }
    
    const saved = storage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error(`Error reading from ${storageType}:`, error);
    return [];
  }
};

export const saveBooksToStorage = (books: Book[], storageType: StorageType = 'localStorage'): boolean => {
  try {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    
    const token = storage.getItem(TOKEN_KEY);
    if (!token) {
      console.error('Unauthorized save attempt: no access token');
      return false;
    }
    
    const validatedBooks = books.map(book => {
      if (book.id === 'court-scribe-companion') return book;
      
      if (!validateBook(book)) {
        console.error('Invalid book structure:', book);
        throw new Error('Invalid book structure');
      }
      
      const sanitizedChapters = book.chapters.map(chapter => ({
        ...chapter,
        content: chapter.content ? sanitizeHtml(chapter.content) : ''
      }));
      
      return {
        ...book,
        chapters: sanitizedChapters
      };
    });
    
    storage.setItem(STORAGE_KEY, JSON.stringify(validatedBooks));
    return true;
  } catch (error) {
    console.error(`Error saving to ${storageType}:`, error);
    return false;
  }
};
