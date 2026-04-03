import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Make expect available globally
globalThis.expect = expect;

// Mock Firebase
vi.mock('../config/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  },
  default: {},
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});
