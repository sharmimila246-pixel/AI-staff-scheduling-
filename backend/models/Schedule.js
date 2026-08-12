const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
  year: {
    type: String, // '1st Year', '2nd Year', '3rd Year'
    required: true,
  },
  day: {
    type: String, // 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday (1st & 3rd)'
    required: true,
  },
  timeSlot: {
    type: String, // e.g. '09:00 - 10:00', '10:00 - 11:00'
    required: true,
  },
  subject: {
    type: String, // e.g. 'CS101', 'Break', 'Math101'
    required: true,
  },
  room: {
    type: String, // e.g. 'A1', 'Lab1', or empty for Break
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);
