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
exports.CivilizationGenome = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const GeneCategorySchema = new mongoose_1.Schema({
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
const CivilizationGenomeSchema = new mongoose_1.Schema({
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
exports.CivilizationGenome = mongoose_1.default.model('CivilizationGenome', CivilizationGenomeSchema);
