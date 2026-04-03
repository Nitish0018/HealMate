import { useEffect, useState } from 'react';

/**
 * OfflineBanner Component
 * Raus-inspired: warm, non-intrusive notification
 */
const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in" role="alert">
      <div className="flex items-center gap-3 px-6 py-3.5 bg-forest-500/90 backdrop-blur-xl text-cream-50 rounded-full shadow-warm-lg border border-white/10">
        <div className="w-2 h-2 rounded-full bg-gold-300 animate-pulse" />
        <span className="text-sm font-medium">You're offline — some features may be limited</span>
      </div>
    </div>
  );
};

export default OfflineBanner;
