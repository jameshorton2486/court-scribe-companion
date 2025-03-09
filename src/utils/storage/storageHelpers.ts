
/**
 * Generates a random string of specified byte length
 * 
 * @param byteLength - Number of bytes for the random string
 * @returns Random hexadecimal string
 */
export const generateRandomString = (byteLength: number): string => {
  const array = new Uint8Array(byteLength);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Determines which storage is available based on the requested type
 * 
 * @param requestedType - Preferred storage type
 * @param isLocalAvailable - Is localStorage available
 * @param isSessionAvailable - Is sessionStorage available
 * @returns Object with storage object and type
 */
export const determineAvailableStorage = (
  requestedType: StorageType,
  isLocalAvailable: boolean,
  isSessionAvailable: boolean
): { storage: Storage | null, type: StorageType } => {
  // Try primary requested storage first
  if (
    (requestedType === 'localStorage' && isLocalAvailable) || 
    (requestedType === 'sessionStorage' && isSessionAvailable)
  ) {
    const storage = requestedType === 'localStorage' ? localStorage : sessionStorage;
    return { storage, type: requestedType };
  }
  
  // Try fallback storage
  const fallbackType = requestedType === 'localStorage' ? 'sessionStorage' : 'localStorage';
  if (
    (fallbackType === 'localStorage' && isLocalAvailable) || 
    (fallbackType === 'sessionStorage' && isSessionAvailable)
  ) {
    const storage = fallbackType === 'localStorage' ? localStorage : sessionStorage;
    return { storage, type: fallbackType };
  }
  
  // No storage available
  return { storage: null, type: requestedType };
};

// Re-export from storage checks for ease of use
export { 
  isLocalStorageAvailable, 
  isSessionStorageAvailable,
  hasEnoughStorageSpace,
  saveFragmentedData,
  getFragmentedData
} from './checks';

// Export storage types
export type StorageType = 'localStorage' | 'sessionStorage';
export const STORAGE_KEY = 'court-reporter-ebooks';
export const STORAGE_VERSION = '1.0.0'; // For future compatibility
