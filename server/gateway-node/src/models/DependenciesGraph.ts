import mongoose, { Document, Schema } from 'mongoose';

export interface IDependencyNode {
  id: string;
  title: string;
  status: string;
  icon: string;
}

export interface IDependencyEdge {
  fromId: string;
  toId: string;
  status: string;
}

export interface IDependenciesGraph extends Document {
  nodes: IDependencyNode[];
  edges: IDependencyEdge[];
  createdAt: Date;
}

const DependencyNodeSchema = new Schema<IDependencyNode>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, required: true },
  icon: { type: String, required: true }
}, { _id: false });

const DependencyEdgeSchema = new Schema<IDependencyEdge>({
  fromId: { type: String, required: true },
  toId: { type: String, required: true },
  status: { type: String, required: true }
}, { _id: false });

const DependenciesGraphSchema = new Schema<IDependenciesGraph>({
  nodes: [DependencyNodeSchema],
  edges: [DependencyEdgeSchema],
  createdAt: { type: Date, default: Date.now }
});

export const DependenciesGraph = mongoose.model<IDependenciesGraph>('DependenciesGraph', DependenciesGraphSchema);
