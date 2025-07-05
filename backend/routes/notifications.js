const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getNotificationStats
} = require('../controllers/notificationController');

// Get all notifications for the authenticated user
router.get('/', auth, getNotifications);

// Get notification statistics
router.get('/stats', auth, getNotificationStats);

// Get specific notification
router.get('/:id', auth, getNotification);

// Mark notification as read
router.patch('/:id/read', auth, markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', auth, markAllAsRead);

// Delete specific notification
router.delete('/:id', auth, deleteNotification);

// Delete all read notifications
router.delete('/delete-read', auth, deleteReadNotifications);

module.exports = router; 