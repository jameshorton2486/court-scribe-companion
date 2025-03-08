
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { toast } from 'sonner';

type SyncStatus = 'synchronized' | 'synchronizing' | 'unsynchronized' | 'error';
type StorageType = 'localStorage' | 'sessionStorage';

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

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

// Storage key for books
const STORAGE_KEY = 'court-reporter-ebooks';

// Get books from specified storage
const getSavedBooks = (storageType: StorageType = 'localStorage'): Book[] => {
  try {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    const saved = storage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error(`Error reading from ${storageType}:`, error);
    return [];
  }
};

// Save books to storage
const saveBooksToStorage = (books: Book[], storageType: StorageType = 'localStorage'): boolean => {
  try {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(books));
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

  // Track changes for synchronization
  useEffect(() => {
    if (book && book.id !== 'court-scribe-companion') {
      // Only mark as unsynchronized if the book was previously loaded and changed
      if (lastSyncTime !== null) {
        setSyncStatus('unsynchronized');
      }
    }
  }, [book, lastSyncTime]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Function to synchronize data with the server
  const syncWithServer = async (): Promise<boolean> => {
    if (!book || book.id === 'court-scribe-companion') {
      // No need to sync sample book
      return true;
    }

    try {
      setSyncStatus('synchronizing');
      
      // This would be where an actual API call would happen
      // For now, we'll simulate a successful sync
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

  // Export all books to a backup file
  const exportBooks = async (): Promise<Book[]> => {
    try {
      // Get all books from storage
      const allBooks = getSavedBooks(storageType);
      
      // If the current book is modified but not saved, include its latest version
      if (book && book.id !== 'court-scribe-companion') {
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

  // Import books from a backup file
  const importBooks = async (importedBooks: Book[]): Promise<number> => {
    try {
      if (!Array.isArray(importedBooks) || importedBooks.length === 0) {
        throw new Error('No valid books found in the import data');
      }
      
      // Validate books structure
      const validBooks = importedBooks.filter(b => 
        b && typeof b === 'object' && 
        b.id && typeof b.id === 'string' &&
        b.title && typeof b.title === 'string' &&
        Array.isArray(b.chapters)
      );
      
      if (validBooks.length === 0) {
        throw new Error('No valid books found in the import data');
      }
      
      // Get existing books
      const existingBooks = getSavedBooks(storageType);
      
      // Merge books, replacing existing ones with the same ID
      const mergedBooks = [...existingBooks];
      
      for (const importedBook of validBooks) {
        const existingIndex = mergedBooks.findIndex(b => b.id === importedBook.id);
        if (existingIndex >= 0) {
          mergedBooks[existingIndex] = importedBook;
        } else {
          mergedBooks.push(importedBook);
        }
      }
      
      // Save merged books
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
