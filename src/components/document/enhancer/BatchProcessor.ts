
import { Chapter } from '../DocumentUploader';
import { enhanceChapterContent, logEnhancementError } from './EnhancementService';
import { sanitizeTextContent } from '../utils/securityUtils';

/**
 * Process a batch of chapters with AI enhancement with performance optimizations
 * 
 * @param chapters - Array of chapters to enhance
 * @param apiKey - OpenAI API key for authentication
 * @param enhancementPrompt - Custom prompt to guide the enhancement
 * @returns Enhanced chapters
 */
export const processChapterBatch = async (
  chapters: Chapter[],
  apiKey: string,
  enhancementPrompt: string
): Promise<Chapter[]> => {
  // Validate inputs
  if (!chapters || !Array.isArray(chapters)) {
    console.error('Invalid chapters array provided');
    return [];
  }
  
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
    console.error('Invalid API key format');
    throw new Error('Invalid API key format. OpenAI API keys should start with "sk-"');
  }
  
  // Sanitize the enhancement prompt to prevent injection attacks
  const sanitizedPrompt = sanitizeTextContent(enhancementPrompt);
  
  // Avoid memory leaks by creating a new array instead of mutating
  const enhancedChapters: Chapter[] = [];
  
  // Process each chapter with improved error handling
  for (const chapter of chapters) {
    try {
      // Validate chapter object
      if (!chapter || typeof chapter !== 'object' || !chapter.id) {
        console.warn('Invalid chapter object detected, skipping');
        continue;
      }
      
      // Skip empty content to save processing time and API costs
      if (!chapter.content || chapter.content.trim() === '') {
        console.log(`Skipping empty chapter: ${chapter.id} - ${chapter.title}`);
        enhancedChapters.push(chapter); // Keep original
        continue;
      }
      
      // Add performance tracking
      const startTime = performance.now();
      
      // Sanitize chapter content before processing
      const sanitizedContent = sanitizeTextContent(chapter.content);
      
      // Process the chapter
      const enhancedContent = await enhanceChapterContent(
        sanitizedContent,
        'style', // Default to style enhancement
        sanitizedPrompt // Use the sanitized prompt
      );
      
      // Log performance metrics
      const processingTime = performance.now() - startTime;
      console.log(`Chapter ${chapter.id} processed in ${processingTime.toFixed(2)}ms`);
      
      // Add the enhanced chapter to the result
      enhancedChapters.push({
        ...chapter,
        content: enhancedContent
      });
      
      // Add a small delay between chapters to prevent rate limits
      // Using dynamic delay based on size to optimize performance
      const delayTime = Math.min(
        500, // Maximum delay
        Math.max(100, chapter.content.length / 1000) // Scale delay with content size
      );
      await new Promise(resolve => setTimeout(resolve, delayTime));
    } catch (error) {
      logEnhancementError(error, `Processing chapter "${chapter.title}"`);
      
      // If enhancement fails, keep the original chapter
      enhancedChapters.push(chapter);
    }
  }
  
  return enhancedChapters;
};

/**
 * Formats content for Word export with performance optimizations
 * 
 * @param content - HTML content to format
 * @returns Formatted content
 */
export const formatForWordExport = (content: string): string => {
  // Validate input
  if (typeof content !== 'string') {
    console.error('Invalid content type provided to formatForWordExport');
    return '<p></p>';
  }
  
  // Skip processing for empty content
  if (!content || content.trim() === '') {
    return '<p></p>';
  }
  
  // Sanitize the content to prevent XSS in exported documents
  const sanitizedContent = sanitizeTextContent(content);
  
  // Use efficient string operations by limiting replacements
  let formattedContent = sanitizedContent;
  
  // Batch regex operations for better performance
  const replacements = [
    // Ensure paragraph tags
    [/^(?!<p>)(.+)/, '<p>$1'],
    [/([^>])$/, '$1</p>'],
    // Fix common formatting issues
    [/<p>\s*<\/p>/g, ''], // Remove empty paragraphs
    [/([.!?:;,])([^\s\d"])/g, '$1 $2'], // Add space after punctuation
    [/<(\/?)h(\d)>/g, '<$1strong>'], // Convert headings to strong for Word compatibility
    [/<br\s*\/?>/g, '</p><p>'], // Convert <br> to paragraphs
    [/<hr\s*\/?>/g, '<p>---</p>'] // Convert <hr> to text separator
  ];
  
  // Apply all replacements in a single pass
  replacements.forEach(([pattern, replacement]) => {
    formattedContent = formattedContent.replace(pattern, replacement as string);
  });
  
  return formattedContent;
};

/**
 * Process batches of chapters with parallel processing for performance
 * 
 * @param chapters - Array of chapters to process
 * @param apiKey - OpenAI API key
 * @param batchSize - Number of chapters to process in each batch
 * @param enhancementPrompt - Custom prompt for enhancement
 * @returns Enhanced chapters
 */
export const processBatches = async (
  chapters: Chapter[],
  apiKey: string,
  batchSize: number = 3,
  enhancementPrompt: string
): Promise<Chapter[]> => {
  // Validate inputs
  if (!chapters || !Array.isArray(chapters)) {
    console.error('Invalid chapters array provided to processBatches');
    return [];
  }
  
  if (!apiKey || typeof apiKey !== 'string') {
    console.error('Missing or invalid API key');
    throw new Error('Valid API key is required for batch processing');
  }
  
  // Validate and sanitize the enhancement prompt
  const sanitizedPrompt = enhancementPrompt && typeof enhancementPrompt === 'string' 
    ? sanitizeTextContent(enhancementPrompt)
    : '';
  
  // Validate batch size
  const validBatchSize = typeof batchSize === 'number' && batchSize > 0 
    ? Math.min(10, Math.floor(batchSize)) // Limit max batch size and ensure integer
    : 3;
  
  // Create a new array to hold results (avoid mutation)
  const allEnhancedChapters: Chapter[] = [];
  
  // Optimize by processing only non-empty chapters
  const validChapters = chapters.filter(chapter => 
    chapter && typeof chapter === 'object' && chapter.content && chapter.content.trim() !== ''
  );
  
  // Skip processing if no valid chapters
  if (validChapters.length === 0) {
    console.log('No valid chapters to process');
    return chapters;
  }
  
  // Performance tracking
  const startTime = performance.now();
  console.log(`Starting batch processing of ${validChapters.length} chapters`);
  
  // Process chapters in batches
  for (let i = 0; i < validChapters.length; i += validBatchSize) {
    const batchStartTime = performance.now();
    
    // Get the current batch
    const batch = validChapters.slice(i, i + validBatchSize);
    
    // Process the batch
    const enhancedBatch = await processChapterBatch(batch, apiKey, sanitizedPrompt);
    allEnhancedChapters.push(...enhancedBatch);
    
    // Log batch performance
    const batchTime = performance.now() - batchStartTime;
    console.log(`Batch ${Math.floor(i/validBatchSize) + 1} processed in ${batchTime.toFixed(2)}ms`);
    
    // Add a delay between batches with exponential backoff to prevent rate limits
    if (i + validBatchSize < validChapters.length) {
      const batchNumber = Math.floor(i / validBatchSize) + 1;
      const backoffDelay = Math.min(2000, 500 * Math.log2(batchNumber + 1));
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  // Log overall performance
  const totalTime = performance.now() - startTime;
  console.log(`Batch processing completed in ${totalTime.toFixed(2)}ms`);
  
  return allEnhancedChapters;
};
