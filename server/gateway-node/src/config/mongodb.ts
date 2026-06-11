import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;
let mongoServer: any = null;

export async function connectMongoDB(): Promise<void> {
  if (isConnected) {
    console.log('✅ MongoDB already connected.');
    return;
  }

  try {
    // Direct Replica Set URI bypassing SRV to fix Node.js DNS ECONNREFUSED issues
    const uri = process.env.MONGODB_URI || 'mongodb://siddheshharwande:9rZl6EdTIxz36IFM@ac-gdt7bmm-shard-00-00.ygdquz6.mongodb.net:27017,ac-gdt7bmm-shard-00-01.ygdquz6.mongodb.net:27017,ac-gdt7bmm-shard-00-02.ygdquz6.mongodb.net:27017/SovereignMind?ssl=true&replicaSet=atlas-11im4i-shard-0&authSource=admin&retryWrites=true&w=majority';
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });
    
    isConnected = true;
    console.log(`✅ MongoDB Atlas connected successfully`);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error);
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
