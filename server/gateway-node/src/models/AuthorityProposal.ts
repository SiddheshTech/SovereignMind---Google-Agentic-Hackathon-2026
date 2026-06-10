import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthorityProposal extends Document {
  title: string;
  safetyScore: number;
  riskScore: number;
  civilLibertyImpact: string;
  recommendation: string;
  zone: string;
  constitutionalPoints: string[];
  violations: string[];
  explanation: string;
  createdAt: Date;
}

const AuthorityProposalSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    safetyScore: {
      type: Number,
      required: true,
    },
    riskScore: {
      type: Number,
      required: true,
    },
    civilLibertyImpact: {
      type: String,
      required: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      required: true,
    },
    constitutionalPoints: {
      type: [String],
      default: [],
    },
    violations: {
      type: [String],
      default: [],
    },
    explanation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AuthorityProposal = mongoose.model<IAuthorityProposal>('AuthorityProposal', AuthorityProposalSchema);
