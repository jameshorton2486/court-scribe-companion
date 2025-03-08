
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useBookLoader from './useBookLoader';
import { toast } from 'sonner';
import * as storageUtils from '@/utils/storageUtils';
import * as storageChecks from '@/utils/storageChecks';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/utils/storageUtils', () => ({
  getSavedBooks: vi.fn(),
  saveBooksToStorage: vi.fn(() => true),
  StorageType: {
    'localStorage': 'localStorage',
    'sessionStorage': 'sessionStorage',
  },
}));

vi.mock('@/utils/storageChecks', () => ({
  isLocalStorageAvailable: vi.fn(),
  isSessionStorageAvailable: vi.fn(),
}));

vi.mock('@/hooks/useSampleBook', () => ({
  sampleBook: { id: 'court-scribe-companion', title: 'Sample Book', chapters: [] },
  generateToc: vi.fn(() => []),
}));

describe('useBookLoader', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storageChecks.isLocalStorageAvailable).mockReturnValue(true);
    vi.mocked(storageChecks.isSessionStorageAvailable).mockReturnValue(true);
    vi.mocked(storageUtils.getSavedBooks).mockReturnValue([
      { id: 'test-book', title: 'Test Book', chapters: [] }
    ]);
  });
  
  it('should load a book from storage when bookId is provided', () => {
    const { result } = renderHook(() => useBookLoader('test-book', mockNavigate));
    
    expect(storageUtils.getSavedBooks).toHaveBeenCalled();
    expect(result.current.book).toEqual({ id: 'test-book', title: 'Test Book', chapters: [] });
  });
  
  it('should load the sample book when bookId is court-scribe-companion', () => {
    const { result } = renderHook(() => useBookLoader('court-scribe-companion', mockNavigate));
    
    expect(result.current.book).toEqual({ id: 'court-scribe-companion', title: 'Sample Book', chapters: [] });
  });
  
  it('should navigate to home when book is not found', () => {
    renderHook(() => useBookLoader('non-existent-book', mockNavigate));
    
    expect(toast.error).toHaveBeenCalledWith('Book not found', expect.any(Object));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  it('should update book in storage when updateBook is called', () => {
    const { result } = renderHook(() => useBookLoader('test-book', mockNavigate));
    
    const updatedBook = { id: 'test-book', title: 'Updated Book', chapters: [] };
    
    act(() => {
      result.current.updateBook(updatedBook);
    });
    
    expect(result.current.book).toEqual(updatedBook);
    expect(storageUtils.saveBooksToStorage).toHaveBeenCalled();
  });
  
  it('should handle storage unavailability', () => {
    vi.mocked(storageChecks.isLocalStorageAvailable).mockReturnValue(false);
    vi.mocked(storageChecks.isSessionStorageAvailable).mockReturnValue(false);
    
    const { result } = renderHook(() => useBookLoader(undefined, mockNavigate));
    
    expect(result.current.storageAvailable).toBe(false);
    expect(toast.warning).toHaveBeenCalledWith('Storage unavailable', expect.any(Object));
  });
});
