
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { toast } from 'sonner';
import { validateBook, sanitizeHtml } from '@/utils/validationUtils';
import { 
  isLocalStorageAvailable, 
  isSessionStorageAvailable, 
  hasEnoughStorageSpace,
  saveFragmentedData,
  getFragmentedData
} from './storageChecks';
import { handleError, ErrorCode, debounce } from './errorHandlingUtils';

/**
 * Types of browser storage that can be used
 */
export type StorageType = 'localStorage' | 'sessionStorage';

// Storage keys
const STORAGE_KEY = 'court-reporter-ebooks';
const TOKEN_KEY = 'court-reporter-access-token';
const STORAGE_TEST_KEY = 'court-reporter-storage-test';
const STORAGE_VERSION = '1.0.0'; // For future compatibility

/**
 * Generates a cryptographically stronger access token for storage authorization
 * 
 * @returns Random string token
 */
export const generateAccessToken = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
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
      
      // Try to load normally first
      const saved = primaryStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          return Array.isArray(data) ? data : [];
        } catch (e) {
          console.warn('Error parsing storage data, trying fragmented data', e);
        }
      }
      
      // Try loading fragmented data
      const fragmentedData = getFragmentedData(STORAGE_KEY, primaryStorage);
      if (fragmentedData) {
        try {
          const data = JSON.parse(fragmentedData);
          return Array.isArray(data) ? data : [];
        } catch (e) {
          console.error('Error parsing fragmented storage data', e);
        }
      }
    }
    
    // If requested storage fails, try the other one as fallback
    const fallbackType = storageType === 'localStorage' ? 'sessionStorage' : 'localStorage';
    const fallbackStorage = storageType === 'localStorage' ? sessionStorage : localStorage;
    
    if ((fallbackType === 'localStorage' && isLocalStorageAvailable()) || 
        (fallbackType === 'sessionStorage' && isSessionStorageAvailable())) {
      
      // Try to load normally first
      const saved = fallbackStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (Array.isArray(data)) {
            toast.info('Using fallback storage', {
              description: `Books were loaded from ${fallbackType} instead of ${storageType}.`
            });
            return data;
          }
        } catch (e) {
          console.warn('Error parsing fallback storage data', e);
        }
      }
      
      // Try loading fragmented data
      const fragmentedData = getFragmentedData(STORAGE_KEY, fallbackStorage);
      if (fragmentedData) {
        try {
          const data = JSON.parse(fragmentedData);
          if (Array.isArray(data)) {
            toast.info('Using fallback fragmented storage', {
              description: `Books were loaded from ${fallbackType} instead of ${storageType}.`
            });
            return data;
          }
        } catch (e) {
          console.error('Error parsing fallback fragmented storage data', e);
        }
      }
    }
  } catch (error) {
    handleError(error, 'Storage retrieval', true);
  }
  
  // If all attempts fail, return empty array
  return [];
};

/**
 * Saves books to browser storage with validation and sanitization
 * 
 * This function attempts to save to the requested storage type first.
 * If that fails, it will try the alternative storage as a fallback.
 * For large data, it will use fragmentation to work around storage limits.
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
      
      try {
        // If data is too large, use fragmentation
        if (!hasEnoughStorageSpace(booksJson)) {
          console.info('Using fragmented storage due to large data size');
          const success = saveFragmentedData(STORAGE_KEY, booksJson, primaryStorage);
          
          if (success) {
            if (storageType === 'sessionStorage') {
              toast.warning("Using temporary storage", {
                description: "Your books are saved to session storage. They will be lost when you close the browser.",
                duration: 5000
              });
            }
            return true;
          } else {
            throw new Error('Failed to save fragmented data');
          }
        } else {
          // Normal save for smaller data
          primaryStorage.setItem(STORAGE_KEY, booksJson);
          
          if (storageType === 'sessionStorage') {
            toast.warning("Using temporary storage", {
              description: "Your books are saved to session storage. They will be lost when you close the browser.",
              duration: 5000
            });
          }
          
          return true;
        }
      } catch (e) {
        console.warn(`Failed to save to ${storageType}, will try fallback`, e);
      }
    }
    
    // Try fallback storage if primary failed
    const fallbackType = storageType === 'localStorage' ? 'sessionStorage' : 'localStorage';
    const fallbackStorage = fallbackType === 'localStorage' ? localStorage : sessionStorage;
    
    if ((fallbackType === 'localStorage' && isLocalStorageAvailable()) || 
        (fallbackType === 'sessionStorage' && isSessionStorageAvailable())) {
      
      try {
        // Try fragmented for large data
        if (!hasEnoughStorageSpace(booksJson)) {
          const success = saveFragmentedData(STORAGE_KEY, booksJson, fallbackStorage);
          
          if (success) {
            toast.warning(`Using ${fallbackType} with fragmentation`, {
              description: `Your book was saved to ${fallbackType} because ${storageType} was not available.`,
              duration: 5000
            });
            return true;
          }
        } else {
          fallbackStorage.setItem(STORAGE_KEY, booksJson);
          
          toast.warning(`Using ${fallbackType}`, {
            description: `Your book was saved to ${fallbackType} because ${storageType} was not available.`,
            duration: 5000
          });
          
          return true;
        }
      } catch (e) {
        console.error('Failed to save to fallback storage', e);
      }
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

// Create a debounced version for frequent saves
export const debouncedSaveBooks = debounce(saveBooksToStorage, 500);
