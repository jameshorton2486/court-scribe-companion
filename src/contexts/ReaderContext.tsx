import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { toast } from 'sonner';

type SyncStatus = 'synchronized' | 'synchronizing' | 'unsynchronized' | 'error';
type StorageType = 'localStorage' | 'sessionStorage';

interface BookValidationSchema {
  id: string;
  title: string;
  chapters: { id: string; title: string; content: string }[];
}

interface ReaderContextType {
  book: Book | null;
  toc: TocItem[];
  isDarkTheme: boolean;
  activeChapter: string | undefined;
  tocVisible: boolean;
  showEnhancer: boolean;
  showExportDialog: boolean;
  storageAvailable: boolean;
  syncStatus: SyncStatus;
  storageType: StorageType;
  setBook: (book: Book | null) => void;
  setToc: (toc: TocItem[]) => void;
  setIsDarkTheme: (isDark: boolean) => void;
  setActiveChapter: (chapterId: string | undefined) => void;
  setTocVisible: (visible: boolean) => void;
  setShowEnhancer: (show: boolean) => void;
  setShowExportDialog: (show: boolean) => void;
  setStorageAvailable: (available: boolean) => void;
  setStorageType: (type: StorageType) => void;
  toggleTheme: () => void;
  syncWithServer: () => Promise<boolean>;
  exportBooks: () => Promise<Book[]>;
  importBooks: (books: Book[]) => Promise<number>;
}

interface TocItem {
  id: string;
  title: string;
  level: number;
  page?: number;
}

const generateAccessToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

const STORAGE_KEY = 'court-reporter-ebooks';
const TOKEN_KEY = 'court-reporter-access-token';

const getSavedBooks = (storageType: StorageType = 'localStorage'): Book[] => {
  try {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    
    const token = storage.getItem(TOKEN_KEY);
    if (!token) {
      storage.setItem(TOKEN_KEY, generateAccessToken());
    }
    
    const saved = storage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error(`Error reading from ${storageType}:`, error);
    return [];
  }
};

const validateBook = (book: any): boolean => {
  if (!book || typeof book !== 'object') return false;
  if (typeof book.id !== 'string' || !book.id) return false;
  if (typeof book.title !== 'string' || !book.title) return false;
  
  if (!Array.isArray(book.chapters)) return false;
  
  for (const chapter of book.chapters) {
    if (!chapter || typeof chapter !== 'object') return false;
    if (typeof chapter.id !== 'string' || !chapter.id) return false;
    if (typeof chapter.title !== 'string') return false;
    
    if (chapter.content && typeof chapter.content !== 'string') return false;
  }
  
  return true;
};

const sanitizeHtml = (html: string): string => {
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  return sanitized;
};

const saveBooksToStorage = (books: Book[], storageType: StorageType = 'localStorage'): boolean => {
  try {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    
    const token = storage.getItem(TOKEN_KEY);
    if (!token) {
      console.error('Unauthorized save attempt: no access token');
      return false;
    }
    
    const validatedBooks = books.map(book => {
      if (book.id === 'court-scribe-companion') return book;
      
      if (!validateBook(book)) {
        console.error('Invalid book structure:', book);
        throw new Error('Invalid book structure');
      }
      
      const sanitizedChapters = book.chapters.map(chapter => ({
        ...chapter,
        content: chapter.content ? sanitizeHtml(chapter.content) : ''
      }));
      
      return {
        ...book,
        chapters: sanitizedChapters
      };
    });
    
    storage.setItem(STORAGE_KEY, JSON.stringify(validatedBooks));
    return true;
  } catch (error) {
    console.error(`Error saving to ${storageType}:`, error);
    return false;
  }
};

export const ReaderProvider = ({ children }: { children: ReactNode }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | undefined>(undefined);
  const [tocVisible, setTocVisible] = useState(false);
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synchronized');
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [storageType, setStorageType] = useState<StorageType>('localStorage');

  useEffect(() => {
    if (book && book.id !== 'court-scribe-companion') {
      if (lastSyncTime !== null) {
        setSyncStatus('unsynchronized');
      }
    }
  }, [book, lastSyncTime]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark');
  };

  const syncWithServer = async (): Promise<boolean> => {
    if (!book || book.id === 'court-scribe-companion') {
      return true;
    }

    try {
      setSyncStatus('synchronizing');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSyncStatus('synchronized');
      setLastSyncTime(Date.now());
      return true;
    } catch (error) {
      console.error('Synchronization failed:', error);
      setSyncStatus('error');
      return false;
    }
  };

  const exportBooks = async (): Promise<Book[]> => {
    try {
      const allBooks = getSavedBooks(storageType);
      
      if (book && book.id !== 'court-scribe-companion') {
        if (!validateBook(book)) {
          throw new Error('Current book has invalid structure');
        }
        
        const bookIndex = allBooks.findIndex(b => b.id === book.id);
        if (bookIndex >= 0) {
          allBooks[bookIndex] = book;
        } else {
          allBooks.push(book);
        }
      }
      
      return allBooks;
    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export books: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const importBooks = async (importedBooks: Book[]): Promise<number> => {
    try {
      if (!Array.isArray(importedBooks) || importedBooks.length === 0) {
        throw new Error('No valid books found in the import data');
      }
      
      const validBooks = importedBooks.filter(b => {
        const isValid = validateBook(b);
        
        if (!isValid) {
          console.warn('Skipping invalid book during import:', b);
        }
        
        return isValid;
      });
      
      if (validBooks.length === 0) {
        throw new Error('No valid books found in the import data');
      }
      
      const existingBooks = getSavedBooks(storageType);
      
      const mergedBooks = [...existingBooks];
      
      for (const importedBook of validBooks) {
        const sanitizedBook = {
          ...importedBook,
          chapters: importedBook.chapters.map(chapter => ({
            ...chapter,
            content: chapter.content ? sanitizeHtml(chapter.content) : ''
          }))
        };
        
        const existingIndex = mergedBooks.findIndex(b => b.id === importedBook.id);
        if (existingIndex >= 0) {
          mergedBooks[existingIndex] = sanitizedBook;
        } else {
          mergedBooks.push(sanitizedBook);
        }
      }
      
      const saveSuccess = saveBooksToStorage(mergedBooks, storageType);
      
      if (!saveSuccess) {
        throw new Error('Failed to save imported books to storage');
      }
      
      return validBooks.length;
    } catch (error) {
      console.error('Import error:', error);
      throw new Error('Failed to import books: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <ReaderContext.Provider
      value={{
        book,
        toc,
        isDarkTheme,
        activeChapter,
        tocVisible,
        showEnhancer,
        showExportDialog,
        storageAvailable,
        syncStatus,
        storageType,
        setBook,
        setToc,
        setIsDarkTheme,
        setActiveChapter,
        setTocVisible,
        setShowEnhancer,
        setShowExportDialog,
        setStorageAvailable,
        setStorageType,
        toggleTheme,
        syncWithServer,
        exportBooks,
        importBooks
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
};

export const useReader = () => {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
};

export type { TocItem };
