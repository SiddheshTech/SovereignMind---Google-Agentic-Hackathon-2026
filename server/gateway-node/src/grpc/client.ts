import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const PROTO_PATH = path.join(__dirname, '../../../grpc-proto/services.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
const sovereignmind = protoDescriptor.sovereignmind;

// Default FastAPI Core gRPC address
const GRPC_SERVER_ADDRESS = process.env.GRPC_SERVER_ADDRESS || 'localhost:50051';

export const grpcClient = new sovereignmind.SovereignMindService(
  GRPC_SERVER_ADDRESS,
  grpc.credentials.createInsecure()
);

export function getSovereigntyGenome(countryCode: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetSovereigntyGenome({ country_code: countryCode }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function searchGenomeTraits(query: string, limit = 5): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SearchGenomeTraits({ query, limit }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function runConstitutionalEvaluation(countryCode: string, proposedAction: string, context: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.RunConstitutionalEvaluation({ country_code: countryCode, proposed_action: proposedAction, context }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function startSandboxSimulation(countryCode: string, epochs: number, activeCrises: string[]): any {
  // Returns a readable stream
  return grpcClient.StartSandboxSimulation({
    country_code: countryCode,
    epochs,
    active_crises: activeCrises
  });
}

export function draftEmergencyContract(itemNeeded: string, quantityRequired: number, urgentReason: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.DraftEmergencyContract({
      item_needed: itemNeeded,
      quantity_required: quantityRequired,
      urgent_reason: urgentReason
    }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function optimizePrompt(agentId: string, taskDescription: string, systemPrompt: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.OptimizePrompt({
      agent_id: agentId,
      task_description: taskDescription,
      system_prompt: systemPrompt
    }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function evaluateAuthorityProposal(title: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.EvaluateAuthorityProposal({ title }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function calculateSimilarity(countryCode: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.CalculateSimilarity({ country_code: countryCode }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

// ── Sandbox Methods ──────────────────────────────────────────────────────────

export function runCrisisScenario(crises: string[], scenarioName: string = 'Custom Scenario'): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.RunCrisisScenario(
      { crises, scenario_name: scenarioName },
      (err: any, response: any) => {
        if (err) return reject(err);
        resolve(response);
      }
    );
  });
}

/** Returns a gRPC readable stream. Caller must iterate over it. */
export function runDetailedSimulation(crises: string[], epochs: number): any {
  return grpcClient.RunDetailedSimulation({ crises, epochs });
}

export function generateRecoveryPaths(crises: string[], scenarioId: string = ''): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GenerateRecoveryPaths(
      { crises, scenario_id: scenarioId },
      (err: any, response: any) => {
        if (err) return reject(err);
        resolve(response);
      }
    );
  });
}

// ── Settings Methods ──────────────────────────────────────────────────────────

export function getSystemSettings(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetSystemSettings({}, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function saveSystemSettings(updates: Record<string, any>): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SaveSystemSettings(updates, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function getSecurityClearances(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetSecurityClearances({}, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function updateSecurityClearance(id: string, level?: string, status?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.UpdateSecurityClearance({ id, level: level || '', status: status || '' }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function getAccessTokens(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetAccessTokens({}, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function generateAccessToken(tokenType: string, environment: string, permissions: string, owner?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GenerateAccessToken(
      { token_type: tokenType, environment, permissions, owner: owner || 'System' },
      (err: any, response: any) => {
        if (err) return reject(err);
        resolve(response);
      }
    );
  });
}

export function updateAccessToken(id: string, action: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.UpdateAccessToken({ id, action }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function getAlertRules(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetAlertRules({}, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function saveAlertRule(rule: { id?: string; name: string; severity: string; trigger: string; destination: string; active: boolean }): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SaveAlertRule(
      { id: rule.id || '', name: rule.name, severity: rule.severity, trigger: rule.trigger, destination: rule.destination, active: rule.active },
      (err: any, response: any) => {
        if (err) return reject(err);
        resolve(response);
      }
    );
  });
}

export function deleteAlertRule(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.DeleteAlertRule({ id }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

// ── COMPLIANCE RECORDS ────────────────────────────────────────────────────────

export function getComplianceRecords(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetComplianceRecords({}, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response?.records || []);
    });
  });
}

export function saveComplianceRecord(request: any): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SaveComplianceRecord(request, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function deleteComplianceRecord(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.DeleteComplianceRecord({ id }, (err: any, response: any) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

// ── NEW ENDPOINTS RESTORED + COLLABORATION ──

export function generateRiskRadarData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GenerateRiskRadar({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function generateForecastData(timeframe: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GenerateForecast({ timeframe }, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function generateBlackSwanData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GenerateBlackSwan({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function getNationModelData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetNationModel({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function executeShockScenario(scenarioId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.ExecuteShockScenario({ scenarioId }, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function generateDependenciesData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GenerateDependencies({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function getInfrastructureData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetInfrastructure({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function simulateInfrastructureUpdate(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SimulateInfrastructureUpdate({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function getAnalyticsData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetAnalyticsData({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function simulateAnalyticsUpdate(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SimulateAnalyticsUpdate({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function generateSynthesisReport(domain: string, horizon: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GenerateSynthesisReport({ domain, horizon }, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function getCrisisData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetCrisisData({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function simulateCrisisUpdate(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SimulateCrisisUpdate({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function generatePolicyOptions(prompt: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GeneratePolicyOptions({ prompt }, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function getProcurementData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetProcurementData({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function simulateProcurementUpdate(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SimulateProcurementUpdate({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function getIntelligenceGraphData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetIntelligenceGraphData({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function simulateIntelligenceUpdate(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SimulateIntelligenceUpdate({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function sendCopilotMessage(prompt: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SendCopilotMessage({ prompt }, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

// ── COLLABORATION ENDPOINTS ──

export function getCollaborationData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetCollaborationData({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function createCollaborationRoom(name: string, type: string, category: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.CreateCollaborationRoom({ name, type, category }, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}
export function sendCollaborationMessage(roomId: string, sender: string, text: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SendCollaborationMessage({ roomId, sender, text }, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

// ── COMMAND CENTER ENDPOINTS ──

export function getCommandCenterData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetCommandCenterData({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

export function refreshCommandCenterData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.RefreshCommandCenterData({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

// ── EXECUTIVE BRIEFING ENDPOINTS ──

export function getExecutiveBriefingData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetExecutiveBriefingData({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

export function refreshExecutiveBriefingData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.RefreshExecutiveBriefingData({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

// ── METRIC DETAIL ENDPOINTS ──

export function getMetricDetail(metricId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetMetricDetail({ metric_id: metricId }, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

// ── EMERGENCY POWERS & TREATY ENDPOINTS ──

export function simulateEmergencyPowers(scenario: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.SimulateEmergencyPowers({ scenario }, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

export function analyzeTreatyConstraints(proposal: string): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.AnalyzeTreatyConstraints({ proposal }, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

// ── OPERATOR DASHBOARD ENDPOINTS ──

export function getOperatorDashboardData(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.GetOperatorDashboardData({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

// ── MODEL TRAINING ENDPOINTS ──

export function triggerModelTraining(): Promise<any> {
  return new Promise((resolve, reject) => {
    grpcClient.TriggerModelTraining({}, (err: any, response: any) => {
      if (err) return reject(err); resolve(response);
    });
  });
}

