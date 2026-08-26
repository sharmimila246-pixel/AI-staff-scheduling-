const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const mongoose = require('mongoose');
const demoStaff = require('../data/demoStaff');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_staff_scheduler_key';

// @route   POST api/auth/login
// @desc    Authenticate staff & get token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for existing staff
    let staff;
    if (mongoose.connection.readyState !== 1) {
      // Demo mode - validate against in-memory demo users
      staff = demoStaff.getByUsername(username);
      if (!staff || staff.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } else {
      try {
        staff = await Staff.findOne({ username });
      } catch (e) {
        console.warn('Mongoose query failed in auth; falling back to demo users', e.message);
        staff = demoStaff.getByUsername(username);
        if (!staff || staff.password !== password) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      }

      if (!staff) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Validate password (DB-backed user)
      if (staff.comparePassword) {
        const isMatch = await staff.comparePassword(password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      } else {
        // If staff object came from fallback demo, compare plaintext
        if (staff.password !== password) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      }
    }

    // Create JWT
    const token = jwt.sign(
      { id: staff._id, name: staff.name, role: staff.title },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      staff: {
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
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
