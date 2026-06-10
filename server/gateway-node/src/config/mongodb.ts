import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://siddheshharwande:9rZl6EdTIxz36IFM@siddhesh.ygdquz6.mongodb.net/SovereignMind';

let isConnected = false;

export async function connectMongoDB(): Promise<void> {
  if (isConnected) {
    console.log('✅ MongoDB already connected.');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully to SovereignMind database.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected.');
  isConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
  isConnected = false;
});

export default mongoose;
