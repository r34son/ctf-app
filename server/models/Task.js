const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String, // TODO: must be an enum
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  flag: {
    type: String,
    required: true,
  },
  enableAfter: {
    type: Number,
    default: 0,
  },
  force: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Task', taskSchema);
