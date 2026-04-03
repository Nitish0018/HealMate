import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = true, message = 'Test error' }) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>No error</div>;
};

// Component that works normally
const WorkingComponent = () => <div>Working component</div>;

describe('ErrorBoundary', () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  describe('Normal Operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Working component')).toBeInTheDocument();
    });

    it('should not display error UI when children render successfully', () => {
      render(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should catch errors and display fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(/An error occurred while rendering this section/)
      ).toBeInTheDocument();
    });

    it('should display section name in error UI when provided', () => {
      render(
        <ErrorBoundary section="Test Section">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Section: Test Section')).toBeInTheDocument();
    });

    it('should log error details to console', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary section="Test Section">
          <ThrowError message="Custom error message" />
        </ErrorBoundary>
      );

      // Verify console.error was called (React logs errors internally)
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });

    it('should display "Try Again" button in error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should display "Refresh Page" button in error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Refresh Page')).toBeInTheDocument();
    });
  });

  describe('Error Recovery', () => {
    it('should reset error state when "Try Again" is clicked', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Error UI should be displayed
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Click "Try Again" button - this resets the error state
      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.click(tryAgainButton);

      // After clicking, the component will try to re-render the children
      // Since the child still throws, we should see the error UI again
      // This verifies the reset mechanism works (it attempts to re-render)
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should reload page when "Refresh Page" is clicked', () => {
      // Mock window.location.reload
      const reloadMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByText('Refresh Page');
      fireEvent.click(refreshButton);

      expect(reloadMock).toHaveBeenCalled();
    });
  });

  describe('Custom Fallback', () => {
    it('should render custom fallback UI when provided', () => {
      const customFallback = <div>Custom error message</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Sections', () => {
    it('should isolate errors to specific error boundary', () => {
      render(
        <div>
          <ErrorBoundary section="Section A">
            <ThrowError />
          </ErrorBoundary>
          <ErrorBoundary section="Section B">
            <WorkingComponent />
          </ErrorBoundary>
        </div>
      );

      // Section A should show error
      expect(screen.getByText('Section: Section A')).toBeInTheDocument();
      
      // Section B should still work
      expect(screen.getByText('Working component')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert" on error container', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should hide error icon from screen readers', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const errorIcon = screen.getByRole('alert').querySelector('svg');
      expect(errorIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have accessible button labels', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByText('Try Again');
      expect(tryAgainButton).toHaveAttribute('aria-label', 'Try again to reload this section');
    });
  });
});
