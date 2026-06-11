"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrisisSimulation = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AgeGroupSchema = new mongoose_1.Schema({
    group: String,
    percentage: Number,
    reaction: String,
}, { _id: false });
const IncomeClassSchema = new mongoose_1.Schema({
    class: String,
    percentage: Number,
    vulnerability: String,
}, { _id: false });
const PoliticalPrefSchema = new mongoose_1.Schema({
    faction: String,
    percentage: Number,
    sentiment: String,
}, { _id: false });
const RecoveryScenarioSchema = new mongoose_1.Schema({
    trajectory: String,
    probability: Number,
    description: String,
    estimatedMonths: Number,
}, { _id: false });
const SimTickSchema = new mongoose_1.Schema({
    epoch: Number,
    panicLevel: Number,
    economicDisruption: Number,
    infraInstability: Number,
    supplyChainFailure: Number,
    civilUnrest: Number,
    collapseProbability: Number,
    statusMessage: String,
}, { _id: false });
const CrisisSimulationSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.CrisisSimulation = mongoose_1.default.model('CrisisSimulation', CrisisSimulationSchema);
