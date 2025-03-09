
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ReaderProvider, useReader } from './ReaderContext';

// Simple test component that uses the context
const TestComponent = () => {
  const { book, toggleTheme } = useReader();
  return (
    <div>
      <h1>Book Title: {book?.title || 'No book loaded'}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ReaderContext', () => {
  it('provides context values to child components', () => {
    render(
      <ReaderProvider>
        <TestComponent />
      </ReaderProvider>
    );
    
    expect(screen.getByText('Book Title: No book loaded')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });
  
  it('throws error when useReader is used outside provider', () => {
    // Mock console.error to prevent error output in test
    const consoleSpy = vi.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useReader must be used within a ReaderProvider');
    
    consoleSpy.mockRestore();
  });
});
