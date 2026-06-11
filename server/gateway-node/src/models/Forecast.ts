import mongoose, { Document, Schema } from 'mongoose';

export interface IForecastTimelinePoint {
  year: string;
  title: string;
  description: string;
}

export interface IForecast extends Document {
  timelinePoints: IForecastTimelinePoint[];
  stabilityDeviation: string;
  convergencePointDescription: string;
  createdAt: Date;
}

const ForecastTimelinePointSchema = new Schema<IForecastTimelinePoint>({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const ForecastSchema = new Schema<IForecast>({
  timelinePoints: { type: [ForecastTimelinePointSchema], required: true },
  stabilityDeviation: { type: String, required: true },
  convergencePointDescription: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Forecast = mongoose.model<IForecast>('Forecast', ForecastSchema);
