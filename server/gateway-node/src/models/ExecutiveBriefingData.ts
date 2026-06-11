import mongoose from 'mongoose';

const ExecutiveBriefingSnapshotSchema = new mongoose.Schema({
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

export const ExecutiveBriefingSnapshot = mongoose.model('ExecutiveBriefingSnapshot', ExecutiveBriefingSnapshotSchema);
