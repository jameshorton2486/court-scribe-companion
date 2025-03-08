
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReaderProvider, useReaderContext } from './ReaderContext';
import React from 'react';

// Mock local storage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Helper function to create a wrapper for the hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ReaderProvider>{children}</ReaderProvider>
);

describe('ReaderContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useReaderContext(), { wrapper });
    
    expect(result.current.currentBook).toBeNull();
    expect(result.current.currentChapter).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should set current book', () => {
    const { result } = renderHook(() => useReaderContext(), { wrapper });
    
    const mockBook = {
      id: 'book-1',
      title: 'Test Book',
      author: 'Test Author', // Added missing property
      chapters: []
    };
    
    act(() => {
      result.current.setCurrentBook(mockBook);
    });
    
    expect(result.current.currentBook).toEqual(mockBook);
  });

  it('should set current chapter', () => {
    const { result } = renderHook(() => useReaderContext(), { wrapper });
    
    const mockChapter = { id: 'chapter-1', title: 'Chapter 1', content: 'Content' };
    
    act(() => {
      result.current.setCurrentChapter(mockChapter);
    });
    
    expect(result.current.currentChapter).toEqual(mockChapter);
  });

  it('should update loading state', () => {
    const { result } = renderHook(() => useReaderContext(), { wrapper });
    
    act(() => {
      result.current.setIsLoading(true);
    });
    
    expect(result.current.isLoading).toBe(true);
  });

  it('should update the book with new chapters', () => {
    const { result } = renderHook(() => useReaderContext(), { wrapper });
    
    const mockBook = {
      id: 'book-1',
      title: 'Test Book',
      author: 'Test Author', // Added missing property
      chapters: []
    };
    
    const newChapters = [
      { id: 'chapter-1', title: 'Chapter 1', content: 'Content 1' },
      { id: 'chapter-2', title: 'Chapter 2', content: 'Content 2' }
    ];
    
    act(() => {
      result.current.setCurrentBook(mockBook);
      result.current.updateBookChapters(newChapters);
    });
    
    expect(result.current.currentBook?.chapters).toEqual(newChapters);
  });
});
