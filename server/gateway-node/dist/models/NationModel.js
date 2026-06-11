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
exports.NationModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const NationModelSchema = new mongoose_1.Schema({
    economyVal: { type: String, required: true },
    economyTrend: { type: String, required: true },
    societyVal: { type: String, required: true },
    societySubtitle: { type: String, required: true },
    governanceVal: { type: String, required: true },
    governanceSubtitle: { type: String, required: true },
    infrastructureVal: { type: String, required: true },
    infrastructureTrend: { type: String, required: true },
    securityVal: { type: String, required: true },
    securitySubtitle: { type: String, required: true },
    taxationVelocity: { type: Number, required: true },
    borderFriction: { type: String, required: true },
    cohesionIndex: { type: Number, required: true },
    supplyIntegration: { type: String, required: true },
    volatilityIndex: { type: Number, required: true },
    integrityPercentage: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});
exports.NationModel = mongoose_1.default.model('NationModel', NationModelSchema);
