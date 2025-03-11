
/**
 * Document enhancement service providing AI-powered content improvements
 * This file re-exports functionality from more specialized service files
 */

// Export API Key management functions
export { 
  setOpenAIApiKey, 
  getOpenAIApiKey, 
  testApiKey 
} from './services/ApiKeyService';

// Export content enhancement functions
export { 
  enhanceChapterContent, 
  logEnhancementError 
} from './services/ContentEnhancementService';

// Export prompt management functions
export { 
  getPromptTemplates,
  saveCustomBookPrompt,
  getCustomBookPrompt,
  getAllCustomBookPrompts
} from './services/PromptService';
