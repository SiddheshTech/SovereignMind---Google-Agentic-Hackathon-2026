import mongoose, { Document, Schema } from 'mongoose';

export interface ICrisisIncident {
  id: string;
  title: string;
  time: string;
  desc: string;
  severity: string;
  status: string;
  responders: number;
}

export interface ICrisisMapNode {
  id: string;
  x: number;
  y: number;
  type: string;
  status: string;
}

export interface ICrisisChannel {
  name: string;
  active: boolean;
  status: string;
}

export interface ICrisisLogEntry {
  time: string;
  msg: string;
  type: string;
}

export interface ICrisisPolicyOption {
  title: string;
  desc: string;
  tag: string;
}

export interface ICrisisComparatorRow {
  metric: string;
  optA: string;
  optB: string;
  optC: string;
}

export interface ICrisisChatMsg {
  name: string;
  msg: string;
  time: string;
  isAI: boolean;
}

export interface ICrisisData extends Document {
  incidents: ICrisisIncident[];
  mapNodes: ICrisisMapNode[];
  channels: ICrisisChannel[];
  logs: ICrisisLogEntry[];
  policyOptions: ICrisisPolicyOption[];
  comparatorRows: ICrisisComparatorRow[];
  chatMsgs: ICrisisChatMsg[];
  jointResolutionDraft: string;
  activeDefcon: string;
  createdAt: Date;
}

const CrisisIncidentSchema = new Schema<ICrisisIncident>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  time: { type: String, required: true },
  desc: { type: String, required: true },
  severity: { type: String, required: true },
  status: { type: String, required: true },
  responders: { type: Number, required: true }
}, { _id: false });

const CrisisMapNodeSchema = new Schema<ICrisisMapNode>({
  id: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true }
}, { _id: false });

const CrisisChannelSchema = new Schema<ICrisisChannel>({
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
  status: { type: String, required: true }
}, { _id: false });

const CrisisLogEntrySchema = new Schema<ICrisisLogEntry>({
  time: { type: String, required: true },
  msg: { type: String, required: true },
  type: { type: String, required: true }
}, { _id: false });

const CrisisPolicyOptionSchema = new Schema<ICrisisPolicyOption>({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  tag: { type: String, required: true }
}, { _id: false });

const CrisisComparatorRowSchema = new Schema<ICrisisComparatorRow>({
  metric: { type: String, required: true },
  optA: { type: String, required: true },
  optB: { type: String, required: true },
  optC: { type: String, required: true }
}, { _id: false });

const CrisisChatMsgSchema = new Schema<ICrisisChatMsg>({
  name: { type: String, required: true },
  msg: { type: String, required: true },
  time: { type: String, required: true },
  isAI: { type: Boolean, required: true }
}, { _id: false });

const CrisisDataSchema = new Schema<ICrisisData>({
  incidents: [CrisisIncidentSchema],
  mapNodes: [CrisisMapNodeSchema],
  channels: [CrisisChannelSchema],
  logs: [CrisisLogEntrySchema],
  policyOptions: [CrisisPolicyOptionSchema],
  comparatorRows: [CrisisComparatorRowSchema],
  chatMsgs: [CrisisChatMsgSchema],
  jointResolutionDraft: { type: String, required: true },
  activeDefcon: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const CrisisData = mongoose.model<ICrisisData>('CrisisData', CrisisDataSchema);
