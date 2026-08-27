const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');
const mongoose = require('mongoose');

// @route   GET api/calendar
// @desc    Get all calendar events (e.g. for May 2024)
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json([
      { _id: 'demo-calendar-1', date: '2024-05-01', type: 'Holiday' },
      { _id: 'demo-calendar-2', date: '2024-05-11', type: 'Working Saturday' },
      { _id: 'demo-calendar-3', date: '2024-05-18', type: 'Working Saturday' },
      { _id: 'demo-calendar-4', date: '2024-05-25', type: 'Holiday' },
    ]);
  }

  try {
    const events = await CalendarEvent.find();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
