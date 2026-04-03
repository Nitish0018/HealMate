# Error Handling Implementation

This document describes the error handling and offline detection features implemented for the HealMate Phase 3 Core Frontend application.

## Overview

The application implements comprehensive error handling through:
1. **React Error Boundaries** - Catch and handle component errors gracefully
2. **Offline Detection** - Detect and notify users when they lose network connectivity
3. **Error Logging** - Log errors to console for debugging purposes
4. **Fallback UI** - Display user-friendly error messages with recovery options

## Components

### ErrorBoundary Component

**Location**: `src/components/ErrorBoundary.jsx`

A React class component that catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI.

#### Features:
- Catches errors in child components during rendering, lifecycle methods, and constructors
- Logs error details to console with section identification
- Displays user-friendly error message with recovery options
- Provides "Try Again" button to attempt re-rendering
- Provides "Refresh Page" button for full page reload
- Shows detailed error information in development mode
- Supports custom fallback UI via props

#### Usage:

```jsx
import ErrorBoundary from './components/ErrorBoundary';

// Basic usage
<ErrorBoundary section="Dashboard">
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary 
  section="Critical Section"
  fallback={<CustomErrorUI />}
>
  <YourComponent />
</ErrorBoundary>
```

#### Props:
- `children` (ReactNode, required) - Components to wrap and protect
- `section` (string, optional) - Section name for error logging and display
- `fallback` (ReactNode, optional) - Custom fallback UI to display on error

### OfflineBanner Component

**Location**: `src/components/OfflineBanner.jsx`

A component that displays a banner at the top of the page when the user loses network connectivity.

#### Features:
- Automatically detects online/offline status
- Fixed positioning at top of viewport
- High z-index for visibility above other content
- Accessible with ARIA attributes
- Automatically hides when connection is restored

#### Usage:

```jsx
import OfflineBanner from './components/OfflineBanner';

function App() {
  return (
    <>
      <OfflineBanner />
      {/* Rest of your app */}
    </>
  );
}
```

### useOnlineStatus Hook

**Location**: `src/hooks/useOnlineStatus.js`

A custom React hook that monitors the browser's online/offline status.

#### Features:
- Returns current online status (boolean)
- Listens to browser online/offline events
- Logs network status changes to console
- Automatically cleans up event listeners on unmount

#### Usage:

```jsx
import useOnlineStatus from './hooks/useOnlineStatus';

function MyComponent() {
  const isOnline = useOnlineStatus();
  
  return (
    <div>
      {isOnline ? 'Connected' : 'Offline'}
    </div>
  );
}
```

## Implementation in App.jsx

The error handling features are integrated into the main application:

```jsx
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';

function App() {
  return (
    <ErrorBoundary section="App Root">
      <Router>
        <AuthProvider>
          <OfflineBanner />
          
          <Routes>
            {/* Patient routes with error boundaries */}
            <Route 
              path="/patient/dashboard" 
              element={
                <ProtectedRoute requiredRole="PATIENT">
                  <ErrorBoundary section="Patient Dashboard">
                    <PatientDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Doctor routes with error boundaries */}
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute requiredRole="DOCTOR">
                  <ErrorBoundary section="Doctor Dashboard">
                    <DoctorDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* More routes... */}
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
```

## Error Isolation Strategy

The application uses multiple error boundaries to isolate errors:

1. **Root Level** - Catches catastrophic errors in the entire app
2. **Page Level** - Catches errors in specific pages (Patient Dashboard, Doctor Dashboard, etc.)
3. **Section Level** - Can be added to isolate specific sections within pages

This strategy ensures that:
- Errors in one section don't crash the entire application
- Users can continue using unaffected parts of the app
- Each section can be recovered independently

## Testing

Comprehensive tests are provided for all error handling features:

### Unit Tests:
- `ErrorBoundary.test.jsx` - Tests error catching, fallback UI, and recovery
- `useOnlineStatus.test.js` - Tests online/offline detection
- `OfflineBanner.test.jsx` - Tests banner display and accessibility

### Integration Tests:
- `ErrorHandling.integration.test.jsx` - Tests interaction between components

Run tests with:
```bash
npm test
```

## Accessibility

All error handling components follow accessibility best practices:

- Error boundaries use `role="alert"` for screen reader announcements
- Offline banner uses `aria-live="assertive"` for immediate notification
- Icons are hidden from screen readers with `aria-hidden="true"`
- Buttons have descriptive `aria-label` attributes
- Color is not the only indicator of error state

## Error Logging

Errors are logged to the console with the following format:

```
[ErrorBoundary - Section Name] Error caught: Error message
[ErrorBoundary - Section Name] Error info: { componentStack: ... }
[ErrorBoundary - Section Name] Component stack: ...
```

In production, you can extend this to send errors to an error tracking service like Sentry, LogRocket, or Rollbar.

## Requirements Validation

This implementation validates **Requirement 11.2**:
> "If an API request fails, the system shall display an error message with retry option"

The ErrorBoundary component provides:
- ✅ Error message display
- ✅ Retry option ("Try Again" button)
- ✅ Alternative recovery option ("Refresh Page" button)
- ✅ User-friendly messaging
- ✅ Graceful degradation

## Best Practices

1. **Wrap major sections** - Use error boundaries around major application sections
2. **Provide section names** - Always provide descriptive section names for debugging
3. **Don't overuse** - Don't wrap every small component; focus on major sections
4. **Custom fallbacks** - Use custom fallbacks for critical sections that need specific recovery UIs
5. **Monitor errors** - In production, send errors to a monitoring service
6. **Test error scenarios** - Regularly test error scenarios to ensure boundaries work correctly

## Future Enhancements

Potential improvements for the error handling system:

1. **Error Reporting Service** - Integrate with Sentry or similar service
2. **Error Analytics** - Track error frequency and patterns
3. **Retry Logic** - Implement automatic retry with exponential backoff
4. **Offline Queue** - Queue actions when offline and sync when online
5. **Service Worker** - Add service worker for better offline support
6. **Error Recovery Strategies** - Implement different recovery strategies per error type
7. **User Feedback** - Allow users to report errors with additional context

## Troubleshooting

### Error boundary not catching errors
- Error boundaries only catch errors in child components
- They don't catch errors in event handlers (use try-catch instead)
- They don't catch errors in async code (use .catch() or try-catch)

### Offline banner not showing
- Check if `navigator.onLine` is supported in your browser
- Verify the hook is properly imported and used
- Check browser console for any errors

### Tests failing
- Ensure all dependencies are installed: `npm install`
- Clear test cache: `npm test -- --clearCache`
- Check that mocks are properly set up in test files

## Resources

- [React Error Boundaries Documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [MDN: Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [Web.dev: Offline UX Considerations](https://web.dev/offline-ux-design-guidelines/)
