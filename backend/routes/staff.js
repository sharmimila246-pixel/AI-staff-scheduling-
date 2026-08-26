const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const demoStaff = require('../data/demoStaff');

// @route   GET api/staff
// @desc    Get all staff (for Profile Selection)
router.get('/', async (req, res) => {
  // If DB is not connected, return an empty list so the frontend can still load
  if (mongoose.connection.readyState !== 1) {
    console.warn('MongoDB not connected - returning demo staff list');
    return res.json(demoStaff.getAll());
  }
  try {
    const staffList = await Staff.find().select('-password');
    res.json(staffList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/staff/:id
// @desc    Get staff by ID
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const staff = demoStaff.getById(req.params.id);
      if (!staff) return res.status(404).json({ message: 'Staff member not found' });
      return res.json(staff);
    }

    const staff = await Staff.findById(req.params.id).select('-password');
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/staff/:id
// @desc    Update staff profile details
router.put('/:id', async (req, res) => {
  const { name, email, contact } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = demoStaff.updateById(req.params.id, { name, email, contact });
      if (!updated) return res.status(404).json({ message: 'Staff member not found' });
      return res.json(updated);
    }

    let staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    if (name) staff.name = name;
    if (email) staff.email = email;
    if (contact) staff.contact = contact;

    await staff.save();

    res.json({
      id: staff._id,
      name: staff.name,
      title: staff.title,
      department: staff.department,
      email: staff.email,
      contact: staff.contact,
      joiningDate: staff.joiningDate,
      employeeId: staff.employeeId,
      avatarUrl: staff.avatarUrl,
      username: staff.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/staff/:id/password
// @desc    Update staff password
router.put('/:id/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: accept any password change without verification
      const staff = demoStaff.getById(req.params.id);
      if (!staff) return res.status(404).json({ message: 'Staff member not found' });
      // no-op for demo
      return res.json({ message: 'Password updated (demo mode)' });
    }

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Verify current password
    const isMatch = await staff.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Assign new password (pre-save hook will hash it)
    staff.password = newPassword;
    await staff.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/staff/:id
// @desc    Delete staff profile
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = demoStaff.deleteById(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Staff member not found' });
      return res.json({ message: 'Staff member removed (demo mode)', id: req.params.id });
    }

    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json({ message: 'Staff member removed successfully', id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

