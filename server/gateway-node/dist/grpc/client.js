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
exports.evaluateAuthorityProposal = evaluateAuthorityProposal;
exports.calculateSimilarity = calculateSimilarity;
exports.runCrisisScenario = runCrisisScenario;
exports.runDetailedSimulation = runDetailedSimulation;
exports.generateRecoveryPaths = generateRecoveryPaths;
exports.getSystemSettings = getSystemSettings;
exports.saveSystemSettings = saveSystemSettings;
exports.getSecurityClearances = getSecurityClearances;
exports.updateSecurityClearance = updateSecurityClearance;
exports.getAccessTokens = getAccessTokens;
exports.generateAccessToken = generateAccessToken;
exports.updateAccessToken = updateAccessToken;
exports.getAlertRules = getAlertRules;
exports.saveAlertRule = saveAlertRule;
exports.deleteAlertRule = deleteAlertRule;
exports.getComplianceRecords = getComplianceRecords;
exports.saveComplianceRecord = saveComplianceRecord;
exports.deleteComplianceRecord = deleteComplianceRecord;
exports.generateRiskRadarData = generateRiskRadarData;
exports.generateForecastData = generateForecastData;
exports.generateBlackSwanData = generateBlackSwanData;
exports.getNationModelData = getNationModelData;
exports.executeShockScenario = executeShockScenario;
exports.generateDependenciesData = generateDependenciesData;
exports.getInfrastructureData = getInfrastructureData;
exports.simulateInfrastructureUpdate = simulateInfrastructureUpdate;
exports.getAnalyticsData = getAnalyticsData;
exports.simulateAnalyticsUpdate = simulateAnalyticsUpdate;
exports.generateSynthesisReport = generateSynthesisReport;
exports.getCrisisData = getCrisisData;
exports.simulateCrisisUpdate = simulateCrisisUpdate;
exports.generatePolicyOptions = generatePolicyOptions;
exports.getProcurementData = getProcurementData;
exports.simulateProcurementUpdate = simulateProcurementUpdate;
exports.getIntelligenceGraphData = getIntelligenceGraphData;
exports.simulateIntelligenceUpdate = simulateIntelligenceUpdate;
exports.sendCopilotMessage = sendCopilotMessage;
exports.getCollaborationData = getCollaborationData;
exports.createCollaborationRoom = createCollaborationRoom;
exports.sendCollaborationMessage = sendCollaborationMessage;
exports.getCommandCenterData = getCommandCenterData;
exports.refreshCommandCenterData = refreshCommandCenterData;
exports.getExecutiveBriefingData = getExecutiveBriefingData;
exports.refreshExecutiveBriefingData = refreshExecutiveBriefingData;
exports.getMetricDetail = getMetricDetail;
exports.simulateEmergencyPowers = simulateEmergencyPowers;
exports.analyzeTreatyConstraints = analyzeTreatyConstraints;
exports.getOperatorDashboardData = getOperatorDashboardData;
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
function evaluateAuthorityProposal(title) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.EvaluateAuthorityProposal({ title }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function calculateSimilarity(countryCode) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.CalculateSimilarity({ country_code: countryCode }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
// ── Sandbox Methods ──────────────────────────────────────────────────────────
function runCrisisScenario(crises, scenarioName = 'Custom Scenario') {
    return new Promise((resolve, reject) => {
        exports.grpcClient.RunCrisisScenario({ crises, scenario_name: scenarioName }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
/** Returns a gRPC readable stream. Caller must iterate over it. */
function runDetailedSimulation(crises, epochs) {
    return exports.grpcClient.RunDetailedSimulation({ crises, epochs });
}
function generateRecoveryPaths(crises, scenarioId = '') {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GenerateRecoveryPaths({ crises, scenario_id: scenarioId }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
// ── Settings Methods ──────────────────────────────────────────────────────────
function getSystemSettings() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetSystemSettings({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function saveSystemSettings(updates) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SaveSystemSettings(updates, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function getSecurityClearances() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetSecurityClearances({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function updateSecurityClearance(id, level, status) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.UpdateSecurityClearance({ id, level: level || '', status: status || '' }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function getAccessTokens() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetAccessTokens({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function generateAccessToken(tokenType, environment, permissions, owner) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GenerateAccessToken({ token_type: tokenType, environment, permissions, owner: owner || 'System' }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function updateAccessToken(id, action) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.UpdateAccessToken({ id, action }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function getAlertRules() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetAlertRules({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function saveAlertRule(rule) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SaveAlertRule({ id: rule.id || '', name: rule.name, severity: rule.severity, trigger: rule.trigger, destination: rule.destination, active: rule.active }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function deleteAlertRule(id) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.DeleteAlertRule({ id }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
// ── COMPLIANCE RECORDS ────────────────────────────────────────────────────────
function getComplianceRecords() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetComplianceRecords({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response?.records || []);
        });
    });
}
function saveComplianceRecord(request) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SaveComplianceRecord(request, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function deleteComplianceRecord(id) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.DeleteComplianceRecord({ id }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
// ── NEW ENDPOINTS RESTORED + COLLABORATION ──
function generateRiskRadarData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GenerateRiskRadarData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function generateForecastData(timeframe) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GenerateForecastData({ timeframe }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function generateBlackSwanData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GenerateBlackSwanData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function getNationModelData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetNationModelData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function executeShockScenario(scenarioId) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.ExecuteShockScenario({ scenarioId }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function generateDependenciesData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GenerateDependenciesData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function getInfrastructureData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetInfrastructureData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function simulateInfrastructureUpdate() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SimulateInfrastructureUpdate({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function getAnalyticsData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetAnalyticsData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function simulateAnalyticsUpdate() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SimulateAnalyticsUpdate({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function generateSynthesisReport(domain, horizon) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GenerateSynthesisReport({ domain, horizon }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function getCrisisData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetCrisisData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function simulateCrisisUpdate() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SimulateCrisisUpdate({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function generatePolicyOptions(prompt) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GeneratePolicyOptions({ prompt }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function getProcurementData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetProcurementData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function simulateProcurementUpdate() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SimulateProcurementUpdate({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function getIntelligenceGraphData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetIntelligenceGraphData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function simulateIntelligenceUpdate() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SimulateIntelligenceUpdate({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function sendCopilotMessage(prompt) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SendCopilotMessage({ prompt }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
// ── COLLABORATION ENDPOINTS ──
function getCollaborationData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetCollaborationData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function createCollaborationRoom(name, type, category) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.CreateCollaborationRoom({ name, type, category }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function sendCollaborationMessage(roomId, sender, text) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SendCollaborationMessage({ roomId, sender, text }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
// ── COMMAND CENTER ENDPOINTS ──
function getCommandCenterData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetCommandCenterData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function refreshCommandCenterData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.RefreshCommandCenterData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
// ── EXECUTIVE BRIEFING ENDPOINTS ──
function getExecutiveBriefingData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetExecutiveBriefingData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function refreshExecutiveBriefingData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.RefreshExecutiveBriefingData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
// ── METRIC DETAIL ENDPOINTS ──
function getMetricDetail(metricId) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetMetricDetail({ metric_id: metricId }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
// ── EMERGENCY POWERS & TREATY ENDPOINTS ──
function simulateEmergencyPowers(scenario) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.SimulateEmergencyPowers({ scenario }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
function analyzeTreatyConstraints(proposal) {
    return new Promise((resolve, reject) => {
        exports.grpcClient.AnalyzeTreatyConstraints({ proposal }, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
// ── OPERATOR DASHBOARD ENDPOINTS ──
function getOperatorDashboardData() {
    return new Promise((resolve, reject) => {
        exports.grpcClient.GetOperatorDashboardData({}, (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
