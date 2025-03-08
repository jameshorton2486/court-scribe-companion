
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Book } from '@/components/ebook-uploader/EbookUploader';

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
}

interface TocItem {
  id: string;
  title: string;
  level: number;
  page?: number;
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
        syncWithServer
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
