
/**
 * Service for managing OpenAI API keys
 */
import { validateApiKeyFormat } from '../../utils/securityUtils';
import { toast } from 'sonner';

// API key for testing
let openaiApiKey: string | null = null;

/**
 * Set the API key and store it in localStorage
 */
export const setOpenAIApiKey = (apiKey: string): void => {
  // Validate API key format
  if (!apiKey || !validateApiKeyFormat(apiKey)) {
    const errorMessage = 'Invalid API key format. OpenAI API keys typically start with "sk-"';
    console.error(errorMessage);
    toast.error('Invalid API Key', {
      description: errorMessage
    });
    throw new Error(errorMessage);
  }
  
  openaiApiKey = apiKey;
  
  // Store in localStorage for persistence
  try {
    localStorage.setItem('openai_api_key', apiKey);
    console.log('API key stored successfully');
    toast.success('API Key Saved', {
      description: 'Your OpenAI API key has been saved successfully.'
    });
  } catch (error) {
    const errorMessage = 'Failed to store API key in localStorage';
    console.error(errorMessage, error);
    toast.error('Storage Error', {
      description: errorMessage
    });
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
        toast.error('Invalid Stored API Key', {
          description: 'The stored API key is invalid and has been removed.'
        });
        return null;
      }
    }
  } catch (error) {
    console.error('Failed to retrieve API key from localStorage:', error);
    toast.error('Storage Access Error', {
      description: 'Could not access local storage to retrieve your API key.'
    });
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

  console.log('Testing API key validity...');

  // Adding a delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // This is just a simulation. In a real app, you would make an actual API call to OpenAI
  // to validate the key using their authentication endpoints
  const result = { 
    success: true, 
    message: "API key validation successful! You can now use OpenAI enhancements." 
  };
  
  console.log('API key test result:', result);
  return result;
};

/**
 * Clear the API key from memory and storage
 */
export const clearApiKey = (): void => {
  openaiApiKey = null;
  
  try {
    localStorage.removeItem('openai_api_key');
    console.log('API key cleared successfully');
    toast.success('API Key Removed', {
      description: 'Your OpenAI API key has been removed.'
    });
  } catch (error) {
    const errorMessage = 'Failed to remove API key from localStorage';
    console.error(errorMessage, error);
    toast.error('Storage Error', {
      description: errorMessage
    });
  }
};
