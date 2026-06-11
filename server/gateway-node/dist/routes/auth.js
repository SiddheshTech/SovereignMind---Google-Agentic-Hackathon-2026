"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'sovereignmind-secret-jwt-key-2026';
const JWT_EXPIRES_IN = '7d';
// ──────────────────────────────────────────────────────────────
// POST /api/auth/signup
// ──────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password, company, role, agreedToTerms } = req.body;
        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                error: 'Full name, email, and password are required.',
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long.',
            });
        }
        if (!agreedToTerms) {
            return res.status(400).json({
                error: 'You must agree to the Terms of Service to register.',
            });
        }
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({
                error: 'An account with this email already exists. Please sign in instead.',
            });
        }
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Create user in MongoDB
        const newUser = new User_1.User({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            company: company?.trim() || '',
            role: role?.trim() || 'Sector Level 3 Planner',
            agreedToTerms: agreedToTerms || false,
            enclaveRegion: 'Alpine Sector-12 Tactical Enclave',
        });
        await newUser.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        console.log(`✅ New user registered: ${newUser.email}`);
        return res.status(201).json({
            message: 'Account created successfully! Welcome to SovereignMind.',
            token,
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                company: newUser.company,
                role: newUser.role,
                enclaveRegion: newUser.enclaveRegion,
                createdAt: newUser.createdAt,
            },
        });
    }
    catch (error) {
        console.error('❌ Signup error:', error);
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'An account with this email already exists. Please sign in instead.',
            });
        }
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ error: messages.join('. ') });
        }
        return res.status(500).json({
            error: 'An internal server error occurred. Please try again.',
        });
    }
});
// ──────────────────────────────────────────────────────────────
// POST /api/auth/signin
// ──────────────────────────────────────────────────────────────
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required.',
            });
        }
        // Find user by email
        const user = await User_1.User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials. No account found with this email.',
            });
        }
        // Compare password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials. Incorrect password.',
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email,
            fullName: user.fullName,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        console.log(`✅ User signed in: ${user.email}`);
        return res.status(200).json({
            message: 'Signed in successfully! Welcome back.',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                company: user.company,
                role: user.role,
                enclaveRegion: user.enclaveRegion,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.error('❌ Signin error:', error);
        return res.status(500).json({
            error: 'An internal server error occurred. Please try again.',
        });
    }
});
// ──────────────────────────────────────────────────────────────
// GET /api/auth/me  (verify token & return user profile)
// ──────────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided.' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                company: user.company,
                role: user.role,
                enclaveRegion: user.enclaveRegion,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }
        console.error('❌ /me error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.default = router;
