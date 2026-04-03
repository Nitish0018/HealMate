import useOnlineStatus from '../hooks/useOnlineStatus';

/**
 * OfflineBanner Component
 * Displays a banner when the user is offline
 * Automatically shows/hides based on network connectivity
 */
const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  // Don't render anything if online
  if (isOnline) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-3 shadow-lg"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {/* Offline Icon */}
        <svg
          className="h-5 w-5 mr-2 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.5 7.063a7 7 0 00-13 0l6.5 6.5 6.5-6.5zm-1.414 1.414L10 13.563 4.914 8.477a5.5 5.5 0 0110.172 0zM10 18a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
          <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14z" />
        </svg>

        {/* Message */}
        <p className="text-sm font-medium">
          You are offline. Some features may not work properly.
        </p>
      </div>
    </div>
  );
};

export default OfflineBanner;
