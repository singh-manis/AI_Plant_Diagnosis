import React from 'react';

/**
 * Global error boundary component to catch and handle React errors
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} ErrorBoundary component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gray-800/80 border border-red-500/30 rounded-2xl shadow-2xl p-8 text-center backdrop-blur">
            <div className="text-6xl mb-4">🌱</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-300 mb-6">
              We encountered an unexpected error. Don't worry, your plants are safe!
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                🔄 Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                🏠 Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-red-400 cursor-pointer hover:text-red-300">
                  Show Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-900 rounded text-xs text-red-300 overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
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