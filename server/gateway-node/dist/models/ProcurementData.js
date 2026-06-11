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
exports.ProcurementData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VendorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    category: { type: String, required: true },
    tier: { type: String, required: true },
    status: { type: String, required: true },
    reliability: { type: Number, required: true },
    distance: { type: String, required: true },
    capacity: { type: String, required: true }
});
const ContractSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    entity: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true }
});
const MapNodeSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    type: { type: String, required: true },
    statusText: { type: String, required: false }
});
const MapPathSchema = new mongoose_1.Schema({
    path: { type: String, required: true },
    stroke: { type: String, required: true },
    animated: { type: Boolean, required: true }
});
const RiskVectorSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    val: { type: String, required: true },
    trend: { type: String, required: true },
    color: { type: String, required: true },
    detail: { type: String, required: true }
});
const ProcurementDataSchema = new mongoose_1.Schema({
    vendors: { type: [VendorSchema], default: [] },
    contracts: { type: [ContractSchema], default: [] },
    mapNodes: { type: [MapNodeSchema], default: [] },
    mapPaths: { type: [MapPathSchema], default: [] },
    riskVectors: { type: [RiskVectorSchema], default: [] },
    defcon: { type: String, default: "3" },
    activeScanAgents: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});
exports.ProcurementData = mongoose_1.default.model('ProcurementData', ProcurementDataSchema);
