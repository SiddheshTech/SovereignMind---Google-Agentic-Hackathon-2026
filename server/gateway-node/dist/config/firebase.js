"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientAuth = exports.adminAuth = exports.adminDb = void 0;
const admin = __importStar(require("firebase-admin"));
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
// Initialize Firebase Admin
try {
    // Try to resolve the path relative to the root server directory (where .env is)
    const serviceAccountPath = process.env.FIREBASE_CREDENTIALS_PATH
        ? path_1.default.resolve(__dirname, '../../../', process.env.FIREBASE_CREDENTIALS_PATH)
        : '';
    if (serviceAccountPath) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath),
        });
        console.log('✅ Firebase Admin initialized');
    }
    else {
        console.warn('⚠️ FIREBASE_CREDENTIALS_PATH not found in environment. Mocking Firebase Admin.');
    }
}
catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
}
exports.adminDb = admin.apps.length > 0 ? admin.firestore() : null;
exports.adminAuth = admin.apps.length > 0 ? admin.auth() : null;
// Initialize Firebase Client (for email/password sign in from backend)
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "mock-api-key",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "mock-auth-domain",
    projectId: process.env.FIREBASE_PROJECT_ID || "mock-project-id",
};
const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
exports.clientAuth = (0, auth_1.getAuth)(firebaseApp);
