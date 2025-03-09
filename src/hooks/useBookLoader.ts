import { useState, useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { TocItem } from '@/components/TableOfContents';
import { isLocalStorageAvailable, isSessionStorageAvailable } from '@/utils/storageChecks';
import { getSavedBooks, saveBooksToStorage, StorageType } from '@/utils/storageUtils';
import { sampleBook, generateToc } from '@/hooks/useSampleBook';

const useBookLoader = (bookId: string | undefined, navigate: NavigateFunction) => {
  const [book, setBook] = useState<Book | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  const [storageType, setStorageType] = useState<StorageType>('localStorage');

  // Check storage availability once on mount
  useEffect(() => {
    const localAvailable = isLocalStorageAvailable();
    const sessionAvailable = isSessionStorageAvailable();
    const anyStorageAvailable = localAvailable || sessionAvailable;
    
    setStorageAvailable(anyStorageAvailable);
    
    // If localStorage isn't available but sessionStorage is, switch to that
    if (!localAvailable && sessionAvailable) {
      setStorageType('sessionStorage');
      toast.warning("Using session storage", {
        description: "Local storage is unavailable. Your books will only be saved for the current session.",
        duration: 5000
      });
    } else if (!anyStorageAvailable) {
      toast.warning("Storage unavailable", {
        description: "Your browser has limited or no storage capabilities. Your books won't be saved between sessions."
      });
    }
  }, []);

  // Load the book from storage
  useEffect(() => {
    if (bookId === 'court-scribe-companion') {
      // Load the sample book if requested by ID
      setBook(sampleBook);
      setToc(generateToc(sampleBook.chapters));
    } else if (bookId) {
      // Try to load from storage
      const savedBooks = getSavedBooks(storageType);
      const foundBook = savedBooks.find(b => b.id === bookId);
      
      if (foundBook) {
        setBook(foundBook);
        setToc(generateToc(foundBook.chapters));
      } else {
        toast.error("Book not found", {
          description: "The requested book could not be found in your library.",
        });
        navigate('/');
      }
    }
  }, [bookId, navigate, storageType]);

  // Function to update a book in storage
  const updateBook = (updatedBook: Book) => {
    if (!updatedBook || !updatedBook.id) {
      toast.error("Invalid book data", {
        description: "Cannot update book with invalid data."
      });
      return;
    }

    // Update state
    setBook(updatedBook);
    setToc(generateToc(updatedBook.chapters));

    // Save to storage (skip sample book)
    if (updatedBook.id !== 'court-scribe-companion') {
      const savedBooks = getSavedBooks(storageType);
      const updatedBooks = savedBooks.map(b => 
        b.id === updatedBook.id ? updatedBook : b
      );
      
      // If book wasn't found, add it
      if (!savedBooks.some(b => b.id === updatedBook.id)) {
        updatedBooks.push(updatedBook);
      }
      
      const saveSuccessful = saveBooksToStorage(updatedBooks, storageType);
      
      if (!saveSuccessful) {
        toast.error("Save failed", {
          description: "Your book changes couldn't be saved due to browser storage limitations."
        });
      }
    }
  };

  return { book, toc, updateBook, storageAvailable, storageType, setStorageType };
};

export default useBookLoader;
