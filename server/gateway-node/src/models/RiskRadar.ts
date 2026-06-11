import mongoose, { Schema, Document } from 'mongoose';

export interface IRiskRadarThreat extends Document {
  threatName: string;
  probability: number;
  severity: string;
  timeToImpact: string;
  createdAt: Date;
}

const RiskRadarThreatSchema = new Schema<IRiskRadarThreat>({
  threatName: { type: String, required: true },
  probability: { type: Number, required: true },
  severity: { type: String, required: true },
  timeToImpact: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const RiskRadarThreat = mongoose.model<IRiskRadarThreat>('RiskRadarThreat', RiskRadarThreatSchema);


export interface IEarlyWarningSignal extends Document {
  signalName: string;
  impact: string;
  probabilityTrend: string;
  createdAt: Date;
}

const EarlyWarningSignalSchema = new Schema<IEarlyWarningSignal>({
  signalName: { type: String, required: true },
  impact: { type: String, required: true },
  probabilityTrend: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const EarlyWarningSignal = mongoose.model<IEarlyWarningSignal>('EarlyWarningSignal', EarlyWarningSignalSchema);
