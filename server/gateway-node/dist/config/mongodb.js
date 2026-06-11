"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = connectMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://siddheshharwande:9rZl6EdTIxz36IFM@siddhesh.ygdquz6.mongodb.net/SovereignMind';
let isConnected = false;
async function connectMongoDB() {
    if (isConnected) {
        console.log('✅ MongoDB already connected.');
        return;
    }
    try {
        await mongoose_1.default.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        isConnected = true;
        console.log('✅ MongoDB connected successfully to SovereignMind database.');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}
mongoose_1.default.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected.');
    isConnected = false;
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
    isConnected = false;
});
exports.default = mongoose_1.default;
