const Reminder = require('../models/Reminder');
const User = require('../models/User');
const Plant = require('../models/Plant');
const emailService = require('../services/emailService');

exports.createReminder = async (req, res) => {
  console.log('Received request to create reminder:', req.body);
  try {
    const reminder = new Reminder({ ...req.body, user: req.user.id });
    await reminder.save();
    await reminder.populate('plant', 'name');
    console.log('Reminder saved successfully:', reminder);
    res.status(201).json(reminder);
  } catch (err) {
    console.error('Error creating reminder:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id })
      .populate('plant', 'name species')
      .sort({ scheduledDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getRemindersByPlant = async (req, res) => {
  try {
    const reminders = await Reminder.find({ 
      user: req.user.id, 
      plant: req.params.plantId 
    })
      .populate('plant', 'name species')
      .sort({ scheduledDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    ).populate('plant', 'name species');
    if (!reminder) return res.status(404).json({ msg: 'Reminder not found' });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    if (!reminder) return res.status(404).json({ msg: 'Reminder not found' });
    res.json({ msg: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.markCompleted = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isCompleted: true },
      { new: true }
    ).populate('plant', 'name species');
    if (!reminder) return res.status(404).json({ msg: 'Reminder not found' });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 