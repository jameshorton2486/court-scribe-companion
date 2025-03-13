
/**
 * Utility to extract chapters from document content
 */
import { Chapter } from '../DocumentUploader';
import { fixEncodingIssues, detectEncodingIssues } from './encodingUtils';
import { sectionPatterns, isHeading, getChapterTitle, getChapterContentHeader } from './chapterPatterns';

/**
 * Extract chapters and subsections from document content
 */
export const extractChapters = (content: string): Chapter[] => {
  // Check if content appears to have encoding issues
  const hasEncodingIssues = detectEncodingIssues(content);
  
  // Split content into lines
  const lines = content.split('\n');
  const chapters: Chapter[] = [];
  
  let currentChapterTitle = hasEncodingIssues ? 'Encoding Issues Detected' : 'Introduction';
  let currentChapterContent = '';
  let chapterCount = 0;
  let lastChapterNumber: string | null = null;
  let isInBackMatter = false;
  let isInAppendices = false;

  // Function to add current chapter
  const addChapter = () => {
    if (currentChapterContent) {
      const id = isInAppendices ? `appendix-${chapterCount}` : 
                isInBackMatter ? `backmatter-${chapterCount}` : 
                `ch-${chapterCount}`;
                
      chapters.push({
        id,
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

    // Check for section markers
    if (line.toLowerCase().startsWith('appendices')) {
      isInAppendices = true;
      isInBackMatter = false;
      continue;
    }

    if (line.toLowerCase().includes('back matter')) {
      isInBackMatter = true;
      isInAppendices = false;
      continue;
    }

    // Check if line is a heading
    let isLineHeading = false;
    
    for (const pattern of sectionPatterns) {
      const match = line.match(pattern);
      if (match) {
        // Save previous chapter
        addChapter();
        
        // Set chapter title and content based on section type
        currentChapterTitle = getChapterTitle(match, isInAppendices, isInBackMatter);
        currentChapterContent = getChapterContentHeader(match, isInAppendices, isInBackMatter);
        
        if (!isInAppendices && !isInBackMatter) {
          lastChapterNumber = match[1];
        }
        
        isLineHeading = true;
        break;
      }
    }

    // Handle bullet points and lists
    if (line.startsWith('•')) {
      currentChapterContent += `<li>${line.substring(1).trim()}</li>\n`;
    } else if (!isLineHeading) {
      if (currentChapterContent.endsWith('</li>\n')) {
        // Close list if we were in one
        currentChapterContent += '</ul>\n';
      }
      // Add regular paragraph
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
