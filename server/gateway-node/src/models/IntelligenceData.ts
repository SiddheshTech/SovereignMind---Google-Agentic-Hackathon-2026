import mongoose, { Document, Schema } from 'mongoose';

export interface IIntelligenceData extends Document {
  nodes: {
    id: string;
    type: string;
    baseColor: string;
    connections: number;
    x: number;
    y: number;
    size: number;
    classStr: string;
    dot: string;
    pulse: boolean;
  }[];
  edges: {
    source: string;
    target: string;
    color: string;
    width: number;
    dashed: boolean;
    opacity: number;
    pulse: boolean;
  }[];
  topologyStats: {
    totalNodes: string;
    activeEdges: string;
    densityScore: string;
    centralityDrift: string;
  };
  simulations: {
    id: string;
    trigger: string;
    mitigations: {
      label: string;
      val: string;
      pct: number;
    }[];
    steps: {
      time: string;
      title: string;
      desc: string;
      color: string;
      isWarning: boolean;
      isFinal: boolean;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const IntelligenceDataSchema = new Schema({
  nodes: [{
    id: String,
    type: String,
    baseColor: String,
    connections: Number,
    x: Number,
    y: Number,
    size: Number,
    classStr: String,
    dot: String,
    pulse: Boolean
  }],
  edges: [{
    source: String,
    target: String,
    color: String,
    width: Number,
    dashed: Boolean,
    opacity: Number,
    pulse: Boolean
  }],
  topologyStats: {
    totalNodes: String,
    activeEdges: String,
    densityScore: String,
    centralityDrift: String
  },
  simulations: [{
    id: String,
    trigger: String,
    mitigations: [{
      label: String,
      val: String,
      pct: Number
    }],
    steps: [{
      time: String,
      title: String,
      desc: String,
      color: String,
      isWarning: Boolean,
      isFinal: Boolean
    }]
  }]
}, { timestamps: true });

export const IntelligenceData = mongoose.model<IIntelligenceData>('IntelligenceData', IntelligenceDataSchema);
