
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
