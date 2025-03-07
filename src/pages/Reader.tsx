
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReaderLayout from '@/components/reader/ReaderLayout';
import TocSidebar from '@/components/reader/TocSidebar';
import ReaderContent, { ReaderMainContent } from '@/components/reader/ReaderContent';
import EnhancerWrapper from '@/components/reader/EnhancerWrapper';
import { ReaderProvider, useReader } from '@/contexts/ReaderContext';
import useBookLoader from '@/hooks/useBookLoader';

const ReaderPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { book, toc, updateBook } = useBookLoader(params.bookId, navigate);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (book) {
      setIsLoading(false);
    }
  }, [book]);

  return (
    <ReaderProvider>
      <ReaderContent />
    </ReaderProvider>
  );
};

const Reader = () => {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const { book, toc, updateBook } = useBookLoader(bookId, navigate);
  
  return (
    <ReaderProvider>
      <ReaderInitializer 
        book={book} 
        toc={toc} 
        chapterId={chapterId} 
        updateBook={updateBook}
      />
      
      <ReaderUI />
    </ReaderProvider>
  );
};

// Component to initialize the reader context
const ReaderInitializer = ({ book, toc, chapterId, updateBook }) => {
  const { 
    setBook, 
    setToc, 
    setActiveChapter,
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
    }
  }, [book, chapterId, setBook, setActiveChapter]);
  
  useEffect(() => {
    if (toc && toc.length > 0) {
      setToc(toc);
    }
  }, [toc, setToc]);
  
  return null;
};

// UI component
const ReaderUI = () => {
  const { showEnhancer, book } = useReader();
  
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
