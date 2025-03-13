
/**
 * Encoding Utilities Module
 * 
 * Provides utility functions for detecting and fixing common encoding issues
 * in text content. Handles various scenarios like UTF-8/Latin-1 mixups,
 * control characters, and malformed HTML entities.
 * 
 * @module encodingUtils
 */

/**
 * Fix common encoding issues in text content
 * 
 * Applies a series of transformations to fix encoding problems like:
 * - UTF-8 characters interpreted as Latin-1
 * - Control characters
 * - HTML entities
 * - Malformed punctuation patterns
 * 
 * @param content - The text content to fix
 * @returns Cleaned text with encoding issues resolved
 */
export const fixEncodingIssues = (content: string): string => {
  if (!content) return '';
  
  // Replace common problematic sequences
  const replacements: [RegExp | string, string][] = [
    [/�/g, ''],                // Remove replacement character
    [/Â/g, ''],                // Common UTF-8 over Latin-1 issue
    [/\u0000/g, ''],           // Null bytes
    [/\r\n/g, '\n'],           // Normalize line endings
    [/\r/g, '\n'],             // Convert CR to LF
    [/��/g, "'"],              // Common apostrophe issue
    [/â€™/g, "'"],             // Smartquote as UTF-8 bytes interpreted as Latin-1
    [/â€œ/g, '"'],             // Left double quote
    [/â€/g, '"'],              // Right double quote
    [/Ã©/g, 'é'],              // Common Latin-1/UTF-8 mix for é
    [/Ã¨/g, 'è'],              // Common Latin-1/UTF-8 mix for è
    [/Ã /g, 'à'],              // Common Latin-1/UTF-8 mix for à
    [/Ã¢/g, 'â'],              // Common Latin-1/UTF-8 mix for â
    [/Ã§/g, 'ç'],              // Common Latin-1/UTF-8 mix for ç
    // XML/HTML entities
    [/&lt;/g, '<'],
    [/&gt;/g, '>'],
    [/&amp;/g, '&'],
    [/&quot;/g, '"'],
    [/&apos;/g, "'"],
    [/&#39;/g, "'"],
    [/&#34;/g, '"'],
    // Remove control characters
    [/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''],
    // Fix consecutive dots and other punctuation
    [/\.{4,}/g, '...'],
    [/\?{3,}/g, '??'],
    [/!{3,}/g, '!!'],
    // Fix multiple non-word characters in a row (likely encoding issues)
    [/([^\w\s])\1{3,}/g, '$1']
  ];
  
  let result = content;
  
  // Apply all replacements
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  
  // Decode any remaining HTML entities
  try {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = result;
    result = textArea.value;
  } catch (e) {
    console.error('Error decoding HTML entities:', e);
  }
  
  // Remove transcription artifacts
  result = removeTranscriptionArtifacts(result);
  
  return result;
};

/**
 * Detect if content likely has encoding issues
 * 
 * Uses pattern matching to identify common indicators of encoding problems:
 * - Unicode replacement characters
 * - Control characters
 * - Suspicious character sequences
 * - High percentage of non-printable characters
 * 
 * @param content - The text content to check
 * @returns True if encoding issues are detected, false otherwise
 */
export const detectEncodingIssues = (content: string): boolean => {
  if (!content) return false;
  
  // Suspicious patterns that suggest encoding issues
  const suspiciousPatterns = [
    /[\uFFFD]{2,}/,                    // Multiple Unicode replacement characters
    /[\x00-\x08\x0B\x0C\x0E-\x1F]{5,}/, // Multiple control characters
    /[Ã]{3,}/,                         // Multiple Ã characters (common in UTF-8/Latin1 mixups)
    /\]\]\]\]/,                        // Multiple brackets
    /�{2,}/,                           // Multiple � characters
    /[\\/@#$%^&*+=]{5,}/              // Multiple consecutive special characters
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(content)) {
      console.warn('Encoding issues detected in document');
      return true;
    }
  }
  
  // Count non-printable characters
  const nonPrintable = (content.match(/[^\x20-\x7E\t\n\r]/g) || []).length;
  
  // If more than 15% of the content is non-printable, suspect encoding issues
  if (content.length > 20 && nonPrintable / content.length > 0.15) {
    console.warn('High percentage of non-printable characters detected');
    return true;
  }
  
  return false;
};

/**
 * Removes common AI transcription artifacts and directives from text
 * 
 * Identifies and removes lines that appear to be transcription guidelines,
 * formatting directives, or other non-content artifacts often included
 * by AI transcription systems.
 * 
 * @param content - The text content to clean
 * @returns Text with transcription artifacts removed
 */
export const removeTranscriptionArtifacts = (content: string): string => {
  if (!content) return '';
  
  let cleanedContent = content;
  
  // Common transcription artifact patterns
  const artifactPatterns = [
    // Paragraphs ending with ¶ or similar symbols
    /^[ •]*[\w\s]+·+¶[\s]*$/gm,
    /^[ •]*[\w\s].*[¶|]+[\s]*$/gm,
    
    // Directive lines with bullet points
    /^[ •]*(Ensure|Do not|Use|Avoid|Correct|Incorrect)[\w\s\-\.]+[¶|]+[\s]*$/gm,
    
    // Section markers with special symbols
    /^[\s]*[⚠️|🚫|⛔|🔴|🟠|🟡|🟢|🔵|🟣|⚪|⚫|✅|❌|⭕|❗|❓|❕|❔|🔺|🔻|🔸|🔹|🔶|🔷|🔘|🔲|🔳|🔈|🔉|🔊|🔇].*[¶|]+[\s]*$/gm,
    
    // Common AI instruction patterns
    /^(Usage:|Example:|Note:|Important:|Warning:|Caution:|Remember:).*[¶|]+[\s]*$/gm,
    
    // Common metadata patterns often included in AI-generated text
    /^\[(Timestamp|Time|Speaker|ID|Note)\].*$/gm,
    
    // Lines that appear to be formatting instructions
    /^[\s]*(Correct vs\. Incorrect).*[¶|]+[\s]*$/gm,
    /^[\s]*(Incorrect Usage:).*[¶|]+[\s]*$/gm
  ];
  
  // Apply all removals
  for (const pattern of artifactPatterns) {
    cleanedContent = cleanedContent.replace(pattern, '');
  }
  
  // Clean up any resulting empty lines
  cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n');
  
  return cleanedContent.trim();
};

/**
 * Process text content to fix encoding issues and remove artifacts
 * 
 * Applies a full suite of text cleaning operations suitable for
 * document processing:
 * - Fixes encoding issues
 * - Removes transcription artifacts
 * - Normalizes whitespace
 * 
 * @param content - The text content to process
 * @returns Cleaned text ready for further processing
 */
export const processTextContent = (content: string): string => {
  if (!content) return '';
  
  // First fix encoding issues
  let processedContent = fixEncodingIssues(content);
  
  // Then remove transcription artifacts
  processedContent = removeTranscriptionArtifacts(processedContent);
  
  // Normalize whitespace
  processedContent = processedContent
    .replace(/[ \t]+/g, ' ')     // Replace multiple spaces/tabs with single space
    .replace(/\n{3,}/g, '\n\n')  // Replace 3+ newlines with 2
    .trim();                     // Remove leading/trailing whitespace
    
  return processedContent;
};
