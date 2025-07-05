import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Custom 404 page component for handling non-existent routes
 * @returns {JSX.Element} NotFound component
 */
const NotFound = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to plants page with search term
      navigate(`/plants?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const quickLinks = [
    { name: 'My Plants', path: '/plants', icon: '🌱' },
    { name: 'Care Diary', path: '/diary', icon: '📝' },
    { name: 'Reminders', path: '/reminders', icon: '⏰' },
    { name: 'AI Assistant', path: '/ai', icon: '🤖' },
    { name: 'Weather', path: '/weather', icon: '🌤️' },
    { name: 'Dashboard', path: '/dashboard', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Main 404 Content */}
        <div className="mb-12">
          <div className="text-8xl mb-6 animate-bounce">🌱</div>
          <h1 className="text-6xl font-bold text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Plant Not Found
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Looks like this page has wandered off to find some sunlight! 
            Don't worry, we'll help you get back to your garden.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-800/80 border border-emerald-900/30 rounded-2xl shadow-lg p-8 mb-8 backdrop-blur">
          <h3 className="text-xl font-semibold text-white mb-4">
            Looking for something specific?
          </h3>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for plants, care tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              🔍
            </button>
          </form>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gray-800/80 border border-emerald-900/30 rounded-2xl shadow-lg p-8 mb-8 backdrop-blur">
          <h3 className="text-xl font-semibold text-white mb-6">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex flex-col items-center p-4 bg-gray-900/50 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group"
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {link.icon}
                </span>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            🏠 Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            ← Go Back
          </button>
        </div>

        {/* Fun Plant Facts */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            💡 Did you know? Some plants can communicate with each other through their root systems!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 