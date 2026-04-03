/**
 * LoadingSpinner Component
 * Raus-inspired: minimal, warm-toned spinner
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'border-forest-500', 
  className = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
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
      <div className="fixed inset-0 flex items-center justify-center bg-cream-100/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
