
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { NavigateFunction } from 'react-router-dom';
import useBookLoader from './useBookLoader';
import * as storageUtils from '@/utils/storageUtils';
import * as storageChecks from '@/utils/storageChecks';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn()
  }
}));

vi.mock('@/utils/storageUtils', () => ({
  getSavedBooks: vi.fn(),
  saveBooksToStorage: vi.fn()
}));

vi.mock('@/utils/storageChecks', () => ({
  isLocalStorageAvailable: vi.fn(),
  isSessionStorageAvailable: vi.fn()
}));

vi.mock('@/hooks/useSampleBook', () => ({
  sampleBook: { 
    id: 'court-scribe-companion',
    title: 'Sample Book',
    chapters: [{ id: 'chapter-1', title: 'Chapter 1', content: 'Sample content' }]
  },
  generateToc: vi.fn().mockReturnValue([{ id: 'chapter-1', title: 'Chapter 1', level: 1 }])
}));

describe('useBookLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mocks
    vi.mocked(storageChecks.isLocalStorageAvailable).mockReturnValue(true);
    vi.mocked(storageChecks.isSessionStorageAvailable).mockReturnValue(true);
    vi.mocked(storageUtils.getSavedBooks).mockReturnValue([]);
  });

  it('should load the sample book when bookId is court-scribe-companion', () => {
    const navigate = vi.fn() as NavigateFunction;
    
    const { result } = renderHook(() => 
      useBookLoader('court-scribe-companion', navigate)
    );
    
    expect(result.current.book).not.toBeNull();
    expect(result.current.book?.id).toBe('court-scribe-companion');
  });

  it('should try to load a book from storage when bookId is provided', () => {
    const mockBook = {
      id: 'test-book',
      title: 'Test Book',
      chapters: [{ id: 'test-chapter', title: 'Test Chapter', content: 'Test content' }]
    };
    
    vi.mocked(storageUtils.getSavedBooks).mockReturnValue([mockBook]);
    
    const navigate = vi.fn() as NavigateFunction;
    
    const { result } = renderHook(() => 
      useBookLoader('test-book', navigate)
    );
    
    expect(result.current.book).not.toBeNull();
    expect(result.current.book?.id).toBe('test-book');
    expect(storageUtils.getSavedBooks).toHaveBeenCalledWith('localStorage');
  });

  it('should navigate back to home if book is not found', () => {
    const navigate = vi.fn() as NavigateFunction;
    
    renderHook(() => 
      useBookLoader('non-existent-book', navigate)
    );
    
    expect(navigate).toHaveBeenCalledWith('/');
    expect(toast.error).toHaveBeenCalled();
  });

  it('should use sessionStorage if localStorage is not available', () => {
    vi.mocked(storageChecks.isLocalStorageAvailable).mockReturnValue(false);
    
    const navigate = vi.fn() as NavigateFunction;
    
    const { result } = renderHook(() => 
      useBookLoader(undefined, navigate)
    );
    
    expect(result.current.storageType).toBe('sessionStorage');
    expect(toast.warning).toHaveBeenCalled();
  });

  it('should update book in storage when updateBook is called', () => {
    const mockBook = {
      id: 'test-book',
      title: 'Test Book',
      chapters: [{ id: 'test-chapter', title: 'Test Chapter', content: 'Test content' }]
    };
    
    vi.mocked(storageUtils.getSavedBooks).mockReturnValue([]);
    vi.mocked(storageUtils.saveBooksToStorage).mockReturnValue(true);
    
    const navigate = vi.fn() as NavigateFunction;
    
    const { result } = renderHook(() => 
      useBookLoader(undefined, navigate)
    );
    
    result.current.updateBook(mockBook);
    
    expect(result.current.book).toEqual(mockBook);
    expect(storageUtils.saveBooksToStorage).toHaveBeenCalled();
  });

  it('should show error toast if save fails', () => {
    const mockBook = {
      id: 'test-book',
      title: 'Test Book',
      chapters: [{ id: 'test-chapter', title: 'Test Chapter', content: 'Test content' }]
    };
    
    vi.mocked(storageUtils.getSavedBooks).mockReturnValue([]);
    vi.mocked(storageUtils.saveBooksToStorage).mockReturnValue(false);
    
    const navigate = vi.fn() as NavigateFunction;
    
    const { result } = renderHook(() => 
      useBookLoader(undefined, navigate)
    );
    
    result.current.updateBook(mockBook);
    
    expect(toast.error).toHaveBeenCalled();
  });
});
