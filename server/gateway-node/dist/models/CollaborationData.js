"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaborationData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const HistorySchema = new mongoose_1.default.Schema({
    v: String,
    d: String
}, { _id: false });
const ArtifactSchema = new mongoose_1.default.Schema({
    id: String,
    title: String,
    date: String,
    type: String,
    metadata: String,
    history: [HistorySchema]
}, { _id: false });
const RoomSchema = new mongoose_1.default.Schema({
    id: String,
    name: String,
    type: String,
    category: String,
    ping: Boolean,
    unread: Number
}, { _id: false });
const UserSchema = new mongoose_1.default.Schema({
    id: String,
    name: String,
    status: String
}, { _id: false });
const MessageSchema = new mongoose_1.default.Schema({
    roomId: String,
    sender: String,
    text: String,
    time: String
}, { _id: false });
const CollaborationDataSchema = new mongoose_1.default.Schema({
    rooms: [RoomSchema],
    users: [UserSchema],
    artifacts: [ArtifactSchema],
    messages: [MessageSchema]
}, { timestamps: true });
exports.CollaborationData = mongoose_1.default.model('CollaborationData', CollaborationDataSchema);
