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
