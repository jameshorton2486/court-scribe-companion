
const STORAGE_TEST_KEY = 'court-reporter-storage-test';

/**
 * Check if localStorage is available
 * @returns boolean indicating if localStorage is available and working
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
 * Check if sessionStorage is available
 * @returns boolean indicating if sessionStorage is available and working
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
 * Check if there's enough storage space
 * @param dataToSave Data to check size against available space
 * @returns boolean indicating if there's enough space
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
