const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  paused: Boolean,
  pausedAt: Date,
});

module.exports = mongoose.model('Timer', timerSchema);
