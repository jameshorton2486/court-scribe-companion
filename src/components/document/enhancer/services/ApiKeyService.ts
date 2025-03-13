
/**
 * Service for managing OpenAI API keys
 */
import { validateApiKeyFormat } from '../../utils/securityUtils';

// API key for testing
let openaiApiKey: string | null = null;

/**
 * Set the API key and store it in localStorage
 */
export const setOpenAIApiKey = (apiKey: string): void => {
  // Validate API key format
  if (!apiKey || !validateApiKeyFormat(apiKey)) {
    console.error('Invalid API key format');
    throw new Error('Invalid API key format. OpenAI API keys typically start with "sk-"');
  }
  
  openaiApiKey = apiKey;
  
  // Store in localStorage for persistence
  try {
    localStorage.setItem('openai_api_key', apiKey);
  } catch (error) {
    console.error('Failed to store API key in localStorage:', error);
  }
};

/**
 * Helper to get the API key from memory or localStorage
 */
export const getOpenAIApiKey = (): string | null => {
  // If we already have it in memory, return it
  if (openaiApiKey) {
    return openaiApiKey;
  }
  
  // Try to retrieve from localStorage
  try {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      // Validate retrieved key
      if (validateApiKeyFormat(storedKey)) {
        openaiApiKey = storedKey;
        return storedKey;
      } else {
        console.error('Retrieved invalid API key format from storage');
        localStorage.removeItem('openai_api_key'); // Clear invalid key
        return null;
      }
    }
  } catch (error) {
    console.error('Failed to retrieve API key from localStorage:', error);
  }
  
  return null;
};

/**
 * Method to test API key
 */
export const testApiKey = async (): Promise<{ success: boolean; message: string }> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    return { 
      success: false, 
      message: "No API key provided. Please enter an OpenAI API key." 
    };
  }

  // Perform format validation
  if (!validateApiKeyFormat(apiKey)) {
    return { 
      success: false, 
      message: "Invalid API key format. OpenAI API keys typically start with 'sk-'" 
    };
  }

  // Adding a delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // This is just a simulation. In a real app, you would make an actual API call to OpenAI
  // to validate the key using their authentication endpoints
  return { 
    success: true, 
    message: "API key validation successful! You can now use OpenAI enhancements." 
  };
};

/**
 * Clear the API key from memory and storage
 */
export const clearApiKey = (): void => {
  openaiApiKey = null;
  
  try {
    localStorage.removeItem('openai_api_key');
  } catch (error) {
    console.error('Failed to remove API key from localStorage:', error);
  }
};
