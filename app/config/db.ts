import mongoose from 'mongoose';
import 'dotenv/config';

const DB_URI = process.env.MONGODB_URI;

export const connectDB = async (): Promise<void> => {
  try {
    if (!DB_URI) {
      throw new Error('MongoDB URI is not defined');
    }
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};