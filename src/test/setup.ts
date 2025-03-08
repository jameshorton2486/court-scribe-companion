
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
vi.stubGlobal('localStorage', {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
});

// Mock window.alert and window.confirm
vi.stubGlobal('alert', vi.fn());
vi.stubGlobal('confirm', vi.fn(() => true));
vi.stubGlobal('scrollTo', vi.fn());
