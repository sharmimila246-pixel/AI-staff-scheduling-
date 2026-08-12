const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema({
  date: {
    type: String, // format YYYY-MM-DD
    required: true,
    unique: true,
  },
  type: {
    type: String, // 'Class Day', 'Working Saturday', 'Holiday'
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);
