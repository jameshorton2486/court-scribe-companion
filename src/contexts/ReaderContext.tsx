
import { createContext, useContext, useState, ReactNode } from 'react';
import { Book } from '@/components/ebook-uploader/EbookUploader';

interface ReaderContextType {
  book: Book | null;
  toc: TocItem[];
  isDarkTheme: boolean;
  activeChapter: string | undefined;
  tocVisible: boolean;
  showEnhancer: boolean;
  showExportDialog: boolean;
  setBook: (book: Book | null) => void;
  setToc: (toc: TocItem[]) => void;
  setIsDarkTheme: (isDark: boolean) => void;
  setActiveChapter: (chapterId: string | undefined) => void;
  setTocVisible: (visible: boolean) => void;
  setShowEnhancer: (show: boolean) => void;
  setShowExportDialog: (show: boolean) => void;
  toggleTheme: () => void;
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

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark');
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
        setBook,
        setToc,
        setIsDarkTheme,
        setActiveChapter,
        setTocVisible,
        setShowEnhancer,
        setShowExportDialog,
        toggleTheme
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
