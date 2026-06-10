import mongoose, { Document, Schema } from 'mongoose';

export interface ICrisisSimulation extends Document {
  scenarioName: string;
  crises: string[];
  createdBy?: string;
  createdAt: Date;
  resilienceScore: number;
  estimatedRecoveryMonths: number;
  simulatedPopulation: {
    totalAgents: number;
    ageGroups: Array<{ group: string; percentage: number; reaction: string }>;
    incomeClasses: Array<{ class: string; percentage: number; vulnerability: string }>;
    migrationTendencies: { rate: string; hotspots: string[]; description: string };
    consumptionPatterns: { hoardingRisk: string; essentialGoodDemand: string; description: string };
    politicalPreferences: Array<{ faction: string; percentage: number; sentiment: string }>;
  };
  economicShock: {
    oilCrisisPremium: number;
    foodShortagesIndex: number;
    disruptionSummary: string;
  };
  panicSentiment: {
    realtimeNarratives: string[];
    protestPropensity: number;
    misinformationStrength: number;
  };
  cascadeLinks: string[];
  recoveryPaths?: {
    bestCase: { trajectory: string; probability: number; description: string; estimatedMonths: number };
    expected: { trajectory: string; probability: number; description: string; estimatedMonths: number };
    worstCase: { trajectory: string; probability: number; description: string; estimatedMonths: number };
    overallRecommendation: string;
  };
  simulationTicks?: Array<{
    epoch: number;
    panicLevel: number;
    economicDisruption: number;
    infraInstability: number;
    supplyChainFailure: number;
    civilUnrest: number;
    collapseProbability: number;
    statusMessage: string;
  }>;
}

const AgeGroupSchema = new Schema({
  group: String,
  percentage: Number,
  reaction: String,
}, { _id: false });

const IncomeClassSchema = new Schema({
  class: String,
  percentage: Number,
  vulnerability: String,
}, { _id: false });

const PoliticalPrefSchema = new Schema({
  faction: String,
  percentage: Number,
  sentiment: String,
}, { _id: false });

const RecoveryScenarioSchema = new Schema({
  trajectory: String,
  probability: Number,
  description: String,
  estimatedMonths: Number,
}, { _id: false });

const SimTickSchema = new Schema({
  epoch: Number,
  panicLevel: Number,
  economicDisruption: Number,
  infraInstability: Number,
  supplyChainFailure: Number,
  civilUnrest: Number,
  collapseProbability: Number,
  statusMessage: String,
}, { _id: false });

const CrisisSimulationSchema = new Schema<ICrisisSimulation>(
  {
    scenarioName: { type: String, required: true },
    crises: { type: [String], required: true },
    createdBy: { type: String },
    resilienceScore: { type: Number, default: 50 },
    estimatedRecoveryMonths: { type: Number, default: 18 },
    simulatedPopulation: {
      totalAgents: { type: Number },
      ageGroups: [AgeGroupSchema],
      incomeClasses: [IncomeClassSchema],
      migrationTendencies: {
        rate: String,
        hotspots: [String],
        description: String,
      },
      consumptionPatterns: {
        hoardingRisk: String,
        essentialGoodDemand: String,
        description: String,
      },
      politicalPreferences: [PoliticalPrefSchema],
    },
    economicShock: {
      oilCrisisPremium: { type: Number },
      foodShortagesIndex: { type: Number },
      disruptionSummary: { type: String },
    },
    panicSentiment: {
      realtimeNarratives: [String],
      protestPropensity: Number,
      misinformationStrength: Number,
    },
    cascadeLinks: [String],
    recoveryPaths: {
      bestCase: RecoveryScenarioSchema,
      expected: RecoveryScenarioSchema,
      worstCase: RecoveryScenarioSchema,
      overallRecommendation: String,
    },
    simulationTicks: [SimTickSchema],
  },
  { timestamps: true }
);

export const CrisisSimulation = mongoose.model<ICrisisSimulation>('CrisisSimulation', CrisisSimulationSchema);
