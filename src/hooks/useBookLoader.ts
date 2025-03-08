import { useState, useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { TocItem } from '@/components/TableOfContents';

// Sample e-book content with legal transcript content
const sampleBook = {
  id: 'court-scribe-companion',
  title: 'The Court Reporter\'s Scribe Companion',
  author: 'Legal Transcription Experts',
  chapters: [
    {
      id: 'ch1',
      title: 'Core Content: Chapter 1: Punctuation in Appellate Transcripts',
      content: `
        <h2>Punctuation in Appellate Transcripts</h2>
        <p>Proper punctuation is crucial in legal transcripts, especially those destined for appellate review. This chapter covers the essential rules and conventions that every court reporter must follow to ensure accuracy and clarity.</p>
        <p>Interactive Element: Calculate punctuation decision tree.</p>
        <p>A/B testing options: 25% higher conversion when samples include workflow diagrams vs pure text.</p>
      `
    },
    {
      id: 'ch2',
      title: 'Pricing Matrix Development',
      content: `
        <h2>Pricing Matrix Development</h2>
        <p>2023 - $0.50 per page + surcharge x ( experience factor / 100 )</p>
        <p>Multiple surcharges:</p>
        <ul>
          <li>Expedite: 1.5x</li>
          <li>Weekend: 2x</li>
          <li>Technical: 1.25x</li>
        </ul>
      `
    },
    {
      id: 'ch3',
      title: 'Legal Transcription Process Model',
      content: `
        <h2>Legal Transcription Process Model</h2>
        <p>Legal Compliance, verification and workflow.</p>
        <p>Setup stage:</p>
        <ul>
          <li>DRAFT: THROUGH COMPLAINT/BEFORE INSERT ON Rev2.0/Content</li>
          <li>BUILD.00.1.LEGAL</li>
          <li>* SET DEFAULTS</li>
          <li>SELECT FROM/\Legal\\CompiledDB\</li>
          <li>3 TABLES: client, case, state</li>
          <li>NEW: CREATE STATE.DEFAULT</li>
          <li>SET MESSAGE_TEXT = "Copyright compliance validation failed."</li>
        </ul>
        <p>Wondering if U.S. Copyright Office electronic deposit requirements...?</p>
      `
    },
    {
      id: 'ch4',
      title: 'AI Formatting Prompt Architecture',
      content: `
        <h2>AI Formatting Prompt Architecture</h2>
        <p>Consistently Enforcement Protocol</p>
        <p>Example formatting rules:</p>
        <ol>
          <li>Rule Chaining Architecture:
            <ul>
              <li>2021: Title (No Colon), Comleted (Style), Not Empty (Cap & Sweetner)</li>
              <li>Consistent: Always or 0 time (never)</li>
              <li>Capitalize: "building" = "Building" when alone</li>
            </ul>
          </li>
          <li>Document Config:
            <ul>
              <li>Consistency: All Level with Roman numeral sequencing</li>
              <li>Continuation: All Level can lead with Roman numerals 1-6</li>
              <li>Consistent paragraph level vs OCR / Appellant C</li>
            </ul>
          </li>
        </ol>
      `
    },
    {
      id: 'ch5',
      title: 'Legal Compliance Checks',
      content: `
        <h2>Legal Compliance Checks</h2>
        <p>Legal Compliance Checks:</p>
        <ul>
          <li>Check all court citation convention 2023 USC Title 28 database</li>
          <li>Official citations are required with FCC / Appendix C</li>
          <li>All statements of 'ment' or 'tion' or 'sion' (3%)</li>
        </ul>
      `
    },
    {
      id: 'ch6',
      title: 'Interactive Resources',
      content: `
        <h2>Interactive Resources</h2>
        <p>Interactive Resources:</p>
        <ul>
          <li>Create interactive link libraries with Markdown or similar</li>
          <li>Develop templates with decision trees (3 levels)</li>
          <li>Generate automated practice tests via JSON question banks</li>
        </ul>
      `
    },
    {
      id: 'ch7',
      title: 'Homophones/Spellings',
      content: `
        <h2>Homophones/Spellings</h2>
        <p>Homophones/Spellings:</p>
        <p>December's note: "legal reporter punctuation guide"</p>
        <p>Definitive list: "Proper transcript formatting + style template"</p>
        <p>Update: PDF extract will now be rejected</p>
        <p>This phrase appears (partially) redundant reviewing across all 21 chapters while maintaining legal accuracy95.</p>
      `
    }
  ]
};

// Generate table of contents from chapters
const generateToc = (chapters: any[]): TocItem[] => {
  return chapters.map((chapter, index) => ({
    id: chapter.id,
    title: chapter.title,
    level: 1,
    page: index + 1
  }));
};

const STORAGE_KEY = 'court-reporter-ebooks';
const STORAGE_TEST_KEY = 'court-reporter-storage-test';

/**
 * Check if localStorage is available
 * @returns boolean indicating if localStorage is available and working
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    // Try to set and get a test item
    localStorage.setItem(STORAGE_TEST_KEY, 'test');
    const testValue = localStorage.getItem(STORAGE_TEST_KEY);
    localStorage.removeItem(STORAGE_TEST_KEY);
    return testValue === 'test';
  } catch (e) {
    return false;
  }
};

/**
 * Check if sessionStorage is available
 * @returns boolean indicating if sessionStorage is available and working
 */
const isSessionStorageAvailable = (): boolean => {
  try {
    // Try to set and get a test item
    sessionStorage.setItem(STORAGE_TEST_KEY, 'test');
    const testValue = sessionStorage.getItem(STORAGE_TEST_KEY);
    sessionStorage.removeItem(STORAGE_TEST_KEY);
    return testValue === 'test';
  } catch (e) {
    return false;
  }
};

/**
 * Check if there's enough storage space
 * @param dataToSave Data to check size against available space
 * @returns boolean indicating if there's enough space
 */
const hasEnoughStorageSpace = (dataToSave: string): boolean => {
  try {
    // Estimate the size of the data in bytes
    const dataSize = new Blob([dataToSave]).size;
    // Typical localStorage limit is 5-10MB, we'll be conservative and check against 4MB
    const MAX_SAFE_STORAGE = 4 * 1024 * 1024; // 4MB in bytes
    
    return dataSize < MAX_SAFE_STORAGE;
  } catch (e) {
    console.warn('Error checking storage space:', e);
    return false;
  }
}

// Get books from specified storage
const getSavedBooks = (storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): Book[] => {
  // Try primary requested storage first
  const primaryStorage = storageType === 'localStorage' ? localStorage : sessionStorage;
  
  try {
    if ((storageType === 'localStorage' && isLocalStorageAvailable()) || 
        (storageType === 'sessionStorage' && isSessionStorageAvailable())) {
      const saved = primaryStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (e) {
    console.error(`Error parsing saved books from ${storageType}:`, e);
  }
  
  // If requested storage fails, try the other one as fallback
  const fallbackStorage = storageType === 'localStorage' ? sessionStorage : localStorage;
  const fallbackType = storageType === 'localStorage' ? 'sessionStorage' : 'localStorage';
  
  try {
    if ((fallbackType === 'localStorage' && isLocalStorageAvailable()) || 
        (fallbackType === 'sessionStorage' && isSessionStorageAvailable())) {
      const saved = fallbackStorage.getItem(STORAGE_KEY);
      if (saved) {
        toast.info('Using fallback storage', {
          description: `Books were loaded from ${fallbackType} instead of ${storageType}.`
        });
        return JSON.parse(saved);
      }
    }
  } catch (e) {
    console.error(`Error parsing saved books from fallback ${fallbackType}:`, e);
  }
  
  // If all attempts fail, return empty array
  return [];
};

const saveBooksToStorage = (books: Book[], storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): boolean => {
  const booksJson = JSON.stringify(books);
  
  // Try requested storage type first
  if ((storageType === 'localStorage' && isLocalStorageAvailable()) || 
      (storageType === 'sessionStorage' && isSessionStorageAvailable())) {
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
      
      // If localStorage, check space
      if (storageType === 'localStorage' && !hasEnoughStorageSpace(booksJson)) {
        console.warn('Not enough localStorage space, will try sessionStorage');
      } else {
        storage.setItem(STORAGE_KEY, booksJson);
        
        if (storageType === 'sessionStorage') {
          toast.warning("Using temporary storage", {
            description: "Your books are saved to session storage. They will be lost when you close the browser.",
            duration: 5000
          });
        }
        
        return true;
      }
    } catch (e) {
      console.error(`Error saving to ${storageType}:`, e);
    }
  }
  
  // Try fallback storage if primary failed
  const fallbackType = storageType === 'localStorage' ? 'sessionStorage' : 'localStorage';
  
  if ((fallbackType === 'localStorage' && isLocalStorageAvailable()) || 
      (fallbackType === 'sessionStorage' && isSessionStorageAvailable())) {
    try {
      const fallbackStorage = fallbackType === 'localStorage' ? localStorage : sessionStorage;
      fallbackStorage.setItem(STORAGE_KEY, booksJson);
      
      toast.warning(`Using ${fallbackType}`, {
        description: `Your book was saved to ${fallbackType} because ${storageType} was not available.`,
        duration: 5000
      });
      return true;
    } catch (e) {
      console.error(`Error saving to fallback ${fallbackType}:`, e);
    }
  }
  
  // All attempts failed
  toast.error("Storage unavailable", {
    description: "Your browser doesn't support storage features. Changes won't be saved."
  });
  return false;
};

const useBookLoader = (bookId: string | undefined, navigate: NavigateFunction) => {
  const [book, setBook] = useState<Book | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  const [storageType, setStorageType] = useState<'localStorage' | 'sessionStorage'>('localStorage');

  // Check storage availability once on mount
  useEffect(() => {
    const localAvailable = isLocalStorageAvailable();
    const sessionAvailable = isSessionStorageAvailable();
    const anyStorageAvailable = localAvailable || sessionAvailable;
    
    setStorageAvailable(anyStorageAvailable);
    
    // If localStorage isn't available but sessionStorage is, switch to that
    if (!localAvailable && sessionAvailable) {
      setStorageType('sessionStorage');
      toast.warning("Using session storage", {
        description: "Local storage is unavailable. Your books will only be saved for the current session.",
        duration: 5000
      });
    } else if (!anyStorageAvailable) {
      toast.warning("Storage unavailable", {
        description: "Your browser has limited or no storage capabilities. Your books won't be saved between sessions."
      });
    }
  }, []);

  // Load the book from storage
  useEffect(() => {
    if (bookId === 'court-scribe-companion') {
      // Load the sample book if requested by ID
      setBook(sampleBook);
      setToc(generateToc(sampleBook.chapters));
    } else if (bookId) {
      // Try to load from storage
      const savedBooks = getSavedBooks(storageType);
      const foundBook = savedBooks.find(b => b.id === bookId);
      
      if (foundBook) {
        setBook(foundBook);
        setToc(generateToc(foundBook.chapters));
      } else {
        toast.error("Book not found", {
          description: "The requested book could not be found in your library.",
        });
        navigate('/');
      }
    }
  }, [bookId, navigate, storageType]);

  // Function to update a book in storage
  const updateBook = (updatedBook: Book) => {
    if (!updatedBook || !updatedBook.id) {
      toast.error("Invalid book data", {
        description: "Cannot update book with invalid data."
      });
      return;
    }

    // Update state
    setBook(updatedBook);
    setToc(generateToc(updatedBook.chapters));

    // Save to storage (skip sample book)
    if (updatedBook.id !== 'court-scribe-companion') {
      const savedBooks = getSavedBooks(storageType);
      const updatedBooks = savedBooks.map(b => 
        b.id === updatedBook.id ? updatedBook : b
      );
      
      // If book wasn't found, add it
      if (!savedBooks.some(b => b.id === updatedBook.id)) {
        updatedBooks.push(updatedBook);
      }
      
      const saveSuccessful = saveBooksToStorage(updatedBooks, storageType);
      
      if (!saveSuccessful) {
        toast.error("Save failed", {
          description: "Your book changes couldn't be saved due to browser storage limitations."
        });
      }
    }
  };

  return { book, toc, updateBook, storageAvailable, storageType, setStorageType };
};

export default useBookLoader;
