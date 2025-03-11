
/**
 * Service for managing OpenAI API keys
 */

// API key for testing
let openaiApiKey: string | null = null;

/**
 * Set the API key and store it in localStorage
 */
export const setOpenAIApiKey = (apiKey: string): void => {
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
      openaiApiKey = storedKey;
      return storedKey;
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
  if (!openaiApiKey) {
    return { 
      success: false, 
      message: "No API key provided. Please enter an OpenAI API key." 
    };
  }

  // Adding a delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Basic validation check for SK format
  if (!openaiApiKey.startsWith('sk-') || openaiApiKey.length < 30) {
    return { 
      success: false, 
      message: "Invalid API key format. OpenAI API keys typically start with 'sk-'" 
    };
  }

  // This is just a simulation. In a real app, you would make an actual API call to OpenAI
  // to validate the key using their authentication endpoints
  return { 
    success: true, 
    message: "API key validation successful! You can now use OpenAI enhancements." 
  };
};
