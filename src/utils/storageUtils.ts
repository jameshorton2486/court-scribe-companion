
// This file serves as a compatibility layer for the refactored storage utilities
// All functionality has been moved to src/utils/storage directory

// Re-export everything from the new module structure
import {
  generateRandomString,
  determineAvailableStorage,
  isLocalStorageAvailable,
  isSessionStorageAvailable,
  hasEnoughStorageSpace,
  saveFragmentedData,
  getFragmentedData,
  getSavedBooks,
  saveBooksToStorage,
  debouncedSaveBooks,
  generateAccessToken,
  getAccessToken,
  ensureAccessToken,
  TOKEN_KEY
} from './storage';

// Export core functionality
export {
  generateRandomString,
  determineAvailableStorage,
  isLocalStorageAvailable,
  isSessionStorageAvailable,
  hasEnoughStorageSpace,
  saveFragmentedData,
  getFragmentedData,
  getSavedBooks,
  saveBooksToStorage,
  debouncedSaveBooks,
  generateAccessToken,
  getAccessToken,
  ensureAccessToken,
  TOKEN_KEY
};

// For type exports, we need to use 'export type' with isolatedModules enabled
export type { StorageType } from './storage';

// Export constants
export { STORAGE_KEY, STORAGE_VERSION } from './storage';
