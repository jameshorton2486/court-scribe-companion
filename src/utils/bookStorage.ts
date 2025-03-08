
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { toast } from 'sonner';
import { isLocalStorageAvailable, isSessionStorageAvailable, hasEnoughStorageSpace } from './storageChecks';

const STORAGE_KEY = 'court-reporter-ebooks';

// Get books from specified storage
export const getSavedBooks = (storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): Book[] => {
  // Try primary requested storage first
  const primaryStorage = storageType === 'localStorage' ? localStorage : sessionStorage;
  
  try {
    if ((storageType === 'localStorage' && isLocalStorageAvailable()) || 
        (storageType === 'sessionStorage' && isSessionStorageAvailable())) {
      const saved = primaryStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (e) {
    console.error(`Error parsing saved books from ${storageType}:`, e);
  }
  
  // If requested storage fails, try the other one as fallback
  const fallbackStorage = storageType === 'localStorage' ? sessionStorage : localStorage;
  const fallbackType = storageType === 'localStorage' ? 'sessionStorage' : 'localStorage';
  
  try {
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
  } catch (e) {
    console.error(`Error parsing saved books from fallback ${fallbackType}:`, e);
  }
  
  // If all attempts fail, return empty array
  return [];
};

export const saveBooksToStorage = (books: Book[], storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): boolean => {
  const booksJson = JSON.stringify(books);
  
  // Try requested storage type first
  if ((storageType === 'localStorage' && isLocalStorageAvailable()) || 
      (storageType === 'sessionStorage' && isSessionStorageAvailable())) {
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
      
      // If localStorage, check space
      if (storageType === 'localStorage' && !hasEnoughStorageSpace(booksJson)) {
        console.warn('Not enough localStorage space, will try sessionStorage');
      } else {
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
      console.error(`Error saving to ${storageType}:`, e);
    }
  }
  
  // Try fallback storage if primary failed
  const fallbackType = storageType === 'localStorage' ? 'sessionStorage' : 'localStorage';
  
  if ((fallbackType === 'localStorage' && isLocalStorageAvailable()) || 
      (fallbackType === 'sessionStorage' && isSessionStorageAvailable())) {
    try {
      const fallbackStorage = fallbackType === 'localStorage' ? localStorage : sessionStorage;
      fallbackStorage.setItem(STORAGE_KEY, booksJson);
      
      toast.warning(`Using ${fallbackType}`, {
        description: `Your book was saved to ${fallbackType} because ${storageType} was not available.`,
        duration: 5000
      });
      return true;
    } catch (e) {
      console.error(`Error saving to fallback ${fallbackType}:`, e);
    }
  }
  
  // All attempts failed
  toast.error("Storage unavailable", {
    description: "Your browser doesn't support storage features. Changes won't be saved."
  });
  return false;
};
