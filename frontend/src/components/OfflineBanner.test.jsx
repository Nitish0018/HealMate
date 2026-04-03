import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OfflineBanner from './OfflineBanner';
import * as useOnlineStatusModule from '../hooks/useOnlineStatus';

describe('OfflineBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Online State', () => {
    it('should not render when user is online', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(true);

      const { container } = render(<OfflineBanner />);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByText(/You are offline/)).not.toBeInTheDocument();
    });
  });

  describe('Offline State', () => {
    it('should render banner when user is offline', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      render(<OfflineBanner />);

      expect(screen.getByText(/You are offline/)).toBeInTheDocument();
    });

    it('should display correct offline message', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      render(<OfflineBanner />);

      expect(
        screen.getByText('You are offline. Some features may not work properly.')
      ).toBeInTheDocument();
    });

    it('should have fixed positioning at top of page', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      const { container } = render(<OfflineBanner />);
      const banner = container.firstChild;

      expect(banner).toHaveClass('fixed');
      expect(banner).toHaveClass('top-0');
      expect(banner).toHaveClass('left-0');
      expect(banner).toHaveClass('right-0');
    });

    it('should have high z-index for visibility', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      const { container } = render(<OfflineBanner />);
      const banner = container.firstChild;

      expect(banner).toHaveClass('z-50');
    });

    it('should have warning color styling', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      const { container } = render(<OfflineBanner />);
      const banner = container.firstChild;

      expect(banner).toHaveClass('bg-yellow-500');
      expect(banner).toHaveClass('text-white');
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert" for screen readers', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      render(<OfflineBanner />);

      const banner = screen.getByRole('alert');
      expect(banner).toBeInTheDocument();
    });

    it('should have aria-live="assertive" for immediate announcement', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      render(<OfflineBanner />);

      const banner = screen.getByRole('alert');
      expect(banner).toHaveAttribute('aria-live', 'assertive');
    });

    it('should hide icon from screen readers', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      render(<OfflineBanner />);

      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Dynamic State Changes', () => {
    it('should show banner when going offline', () => {
      const { rerender } = render(<OfflineBanner />);
      
      // Start online
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(true);
      rerender(<OfflineBanner />);
      expect(screen.queryByText(/You are offline/)).not.toBeInTheDocument();

      // Go offline
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);
      rerender(<OfflineBanner />);
      expect(screen.getByText(/You are offline/)).toBeInTheDocument();
    });

    it('should hide banner when going online', () => {
      const { rerender } = render(<OfflineBanner />);
      
      // Start offline
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);
      rerender(<OfflineBanner />);
      expect(screen.getByText(/You are offline/)).toBeInTheDocument();

      // Go online
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(true);
      rerender(<OfflineBanner />);
      expect(screen.queryByText(/You are offline/)).not.toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('should display offline icon', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      render(<OfflineBanner />);

      const icon = screen.getByRole('alert').querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-5');
      expect(icon).toHaveClass('w-5');
    });

    it('should center content horizontally', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      render(<OfflineBanner />);

      const contentContainer = screen.getByRole('alert').querySelector('.max-w-7xl');
      expect(contentContainer).toHaveClass('mx-auto');
      expect(contentContainer).toHaveClass('flex');
      expect(contentContainer).toHaveClass('items-center');
      expect(contentContainer).toHaveClass('justify-center');
    });
  });
});
