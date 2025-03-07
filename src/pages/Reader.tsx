
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBookLoader from '@/hooks/useBookLoader';
import { ReaderProvider, useReader } from '@/contexts/ReaderContext';
import ReaderLayout from '@/components/reader/ReaderLayout';
import TocSidebar from '@/components/reader/TocSidebar';
import ReaderContent from '@/components/reader/ReaderContent';
import EnhancerWrapper from '@/components/reader/EnhancerWrapper';
import { Book } from '@/components/ebook-uploader/EbookUploader';

const ReaderInner = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { 
    book, 
    activeChapter, 
    showEnhancer,
    setActiveChapter, 
    setBook, 
    setToc 
  } = useReader();
  
  const { book: loadedBook, toc, updateBook } = useBookLoader(bookId, navigate);

  useEffect(() => {
    if (loadedBook) {
      setBook(loadedBook);
      setToc(toc);
    }
  }, [loadedBook, toc, setBook, setToc]);

  useEffect(() => {
    if (book && book.chapters.length > 0) {
      if (!activeChapter) {
        setActiveChapter(book.chapters[0].id);
      } else if (chapterId) {
        setActiveChapter(chapterId);
      }
    }
  }, [book, chapterId, activeChapter, setActiveChapter]);

  const handleBookEnhanced = (enhancedBook: Book) => {
    updateBook(enhancedBook);
  };

  if (showEnhancer) {
    return <EnhancerWrapper onBookEnhanced={handleBookEnhanced} />;
  }

  return (
    <ReaderLayout>
      <div className="flex flex-col md:flex-row">
        <TocSidebar />
        <ReaderContent />
      </div>
    </ReaderLayout>
  );
};

// Wrap everything in the ReaderProvider
const Reader = () => {
  return (
    <ReaderProvider>
      <ReaderInner />
    </ReaderProvider>
  );
};

export default Reader;
