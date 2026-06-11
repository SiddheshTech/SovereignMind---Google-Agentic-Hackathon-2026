import mongoose, { Document, Schema } from 'mongoose';

export interface IBlackSwanAnomaly {
  title: string;
  probability: string;
  severity: string;
  description: string;
}

export interface IBlackSwan extends Document {
  anomalies: IBlackSwanAnomaly[];
  permutationsRun: number;
  createdAt: Date;
}

const BlackSwanAnomalySchema = new Schema<IBlackSwanAnomaly>({
  title: { type: String, required: true },
  probability: { type: String, required: true },
  severity: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const BlackSwanSchema = new Schema<IBlackSwan>({
  anomalies: { type: [BlackSwanAnomalySchema], required: true },
  permutationsRun: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const BlackSwan = mongoose.model<IBlackSwan>('BlackSwan', BlackSwanSchema);
