import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useOnlineStatus from './useOnlineStatus';

describe('useOnlineStatus', () => {
  let onlineEventListeners = [];
  let offlineEventListeners = [];

  beforeEach(() => {
    // Reset event listeners
    onlineEventListeners = [];
    offlineEventListeners = [];

    // Mock window.addEventListener
    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'online') {
        onlineEventListeners.push(handler);
      } else if (event === 'offline') {
        offlineEventListeners.push(handler);
      }
    });

    // Mock window.removeEventListener
    vi.spyOn(window, 'removeEventListener').mockImplementation((event, handler) => {
      if (event === 'online') {
        onlineEventListeners = onlineEventListeners.filter(h => h !== handler);
      } else if (event === 'offline') {
        offlineEventListeners = offlineEventListeners.filter(h => h !== handler);
      }
    });

    // Mock console.log to suppress logs during tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should return true when navigator.onLine is true', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });

      const { result } = renderHook(() => useOnlineStatus());
      expect(result.current).toBe(true);
    });

    it('should return false when navigator.onLine is false', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const { result } = renderHook(() => useOnlineStatus());
      expect(result.current).toBe(false);
    });
  });

  describe('Event Listeners', () => {
    it('should register online and offline event listeners', () => {
      renderHook(() => useOnlineStatus());

      expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
    });

    it('should remove event listeners on unmount', () => {
      const { unmount } = renderHook(() => useOnlineStatus());

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
    });
  });

  describe('Online/Offline Transitions', () => {
    it('should update to false when offline event is triggered', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });

      const { result } = renderHook(() => useOnlineStatus());
      expect(result.current).toBe(true);

      // Trigger offline event
      act(() => {
        offlineEventListeners.forEach(handler => handler());
      });

      expect(result.current).toBe(false);
    });

    it('should update to true when online event is triggered', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const { result } = renderHook(() => useOnlineStatus());
      expect(result.current).toBe(false);

      // Trigger online event
      act(() => {
        onlineEventListeners.forEach(handler => handler());
      });

      expect(result.current).toBe(true);
    });

    it('should handle multiple online/offline transitions', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });

      const { result } = renderHook(() => useOnlineStatus());
      expect(result.current).toBe(true);

      // Go offline
      act(() => {
        offlineEventListeners.forEach(handler => handler());
      });
      expect(result.current).toBe(false);

      // Go online
      act(() => {
        onlineEventListeners.forEach(handler => handler());
      });
      expect(result.current).toBe(true);

      // Go offline again
      act(() => {
        offlineEventListeners.forEach(handler => handler());
      });
      expect(result.current).toBe(false);
    });
  });

  describe('Console Logging', () => {
    it('should log when connection is restored', () => {
      const consoleLogSpy = vi.spyOn(console, 'log');

      renderHook(() => useOnlineStatus());

      act(() => {
        onlineEventListeners.forEach(handler => handler());
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('[Network] Connection restored - Online');
    });

    it('should log when connection is lost', () => {
      const consoleLogSpy = vi.spyOn(console, 'log');

      renderHook(() => useOnlineStatus());

      act(() => {
        offlineEventListeners.forEach(handler => handler());
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('[Network] Connection lost - Offline');
    });
  });
});
