import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('✅ Secondary DB check: Connection is already established.');
  } else {
    console.log('⏳ Secondary DB check: Waiting for primary MongoDB connection...');
  }
};

export default connectDB;
