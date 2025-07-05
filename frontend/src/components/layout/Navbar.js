import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../NotificationCenter';
import NotificationService from '../../services/notificationService';
import { notificationsAPI } from '../../services/api';
import logo from '../../logo.svg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const logoRef = useRef();

  useEffect(() => {
    // Initialize notification service
    NotificationService.initialize();
    
    // Fetch initial notification count
    fetchNotificationCount();
    
    // Set up periodic count updates
    const interval = setInterval(fetchNotificationCount, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const response = await notificationsAPI.getStats();
      setUnreadCount(response.data.totalUnread);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-gray-900/95 backdrop-blur-md shadow-lg fixed top-0 w-full z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/showcase" className="flex-shrink-0 flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
                <img src={logo} alt="PlantCare Logo" className="w-8 h-8 mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  PlantCare
                </span>
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/plants"
                  className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Plants
                </Link>
                <Link
                  to="/diary"
                  className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Diary
                </Link>
                <Link
                  to="/reminders"
                  className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Reminders
                </Link>
                <Link
                  to="/ai"
                  className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  AI Assistant
                </Link>
                <Link
                  to="/weather"
                  className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Weather
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 text-gray-300 hover:text-emerald-400 hover:bg-gray-800 rounded-lg transition-all duration-200"
                  title="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-all duration-200 focus:outline-none"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm font-semibold hidden sm:block">{user?.name}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-emerald-400 transition-colors duration-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">👤</span>
                        Profile & Settings
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-red-900/50 hover:text-red-400 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <span className="mr-3">🚪</span>
                        Sign Out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
        )}
      </nav>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default Navbar; 