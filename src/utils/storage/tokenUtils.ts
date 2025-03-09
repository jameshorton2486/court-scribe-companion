
import { generateRandomString } from './storageHelpers';

const TOKEN_KEY = 'court-reporter-access-token';

/**
 * Generates a cryptographically stronger access token for storage authorization
 * 
 * @returns Random string token
 */
export const generateAccessToken = (): string => {
  return generateRandomString(16);
};

/**
 * Retrieves the access token from storage
 * 
 * @param storage - The storage object to retrieve from
 * @returns The token or null if not found
 */
export const getAccessToken = (storage: Storage): string | null => {
  return storage.getItem(TOKEN_KEY);
};

/**
 * Ensures a valid access token exists in storage
 * 
 * @param storage - The storage object to check
 */
export const ensureAccessToken = (storage: Storage): void => {
  const token = getAccessToken(storage);
  if (!token) {
    storage.setItem(TOKEN_KEY, generateAccessToken());
  }
};

export { TOKEN_KEY };
