const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

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
    const staff = await Staff.findOne({ username });
    if (!staff) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await staff.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
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
