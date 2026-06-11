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
exports.AnalyticsData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AnalyticsKeyMetricSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    value: { type: String, required: true },
    trend: { type: String, required: true },
    trendDir: { type: String, required: true },
    statusColor: { type: String, required: true }
}, { _id: false });
const VectorDataPointSchema = new mongoose_1.Schema({
    value: { type: Number, required: true },
    isAnomaly: { type: Boolean, required: true }
}, { _id: false });
const ScoreMatrixItemSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    score: { type: Number, required: true },
    baseline: { type: Number, required: true },
    color: { type: String, required: true }
}, { _id: false });
const IntelligenceReportSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    date: { type: String, required: true },
    confidence: { type: Number, required: true },
    category: { type: String, required: true },
    isCritical: { type: Boolean, required: true }
}, { _id: false });
const AnalyticsDataSchema = new mongoose_1.Schema({
    keyMetrics: [AnalyticsKeyMetricSchema],
    vectorData: [VectorDataPointSchema],
    scoring: [ScoreMatrixItemSchema],
    reports: [IntelligenceReportSchema],
    createdAt: { type: Date, default: Date.now }
});
exports.AnalyticsData = mongoose_1.default.model('AnalyticsData', AnalyticsDataSchema);
