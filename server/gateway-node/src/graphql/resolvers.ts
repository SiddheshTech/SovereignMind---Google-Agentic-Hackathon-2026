import {
  getSovereigntyGenome,
  searchGenomeTraits,
  runConstitutionalEvaluation,
  draftEmergencyContract,
  optimizePrompt
} from '../grpc/client';
import { triggerSandboxStream } from '../websockets/simulation_stream';

export const resolvers = {
  Query: {
    getGenome: async (_: any, { countryCode }: { countryCode: string }) => {
      try {
        return await getSovereigntyGenome(countryCode);
      } catch (err) {
        console.error('GraphQL Error getGenome:', err);
        throw err;
      }
    },
    searchGenomes: async (_: any, { query, limit }: { query: string; limit?: number }) => {
      try {
        const response = await searchGenomeTraits(query, limit || 5);
        return response.results || [];
      } catch (err) {
        console.error('GraphQL Error searchGenomes:', err);
        throw err;
      }
    },
    evaluateAction: async (
      _: any,
      { countryCode, proposedAction, context }: { countryCode: string; proposedAction: string; context: string }
    ) => {
      try {
        return await runConstitutionalEvaluation(countryCode, proposedAction, context);
      } catch (err) {
        console.error('GraphQL Error evaluateAction:', err);
        throw err;
      }
    },
  },
  Mutation: {
    startSandbox: async (
      _: any,
      { countryCode, epochs, activeCrises }: { countryCode: string; epochs: number; activeCrises: string[] }
    ) => {
      try {
        // Trigger the gRPC stream and broadcast via WebSockets
        triggerSandboxStream(countryCode, epochs, activeCrises);
        return {
          country_code: countryCode,
          epochs,
          status: 'SIMULATION_STARTED',
        };
      } catch (err) {
        console.error('GraphQL Error startSandbox:', err);
        throw err;
      }
    },
    draftContract: async (
      _: any,
      { itemNeeded, quantityRequired, urgentReason }: { itemNeeded: string; quantityRequired: number; urgentReason: string }
    ) => {
      try {
        return await draftEmergencyContract(itemNeeded, quantityRequired, urgentReason);
      } catch (err) {
        console.error('GraphQL Error draftContract:', err);
        throw err;
      }
    },
    optimizePrompt: async (
      _: any,
      { agentId, taskDescription, systemPrompt }: { agentId: string; taskDescription: string; systemPrompt: string }
    ) => {
      try {
        return await optimizePrompt(agentId, taskDescription, systemPrompt);
      } catch (err) {
        console.error('GraphQL Error optimizePrompt:', err);
        throw err;
      }
    },
  },
  Subscription: {
    sandboxTickStream: {
      subscribe: async function* (_: any, { countryCode }: { countryCode: string }) {
        console.log(`📡 [GraphQL Subscription] Client subscribed to sandbox tick stream for: ${countryCode}`);
        
        // Yield realistic simulated updates over 5 epochs for the subscription
        for (let epoch = 1; epoch <= 5; epoch++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          yield {
            sandboxTickStream: {
              epoch,
              population: {
                total_population: 10000000.0 - epoch * 250000,
                panic_level: 0.2 + epoch * 0.15,
                displacement_rate: 0.1 + epoch * 0.1
              },
              economy: {
                gdp_growth_rate: 0.02 - epoch * 0.01,
                inflation: 0.02 + epoch * 0.05,
                supply_chain_integrity: 1.0 - epoch * 0.15
              },
              instability: {
                civil_unrest: 0.1 + epoch * 0.15,
                systemic_collapse_probability: 0.05 + epoch * 0.12
              },
              status_message: `GraphQL Subscription stream epoch ${epoch}: Cascades propagating.`
            }
          };
        }
      }
    }
  }
};
