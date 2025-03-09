
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

export { STORAGE_TEST_KEY };
