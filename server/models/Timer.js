const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
  time: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Timer', timerSchema);
