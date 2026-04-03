/**
 * LoadingSpinner Component
 * Reusable loading spinner with Tailwind CSS animations
 * 
 * @param {Object} props
 * @param {string} [props.size] - Size of spinner ('sm', 'md', 'lg', 'xl')
 * @param {string} [props.color] - Color of spinner (Tailwind color class)
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.fullScreen] - Whether to display as full screen overlay
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'border-blue-600', 
  className = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${color} border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
