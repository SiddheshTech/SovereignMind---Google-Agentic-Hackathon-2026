import mongoose, { Schema, Document } from 'mongoose';

export interface IGeneCategory {
  LeadershipContinuity?: number;
  InstitutionalStrength?: number;
  PolicyStability?: number;
  BureaucraticEfficiency?: number;

  FiscalResilience?: number;
  TradeDiversity?: number;
  InflationResistance?: number;
  LaborAdaptability?: number;

  SocialTrust?: number;
  CommunityResilience?: number;
  EducationQuality?: number;
  CulturalCohesion?: number;

  EnergySecurity?: number;
  TransportReliability?: number;
  DigitalConnectivity?: number;
  HealthcareCapacity?: number;
}

export interface ICivilizationGenome extends Document {
  countryCode: string;
  nationName: string;
  overallResilienceIndex: number;
  governanceGenes: IGeneCategory;
  economicGenes: IGeneCategory;
  socialGenes: IGeneCategory;
  infrastructureGenes: IGeneCategory;
}

const GeneCategorySchema = new Schema<IGeneCategory>({
  // Governance
  LeadershipContinuity: { type: Number, default: 0 },
  InstitutionalStrength: { type: Number, default: 0 },
  PolicyStability: { type: Number, default: 0 },
  BureaucraticEfficiency: { type: Number, default: 0 },

  // Economic
  FiscalResilience: { type: Number, default: 0 },
  TradeDiversity: { type: Number, default: 0 },
  InflationResistance: { type: Number, default: 0 },
  LaborAdaptability: { type: Number, default: 0 },

  // Social
  SocialTrust: { type: Number, default: 0 },
  CommunityResilience: { type: Number, default: 0 },
  EducationQuality: { type: Number, default: 0 },
  CulturalCohesion: { type: Number, default: 0 },

  // Infrastructure
  EnergySecurity: { type: Number, default: 0 },
  TransportReliability: { type: Number, default: 0 },
  DigitalConnectivity: { type: Number, default: 0 },
  HealthcareCapacity: { type: Number, default: 0 },
}, { _id: false });

const CivilizationGenomeSchema = new Schema<ICivilizationGenome>({
  countryCode: { type: String, required: true, unique: true },
  nationName: { type: String, required: true },
  overallResilienceIndex: { type: Number, required: true },
  governanceGenes: { type: GeneCategorySchema, default: () => ({}) },
  economicGenes: { type: GeneCategorySchema, default: () => ({}) },
  socialGenes: { type: GeneCategorySchema, default: () => ({}) },
  infrastructureGenes: { type: GeneCategorySchema, default: () => ({}) }
}, {
  timestamps: true
});

export const CivilizationGenome = mongoose.model<ICivilizationGenome>('CivilizationGenome', CivilizationGenomeSchema);
