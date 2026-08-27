const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// @route   GET api/notifications/:staffId
// @desc    Get notifications by staff ID
router.get('/:staffId', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json([]);
  }

  try {
    const notifications = await Notification.find({ staffId: req.params.staffId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
