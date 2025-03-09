
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { toast } from 'sonner';
import { StorageType } from '@/utils/storage';
import { useBookOperations, SyncStatus } from '@/hooks/useBookOperations';

interface TocItem {
  id: string;
  title: string;
  level: number;
  page?: number;
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
  error: Error | null;
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

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export const ReaderProvider = ({ children }: { children: ReactNode }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | undefined>(undefined);
  const [tocVisible, setTocVisible] = useState(false);
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [storageType, setStorageType] = useState<StorageType>('localStorage');
  
  const { syncStatus, error, syncWithServer: sync, exportBooks: exportBooksOp, importBooks: importBooksOp } = useBookOperations();

  useEffect(() => {
    if (book && book.id !== 'court-scribe-companion') {
      // Intentionally left empty - will use the hook's state management
    }
  }, [book]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark');
  };

  const syncWithServer = async (): Promise<boolean> => {
    return await sync(book);
  };

  const exportBooks = async (): Promise<Book[]> => {
    return await exportBooksOp(book, storageType);
  };

  const importBooks = async (books: Book[]): Promise<number> => {
    return await importBooksOp(books, storageType);
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
        error,
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
