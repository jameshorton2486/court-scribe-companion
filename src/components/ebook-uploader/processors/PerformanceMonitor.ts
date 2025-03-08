
// Performance monitoring
export const processWithTiming = <T>(
  operation: () => T,
  operationName: string
): T => {
  const startTime = performance.now();
  
  try {
    const result = operation();
    const endTime = performance.now();
    const processingTime = endTime - startTime;
    
    if (processingTime > 500) {
      console.info(`Performance: ${operationName} took ${processingTime.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`Error in ${operationName} after ${(endTime - startTime).toFixed(2)}ms:`, error);
    throw error;
  }
};

// Helper to process content in chunks for large documents
export const processLargeContent = (
  content: string,
  chunkSize: number = 10000,
  processor: (chunk: string) => string
): string => {
  // For small content, process directly
  if (content.length < chunkSize) {
    return processor(content);
  }
  
  console.info(`Processing large content in chunks (${content.length} chars)`);
  
  // For larger content, process in chunks
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    const chunk = content.substring(i, Math.min(i + chunkSize, content.length));
    chunks.push(processor(chunk));
    
    // Report progress for very large documents
    if (i > 0 && i % (chunkSize * 10) === 0) {
      console.info(`Processed ${i} of ${content.length} characters (${Math.round(i/content.length*100)}%)`);
    }
  }
  
  return chunks.join('');
};

// Load large content in chunks with async support
export const processLargeContentAsync = async (
  content: string,
  chunkSize: number = 10000,
  processor: (chunk: string) => Promise<string>,
  progressCallback?: (percent: number) => void
): Promise<string> => {
  // For small content, process directly
  if (content.length < chunkSize) {
    return await processor(content);
  }
  
  console.info(`Processing large content asynchronously in chunks (${content.length} chars)`);
  
  // For larger content, process in chunks
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    const chunk = content.substring(i, Math.min(i + chunkSize, content.length));
    chunks.push(await processor(chunk));
    
    // Report progress
    const percentComplete = Math.round((i + chunkSize) / content.length * 100);
    if (progressCallback) {
      progressCallback(Math.min(percentComplete, 100));
    }
    
    // Allow UI thread to breathe between chunks
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return chunks.join('');
};

// Memory-efficient way to process an array of items with progress tracking
export const processBatchesAsync = async <T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>,
  progressCallback?: (percent: number) => void
): Promise<R[]> => {
  if (items.length === 0) return [];
  
  const results: R[] = [];
  const totalItems = items.length;
  
  for (let i = 0; i < totalItems; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
    
    // Report progress
    if (progressCallback) {
      const percentComplete = Math.round((i + batchSize) / totalItems * 100);
      progressCallback(Math.min(percentComplete, 100));
    }
    
    // Allow UI thread to breathe between batches
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
};
