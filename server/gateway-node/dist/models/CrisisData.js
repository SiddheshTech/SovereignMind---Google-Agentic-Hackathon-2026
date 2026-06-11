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
exports.CrisisData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CrisisIncidentSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    time: { type: String, required: true },
    desc: { type: String, required: true },
    severity: { type: String, required: true },
    status: { type: String, required: true },
    responders: { type: Number, required: true }
}, { _id: false });
const CrisisMapNodeSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true }
}, { _id: false });
const CrisisChannelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    active: { type: Boolean, required: true },
    status: { type: String, required: true }
}, { _id: false });
const CrisisLogEntrySchema = new mongoose_1.Schema({
    time: { type: String, required: true },
    msg: { type: String, required: true },
    type: { type: String, required: true }
}, { _id: false });
const CrisisPolicyOptionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    tag: { type: String, required: true }
}, { _id: false });
const CrisisComparatorRowSchema = new mongoose_1.Schema({
    metric: { type: String, required: true },
    optA: { type: String, required: true },
    optB: { type: String, required: true },
    optC: { type: String, required: true }
}, { _id: false });
const CrisisChatMsgSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    msg: { type: String, required: true },
    time: { type: String, required: true },
    isAI: { type: Boolean, required: true }
}, { _id: false });
const CrisisDataSchema = new mongoose_1.Schema({
    incidents: [CrisisIncidentSchema],
    mapNodes: [CrisisMapNodeSchema],
    channels: [CrisisChannelSchema],
    logs: [CrisisLogEntrySchema],
    policyOptions: [CrisisPolicyOptionSchema],
    comparatorRows: [CrisisComparatorRowSchema],
    chatMsgs: [CrisisChatMsgSchema],
    jointResolutionDraft: { type: String, required: true },
    activeDefcon: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.CrisisData = mongoose_1.default.model('CrisisData', CrisisDataSchema);
