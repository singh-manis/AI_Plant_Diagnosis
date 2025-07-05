const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['watering', 'fertilizing', 'pruning', 'repotting', 'custom'], required: true },
  scheduledDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  isRecurring: { type: Boolean, default: false },
  recurringDays: { type: Number }, // for recurring reminders
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', ReminderSchema); 