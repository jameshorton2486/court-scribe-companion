
// This file is now just a proxy to maintain backward compatibility
// Ideally, imports should be updated to use the new structure directly

import { 
  STORAGE_KEY,
  STORAGE_VERSION,
  StorageType,
  generateAccessToken,
  getSavedBooks,
  saveBooksToStorage,
  debouncedSaveBooks
} from './storage';

export {
  STORAGE_KEY,
  STORAGE_VERSION,
  StorageType,
  generateAccessToken,
  getSavedBooks,
  saveBooksToStorage,
  debouncedSaveBooks
};
