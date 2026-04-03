/**
 * ErrorMessage Component
 * Raus-inspired: warm, non-aggressive error display
 */
const ErrorMessage = ({ 
  message, 
  onRetry, 
  className = '',
  variant = 'error' 
}) => {
  const variantClasses = {
    error: 'bg-red-50 border-red-100 text-red-600',
    warning: 'bg-gold-50 border-gold-100 text-gold-500',
    info: 'bg-forest-50 border-forest-100 text-forest-500',
  };

  return (
    <div 
      className={`border rounded-2xl p-5 ${variantClasses[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 opacity-60" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>

        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        {onRetry && (
          <div className="ml-auto pl-3">
            <button
              onClick={onRetry}
              className="btn-pill bg-white/80 text-forest-500 px-4 py-2 text-xs font-semibold border border-cream-200 hover:shadow-warm"
              aria-label="Retry"
            >
              <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path 
                  fillRule="evenodd" 
                  d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" 
                  clipRule="evenodd" 
                />
              </svg>
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
