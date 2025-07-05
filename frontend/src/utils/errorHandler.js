/**
 * Utility functions for handling API errors and providing user-friendly messages
 */

/**
 * Get user-friendly error message based on error type
 * @param {Error} error - The error object
 * @param {string} context - Context of where the error occurred (e.g., 'plants', 'diary')
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, context = '') => {
  // Network errors
  if (!error.response) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  const { status, data } = error.response;

  // Server error messages
  if (data?.msg) {
    return data.msg;
  }

  // HTTP status code based messages
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return `${context ? context.charAt(0).toUpperCase() + context.slice(1) : 'Item'} not found.`;
    case 409:
      return 'This item already exists.';
    case 422:
      return 'Please check your input and try again.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

/**
 * Check if error is a network error
 * @param {Error} error - The error object
 * @returns {boolean} True if it's a network error
 */
export const isNetworkError = (error) => {
  return !error.response && (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error'));
};

/**
 * Check if error is an authentication error
 * @param {Error} error - The error object
 * @returns {boolean} True if it's an authentication error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401 || error.response?.status === 403;
};

/**
 * Check if error is a server error
 * @param {Error} error - The error object
 * @returns {boolean} True if it's a server error
 */
export const isServerError = (error) => {
  return error.response?.status >= 500;
};

/**
 * Log error for debugging (only in development)
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}] Error:`, error);
    if (error.response) {
      console.error('Response:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
};

/**
 * Handle API error with logging and user-friendly message
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error, context = '') => {
  logError(error, context);
  return getErrorMessage(error, context);
}; 