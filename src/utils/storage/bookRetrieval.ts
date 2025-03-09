
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { toast } from 'sonner';
import { handleError } from '../errorHandlingUtils';
import { 
  isLocalStorageAvailable,
  isSessionStorageAvailable,
  getFragmentedData
} from './checks';
import { TOKEN_KEY, ensureAccessToken } from './tokenUtils';
import { determineAvailableStorage, STORAGE_KEY, StorageType } from './storageHelpers';

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
    const isLocalAvailable = isLocalStorageAvailable();
    const isSessionAvailable = isSessionStorageAvailable();
    
    // Get primary storage
    const { storage: primaryStorage, type: actualType } = determineAvailableStorage(
      storageType, 
      isLocalAvailable, 
      isSessionAvailable
    );
    
    if (primaryStorage) {
      ensureAccessToken(primaryStorage);
      
      // Try standard retrieval
      const standardResult = tryStandardRetrieval(primaryStorage);
      if (standardResult) return standardResult;
      
      // Try fragmented retrieval
      const fragmentedResult = tryFragmentedRetrieval(primaryStorage);
      if (fragmentedResult) return fragmentedResult;
    }
    
    // Try fallback storage if primary storage failed
    const fallbackType = storageType === 'localStorage' ? 'sessionStorage' : 'localStorage';
    const fallbackStorage = storageType === 'localStorage' ? sessionStorage : localStorage;
    
    if ((fallbackType === 'localStorage' && isLocalAvailable) || 
        (fallbackType === 'sessionStorage' && isSessionAvailable)) {
      
      // Try standard retrieval from fallback
      const standardFallbackResult = tryStandardRetrieval(fallbackStorage, fallbackType, storageType);
      if (standardFallbackResult) return standardFallbackResult;
      
      // Try fragmented retrieval from fallback
      const fragmentedFallbackResult = tryFragmentedRetrieval(fallbackStorage, fallbackType, storageType);
      if (fragmentedFallbackResult) return fragmentedFallbackResult;
    }
  } catch (error) {
    handleError(error, 'Storage retrieval');
  }
  
  // If all attempts fail, return empty array
  return [];
};

/**
 * Tries to retrieve books using standard storage get method
 */
function tryStandardRetrieval(
  storage: Storage, 
  currentType?: StorageType, 
  originalType?: StorageType
): Book[] | null {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    if (!Array.isArray(data)) return null;
    
    // Show toast if using fallback
    if (currentType && originalType && currentType !== originalType) {
      toast.info('Using fallback storage', {
        description: `Books were loaded from ${currentType} instead of ${originalType}.`
      });
    }
    
    return data;
  } catch (e) {
    console.warn('Error parsing storage data', e);
    return null;
  }
}

/**
 * Tries to retrieve books using fragmented storage approach
 */
function tryFragmentedRetrieval(
  storage: Storage, 
  currentType?: StorageType, 
  originalType?: StorageType
): Book[] | null {
  try {
    const fragmentedData = getFragmentedData(STORAGE_KEY, storage);
    if (!fragmentedData) return null;
    
    const data = JSON.parse(fragmentedData);
    if (!Array.isArray(data)) return null;
    
    // Show toast if using fallback
    if (currentType && originalType && currentType !== originalType) {
      toast.info('Using fallback fragmented storage', {
        description: `Books were loaded from ${currentType} instead of ${originalType}.`
      });
    }
    
    return data;
  } catch (e) {
    console.error('Error parsing fragmented storage data', e);
    return null;
  }
}
