import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  v: String,
  d: String
}, { _id: false });

const ArtifactSchema = new mongoose.Schema({
  id: String,
  title: String,
  date: String,
  type: String,
  metadata: String,
  history: [HistorySchema]
}, { _id: false });

const RoomSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String,
  category: String,
  ping: Boolean,
  unread: Number
}, { _id: false });

const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  status: String
}, { _id: false });

const MessageSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  text: String,
  time: String
}, { _id: false });

const CollaborationDataSchema = new mongoose.Schema({
  rooms: [RoomSchema],
  users: [UserSchema],
  artifacts: [ArtifactSchema],
  messages: [MessageSchema]
}, { timestamps: true });

export const CollaborationData = mongoose.model('CollaborationData', CollaborationDataSchema);
