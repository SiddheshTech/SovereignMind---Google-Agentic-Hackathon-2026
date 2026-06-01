"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("../grpc/client");
const simulation_stream_1 = require("../websockets/simulation_stream");
exports.resolvers = {
    Query: {
        getGenome: async (_, { countryCode }) => {
            try {
                return await (0, client_1.getSovereigntyGenome)(countryCode);
            }
            catch (err) {
                console.error('GraphQL Error getGenome:', err);
                throw err;
            }
        },
        searchGenomes: async (_, { query, limit }) => {
            try {
                const response = await (0, client_1.searchGenomeTraits)(query, limit || 5);
                return response.results || [];
            }
            catch (err) {
                console.error('GraphQL Error searchGenomes:', err);
                throw err;
            }
        },
        evaluateAction: async (_, { countryCode, proposedAction, context }) => {
            try {
                return await (0, client_1.runConstitutionalEvaluation)(countryCode, proposedAction, context);
            }
            catch (err) {
                console.error('GraphQL Error evaluateAction:', err);
                throw err;
            }
        },
    },
    Mutation: {
        startSandbox: async (_, { countryCode, epochs, activeCrises }) => {
            try {
                // Trigger the gRPC stream and broadcast via WebSockets
                (0, simulation_stream_1.triggerSandboxStream)(countryCode, epochs, activeCrises);
                return {
                    country_code: countryCode,
                    epochs,
                    status: 'SIMULATION_STARTED',
                };
            }
            catch (err) {
                console.error('GraphQL Error startSandbox:', err);
                throw err;
            }
        },
        draftContract: async (_, { itemNeeded, quantityRequired, urgentReason }) => {
            try {
                return await (0, client_1.draftEmergencyContract)(itemNeeded, quantityRequired, urgentReason);
            }
            catch (err) {
                console.error('GraphQL Error draftContract:', err);
                throw err;
            }
        },
        optimizePrompt: async (_, { agentId, taskDescription, systemPrompt }) => {
            try {
                return await (0, client_1.optimizePrompt)(agentId, taskDescription, systemPrompt);
            }
            catch (err) {
                console.error('GraphQL Error optimizePrompt:', err);
                throw err;
            }
        },
    },
    Subscription: {
        sandboxTickStream: {
            subscribe: async function* (_, { countryCode }) {
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
