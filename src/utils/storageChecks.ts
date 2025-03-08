
const STORAGE_TEST_KEY = 'court-reporter-storage-test';

/**
 * Checks if localStorage is available and functioning
 * 
 * Tests localStorage by attempting to write, read, and remove a test value.
 * 
 * @returns Boolean indicating if localStorage is available and working
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    // Try to set and get a test item
    localStorage.setItem(STORAGE_TEST_KEY, 'test');
    const testValue = localStorage.getItem(STORAGE_TEST_KEY);
    localStorage.removeItem(STORAGE_TEST_KEY);
    return testValue === 'test';
  } catch (e) {
    return false;
  }
};

/**
 * Checks if sessionStorage is available and functioning
 * 
 * Tests sessionStorage by attempting to write, read, and remove a test value.
 * 
 * @returns Boolean indicating if sessionStorage is available and working
 */
export const isSessionStorageAvailable = (): boolean => {
  try {
    // Try to set and get a test item
    sessionStorage.setItem(STORAGE_TEST_KEY, 'test');
    const testValue = sessionStorage.getItem(STORAGE_TEST_KEY);
    sessionStorage.removeItem(STORAGE_TEST_KEY);
    return testValue === 'test';
  } catch (e) {
    return false;
  }
};

/**
 * Checks if there's enough storage space for the data to be saved
 * 
 * Estimates the size of the data and compares it against a conservative limit.
 * 
 * @param dataToSave - String data to check size against available space
 * @returns Boolean indicating if there's enough space
 */
export const hasEnoughStorageSpace = (dataToSave: string): boolean => {
  try {
    // Estimate the size of the data in bytes
    const dataSize = new Blob([dataToSave]).size;
    // Typical localStorage limit is 5-10MB, we'll be conservative and check against 4MB
    const MAX_SAFE_STORAGE = 4 * 1024 * 1024; // 4MB in bytes
    
    return dataSize < MAX_SAFE_STORAGE;
  } catch (e) {
    console.warn('Error checking storage space:', e);
    return false;
  }
}

/**
 * Fragments large data to fit within storage limits
 * 
 * @param key - Base key for the fragmented data
 * @param data - String data to fragment
 * @param storage - Storage object (localStorage or sessionStorage)
 * @returns Boolean indicating success
 */
export const saveFragmentedData = (key: string, data: string, storage: Storage): boolean => {
  try {
    // Clear any existing fragments
    for (let i = 0; i < 100; i++) {
      const fragmentKey = `${key}_fragment_${i}`;
      if (storage.getItem(fragmentKey) !== null) {
        storage.removeItem(fragmentKey);
      } else {
        break; // No more fragments
      }
    }
    
    // If data is small enough, save directly
    if (new Blob([data]).size < 2 * 1024 * 1024) { // 2MB conservative fragment size
      storage.setItem(key, data);
      return true;
    }
    
    // Split into fragments
    const chunkSize = 1024 * 1024; // 1MB chunks
    const chunks = [];
    
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.substring(i, i + chunkSize));
    }
    
    // Save fragments
    for (let i = 0; i < chunks.length; i++) {
      storage.setItem(`${key}_fragment_${i}`, chunks[i]);
    }
    
    // Save metadata
    storage.setItem(`${key}_metadata`, JSON.stringify({
      totalFragments: chunks.length,
      timestamp: Date.now()
    }));
    
    return true;
  } catch (e) {
    console.error('Error saving fragmented data:', e);
    return false;
  }
};

/**
 * Retrieves fragmented data from storage
 * 
 * @param key - Base key for the fragmented data
 * @param storage - Storage object (localStorage or sessionStorage)
 * @returns The reassembled data or null if not found
 */
export const getFragmentedData = (key: string, storage: Storage): string | null => {
  try {
    // Check if fragmented
    const metadata = storage.getItem(`${key}_metadata`);
    
    // If no metadata, try direct retrieval
    if (!metadata) {
      return storage.getItem(key);
    }
    
    // Get fragment count
    const { totalFragments } = JSON.parse(metadata);
    
    // Retrieve and reassemble fragments
    let completeData = '';
    for (let i = 0; i < totalFragments; i++) {
      const fragment = storage.getItem(`${key}_fragment_${i}`);
      if (!fragment) {
        console.error(`Missing fragment ${i} for ${key}`);
        return null;
      }
      completeData += fragment;
    }
    
    return completeData;
  } catch (e) {
    console.error('Error retrieving fragmented data:', e);
    return null;
  }
};
