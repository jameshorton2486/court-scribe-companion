
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReaderLayout from '@/components/reader/ReaderLayout';
import TocSidebar from '@/components/reader/TocSidebar';
import ReaderContent from '@/components/reader/ReaderContent';
import EnhancerWrapper from '@/components/reader/EnhancerWrapper';
import { ReaderProvider, useReader } from '@/contexts/ReaderContext';
import useBookLoader from '@/hooks/useBookLoader';

const ReaderPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  return (
    <ReaderProvider>
      <ReaderContent />
    </ReaderProvider>
  );
};

const Reader = () => {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const { book, toc, updateBook, storageAvailable, storageType, setStorageType } = useBookLoader(bookId, navigate);
  
  return (
    <ReaderProvider>
      <ReaderInitializer 
        book={book} 
        toc={toc} 
        chapterId={chapterId} 
        updateBook={updateBook}
        storageAvailable={storageAvailable}
        storageType={storageType}
        setStorageType={setStorageType}
      />
      
      <ReaderUI />
    </ReaderProvider>
  );
};

// Component to initialize the reader context
const ReaderInitializer = ({ 
  book, 
  toc, 
  chapterId, 
  updateBook, 
  storageAvailable,
  storageType,
  setStorageType
}) => {
  const { 
    setBook, 
    setToc, 
    setActiveChapter,
    setStorageAvailable,
    setStorageType,
    syncWithServer
  } = useReader();
  
  useEffect(() => {
    if (book) {
      setBook(book);
      
      // If we have chapters, set the active chapter
      if (book.chapters && book.chapters.length > 0) {
        // If chapterId is provided and exists in the book, use it
        // Otherwise, default to the first chapter
        const validChapterId = chapterId && 
          book.chapters.some(ch => ch.id === chapterId) ? 
          chapterId : book.chapters[0].id;
          
        setActiveChapter(validChapterId);
      }
      
      // Initial sync check if it's not the sample book
      if (book.id !== 'court-scribe-companion') {
        syncWithServer();
      }
    }
  }, [book, chapterId, setBook, setActiveChapter, syncWithServer]);
  
  useEffect(() => {
    if (toc && toc.length > 0) {
      setToc(toc);
    }
  }, [toc, setToc]);
  
  // Set storage availability and type in context
  useEffect(() => {
    setStorageAvailable(storageAvailable);
  }, [storageAvailable, setStorageAvailable]);
  
  useEffect(() => {
    setStorageType(storageType);
  }, [storageType, setStorageType]);
  
  return null;
};

// UI component
const ReaderUI = () => {
  const { showEnhancer } = useReader();
  
  if (showEnhancer) {
    return <EnhancerWrapper onBookEnhanced={(updatedBook) => {}} />;
  }
  
  return (
    <ReaderLayout>
      <TocSidebar />
      <ReaderContent />
    </ReaderLayout>
  );
};

export default Reader;
