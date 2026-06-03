import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Initialize Firebase Admin
try {
  // Try to resolve the path relative to the root server directory (where .env is)
  const serviceAccountPath = process.env.FIREBASE_CREDENTIALS_PATH 
    ? path.resolve(__dirname, '../../../', process.env.FIREBASE_CREDENTIALS_PATH)
    : '';

  if (serviceAccountPath) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    console.log('✅ Firebase Admin initialized');
  } else {
    console.warn('⚠️ FIREBASE_CREDENTIALS_PATH not found in environment. Mocking Firebase Admin.');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error);
}

export const adminDb = admin.apps.length > 0 ? admin.firestore() : null;
export const adminAuth = admin.apps.length > 0 ? admin.auth() : null;

// Initialize Firebase Client (for email/password sign in from backend)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "mock-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "mock-auth-domain",
  projectId: process.env.FIREBASE_PROJECT_ID || "mock-project-id",
};

const firebaseApp = initializeApp(firebaseConfig);
export const clientAuth = getAuth(firebaseApp);
