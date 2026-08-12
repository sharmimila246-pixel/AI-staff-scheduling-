const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');

// @route   GET api/staff
// @desc    Get all staff (for Profile Selection)
router.get('/', async (req, res) => {
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

