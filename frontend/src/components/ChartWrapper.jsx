import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * ChartWrapper Component
 * Reusable wrapper for chart components with consistent styling,
 * loading state, and error handling
 * 
 * @param {Object} props
 * @param {string} props.title - Chart title
 * @param {React.ReactNode} props.children - Chart component to render
 * @param {boolean} [props.loading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {Function} [props.onRetry] - Retry callback function
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.subtitle] - Optional subtitle
 */
const ChartWrapper = ({ 
  title, 
  children, 
  loading = false, 
  error = null, 
  onRetry,
  className = '',
  subtitle 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      <div className="relative">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {error && !loading && (
          <ErrorMessage 
            message={error} 
            onRetry={onRetry}
            className="my-4"
          />
        )}

        {!loading && !error && (
          <div className="w-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartWrapper;
