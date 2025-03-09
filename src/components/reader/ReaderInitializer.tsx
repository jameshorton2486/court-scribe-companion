
import { useEffect } from 'react';
import { useReader } from '@/contexts/ReaderContext';
import { StorageType } from '@/utils/storageUtils';

interface ReaderInitializerProps {
  book: any;
  toc: any[];
  chapterId: string | undefined;
  updateBook: (book: any) => void;
  storageAvailable: boolean;
  storageType: StorageType;
  setStorageType: (type: StorageType) => void;
}

const ReaderInitializer = ({
  book, 
  toc, 
  chapterId, 
  updateBook, 
  storageAvailable,
  storageType,
  setStorageType
}: ReaderInitializerProps) => {
  const { 
    setBook, 
    setToc, 
    setActiveChapter,
    setStorageAvailable,
    setStorageType: setContextStorageType,
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
          book.chapters.some((ch: any) => ch.id === chapterId) ? 
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
    setContextStorageType(storageType);
  }, [storageType, setContextStorageType]);
  
  return null;
};

export default ReaderInitializer;
