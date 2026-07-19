import mongoose from 'mongoose';

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/textIntelligence';
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`✓ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
  }
};
