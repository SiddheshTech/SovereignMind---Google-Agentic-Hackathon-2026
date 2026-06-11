import mongoose, { Document, Schema } from 'mongoose';

export interface INationModel extends Document {
  economyVal: string;
  economyTrend: string;
  societyVal: string;
  societySubtitle: string;
  governanceVal: string;
  governanceSubtitle: string;
  infrastructureVal: string;
  infrastructureTrend: string;
  securityVal: string;
  securitySubtitle: string;
  taxationVelocity: number;
  borderFriction: string;
  cohesionIndex: number;
  supplyIntegration: string;
  volatilityIndex: number;
  integrityPercentage: number;
  updatedAt: Date;
}

const NationModelSchema = new Schema<INationModel>({
  economyVal: { type: String, required: true },
  economyTrend: { type: String, required: true },
  societyVal: { type: String, required: true },
  societySubtitle: { type: String, required: true },
  governanceVal: { type: String, required: true },
  governanceSubtitle: { type: String, required: true },
  infrastructureVal: { type: String, required: true },
  infrastructureTrend: { type: String, required: true },
  securityVal: { type: String, required: true },
  securitySubtitle: { type: String, required: true },
  taxationVelocity: { type: Number, required: true },
  borderFriction: { type: String, required: true },
  cohesionIndex: { type: Number, required: true },
  supplyIntegration: { type: String, required: true },
  volatilityIndex: { type: Number, required: true },
  integrityPercentage: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export const NationModel = mongoose.model<INationModel>('NationModel', NationModelSchema);
