import { useState, useEffect } from 'react';

/**
 * Custom hook to detect online/offline status
 * Listens to browser online/offline events
 * 
 * @returns {boolean} - true if online, false if offline
 */
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Handler for when connection is restored
    const handleOnline = () => {
      console.log('[Network] Connection restored - Online');
      setIsOnline(true);
    };

    // Handler for when connection is lost
    const handleOffline = () => {
      console.log('[Network] Connection lost - Offline');
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export default useOnlineStatus;
