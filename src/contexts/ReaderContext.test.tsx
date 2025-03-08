
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import { ReaderProvider, useReader } from './ReaderContext';
import { StorageType } from '@/utils/storageUtils';
import * as useBookOperations from '@/hooks/useBookOperations';

// Mock dependencies
vi.mock('@/hooks/useBookOperations', () => ({
  useBookOperations: vi.fn(() => ({
    syncStatus: 'synchronized',
    error: null,
    syncWithServer: vi.fn(() => Promise.resolve(true)),
    exportBooks: vi.fn(() => Promise.resolve([])),
    importBooks: vi.fn(() => Promise.resolve(0)),
  })),
}));

// Test wrapper
const wrapper = ({ children }) => <ReaderProvider>{children}</ReaderProvider>;

describe('ReaderContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('provides default values', () => {
    const { result } = renderHook(() => useReader(), { wrapper });
    
    expect(result.current.book).toBeNull();
    expect(result.current.toc).toEqual([]);
    expect(result.current.isDarkTheme).toBe(false);
    expect(result.current.activeChapter).toBeUndefined();
    expect(result.current.tocVisible).toBe(false);
    expect(result.current.storageType).toBe('localStorage');
    expect(result.current.storageAvailable).toBe(true);
  });

  it('allows changing the book', () => {
    const { result } = renderHook(() => useReader(), { wrapper });
    
    const testBook = { id: 'test-book', title: 'Test Book', chapters: [] };
    
    act(() => {
      result.current.setBook(testBook);
    });
    
    expect(result.current.book).toEqual(testBook);
  });

  it('toggles dark theme correctly', () => {
    const { result } = renderHook(() => useReader(), { wrapper });
    
    expect(result.current.isDarkTheme).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.isDarkTheme).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('allows changing storage type', () => {
    const { result } = renderHook(() => useReader(), { wrapper });
    
    expect(result.current.storageType).toBe('localStorage');
    
    act(() => {
      result.current.setStorageType('sessionStorage' as StorageType);
    });
    
    expect(result.current.storageType).toBe('sessionStorage');
  });

  it('syncs with server using the provided hook', async () => {
    const mockSync = vi.fn(() => Promise.resolve(true));
    vi.mocked(useBookOperations.useBookOperations).mockReturnValue({
      syncStatus: 'synchronized',
      error: null,
      syncWithServer: mockSync,
      exportBooks: vi.fn(),
      importBooks: vi.fn(),
    });
    
    const { result } = renderHook(() => useReader(), { wrapper });
    
    const testBook = { id: 'test-book', title: 'Test Book', chapters: [] };
    act(() => {
      result.current.setBook(testBook);
    });
    
    await act(async () => {
      await result.current.syncWithServer();
    });
    
    expect(mockSync).toHaveBeenCalledWith(testBook);
  });
});
