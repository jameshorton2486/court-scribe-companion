import { Chapter, Document } from './DocumentUploader';

/**
 * Process document content into a structured document with chapters
 */
export const processDocument = (
  title: string,
  author: string,
  content: string
): Document => {
  // Generate a simple ID from title
  const id = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  
  // Fix encoding issues before processing
  const cleanedContent = fixEncodingIssues(content);
  
  // Extract chapters from content
  const chapters = extractChapters(cleanedContent);
  
  return {
    id,
    title,
    author: author || 'Unknown Author',
    chapters
  };
};

/**
 * Fix common encoding issues in text content
 */
const fixEncodingIssues = (content: string): string => {
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
  
  return result;
};

/**
 * Extract chapters and subsections from document content
 */
const extractChapters = (content: string): Chapter[] => {
  // Check if content appears to have encoding issues
  const hasEncodingIssues = detectEncodingIssues(content);
  
  // Split content into lines
  const lines = content.split('\n');
  const chapters: Chapter[] = [];
  
  // Chapter and subsection detection patterns
  const chapterPatterns = [
    /^chapter\s+(\d+)[\s:]+(.+)$/i,            // "Chapter X: Title" or "Chapter X - Title"
    /^(\d+)[\s\.]+(.+)$/,                       // "1. Title" or "I. Title"
    /^(\d+\.\d+)[\s]+(.+)$/                    // "1.1 Title" (subsection)
  ];
  
  let currentChapterTitle = hasEncodingIssues ? 'Encoding Issues Detected' : 'Introduction';
  let currentChapterContent = '';
  let chapterCount = 0;
  let lastChapterNumber: string | null = null;
  
  // Function to add current chapter
  const addChapter = () => {
    if (currentChapterContent) {
      chapters.push({
        id: `ch-${chapterCount}`,
        title: currentChapterTitle,
        content: currentChapterContent.trim()
      });
      chapterCount++;
    }
  };
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if line is a chapter heading or subsection
    let isHeading = false;
    
    for (const pattern of chapterPatterns) {
      const match = line.match(pattern);
      if (match) {
        // Save previous chapter
        addChapter();
        
        // Start new chapter or subsection
        const chapterNumber = match[1];
        const title = match[2] ? match[2].trim() : `Chapter ${chapterNumber}`;
        
        // Check if it's a subsection (contains a decimal point)
        const isSubsection = chapterNumber.includes('.');
        
        if (isSubsection) {
          // This is a subsection (e.g., "3.1")
          currentChapterTitle = `${chapterNumber} ${title}`;
          currentChapterContent = `<h3>${chapterNumber} ${title}</h3>\n`;
        } else {
          // This is a main chapter
          currentChapterTitle = `Chapter ${chapterNumber}: ${title}`;
          currentChapterContent = `<h2>Chapter ${chapterNumber}: ${title}</h2>\n`;
          lastChapterNumber = chapterNumber;
        }
        
        isHeading = true;
        break;
      }
    }
    
    // If not a chapter heading, add to current chapter
    if (!isHeading) {
      // If this is the first content and no chapter yet, create default chapter
      if (chapters.length === 0 && !currentChapterContent) {
        currentChapterTitle = hasEncodingIssues ? 'Encoding Issues Detected' : 'Introduction';
        currentChapterContent = `<h2>${currentChapterTitle}</h2>\n`;
        
        // If encoding issues detected, add a warning
        if (hasEncodingIssues) {
          currentChapterContent += `<div style="color: red; padding: 10px; margin: 10px 0; background-color: #ffeeee; border: 1px solid #ffcccc; border-radius: 4px;">
            <p><strong>Warning:</strong> This document appears to have encoding issues. The text may display incorrectly.</p>
            <p>Try re-saving your document in UTF-8 format before uploading again, or try a different file format (like .txt).</p>
          </div>\n`;
        }
      }
      
      // Add line to current chapter content
      currentChapterContent += `<p>${line}</p>\n`;
    }
  }
  
  // Add final chapter
  addChapter();
  
  // If no chapters were found, create a single chapter with all content
  if (chapters.length === 0) {
    const title = hasEncodingIssues ? 'Encoding Issues Detected' : 'Content';
    let content = `<h2>${title}</h2>\n`;
    
    // If encoding issues detected, add a warning
    if (hasEncodingIssues) {
      content += `<div style="color: red; padding: 10px; margin: 10px 0; background-color: #ffeeee; border: 1px solid #ffcccc; border-radius: 4px;">
        <p><strong>Warning:</strong> This document appears to have encoding issues. The text may display incorrectly.</p>
        <p>Try re-saving your document in UTF-8 format before uploading again, or try a different file format (like .txt).</p>
      </div>\n`;
    }
    
    content += `<p>${fixEncodingIssues(content)}</p>`;
    
    chapters.push({
      id: 'ch-0',
      title,
      content
    });
  }
  
  return chapters;
};

/**
 * Detect if content likely has encoding issues
 */
const detectEncodingIssues = (content: string): boolean => {
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

export { fixEncodingIssues, detectEncodingIssues };
