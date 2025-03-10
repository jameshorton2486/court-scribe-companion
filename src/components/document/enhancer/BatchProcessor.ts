
import { Chapter } from '../DocumentUploader';

/**
 * Format chapter content for Word export
 */
export const formatForWordExport = (content: string): string => {
  // Process the content for Word export
  let formattedContent = content;
  
  // Replace HTML heading tags with Word-compatible styling
  formattedContent = formattedContent
    .replace(/<h1>(.*?)<\/h1>/gi, '<p style="font-size:18pt;font-weight:bold;margin-top:24pt;margin-bottom:6pt;">$1</p>')
    .replace(/<h2>(.*?)<\/h2>/gi, '<p style="font-size:16pt;font-weight:bold;margin-top:18pt;margin-bottom:6pt;">$1</p>')
    .replace(/<h3>(.*?)<\/h3>/gi, '<p style="font-size:14pt;font-weight:bold;margin-top:14pt;margin-bottom:4pt;">$1</p>')
    .replace(/<h4>(.*?)<\/h4>/gi, '<p style="font-size:13pt;font-weight:bold;margin-top:12pt;margin-bottom:4pt;">$1</p>');
  
  // Handle lists for Word
  formattedContent = formattedContent
    .replace(/<ul>(.*?)<\/ul>/gis, '<p>$1</p>')
    .replace(/<ol>(.*?)<\/ol>/gis, '<p>$1</p>')
    .replace(/<li>(.*?)<\/li>/gi, '• $1<br>');
  
  // Handle basic formatting tags
  formattedContent = formattedContent
    .replace(/<strong>(.*?)<\/strong>/gi, '<b>$1</b>')
    .replace(/<em>(.*?)<\/em>/gi, '<i>$1</i>')
    .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>');
  
  // Handle special characters
  formattedContent = formattedContent
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  
  return formattedContent;
};

/**
 * Process chapters in batches to avoid overloading the API
 */
export const processBatches = async (
  chapters: Chapter[],
  processFunction: (chapter: Chapter) => Promise<Chapter>,
  onProgress: (progress: number) => void,
  batchSize: number = 3
): Promise<Chapter[]> => {
  const processedChapters: Chapter[] = [];
  const totalChapters = chapters.length;
  
  // Process chapters in batches
  for (let i = 0; i < totalChapters; i += batchSize) {
    const batch = chapters.slice(i, i + batchSize);
    
    // Process each chapter in the batch concurrently
    const batchPromises = batch.map(chapter => processFunction(chapter));
    const batchResults = await Promise.all(batchPromises);
    
    // Add processed chapters to results
    processedChapters.push(...batchResults);
    
    // Update progress
    const progress = Math.min(100, Math.round(((i + batch.length) / totalChapters) * 100));
    onProgress(progress);
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < totalChapters) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return processedChapters;
};
