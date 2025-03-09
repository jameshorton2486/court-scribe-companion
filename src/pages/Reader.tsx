
import { useParams, useNavigate } from 'react-router-dom';
import { ReaderProvider } from '@/contexts/ReaderContext';
import ReaderInitializer from '@/components/reader/ReaderInitializer';
import ReaderUI from '@/components/reader/ReaderUI';
import useBookLoader from '@/hooks/useBookLoader';

const Reader = () => {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const { book, toc, updateBook, storageAvailable, storageType, setStorageType: setLoaderStorageType } = useBookLoader(bookId, navigate);
  
  return (
    <ReaderProvider>
      <ReaderInitializer 
        book={book} 
        toc={toc} 
        chapterId={chapterId} 
        updateBook={updateBook}
        storageAvailable={storageAvailable}
        storageType={storageType}
        setStorageType={setLoaderStorageType}
      />
      
      <ReaderUI />
    </ReaderProvider>
  );
};

export default Reader;
