
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { toast } from 'sonner';
import { validateBook, sanitizeHtml } from '@/utils/validationUtils';
import { handleError, debounce } from '../errorHandlingUtils';
import { 
  isLocalStorageAvailable, 
  isSessionStorageAvailable,
  hasEnoughStorageSpace,
  saveFragmentedData 
} from './checks';
import { ensureAccessToken } from './tokenUtils';
import { StorageType, STORAGE_KEY } from './storageHelpers';

/**
 * Validates and sanitizes books before saving
 */
function prepareBooks(books: Book[]): Book[] {
  return books.map(book => {
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
}

/**
 * Tries to save books to the specified storage
 */
function trySaveToStorage(books: Book[], storage: Storage, storageType: StorageType): boolean {
  try {
    ensureAccessToken(storage);
    const booksJson = JSON.stringify(books);
    
    // Use fragmentation for large data
    if (!hasEnoughStorageSpace(booksJson)) {
      console.info('Using fragmented storage due to large data size');
      const success = saveFragmentedData(STORAGE_KEY, booksJson, storage);
      
      if (success) {
        if (storageType === 'sessionStorage') {
          toast.warning("Using temporary storage", {
            description: "Your books are saved to session storage. They will be lost when you close the browser.",
            duration: 5000
          });
        }
        return true;
      }
    } else {
      // Standard save for smaller data
      storage.setItem(STORAGE_KEY, booksJson);
      
      if (storageType === 'sessionStorage') {
        toast.warning("Using temporary storage", {
          description: "Your books are saved to session storage. They will be lost when you close the browser.",
          duration: 5000
        });
      }
      
      return true;
    }
  } catch (e) {
    console.warn(`Failed to save to ${storageType}`, e);
  }
  
  return false;
}

/**
 * Tries to save books to fallback storage when primary fails
 */
function trySaveFallback(books: Book[], primaryType: StorageType): boolean {
  const fallbackType = primaryType === 'localStorage' ? 'sessionStorage' : 'localStorage';
  const fallbackStorage = fallbackType === 'localStorage' ? localStorage : sessionStorage;
  
  const isAvailable = fallbackType === 'localStorage' ? 
    isLocalStorageAvailable() : 
    isSessionStorageAvailable();
  
  if (!isAvailable) return false;
  
  const booksJson = JSON.stringify(books);
  
  try {
    // Try fragmented for large data
    if (!hasEnoughStorageSpace(booksJson)) {
      const success = saveFragmentedData(STORAGE_KEY, booksJson, fallbackStorage);
      
      if (success) {
        toast.warning(`Using ${fallbackType} with fragmentation`, {
          description: `Your book was saved to ${fallbackType} because ${primaryType} was not available.`,
          duration: 5000
        });
        return true;
      }
    } else {
      fallbackStorage.setItem(STORAGE_KEY, booksJson);
      
      toast.warning(`Using ${fallbackType}`, {
        description: `Your book was saved to ${fallbackType} because ${primaryType} was not available.`,
        duration: 5000
      });
      
      return true;
    }
  } catch (e) {
    console.error('Failed to save to fallback storage', e);
  }
  
  return false;
}

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
    // Validate and sanitize books
    const validatedBooks = prepareBooks(books);
    
    // Try requested storage type first
    const primaryStorage = storageType === 'localStorage' ? localStorage : sessionStorage;
    const primaryAvailable = storageType === 'localStorage' ? 
      isLocalStorageAvailable() : 
      isSessionStorageAvailable();
    
    if (primaryAvailable) {
      const saveSuccess = trySaveToStorage(validatedBooks, primaryStorage, storageType);
      if (saveSuccess) return true;
    }
    
    // Try fallback storage if primary failed
    const fallbackSuccess = trySaveFallback(validatedBooks, storageType);
    if (fallbackSuccess) return true;
    
    // All attempts failed
    toast.error("Storage unavailable", {
      description: "Your browser doesn't support storage features. Changes won't be saved."
    });
    
    return false;
  } catch (error) {
    handleError(error, 'Saving books');
    return false;
  }
};

// Create a debounced version for frequent saves
export const debouncedSaveBooks = debounce(saveBooksToStorage, 500);
