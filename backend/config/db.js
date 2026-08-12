const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_staff_scheduler';
    console.log(`Connecting to MongoDB at: ${connStr}`);
    await mongoose.connect(connStr);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
