const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const auth = require('../middleware/auth');
const schedulerService = require('../services/schedulerService');

router.post('/', auth, reminderController.createReminder);
router.get('/', auth, reminderController.getReminders);
router.get('/plant/:plantId', auth, reminderController.getRemindersByPlant);
router.put('/:id', auth, reminderController.updateReminder);
router.delete('/:id', auth, reminderController.deleteReminder);
router.put('/:id/complete', auth, reminderController.markCompleted);

// Scheduler status (for debugging)
router.get('/scheduler/status', auth, (req, res) => {
  try {
    const status = schedulerService.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    res.status(500).json({ message: 'Failed to get scheduler status' });
  }
});

// Manually trigger reminder check (for debugging)
router.post('/scheduler/check', auth, async (req, res) => {
  try {
    await schedulerService.manualCheck();
    res.json({ message: 'Manual reminder check completed' });
  } catch (error) {
    console.error('Error in manual reminder check:', error);
    res.status(500).json({ message: 'Failed to trigger manual check' });
  }
});

// Reset scheduler error count (for debugging)
router.post('/scheduler/reset-errors', auth, (req, res) => {
  try {
    schedulerService.resetErrorCount();
    res.json({ message: 'Error count reset successfully' });
  } catch (error) {
    console.error('Error resetting error count:', error);
    res.status(500).json({ message: 'Failed to reset error count' });
  }
});

module.exports = router; 