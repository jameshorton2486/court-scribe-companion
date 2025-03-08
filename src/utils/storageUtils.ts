
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { toast } from 'sonner';
import { validateBook, sanitizeHtml } from '@/utils/validationUtils';
import { isLocalStorageAvailable, isSessionStorageAvailable, hasEnoughStorageSpace } from './storageChecks';
import { handleError } from './errorHandlingUtils';

/**
 * Types of browser storage that can be used
 */
export type StorageType = 'localStorage' | 'sessionStorage';

// Storage keys
const STORAGE_KEY = 'court-reporter-ebooks';
const TOKEN_KEY = 'court-reporter-access-token';
const STORAGE_TEST_KEY = 'court-reporter-storage-test';

/**
 * Generates a unique access token for storage authorization
 * 
 * @returns Random string token
 */
export const generateAccessToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Retrieves saved books from browser storage
 * 
 * This function first tries to retrieve books from the primary requested storage.
 * If that fails, it attempts to retrieve from the alternative storage as a fallback.
 * 
 * @param storageType - Which storage type to use (localStorage or sessionStorage)
 * @returns Array of saved book objects
 */
export const getSavedBooks = (storageType: StorageType = 'localStorage'): Book[] => {
  try {
    // Try primary requested storage first
    const primaryStorage = storageType === 'localStorage' ? localStorage : sessionStorage;
    
    if ((storageType === 'localStorage' && isLocalStorageAvailable()) || 
        (storageType === 'sessionStorage' && isSessionStorageAvailable())) {
      
      const token = primaryStorage.getItem(TOKEN_KEY);
      if (!token) {
        primaryStorage.setItem(TOKEN_KEY, generateAccessToken());
      }
      
      const saved = primaryStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
    
    // If requested storage fails, try the other one as fallback
    const fallbackType = storageType === 'localStorage' ? 'sessionStorage' : 'localStorage';
    const fallbackStorage = storageType === 'localStorage' ? sessionStorage : localStorage;
    
    if ((fallbackType === 'localStorage' && isLocalStorageAvailable()) || 
        (fallbackType === 'sessionStorage' && isSessionStorageAvailable())) {
      
      const saved = fallbackStorage.getItem(STORAGE_KEY);
      if (saved) {
        toast.info('Using fallback storage', {
          description: `Books were loaded from ${fallbackType} instead of ${storageType}.`
        });
        return JSON.parse(saved);
      }
    }
  } catch (error) {
    handleError(error, 'Storage retrieval');
  }
  
  // If all attempts fail, return empty array
  return [];
};

/**
 * Saves books to browser storage with validation and sanitization
 * 
 * This function attempts to save to the requested storage type first.
 * If that fails, it will try the alternative storage as a fallback.
 * 
 * @param books - Array of book objects to save
 * @param storageType - Which storage type to use (localStorage or sessionStorage)
 * @returns Boolean indicating success or failure
 */
export const saveBooksToStorage = (books: Book[], storageType: StorageType = 'localStorage'): boolean => {
  try {
    // Validate books before saving
    const validatedBooks = books.map(book => {
      if (book.id === 'court-scribe-companion') return book;
      
      if (!validateBook(book)) {
        throw new Error(`Invalid book structure: ${book.title || 'Untitled'}`);
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
    
    const booksJson = JSON.stringify(validatedBooks);
    
    // Try requested storage type first
    const primaryStorage = storageType === 'localStorage' ? localStorage : sessionStorage;
    const token = primaryStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      primaryStorage.setItem(TOKEN_KEY, generateAccessToken());
    }
    
    if ((storageType === 'localStorage' && isLocalStorageAvailable()) || 
        (storageType === 'sessionStorage' && isSessionStorageAvailable())) {
      
      // If localStorage, check space
      if (storageType === 'localStorage' && !hasEnoughStorageSpace(booksJson)) {
        console.warn('Not enough localStorage space, will try sessionStorage');
      } else {
        primaryStorage.setItem(STORAGE_KEY, booksJson);
        
        if (storageType === 'sessionStorage') {
          toast.warning("Using temporary storage", {
            description: "Your books are saved to session storage. They will be lost when you close the browser.",
            duration: 5000
          });
        }
        
        return true;
      }
    }
    
    // Try fallback storage if primary failed
    const fallbackType = storageType === 'localStorage' ? 'sessionStorage' : 'localStorage';
    const fallbackStorage = fallbackType === 'localStorage' ? localStorage : sessionStorage;
    
    if ((fallbackType === 'localStorage' && isLocalStorageAvailable()) || 
        (fallbackType === 'sessionStorage' && isSessionStorageAvailable())) {
      
      fallbackStorage.setItem(STORAGE_KEY, booksJson);
      
      toast.warning(`Using ${fallbackType}`, {
        description: `Your book was saved to ${fallbackType} because ${storageType} was not available.`,
        duration: 5000
      });
      
      return true;
    }
    
    // All attempts failed
    toast.error("Storage unavailable", {
      description: "Your browser doesn't support storage features. Changes won't be saved."
    });
    
    return false;
  } catch (error) {
    handleError(error, 'Saving books', true);
    return false;
  }
};

/**
 * Removes bookStorage.ts as its functionality is now consolidated here
 * This ensures no duplication of code across the codebase
 */
