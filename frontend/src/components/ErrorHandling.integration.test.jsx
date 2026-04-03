import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import OfflineBanner from './OfflineBanner';
import * as useOnlineStatusModule from '../hooks/useOnlineStatus';

/**
 * Integration tests for error handling features
 * Tests the interaction between ErrorBoundary, OfflineBanner, and application components
 */

describe('Error Handling Integration', () => {
  const originalError = console.error;
  
  beforeEach(() => {
    console.error = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalError;
  });

  describe('ErrorBoundary with Multiple Sections', () => {
    it('should isolate errors to specific sections without affecting others', () => {
      const WorkingSection = () => <div>Working Section Content</div>;
      const BrokenSection = () => {
        throw new Error('Section error');
      };

      render(
        <div>
          <ErrorBoundary section="Header">
            <WorkingSection />
          </ErrorBoundary>
          
          <ErrorBoundary section="Main Content">
            <BrokenSection />
          </ErrorBoundary>
          
          <ErrorBoundary section="Footer">
            <WorkingSection />
          </ErrorBoundary>
        </div>
      );

      // Working sections should render normally
      expect(screen.getAllByText('Working Section Content')).toHaveLength(2);
      
      // Broken section should show error UI
      expect(screen.getByText('Section: Main Content')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should allow independent error recovery for each section', () => {
      const BrokenSection = () => {
        throw new Error('Section error');
      };

      render(
        <div>
          <ErrorBoundary section="Section A">
            <BrokenSection />
          </ErrorBoundary>
          
          <ErrorBoundary section="Section B">
            <BrokenSection />
          </ErrorBoundary>
        </div>
      );

      // Both sections should show errors
      expect(screen.getByText('Section: Section A')).toBeInTheDocument();
      expect(screen.getByText('Section: Section B')).toBeInTheDocument();

      // Get all "Try Again" buttons
      const tryAgainButtons = screen.getAllByText('Try Again');
      expect(tryAgainButtons).toHaveLength(2);

      // Click first section's retry button
      fireEvent.click(tryAgainButtons[0]);

      // Both sections should still show errors (since components still throw)
      expect(screen.getByText('Section: Section A')).toBeInTheDocument();
      expect(screen.getByText('Section: Section B')).toBeInTheDocument();
    });
  });

  describe('OfflineBanner with ErrorBoundary', () => {
    it('should display offline banner independently of error boundaries', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      const WorkingComponent = () => <div>App Content</div>;

      render(
        <div>
          <OfflineBanner />
          <ErrorBoundary section="App">
            <WorkingComponent />
          </ErrorBoundary>
        </div>
      );

      // Both offline banner and app content should be visible
      expect(screen.getByText(/You are offline/)).toBeInTheDocument();
      expect(screen.getByText('App Content')).toBeInTheDocument();
    });

    it('should show both offline banner and error UI when offline and error occurs', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(false);

      const BrokenComponent = () => {
        throw new Error('Component error');
      };

      render(
        <div>
          <OfflineBanner />
          <ErrorBoundary section="App">
            <BrokenComponent />
          </ErrorBoundary>
        </div>
      );

      // Both offline banner and error UI should be visible
      expect(screen.getByText(/You are offline/)).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should hide offline banner when online even if error boundary is active', () => {
      vi.spyOn(useOnlineStatusModule, 'default').mockReturnValue(true);

      const BrokenComponent = () => {
        throw new Error('Component error');
      };

      render(
        <div>
          <OfflineBanner />
          <ErrorBoundary section="App">
            <BrokenComponent />
          </ErrorBoundary>
        </div>
      );

      // Offline banner should not be visible
      expect(screen.queryByText(/You are offline/)).not.toBeInTheDocument();
      
      // Error UI should still be visible
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Error Boundary with Router', () => {
    it('should work correctly within router context', () => {
      const WorkingPage = () => <div>Page Content</div>;

      render(
        <BrowserRouter>
          <ErrorBoundary section="Router">
            <WorkingPage />
          </ErrorBoundary>
        </BrowserRouter>
      );

      expect(screen.getByText('Page Content')).toBeInTheDocument();
    });

    it('should catch errors in routed components', () => {
      const BrokenPage = () => {
        throw new Error('Page error');
      };

      render(
        <BrowserRouter>
          <ErrorBoundary section="Router">
            <BrokenPage />
          </ErrorBoundary>
        </BrowserRouter>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Section: Router')).toBeInTheDocument();
    });
  });

  describe('Custom Fallback UI', () => {
    it('should render custom fallback when provided', () => {
      const BrokenComponent = () => {
        throw new Error('Component error');
      };

      const CustomFallback = () => (
        <div className="custom-error">
          <h2>Custom Error Handler</h2>
          <p>Please contact support</p>
        </div>
      );

      render(
        <ErrorBoundary fallback={<CustomFallback />}>
          <BrokenComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error Handler')).toBeInTheDocument();
      expect(screen.getByText('Please contact support')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Error Logging', () => {
    it('should log errors to console for debugging', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const BrokenComponent = () => {
        throw new Error('Test error for logging');
      };

      render(
        <ErrorBoundary section="Logging Test">
          <BrokenComponent />
        </ErrorBoundary>
      );

      // Verify console.error was called (React logs errors)
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Requirement 11.2 Validation', () => {
    it('should display error message with retry option when component fails', () => {
      const FailingComponent = () => {
        throw new Error('API request failed');
      };

      render(
        <ErrorBoundary section="API Component">
          <FailingComponent />
        </ErrorBoundary>
      );

      // Validates Requirement 11.2: Display error message with retry option
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/An error occurred while rendering this section/)).toBeInTheDocument();
      
      // Verify retry button is present
      const retryButton = screen.getByText('Try Again');
      expect(retryButton).toBeInTheDocument();
      
      // Verify retry button is clickable
      fireEvent.click(retryButton);
      
      // After retry, error UI should still be present (component still fails)
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});
