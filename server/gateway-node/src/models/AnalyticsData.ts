import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsKeyMetric {
  title: string;
  value: string;
  trend: string;
  trendDir: string;
  statusColor: string;
}

export interface IVectorDataPoint {
  value: number;
  isAnomaly: boolean;
}

export interface IScoreMatrixItem {
  label: string;
  score: number;
  baseline: number;
  color: string;
}

export interface IIntelligenceReport {
  id: string;
  title: string;
  desc: string;
  date: string;
  confidence: number;
  category: string;
  isCritical: boolean;
}

export interface IAnalyticsData extends Document {
  keyMetrics: IAnalyticsKeyMetric[];
  vectorData: IVectorDataPoint[];
  scoring: IScoreMatrixItem[];
  reports: IIntelligenceReport[];
  createdAt: Date;
}

const AnalyticsKeyMetricSchema = new Schema<IAnalyticsKeyMetric>({
  title: { type: String, required: true },
  value: { type: String, required: true },
  trend: { type: String, required: true },
  trendDir: { type: String, required: true },
  statusColor: { type: String, required: true }
}, { _id: false });

const VectorDataPointSchema = new Schema<IVectorDataPoint>({
  value: { type: Number, required: true },
  isAnomaly: { type: Boolean, required: true }
}, { _id: false });

const ScoreMatrixItemSchema = new Schema<IScoreMatrixItem>({
  label: { type: String, required: true },
  score: { type: Number, required: true },
  baseline: { type: Number, required: true },
  color: { type: String, required: true }
}, { _id: false });

const IntelligenceReportSchema = new Schema<IIntelligenceReport>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  date: { type: String, required: true },
  confidence: { type: Number, required: true },
  category: { type: String, required: true },
  isCritical: { type: Boolean, required: true }
}, { _id: false });

const AnalyticsDataSchema = new Schema<IAnalyticsData>({
  keyMetrics: [AnalyticsKeyMetricSchema],
  vectorData: [VectorDataPointSchema],
  scoring: [ScoreMatrixItemSchema],
  reports: [IntelligenceReportSchema],
  createdAt: { type: Date, default: Date.now }
});

export const AnalyticsData = mongoose.model<IAnalyticsData>('AnalyticsData', AnalyticsDataSchema);
