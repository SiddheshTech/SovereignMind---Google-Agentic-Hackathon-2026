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
exports.grpcClient = void 0;
exports.getSovereigntyGenome = getSovereigntyGenome;
exports.searchGenomeTraits = searchGenomeTraits;
exports.runConstitutionalEvaluation = runConstitutionalEvaluation;
exports.startSandboxSimulation = startSandboxSimulation;
exports.draftEmergencyContract = draftEmergencyContract;
exports.optimizePrompt = optimizePrompt;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path = __importStar(require("path"));
const PROTO_PATH = path.join(__dirname, '../../../grpc-proto/services.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const sovereignmind = protoDescriptor.sovereignmind;
// Default FastAPI Core gRPC address
const GRPC_SERVER_ADDRESS = process.env.GRPC_SERVER_ADDRESS || 'localhost:50051';
exports.grpcClient = new sovereignmind.SovereignMindService(GRPC_SERVER_ADDRESS, grpc.credentials.createInsecure());
function getSovereigntyGenome(countryCode) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetSovereigntyGenome({ country_code: countryCode }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function searchGenomeTraits(query, limit = 5) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SearchGenomeTraits({ query, limit }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function runConstitutionalEvaluation(countryCode, proposedAction, context) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.RunConstitutionalEvaluation({ country_code: countryCode, proposed_action: proposedAction, context }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function startSandboxSimulation(countryCode, epochs, activeCrises) {
    // Returns a readable stream
    return exports.grpcClient.StartSandboxSimulation({
        country_code: countryCode,
        epochs,
        active_crises: activeCrises
    });
}
function draftEmergencyContract(itemNeeded, quantityRequired, urgentReason) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.DraftEmergencyContract({
            item_needed: itemNeeded,
            quantity_required: quantityRequired,
            urgent_reason: urgentReason
        }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function optimizePrompt(agentId, taskDescription, systemPrompt) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.OptimizePrompt({
            agent_id: agentId,
            task_description: taskDescription,
            system_prompt: systemPrompt
        }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
