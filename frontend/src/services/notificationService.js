import { notificationsAPI } from './api';

class NotificationService {
  // Get all notifications
  static async getNotifications(page = 1, limit = 20, unreadOnly = false) {
    const response = await notificationsAPI.getAll(page, limit, unreadOnly);
    return response.data;
  }

  // Get notification by ID
  static async getNotification(id) {
    const response = await notificationsAPI.getById(id);
    return response.data;
  }

  // Mark notification as read
  static async markAsRead(id) {
    const response = await notificationsAPI.markAsRead(id);
    return response.data;
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    const response = await notificationsAPI.markAllAsRead();
    return response.data;
  }

  // Delete notification
  static async deleteNotification(id) {
    const response = await notificationsAPI.delete(id);
    return response.data;
  }

  // Delete all read notifications
  static async deleteReadNotifications() {
    const response = await notificationsAPI.deleteRead();
    return response.data;
  }

  // Get notification statistics
  static async getNotificationStats() {
    const response = await notificationsAPI.getStats();
    return response.data;
  }

  // Request push notification permission
  static async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Show push notification
  static showPushNotification(title, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const defaultOptions = {
              icon: '/favicon.svg',
        badge: '/favicon.svg',
      requireInteraction: false,
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    // Handle notification click
    notification.onclick = function() {
      window.focus();
      notification.close();
      
      // Navigate to relevant page if URL is provided
      if (options.url) {
        window.location.href = options.url;
      }
    };

    return notification;
  }

  // Show reminder notification
  static showReminderNotification(reminder) {
    const title = `Reminder: ${reminder.title}`;
    const options = {
      body: `It's time to ${reminder.reminderType.replace('_', ' ')} your plant${reminder.plant ? ` - ${reminder.plant.name}` : ''}`,
      tag: `reminder-${reminder._id}`,
      url: `/reminders`,
      requireInteraction: true
    };

    return this.showPushNotification(title, options);
  }

  // Show plant care notification
  static showPlantCareNotification(plant, careType, message) {
    const title = `Plant Care: ${plant.name}`;
    const options = {
      body: message,
      tag: `plant-care-${plant._id}`,
      url: `/plants/${plant._id}`,
      requireInteraction: false
    };

    return this.showPushNotification(title, options);
  }

  // Show weather alert notification
  static showWeatherAlertNotification(alert) {
    const title = 'Weather Alert';
    const options = {
      body: `Weather conditions may affect your plants. ${alert}`,
      tag: 'weather-alert',
      url: '/weather',
      requireInteraction: false
    };

    return this.showPushNotification(title, options);
  }

  // Show AI insight notification
  static showAIInsightNotification(insight) {
    const title = 'AI Plant Insight';
    const options = {
      body: insight.message,
      tag: 'ai-insight',
      url: '/ai',
      requireInteraction: false
    };

    return this.showPushNotification(title, options);
  }

  // Initialize notification service
  static async initialize() {
    const hasPermission = await this.requestPermission();
    
    if (hasPermission) {
      console.log('Push notifications enabled');
      
      // Set up periodic notification checks
      this.startNotificationPolling();
    } else {
      console.log('Push notifications disabled');
    }
  }

  // Poll for new notifications
  static startNotificationPolling() {
    // Check for new notifications every 30 seconds
    setInterval(async () => {
      try {
        const { notifications, unreadCount } = await this.getNotifications(1, 5, true);
        
        // Show notifications for unread items
        notifications.forEach(notification => {
          if (!notification.read) {
            this.showNotificationBasedOnType(notification);
          }
        });

        // Update notification badge
        this.updateNotificationBadge(unreadCount);
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    }, 30000); // 30 seconds
  }

  // Show notification based on type
  static showNotificationBasedOnType(notification) {
    switch (notification.type) {
      case 'reminder':
        this.showReminderNotification(notification.relatedReminder);
        break;
      case 'plant_care':
        this.showPlantCareNotification(
          notification.relatedPlant,
          notification.data.careType,
          notification.message
        );
        break;
      case 'weather_alert':
        this.showWeatherAlertNotification(notification.message);
        break;
      case 'ai_insight':
        this.showAIInsightNotification(notification.data.insight);
        break;
      default:
        this.showPushNotification(notification.title, {
          body: notification.message,
          tag: `notification-${notification._id}`
        });
    }
  }

  // Update notification badge
  static updateNotificationBadge(count) {
    // Update favicon badge if supported
    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(count);
    }

    // Update page title
    if (count > 0) {
      document.title = `(${count}) AI Plant Care`;
    } else {
      document.title = 'AI Plant Care';
    }
  }
}

export default NotificationService; 