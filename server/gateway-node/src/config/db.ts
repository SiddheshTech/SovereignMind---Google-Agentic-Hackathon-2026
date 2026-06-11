import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://siddheshharwande:9rZl6EdTIxz36IFM@siddhesh.ygdquz6.mongodb.net/SovereignMind';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected to SovereignMind DB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
