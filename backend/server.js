const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const scheduleRoutes = require('./routes/schedule');
const calendarRoutes = require('./routes/calendar');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Staff Scheduler API is running...' });
});

// Serve frontend static assets in production or if dist exists
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(distPath, 'index.html'));
    }
  });
} else {
  app.get('/', (req, res) => {
    res.send('AI Staff Scheduler API is running...');
  });
}

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;
