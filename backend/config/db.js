const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_staff_scheduler';
    console.log(`Connecting to MongoDB at: ${connStr}`);
    // Fail fast if MongoDB is not available to avoid long buffering in Mongoose
    await mongoose.connect(connStr, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Continuing without database connection (development fallback).');
    // Disable mongoose buffering so queries fail fast instead of timing out after long buffering.
    try {
      mongoose.set('bufferCommands', false);
      await mongoose.disconnect();
    } catch (e) {
      // ignore
    }
    // Do not exit process; allow the server to run for UI/front-end or local dev without MongoDB.
  }
};

module.exports = connectDB;
