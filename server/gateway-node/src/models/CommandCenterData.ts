import mongoose from 'mongoose';

const CommandCenterSnapshotSchema = new mongoose.Schema({
  stabilityScore: { type: Number, default: 72 },
  stabilityLabel: { type: String, default: 'Stable' },
  trend30d: { type: String, default: '↑ +2.1%' },
  activeThreats: { type: Number, default: 17 },
  criticalNations: { type: Number, default: 4 },
  emergingRisks: { type: Number, default: 11 },
  aiBriefing: { type: String, default: '' },
  threats: [{
    title: String,
    trend: String,
    color: String,
    time: String
  }],
  futureRisks: [{
    year: Number,
    risk: String,
    prob: String
  }],
  rankings: [{
    category: String,
    nation: String
  }],
  recommendations: [{
    text: String,
    impact: String,
    icon: String
  }],
  timelineEvents: [{
    year: String,
    name: String,
    type: String
  }],
  metrics: [{
    id: String,
    label: String,
    score: String,
    status: String,
    details: String,
    color: String
  }],
  mapPoints: [{
    id: String,
    x: String,
    y: String,
    color: String,
    pulse: Boolean,
    stability: String,
    resilience: String,
    activeRisk: String
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const CommandCenterSnapshot = mongoose.model('CommandCenterSnapshot', CommandCenterSnapshotSchema);
