
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
