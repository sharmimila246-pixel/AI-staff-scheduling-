const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');

// @route   GET api/calendar
// @desc    Get all calendar events (e.g. for May 2024)
router.get('/', async (req, res) => {
  try {
    const events = await CalendarEvent.find();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
