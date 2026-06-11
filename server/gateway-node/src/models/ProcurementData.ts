import mongoose, { Schema, Document } from 'mongoose';

export interface IProcurementVendor {
  name: string;
  id: string;
  category: string;
  tier: string;
  status: string;
  reliability: number;
  distance: string;
  capacity: string;
}

export interface IProcurementContract {
  id: string;
  entity: string;
  type: string;
  date: string;
  status: string;
}

export interface IProcurementMapNode {
  id: string;
  x: number;
  y: number;
  type: string;
  statusText: string;
}

export interface IProcurementMapPath {
  path: string;
  stroke: string;
  animated: boolean;
}

export interface IProcurementRiskVector {
  label: string;
  val: string;
  trend: string;
  color: string;
  detail: string;
}

export interface IProcurementData extends Document {
  vendors: IProcurementVendor[];
  contracts: IProcurementContract[];
  mapNodes: IProcurementMapNode[];
  mapPaths: IProcurementMapPath[];
  riskVectors: IProcurementRiskVector[];
  defcon: string;
  activeScanAgents: number;
  updatedAt: Date;
}

const VendorSchema = new Schema<IProcurementVendor>({
  name: { type: String, required: true },
  id: { type: String, required: true },
  category: { type: String, required: true },
  tier: { type: String, required: true },
  status: { type: String, required: true },
  reliability: { type: Number, required: true },
  distance: { type: String, required: true },
  capacity: { type: String, required: true }
});

const ContractSchema = new Schema<IProcurementContract>({
  id: { type: String, required: true },
  entity: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true }
});

const MapNodeSchema = new Schema<IProcurementMapNode>({
  id: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  type: { type: String, required: true },
  statusText: { type: String, required: false }
});

const MapPathSchema = new Schema<IProcurementMapPath>({
  path: { type: String, required: true },
  stroke: { type: String, required: true },
  animated: { type: Boolean, required: true }
});

const RiskVectorSchema = new Schema<IProcurementRiskVector>({
  label: { type: String, required: true },
  val: { type: String, required: true },
  trend: { type: String, required: true },
  color: { type: String, required: true },
  detail: { type: String, required: true }
});

const ProcurementDataSchema = new Schema<IProcurementData>({
  vendors: { type: [VendorSchema], default: [] },
  contracts: { type: [ContractSchema], default: [] },
  mapNodes: { type: [MapNodeSchema], default: [] },
  mapPaths: { type: [MapPathSchema], default: [] },
  riskVectors: { type: [RiskVectorSchema], default: [] },
  defcon: { type: String, default: "3" },
  activeScanAgents: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export const ProcurementData = mongoose.model<IProcurementData>('ProcurementData', ProcurementDataSchema);
