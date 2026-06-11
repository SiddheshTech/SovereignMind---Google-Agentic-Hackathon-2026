import mongoose, { Document, Schema } from 'mongoose';

export interface IInfrastructureMetric {
  label: string;
  val: string;
}

export interface IInfrastructureNode {
  id: string;
  title: string;
  icon: string;
  status: string;
  statusColor: string;
  load: number;
  metrics: IInfrastructureMetric[];
}

export interface IInfrastructureData extends Document {
  nodes: IInfrastructureNode[];
  createdAt: Date;
}

const InfrastructureMetricSchema = new Schema<IInfrastructureMetric>({
  label: { type: String, required: true },
  val: { type: String, required: true }
}, { _id: false });

const InfrastructureNodeSchema = new Schema<IInfrastructureNode>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  status: { type: String, required: true },
  statusColor: { type: String, required: true },
  load: { type: Number, required: true },
  metrics: [InfrastructureMetricSchema]
}, { _id: false });

const InfrastructureDataSchema = new Schema<IInfrastructureData>({
  nodes: [InfrastructureNodeSchema],
  createdAt: { type: Date, default: Date.now }
});

export const InfrastructureData = mongoose.model<IInfrastructureData>('InfrastructureData', InfrastructureDataSchema);
