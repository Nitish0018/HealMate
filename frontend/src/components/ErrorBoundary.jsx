import { Component } from 'react';

/**
 * ErrorBoundary Component
 * Raus-inspired: warm, calming error state
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const section = this.props.section || 'Unknown Section';
    console.error(`[ErrorBoundary - ${section}] Error caught:`, error);
    console.error(`[ErrorBoundary - ${section}] Error info:`, errorInfo);
    console.error(`[ErrorBoundary - ${section}] Component stack:`, errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[200px] flex items-center justify-center p-6" role="alert">
          <div className="max-w-md w-full bg-cream-100 border border-cream-200 rounded-2xl p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-copper-500/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-copper-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="ml-4 flex-1">
                <h3 className="font-serif text-lg text-forest-500">
                  Something went wrong
                </h3>
                <div className="mt-2 text-sm text-forest-500/50">
                  <p>
                    An error occurred. Please try refreshing the page.
                  </p>
                  {this.props.section && (
                    <p className="mt-1 text-xs text-forest-500/30">
                      Section: {this.props.section}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={this.handleReset}
                    className="btn-pill bg-forest-500 text-cream-50 px-5 py-2.5 text-sm font-medium"
                    aria-label="Try again to reload this section"
                  >
                    Try Again
                  </button>

                  <button
                    onClick={() => window.location.reload()}
                    className="btn-pill-outline px-5 py-2.5 text-sm"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-xs">
                <summary className="cursor-pointer text-forest-500/40 font-medium hover:text-forest-500/60">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2 p-4 bg-cream-200/50 rounded-xl overflow-auto">
                  <p className="font-semibold text-forest-500">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-forest-500/50 whitespace-pre-wrap text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
