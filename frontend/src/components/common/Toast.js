import React from 'react';

/**
 * Toast notification component for displaying success and error messages
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display (if empty, component renders nothing)
 * @param {string} props.type - The type of toast ('success' or 'error')
 * @param {Function} props.onClose - Callback function when close button is clicked
 * @returns {JSX.Element|null} Toast component or null if no message
 */
function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300
      ${type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}
      role="alert"
      aria-live="polite"
    >
      {message}
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white font-bold">×</button>
    </div>
  );
}

export default Toast; 