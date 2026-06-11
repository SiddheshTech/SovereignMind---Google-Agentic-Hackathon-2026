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
