"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutiveBriefingSnapshot = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ExecutiveBriefingSnapshotSchema = new mongoose_1.default.Schema({
    tasks: [{
            id: Number,
            title: String,
            desc: String,
            status: String,
            statusColor: String,
            date: String,
            priority: String,
            owner: String,
            dep: String
        }],
    meetings: [{
            id: Number,
            color: String,
            title: String,
            time: String,
            participants: Number,
            priority: String
        }],
    totalDirectives: { type: Number, default: 41 },
    resolvedLoops: { type: Number, default: 16 },
    recalibrationRate: { type: String, default: '23%' },
    interruptVectors: { type: Number, default: 51 },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
exports.ExecutiveBriefingSnapshot = mongoose_1.default.model('ExecutiveBriefingSnapshot', ExecutiveBriefingSnapshotSchema);
