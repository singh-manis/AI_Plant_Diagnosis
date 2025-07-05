const Notification = require('../models/Notification');
const User = require('../models/User');

// Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (page - 1) * limit;

    let query = { user: req.user.id };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .populate('relatedPlant', 'name species photoUrl')
      .populate('relatedReminder', 'title dueDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });

    res.json({
      notifications,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + notifications.length < total
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// Get notification by ID
const getNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('relatedPlant', 'name species photoUrl')
      .populate('relatedReminder', 'title dueDate');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ message: 'Failed to fetch notification' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

// Delete all read notifications
const deleteReadNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      user: req.user.id,
      read: true
    });

    res.json({ 
      message: `${result.deletedCount} notifications deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting read notifications:', error);
    res.status(500).json({ message: 'Failed to delete notifications' });
  }
};

// Get notification statistics
const getNotificationStats = async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: ['$read', 0, 1] }
          }
        }
      }
    ]);

    const totalUnread = await Notification.countDocuments({
      user: req.user.id,
      read: false
    });

    const totalCount = await Notification.countDocuments({
      user: req.user.id
    });

    res.json({
      stats,
      totalUnread,
      totalCount
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({ message: 'Failed to fetch notification statistics' });
  }
};

// Create notification (internal use)
const createNotification = async (userId, notificationData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check user notification preferences
    if (user.notificationSettings && !user.notificationSettings.enabled) {
      return null; // Don't create notification if disabled
    }

    const notification = new Notification({
      user: userId,
      ...notificationData
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Create reminder notification
const createReminderNotification = async (reminder) => {
  const notificationData = {
    type: 'reminder',
    title: `Reminder: ${reminder.title}`,
    message: `It's time to ${reminder.reminderType.replace('_', ' ')} your plant${reminder.plant ? ` - ${reminder.plant.name}` : ''}`,
    relatedReminder: reminder._id,
    relatedPlant: reminder.plant,
    priority: reminder.completed ? 'low' : 'high',
    data: {
      reminderType: reminder.reminderType,
      dueDate: reminder.dueDate
    }
  };

  return await createNotification(reminder.user, notificationData);
};

// Create plant care notification
const createPlantCareNotification = async (plant, careType, message) => {
  const notificationData = {
    type: 'plant_care',
    title: `Plant Care: ${plant.name}`,
    message,
    relatedPlant: plant._id,
    priority: 'medium',
    data: {
      careType,
      plantName: plant.name
    }
  };

  return await createNotification(plant.user, notificationData);
};

// Create weather alert notification
const createWeatherAlertNotification = async (userId, weatherData) => {
  const notificationData = {
    type: 'weather_alert',
    title: 'Weather Alert',
    message: `Weather conditions may affect your plants. ${weatherData.alert}`,
    priority: 'medium',
    data: {
      weather: weatherData
    }
  };

  return await createNotification(userId, notificationData);
};

// Create AI insight notification
const createAIInsightNotification = async (userId, insight) => {
  const notificationData = {
    type: 'ai_insight',
    title: 'AI Plant Insight',
    message: insight.message,
    priority: 'low',
    data: {
      insight: insight
    }
  };

  return await createNotification(userId, notificationData);
};

module.exports = {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getNotificationStats,
  createNotification,
  createReminderNotification,
  createPlantCareNotification,
  createWeatherAlertNotification,
  createAIInsightNotification
}; 