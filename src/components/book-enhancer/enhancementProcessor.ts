import { toast } from 'sonner';
import { Book, Chapter } from '@/components/ebook-uploader/BookProcessor';
import { ChapterProcessingError } from '@/components/ebook-uploader/processors/ErrorHandler';

interface EnhancementOptions {
  // Grammar options
  enableGrammarCheck: boolean;
  grammarLevel: number;
  enableSpellingCheck: boolean;
  
  // Content options
  enableContentExpansion: boolean;
  expansionLevel: number;
  writingStyle: string;
  improveClarity: boolean;
  
  // Formatting options
  enableProfessionalFormatting: boolean;
  fontFamily: string;
  generateTOC: boolean;
  addChapterBreaks: boolean;
}

interface EnhancementResult {
  content: string;
  warnings?: string[];
  errors?: ChapterProcessingError[];
  processingTime?: number;
}

const trackProcessingTime = async <T>(
  operation: () => Promise<T>
): Promise<{result: T, processingTime: number}> => {
  const startTime = performance.now();
  const result = await operation();
  const processingTime = performance.now() - startTime;
  return { result, processingTime };
};

const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  errorMessage: string
): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    let details = '';
    
    if (error instanceof Error) {
      details = error.message;
    } else if (typeof error === 'string') {
      details = error;
    }
    
    toast.error(errorMessage, { 
      description: details || 'Please try again'
    });
    
    return null;
  }
};

const applyGrammarCorrections = (text: string, grammarLevel: number): string => {
  let correctedText = text
    .replace(/\s\s+/g, ' ')                          // Fix multiple spaces
    .replace(/\bi\b/g, 'I')                          // Capitalize "i"
    .replace(/([.!?])\s*(\w)/g, (_, p, w) => `${p} ${w.toUpperCase()}`) // Capitalize after sentence
    .replace(/\b(i'm|i'll|i've|i'd)\b/gi, match => match[0].toUpperCase() + match.slice(1)) // Fix I contractions
    .replace(/(\w)\s+([,.!?:;])/g, '$1$2')           // Fix space before punctuation
    .replace(/([,.!?:;])\s*/g, '$1 ')                // Ensure space after punctuation
    .replace(/\s+\./g, '.')                          // Fix space before period
    .replace(/\.\./g, '.')                           // Fix double periods
    .replace(/\s*\n\s*/g, '\n')                      // Fix spacing around new lines
    .replace(/([.!?])\s+([a-z])/g, (_, p, l) => `${p} ${l.toUpperCase()}`) // Capitalize after periods
    .replace(/"\s*(.+?)\s*"/g, '"$1"')               // Fix spacing in quotes
    .replace(/"\s*(.+?)\s*"/g, '"$1"')               // Fix spacing in quotes
    .replace(/'\s*(.+?)\s*'/g, "'$1'");              // Fix spacing in single quotes
  
  if (grammarLevel >= 2) {
    correctedText = correctedText
      .replace(/\b(dont|cant|wont|didnt|isnt|arent|wouldnt|couldnt|shouldnt|hasnt|havent|doesnt)\b/gi, 
        match => match.slice(0, -1) + "'" + match.slice(-1)) // Add apostrophes
      .replace(/\byou're\b/gi, "you're")
      .replace(/\bthey're\b/gi, "they're")
      .replace(/\bthere's\b/gi, "there's")
      .replace(/\bit's\b/gi, "it's")
      .replace(/\bwe're\b/gi, "we're")
      .replace(/([^.!?:;])\s+\n\s+/g, '$1.\n')       // Add periods before line breaks if missing
      .replace(/ - /g, " — ")                         // Convert hyphens to em dashes
      .replace(/(\w)'(\w)/g, "$1'$2");               // Fix apostrophes in contractions
  }
  
  if (grammarLevel >= 3) {
    correctedText = correctedText
      .replace(/\b(could of|should of|would of|must of)\b/gi, match => 
        match.replace(' of', ' have'))                // Fix "could of" to "could have"
      .replace(/\b(less)\s+(\w+s)\b/gi, "fewer $2")   // "less books" to "fewer books"
      .replace(/\b(amount)\s+of\s+(\w+s)\b/gi, "number of $2") // "amount of people" to "number of people"
      .replace(/\bas\s+such\b/gi, "therefore")        // Improve formal language
      .replace(/\bin order to\b/gi, "to")             // More concise
      .replace(/\b(very|really|extremely)\s+(\w+)\b/gi, "$2") // Remove intensifiers for cleaner prose
      .replace(/\bnot only\.\.\.\s*but also\b/gi, "both...and"); // Fix correlative conjunctions
  }
  
  return correctedText;
};

const applyProfessionalFormatting = (
  content: string, 
  options: { 
    fontFamily: string, 
    generateTOC: boolean, 
    addChapterBreaks: boolean 
  }
): string => {
  let formattedContent = content;
  
  const fontClass = `font-${options.fontFamily}`;
  
  formattedContent = formattedContent
    .replace(/<h1/g, `<h1 class="text-4xl font-bold mb-8 mt-10 ${fontClass}"`)
    .replace(/<h2/g, `<h2 class="text-3xl font-semibold mb-6 mt-8 ${fontClass}"`)
    .replace(/<h3/g, `<h3 class="text-2xl font-medium mb-4 mt-6 ${fontClass}"`)
    .replace(/<h4/g, `<h4 class="text-xl font-medium mb-3 mt-5 ${fontClass}"`)
    .replace(/<p>/g, `<p class="mb-4 leading-relaxed ${fontClass}">`)
    .replace(/<ul>/g, `<ul class="list-disc pl-6 mb-4 ${fontClass}">`)
    .replace(/<ol>/g, `<ol class="list-decimal pl-6 mb-4 ${fontClass}">`)
    .replace(/<blockquote>/g, `<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 ${fontClass}">`);
  
  if (options.generateTOC) {
    formattedContent = formattedContent
      .replace(/<h([1-3]) id="([^"]+)"([^>]*)>/g, 
        (_, level, id, attrs) => `<h${level} id="${id}"${attrs} data-toc-item="true" data-toc-level="${level}">`);
  }
  
  if (options.addChapterBreaks) {
    formattedContent = `<div class="page-break-before"></div>${formattedContent}`;
  }
  
  return formattedContent;
};

const enhanceChapterContent = async (
  chapterContent: string, 
  options: EnhancementOptions
): Promise<EnhancementResult> => {
  try {
    const { result: enhancedContent, processingTime } = await trackProcessingTime(async () => {
      let content = chapterContent;
      const warnings: string[] = [];
      
      if (options.enableGrammarCheck || options.enableSpellingCheck) {
        if (options.enableGrammarCheck && options.grammarLevel > 3) {
          warnings.push('High grammar level may alter the original voice significantly');
        }
        
        content = applyGrammarCorrections(content, options.grammarLevel);
      }
      
      if (options.enableContentExpansion) {
        if (content.length > 10000 && options.expansionLevel > 2) {
          warnings.push('Content is already lengthy; significant expansion may make it too verbose');
        }
        
        const paragraphs = content.split('</p><p>');
        if (paragraphs.length > 1) {
          const expansionAmount = options.expansionLevel;
          const expansionText = `This is an example of expanded content that would normally be generated by an AI model. This text demonstrates how the content expansion feature would work in a real implementation. The AI would analyze the context and add relevant, engaging content to enrich the reading experience.`;
          
          if (expansionAmount >= 2) {
            paragraphs.splice(2, 0, expansionText);
          }
          content = paragraphs.join('</p><p>');
        }
      }
      
      if (options.enableProfessionalFormatting) {
        content = applyProfessionalFormatting(content, {
          fontFamily: options.fontFamily,
          generateTOC: options.generateTOC,
          addChapterBreaks: options.addChapterBreaks
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return content;
    });
    
    console.info(`Enhanced chapter in ${processingTime.toFixed(2)}ms`);
    
    return { 
      content: enhancedContent,
      processingTime,
      warnings: [] // In a real implementation, warnings would be populated
    };
  } catch (error) {
    console.error('Error enhancing chapter content:', error);
    
    return {
      content: chapterContent, // Return original content on error
      errors: [{
        message: 'Failed to enhance chapter content',
        code: 'ENHANCEMENT_FAILED',
        details: error instanceof Error ? error.message : String(error)
      }]
    };
  }
};

export const enhanceBook = async (
  book: Book,
  selectedChapterIds: string[],
  options: EnhancementOptions
): Promise<Book> => {
  try {
    const enhancedBook = { ...book };
    const enhancedChapters = [...book.chapters];
    const enhancementErrors: ChapterProcessingError[] = [];
    
    const startTime = performance.now();
    
    for (let i = 0; i < enhancedChapters.length; i++) {
      const chapter = enhancedChapters[i];
      
      if (!selectedChapterIds.includes(chapter.id)) {
        continue;
      }
      
      console.info(`Enhancing chapter: ${chapter.title}`);
      
      const result = await safeApiCall(
        () => enhanceChapterContent(chapter.content, options),
        `Failed to enhance chapter: ${chapter.title}`
      );
      
      if (result) {
        enhancedChapters[i] = {
          ...chapter,
          content: result.content,
          processingErrors: result.errors
        };
        
        if (result.errors && result.errors.length > 0) {
          enhancementErrors.push(...result.errors);
        }
        
        if (result.warnings && result.warnings.length > 0) {
          console.warn(`Warnings for chapter "${chapter.title}":`, result.warnings);
        }
        
        toast.success(`Enhanced chapter: ${chapter.title}`, {
          description: result.processingTime ? 
            `Processed in ${(result.processingTime / 1000).toFixed(1)}s` : undefined
        });
      } else {
        enhancementErrors.push({
          message: `Failed to enhance chapter: ${chapter.title}`,
          code: 'ENHANCEMENT_FAILED'
        });
      }
    }
    
    const totalTime = performance.now() - startTime;
    console.info(`Enhanced book in ${(totalTime / 1000).toFixed(2)}s`);
    
    enhancedBook.chapters = enhancedChapters;
    if (enhancementErrors.length > 0) {
      enhancedBook.processingErrors = enhancementErrors;
    }
    
    return enhancedBook;
  } catch (error) {
    console.error('Error enhancing book:', error);
    toast.error('Failed to enhance book', {
      description: 'There was a problem enhancing your book.'
    });
    throw error;
  }
};

export default {
  enhanceBook,
  enhanceChapterContent
};
