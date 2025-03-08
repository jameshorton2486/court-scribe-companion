
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBookLoader } from './useBookLoader';
import * as storageUtils from '@/utils/storageUtils';

vi.mock('@/utils/storageUtils', () => ({
  saveBookToStorage: vi.fn(),
  loadBookFromStorage: vi.fn(),
  getBookIdFromUrl: vi.fn(),
  hasBookInStorage: vi.fn()
}));

describe('useBookLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load book from storage when bookId is available', async () => {
    // Setup mocks
    const mockBook = {
      id: 'book-123',
      title: 'Test Book',
      author: 'Test Author', // Added missing property
      chapters: []
    };
    vi.mocked(storageUtils.getBookIdFromUrl).mockReturnValue('book-123');
    vi.mocked(storageUtils.hasBookInStorage).mockReturnValue(true);
    vi.mocked(storageUtils.loadBookFromStorage).mockResolvedValue(mockBook);

    // Render the hook
    const { result } = renderHook(() => useBookLoader());

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.current.book).toEqual(mockBook);
      expect(result.current.isLoading).toBe(false);
    });

    expect(storageUtils.getBookIdFromUrl).toHaveBeenCalled();
    expect(storageUtils.loadBookFromStorage).toHaveBeenCalledWith('book-123');
  });

  it('should set error state when loading fails', async () => {
    // Setup mocks
    vi.mocked(storageUtils.getBookIdFromUrl).mockReturnValue('book-123');
    vi.mocked(storageUtils.hasBookInStorage).mockReturnValue(true);
    vi.mocked(storageUtils.loadBookFromStorage).mockRejectedValue(new Error('Loading failed'));

    // Render the hook
    const { result } = renderHook(() => useBookLoader());

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should save book to storage on successful load', async () => {
    // Setup mocks
    const mockBook = {
      id: 'book-123',
      title: 'Test Book',
      author: 'Test Author', // Added missing property
      chapters: []
    };
    vi.mocked(storageUtils.getBookIdFromUrl).mockReturnValue('book-123');
    vi.mocked(storageUtils.hasBookInStorage).mockReturnValue(true);
    vi.mocked(storageUtils.loadBookFromStorage).mockResolvedValue(mockBook);

    // Render the hook
    const { result } = renderHook(() => useBookLoader());

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.current.book).toEqual(mockBook);
    });

    expect(storageUtils.saveBookToStorage).toHaveBeenCalledWith(mockBook);
  });
});
