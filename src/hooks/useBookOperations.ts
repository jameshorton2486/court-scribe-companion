
import { useState } from 'react';
import { Book } from '@/components/ebook-uploader/EbookUploader';
import { validateBook } from '@/utils/validationUtils';
import { getSavedBooks, saveBooksToStorage, StorageType } from '@/utils/storageUtils';
import { handleError, safeOperation } from '@/utils/errorHandlingUtils';

export type SyncStatus = 'synchronized' | 'synchronizing' | 'unsynchronized' | 'error';

export function useBookOperations() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synchronized');
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const syncWithServer = async (book: Book | null): Promise<boolean> => {
    if (!book || book.id === 'court-scribe-companion') {
      return true;
    }

    try {
      setSyncStatus('synchronizing');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSyncStatus('synchronized');
      setLastSyncTime(Date.now());
      return true;
    } catch (error) {
      const appError = handleError(error, 'Synchronization', true);
      setSyncStatus('error');
      setError(appError.originalError instanceof Error ? 
               appError.originalError : 
               new Error(appError.message));
      return false;
    }
  };

  const exportBooks = async (book: Book | null, storageType: StorageType): Promise<Book[]> => {
    return safeOperation(async () => {
      const allBooks = getSavedBooks(storageType);
      
      if (book && book.id !== 'court-scribe-companion') {
        if (!validateBook(book)) {
          throw new Error('Current book has invalid structure');
        }
        
        const bookIndex = allBooks.findIndex(b => b.id === book.id);
        if (bookIndex >= 0) {
          allBooks[bookIndex] = book;
        } else {
          allBooks.push(book);
        }
      }
      
      return allBooks;
    }, 'Book export', 'Failed to export books') as Promise<Book[]>;
  };

  const importBooks = async (importedBooks: Book[], storageType: StorageType): Promise<number> => {
    return safeOperation(async () => {
      if (!Array.isArray(importedBooks) || importedBooks.length === 0) {
        throw new Error('No valid books found in the import data');
      }
      
      const validBooks = importedBooks.filter(b => {
        const isValid = validateBook(b);
        
        if (!isValid) {
          console.warn('Skipping invalid book during import:', b);
        }
        
        return isValid;
      });
      
      if (validBooks.length === 0) {
        throw new Error('No valid books found in the import data');
      }
      
      const existingBooks = getSavedBooks(storageType);
      
      const mergedBooks = [...existingBooks];
      
      for (const importedBook of validBooks) {
        const existingIndex = mergedBooks.findIndex(b => b.id === importedBook.id);
        if (existingIndex >= 0) {
          mergedBooks[existingIndex] = importedBook;
        } else {
          mergedBooks.push(importedBook);
        }
      }
      
      const saveSuccess = saveBooksToStorage(mergedBooks, storageType);
      
      if (!saveSuccess) {
        throw new Error('Failed to save imported books to storage');
      }
      
      return validBooks.length;
    }, 'Book import', 'Failed to import books') as Promise<number>;
  };

  return {
    syncStatus,
    error,
    syncWithServer,
    exportBooks,
    importBooks
  };
}
