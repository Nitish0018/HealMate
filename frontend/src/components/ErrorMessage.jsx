/**
 * ErrorMessage Component
 * Displays error messages with optional retry button
 * 
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {Function} [props.onRetry] - Optional retry callback function
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.variant] - Error variant ('error', 'warning', 'info')
 */
const ErrorMessage = ({ 
  message, 
  onRetry, 
  className = '',
  variant = 'error' 
}) => {
  const variantClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconClasses = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  return (
    <div 
      className={`border rounded-lg p-4 ${variantClasses[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <svg 
            className={`h-5 w-5 ${iconClasses[variant]}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <div className="ml-auto pl-3">
            <button
              onClick={onRetry}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              aria-label="Retry"
            >
              <svg 
                className="h-4 w-4 mr-1" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
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
