const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  species: { type: String },
  location: { type: String },
  potSize: { type: String },
  sunlight: { type: String },
  photoUrl: { type: String },
  careSchedule: { type: Object },
  location: {
    city: { type: String },
    lat: { type: Number },
    lon: { type: Number }
  },
  weatherAware: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plant', PlantSchema); 