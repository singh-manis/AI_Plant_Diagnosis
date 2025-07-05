const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notificationSettings: {
    enabled: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    reminders: { type: Boolean, default: true },
    plantCare: { type: Boolean, default: true },
    weatherAlerts: { type: Boolean, default: true },
    aiInsights: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema); 