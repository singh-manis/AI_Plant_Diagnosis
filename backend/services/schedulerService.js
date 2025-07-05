const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const emailService = require('./emailService');

class SchedulerService {
  constructor() {
    this.isProcessing = false;
    this.lastExecution = null;
    this.executionCount = 0;
    this.errorCount = 0;
    this.initScheduler();
  }

  initScheduler() {
    // Check for reminders every 5 minutes instead of every minute
    const task = cron.schedule('*/5 * * * *', async () => {
      await this.checkReminders();
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata", // Set timezone to avoid timezone issues
      recoverMissedExecutions: false // Don't try to recover missed executions
    });

    // Handle task errors
    task.on('error', (error) => {
      console.error('Cron task error:', error);
      this.errorCount++;
    });

    console.log('Scheduler initialized - checking reminders every 5 minutes');
  }

  async checkReminders() {
    // Prevent overlapping executions
    if (this.isProcessing) {
      console.log('Reminder check already in progress, skipping...');
      return;
    }

    this.isProcessing = true;
    this.lastExecution = new Date();
    this.executionCount++;
    const startTime = Date.now();

    try {
      console.log(`Starting reminder check #${this.executionCount}...`);
      
      const now = new Date();
      const reminders = await Reminder.find({
        scheduledDate: { $lte: now },
        isCompleted: false
      }).populate('user', 'email name').populate('plant', 'name');

      console.log(`Found ${reminders.length} reminders to process`);

      // Process reminders with timeout and better error handling
      let processedCount = 0;
      let errorCount = 0;

      for (const reminder of reminders) {
        try {
          // Add timeout for each reminder processing
          await Promise.race([
            this.processReminder(reminder),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Reminder processing timeout')), 30000)
            )
          ]);
          processedCount++;
        } catch (error) {
          console.error(`Error processing reminder ${reminder._id}:`, error);
          errorCount++;
          // Continue with next reminder instead of stopping
          continue;
        }
      }

      const duration = Date.now() - startTime;
      console.log(`Reminder check completed in ${duration}ms - Processed: ${processedCount}, Errors: ${errorCount}`);
    } catch (error) {
      console.error('Error in reminder check:', error);
      this.errorCount++;
    } finally {
      this.isProcessing = false;
    }
  }

  async processReminder(reminder) {
    try {
      // Send email notification
      if (reminder.user && reminder.user.email) {
        await emailService.sendReminderEmail(
          reminder.user.email,
          reminder.user.name,
          reminder.plant?.name || 'Unknown Plant',
          reminder.title,
          reminder.description
        );
        console.log(`Email sent for reminder: ${reminder.title}`);
      }

      // Mark as completed if not recurring
      if (!reminder.isRecurring) {
        reminder.isCompleted = true;
        await reminder.save();
        console.log(`Marked reminder as completed: ${reminder.title}`);
      } else {
        // Update next scheduled date for recurring reminders
        const nextDate = new Date(reminder.scheduledDate);
        nextDate.setDate(nextDate.getDate() + (reminder.recurringDays || 1));
        reminder.scheduledDate = nextDate;
        await reminder.save();
        console.log(`Updated recurring reminder: ${reminder.title} - Next: ${nextDate}`);
      }
    } catch (error) {
      console.error(`Error processing reminder ${reminder._id}:`, error);
      throw error;
    }
  }

  // Method to manually trigger reminder check (for testing)
  async manualCheck() {
    console.log('Manual reminder check triggered');
    await this.checkReminders();
  }

  // Method to get scheduler status
  getStatus() {
    return {
      isProcessing: this.isProcessing,
      lastExecution: this.lastExecution?.toISOString(),
      executionCount: this.executionCount,
      errorCount: this.errorCount,
      uptime: process.uptime()
    };
  }

  // Method to reset error count
  resetErrorCount() {
    this.errorCount = 0;
    console.log('Error count reset');
  }
}

module.exports = new SchedulerService(); 