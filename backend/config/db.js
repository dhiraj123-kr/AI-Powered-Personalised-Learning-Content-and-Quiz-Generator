const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

      // Auto-seed default curriculum if collection is empty
      try {
        const Subject = require('../models/Subject');
        const count = await Subject.countDocuments();
        if (count === 0) {
          const { seedDefaultCurriculum } = require('../controllers/subjectController');
          await seedDefaultCurriculum();
        }
      } catch (seedErr) {
        console.warn('Initial curriculum check note:', seedErr.message);
      }

      return;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) {
        const delay = attempt * 2000;
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.warn('⚠️ MongoDB connection could not be established. Server is running; please start MongoDB service.');
        return;
      }
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});

module.exports = connectDB;
