import mongoose, { Schema, Document } from 'mongoose';

export interface ICopilotMessage {
  id: number;
  role: string;
  content: string;
  timestamp: Date;
}

export interface ICopilotSession extends Document {
  sessionId: string;
  messages: ICopilotMessage[];
}

const CopilotMessageSchema: Schema = new Schema({
  id: { type: Number, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const CopilotSessionSchema: Schema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  messages: { type: [CopilotMessageSchema], default: [] }
});

export default mongoose.model<ICopilotSession>('CopilotSession', CopilotSessionSchema);
