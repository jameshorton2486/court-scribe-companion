
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { NavigateFunction } from 'react-router-dom';
import useBookLoader from './useBookLoader';
import * as storageUtils from '../utils/storageUtils';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('useBookLoader', () => {
  const mockNavigate = vi.fn() as NavigateFunction;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock storage functions
    vi.spyOn(storageUtils, 'getSavedBooks').mockImplementation(() => [
      { id: 'test-book', title: 'Test Book', chapters: [] }
    ]);
    
    vi.spyOn(storageUtils, 'saveBooksToStorage').mockReturnValue(true);
  });
  
  it('loads sample book when bookId is court-scribe-companion', () => {
    const { result } = renderHook(() => useBookLoader('court-scribe-companion', mockNavigate));
    
    expect(result.current.book).not.toBeNull();
    expect(result.current.book?.id).toBe('court-scribe-companion');
  });
  
  it('loads book from storage when valid bookId is provided', () => {
    const { result } = renderHook(() => useBookLoader('test-book', mockNavigate));
    
    expect(storageUtils.getSavedBooks).toHaveBeenCalled();
    expect(result.current.book?.id).toBe('test-book');
  });
  
  it('navigates to home when book is not found', () => {
    vi.spyOn(storageUtils, 'getSavedBooks').mockImplementation(() => []);
    
    renderHook(() => useBookLoader('non-existent-book', mockNavigate));
    
    expect(toast.error).toHaveBeenCalledWith('Book not found', expect.any(Object));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  it('updates book in storage when updateBook is called', () => {
    const { result } = renderHook(() => useBookLoader('test-book', mockNavigate));
    
    const updatedBook = { id: 'test-book', title: 'Updated Book', chapters: [] };
    
    act(() => {
      result.current.updateBook(updatedBook);
    });
    
    expect(storageUtils.saveBooksToStorage).toHaveBeenCalled();
    expect(result.current.book).toEqual(updatedBook);
  });
  
  it('handles storage availability', () => {
    vi.spyOn(storageUtils, 'getSavedBooks').mockImplementation(() => []);
    
    const { result } = renderHook(() => useBookLoader(undefined, mockNavigate));
    
    expect(result.current.storageAvailable).toBeDefined();
  });
});
