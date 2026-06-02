import { Router } from 'express';
import { adminAuth, adminDb, clientAuth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, company, role, agreedToTerms } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!adminAuth || !adminDb) {
      return res.status(500).json({ error: 'Firebase Admin not fully configured on the server.' });
    }

    // 1. Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: fullName || undefined,
    });

    // 2. Store additional data in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      fullName: fullName || '',
      company: company || '',
      role: role || '',
      email: email,
      agreedToTerms: agreedToTerms || false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        fullName,
        role,
        company
      }
    });
  } catch (error: any) {
    console.error('Signup Error:', error);
    res.status(400).json({ error: error.message || 'Error creating user' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Sign in using Firebase Client SDK
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const idToken = await userCredential.user.getIdToken();

    // Fetch additional user details from Firestore
    let userData = {};
    if (adminDb) {
      const userDoc = await adminDb.collection('users').doc(userCredential.user.uid).get();
      if (userDoc.exists) {
        userData = userDoc.data() || {};
      }
    }

    res.status(200).json({
      message: 'Signed in successfully',
      token: idToken,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        ...userData
      }
    });
  } catch (error: any) {
    console.error('Signin Error:', error);
    res.status(401).json({ error: error.message || 'Invalid credentials' });
  }
});

export default router;
