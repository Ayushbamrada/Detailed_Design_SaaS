// src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

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
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Optional: Send to your logging service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Optionally reload the page or reset the app state
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-100">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              {this.props.title || "Something went wrong"}
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              {this.props.message || "An error occurred in this component. Please try again."}
            </p>
            
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg overflow-auto max-h-40">
                <p className="text-sm font-mono text-red-600">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <p className="text-xs font-mono text-gray-500 mt-2">
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Higher Order Component to wrap components with error boundary
export function withErrorBoundary(Component, errorBoundaryProps = {}) {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;