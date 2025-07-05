const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/plants', require('./routes/plants'));
app.use('/api/diary', require('./routes/diary'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/notifications', require('./routes/notifications'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'AI Plant Care API is running!' });
});

module.exports = app; 