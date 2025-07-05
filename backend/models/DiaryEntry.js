const mongoose = require('mongoose');

const DiaryEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  photoUrl: { type: String },
  activity: { type: String }, // e.g., 'watering', 'fertilizing', 'pruning', 'observation'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema); 