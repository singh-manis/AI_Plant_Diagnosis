import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { notificationsAPI } from '../services/api';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, unread, read

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const unreadOnly = activeTab === 'unread';
      const response = await notificationsAPI.getAll(1, 50, unreadOnly);
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(notifications.map(notification =>
        notification._id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationsAPI.delete(notificationId);
      setNotifications(notifications.filter(notification => notification._id !== notificationId));
      if (!notifications.find(n => n._id === notificationId)?.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleDeleteRead = async () => {
    try {
      await notificationsAPI.deleteRead();
      setNotifications(notifications.filter(notification => !notification.read));
    } catch (error) {
      console.error('Error deleting read notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      reminder: '⏰',
      plant_care: '🌱',
      weather_alert: '🌤️',
      system: '⚙️',
      ai_insight: '🤖'
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type) => {
    const colors = {
      reminder: 'bg-blue-100 text-blue-800',
      plant_care: 'bg-green-100 text-green-800',
      weather_alert: 'bg-yellow-100 text-yellow-800',
      system: 'bg-gray-100 text-gray-800',
      ai_insight: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    return colors[priority] || 'text-gray-500';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'read') return notification.read;
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 ${activeTab === 'all' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 ${activeTab === 'unread' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 ${activeTab === 'read' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Read
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
              >
                Mark all read
              </button>
            )}
            {notifications.some(n => n.read) && (
              <button
                onClick={handleDeleteRead}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
              >
                Delete read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-gray-500">
                {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map(notification => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h3>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                              {notification.type.replace('_', ' ')}
                            </span>
                            <span className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.createdAt)}
                            </span>
                            <div className="flex gap-1">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  className="text-xs text-primary-600 hover:text-primary-700 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                                >
                                  Mark read
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification._id)}
                                className="text-xs text-red-600 hover:text-red-700 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Related content links */}
                      {(notification.relatedPlant || notification.relatedReminder) && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          {notification.relatedPlant && (
                            <Link
                              to={`/plants/${notification.relatedPlant._id}`}
                              className="text-xs text-primary-600 hover:text-primary-700 mr-3"
                            >
                              View Plant: {notification.relatedPlant.name}
                            </Link>
                          )}
                          {notification.relatedReminder && (
                            <Link
                              to="/reminders"
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              View Reminder
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <Link
            to="/notifications"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all notifications →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter; 