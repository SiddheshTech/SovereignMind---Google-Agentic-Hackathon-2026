import {
  getSovereigntyGenome,
  searchGenomeTraits,
  runConstitutionalEvaluation,
  draftEmergencyContract,
  optimizePrompt,
  evaluateAuthorityProposal,
  runCrisisScenario,
  runDetailedSimulation,
  generateRecoveryPaths,
  calculateSimilarity,
  getSystemSettings,
  saveSystemSettings,
  getSecurityClearances,
  updateSecurityClearance,
  getAccessTokens,
  generateAccessToken,
  updateAccessToken,
  getAlertRules,
  saveAlertRule,
  deleteAlertRule,
  getComplianceRecords,
  saveComplianceRecord,
  deleteComplianceRecord,
} from '../grpc/client';
import { triggerSandboxStream, broadcast, triggerDetailedSimStream } from '../websockets/simulation_stream';
import { AuthorityProposal } from '../models/AuthorityProposal';
import { CrisisSimulation } from '../models/CrisisSimulation';
import { CivilizationGenome } from '../models/CivilizationGenome';
import connectDB from '../config/db';

connectDB();

/** Helper to convert gRPC CrisisScenarioResponse to GraphQL shape */
function formatSimulation(doc: any) {
  const pop = doc.simulatedPopulation || {};
  return {
    id: doc._id?.toString() || doc.id,
    scenarioName: doc.scenarioName,
    crises: doc.crises || [],
    resilienceScore: doc.resilienceScore ?? 50,
    estimatedRecoveryMonths: doc.estimatedRecoveryMonths ?? 18,
    simulatedPopulation: {
      totalAgents: pop.totalAgents ?? 10000000,
      ageGroups: (pop.ageGroups || []).map((a: any) => ({
        group: a.group,
        percentage: a.percentage,
        reaction: a.reaction,
      })),
      incomeClasses: (pop.incomeClasses || []).map((c: any) => ({
        class: c.class || c.income_class,
        percentage: c.percentage,
        vulnerability: c.vulnerability,
      })),
      migrationTendencies: {
        rate: pop.migrationTendencies?.rate || '',
        hotspots: pop.migrationTendencies?.hotspots || [],
        description: pop.migrationTendencies?.description || '',
      },
      consumptionPatterns: {
        hoardingRisk: pop.consumptionPatterns?.hoardingRisk || '',
        essentialGoodDemand: pop.consumptionPatterns?.essentialGoodDemand || '',
        description: pop.consumptionPatterns?.description || '',
      },
      politicalPreferences: (pop.politicalPreferences || []).map((p: any) => ({
        faction: p.faction,
        percentage: p.percentage,
        sentiment: p.sentiment,
      })),
    },
    economicShock: {
      oilCrisisPremium: doc.economicShock?.oilCrisisPremium ?? 0,
      foodShortagesIndex: doc.economicShock?.foodShortagesIndex ?? 0,
      disruptionSummary: doc.economicShock?.disruptionSummary || '',
    },
    panicSentiment: {
      realtimeNarratives: doc.panicSentiment?.realtimeNarratives || [],
      protestPropensity: doc.panicSentiment?.protestPropensity ?? 0,
      misinformationStrength: doc.panicSentiment?.misinformationStrength ?? 0,
    },
    cascadeLinks: doc.cascadeLinks || [],
    recoveryPaths: doc.recoveryPaths || null,
    createdAt: (doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt || Date.now())).toISOString(),
  };
}

/** Convert protobuf gRPC response to our MongoDB-compatible shape */
function grpcScenarioToDoc(res: any) {
  const pop = res.simulated_population || {};
  return {
    scenarioName: res.scenario_name || 'Custom Scenario',
    crises: res.crises || [],
    resilienceScore: res.resilience_score ?? 50,
    estimatedRecoveryMonths: res.estimated_recovery_months ?? 18,
    simulatedPopulation: {
      totalAgents: pop.total_agents ?? 10000000,
      ageGroups: (pop.age_groups || []).map((a: any) => ({
        group: a.group,
        percentage: a.percentage,
        reaction: a.reaction,
      })),
      incomeClasses: (pop.income_classes || []).map((c: any) => ({
        class: c.income_class || c.class,
        percentage: c.percentage,
        vulnerability: c.vulnerability,
      })),
      migrationTendencies: {
        rate: pop.migration_tendencies?.rate || '',
        hotspots: pop.migration_tendencies?.hotspots || [],
        description: pop.migration_tendencies?.description || '',
      },
      consumptionPatterns: {
        hoardingRisk: pop.consumption_patterns?.hoarding_risk || '',
        essentialGoodDemand: pop.consumption_patterns?.essential_good_demand || '',
        description: pop.consumption_patterns?.description || '',
      },
      politicalPreferences: (res.political_preferences || []).map((p: any) => ({
        faction: p.faction,
        percentage: p.percentage,
        sentiment: p.sentiment,
      })),
    },
    economicShock: {
      oilCrisisPremium: res.economic_shock?.oil_crisis_premium ?? 0,
      foodShortagesIndex: res.economic_shock?.food_shortages_index ?? 0,
      disruptionSummary: res.economic_shock?.disruption_summary || '',
    },
    panicSentiment: {
      realtimeNarratives: res.panic_sentiment?.realtime_narratives || [],
      protestPropensity: res.panic_sentiment?.protest_propensity ?? 0,
      misinformationStrength: res.panic_sentiment?.misinformation_strength ?? 0,
    },
    cascadeLinks: res.cascade_links || [],
  };
}


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
    getDetailedGenome: async (_: any, { countryCode }: { countryCode: string }) => {
      try {
        const genome = await CivilizationGenome.findOne({ countryCode: countryCode.toUpperCase() });
        return genome;
      } catch (err) {
        console.error('GraphQL Error getDetailedGenome:', err);
        throw err;
      }
    },
    getSimilarity: async (_: any, { countryCode }: { countryCode: string }) => {
      try {
        const response = await calculateSimilarity(countryCode);
        return response.results || [];
      } catch (err) {
        console.error('GraphQL Error getSimilarity:', err);
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
    getAuthorityProposals: async () => {
      try {
        const proposals = await AuthorityProposal.find().sort({ createdAt: -1 });
        return proposals.map(p => ({
          id: p._id.toString(),
          title: p.title,
          safetyScore: p.safetyScore,
          riskScore: p.riskScore,
          civilLibertyImpact: p.civilLibertyImpact,
          recommendation: p.recommendation,
          zone: p.zone,
          constitutionalPoints: p.constitutionalPoints,
          violations: p.violations,
          explanation: p.explanation,
          createdAt: p.createdAt.toISOString()
        }));
      } catch (err) {
        console.error('GraphQL Error getAuthorityProposals:', err);
        throw err;
      }
    },

    // ── Sandbox Queries ────────────────────────────────────────────────────────
    getCrisisSimulations: async (_: any, { limit }: { limit?: number }) => {
      try {
        const sims = await CrisisSimulation.find().sort({ createdAt: -1 }).limit(limit || 20);
        return sims.map(formatSimulation);
      } catch (err) {
        console.error('GraphQL Error getCrisisSimulations:', err);
        throw err;
      }
    },
    getCrisisSimulation: async (_: any, { id }: { id: string }) => {
      try {
        const sim = await CrisisSimulation.findById(id);
        if (!sim) throw new Error('Simulation not found');
        return formatSimulation(sim);
      } catch (err) {
        console.error('GraphQL Error getCrisisSimulation:', err);
        throw err;
      }
    },

    // ── Settings Queries ───────────────────────────────────────────────────────
    getSystemSettings: async () => {
      try {
        const s = await getSystemSettings();
        return {
          operatorName: s.operator_name,
          operatorId: s.operator_id,
          operatorInstitution: s.operator_institution,
          operatorRole: s.operator_role,
          operatorTogglesJson: s.operator_toggles_json,
          modelProcessingBound: s.model_processing_bound,
          clearanceMatrixJson: s.clearance_matrix_json,
          activeRegion: s.active_region,
          storagePoliciesJson: s.storage_policies_json,
          processingBoundary: s.processing_boundary,
          theme: s.theme,
          telemetryTogglesJson: s.telemetry_toggles_json,
          notificationChannelsJson: s.notification_channels_json,
          networkProtocolsJson: s.network_protocols_json,
          networkPoliciesJson: s.network_policies_json,
        };
      } catch (err) {
        console.error('GraphQL Error getSystemSettings:', err);
        throw err;
      }
    },

    getSecurityClearances: async () => {
      try {
        const res = await getSecurityClearances();
        return (res.clearances || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          serviceId: c.service_id,
          level: c.level,
          status: c.status,
          expiry: c.expiry,
        }));
      } catch (err) {
        console.error('GraphQL Error getSecurityClearances:', err);
        throw err;
      }
    },

    getAccessTokens: async () => {
      try {
        const res = await getAccessTokens();
        return (res.tokens || []).map((t: any) => ({
          id: t.id,
          owner: t.owner,
          tokenType: t.token_type,
          created: t.created,
          lastUsed: t.last_used,
          status: t.status,
        }));
      } catch (err) {
        console.error('GraphQL Error getAccessTokens:', err);
        throw err;
      }
    },

    getAlertRules: async () => {
      try {
        const res = await getAlertRules();
        return res?.rules || [];
      } catch (err: any) {
        throw new Error(`gRPC getAlertRules failed: ${err.message}`);
      }
    },
    getComplianceRecords: async () => {
      try {
        const res = await getComplianceRecords();
        return res; // Already maps to records array in client.ts
      } catch (err: any) {
        throw new Error(`gRPC getComplianceRecords failed: ${err.message}`);
      }
    }
  },

  Mutation: {
    startSandbox: async (
      _: any,
      { countryCode, epochs, activeCrises }: { countryCode: string; epochs: number; activeCrises: string[] }
    ) => {
      try {
        triggerSandboxStream(countryCode, epochs, activeCrises);
        return { country_code: countryCode, epochs, status: 'SIMULATION_STARTED' };
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
    validateAuthorityProposal: async (_: any, { title }: { title: string }) => {
      try {
        const res = await evaluateAuthorityProposal(title);
        const newProposal = new AuthorityProposal({
          title: res.title,
          safetyScore: res.safety_score,
          riskScore: res.risk_score,
          civilLibertyImpact: res.civil_liberty_impact,
          recommendation: res.recommendation,
          zone: res.zone,
          constitutionalPoints: res.constitutional_points || [],
          violations: res.violations || [],
          explanation: res.explanation
        });
        await newProposal.save();
        const responseData = {
          id: newProposal._id.toString(),
          title: newProposal.title,
          safetyScore: newProposal.safetyScore,
          riskScore: newProposal.riskScore,
          civilLibertyImpact: newProposal.civilLibertyImpact,
          recommendation: newProposal.recommendation,
          zone: newProposal.zone,
          constitutionalPoints: newProposal.constitutionalPoints,
          violations: newProposal.violations,
          explanation: newProposal.explanation,
          createdAt: newProposal.createdAt.toISOString()
        };
        broadcast({ type: 'AUTHORITY_PROPOSAL_ADDED', data: responseData }, '/ws/authority-maps');
        return responseData;
      } catch (err) {
        console.error('GraphQL Error validateAuthorityProposal:', err);
        throw err;
      }
    },

    // ── Sandbox Mutations ──────────────────────────────────────────────────────

    /** Full AI crisis scenario analysis → saved to MongoDB, live tick stream started */
    launchCrisisSimulation: async (
      _: any,
      { crises, scenarioName }: { crises: string[]; scenarioName?: string }
    ) => {
      try {
        const name = scenarioName || `Scenario: ${crises.slice(0, 2).join(' + ')}`;
        console.log(`🚀 [GraphQL] launchCrisisSimulation for: ${crises}`);

        // 1. Run AI crisis analysis via gRPC → FastAPI → Gemini
        const grpcRes = await runCrisisScenario(crises, name);
        const docData = grpcScenarioToDoc(grpcRes);

        // 2. Save to MongoDB
        const saved = await CrisisSimulation.create(docData);
        const simId = saved._id.toString();

        // 3. Trigger real-time tick stream for Simulations tab (non-blocking)
        triggerDetailedSimStream(crises, 12, simId);

        // 4. Broadcast to all sandbox WS clients
        broadcast({
          type: 'SIMULATION_LAUNCHED',
          simulationId: simId,
          scenarioName: name,
          crises,
          resilienceScore: grpcRes.resilience_score,
          estimatedRecoveryMonths: grpcRes.estimated_recovery_months,
        }, '/ws/sandbox');

        return {
          simulationId: simId,
          scenarioName: name,
          status: 'LAUNCHED',
          crises,
          resilienceScore: grpcRes.resilience_score ?? 50,
          estimatedRecoveryMonths: grpcRes.estimated_recovery_months ?? 18,
        };
      } catch (err: any) {
        console.error('GraphQL Error launchCrisisSimulation:', err);
        throw err;
      }
    },

    /** Generate AI recovery paths for an existing simulation */
    generateRecoveryPaths: async (
      _: any,
      { simulationId, crises }: { simulationId: string; crises: string[] }
    ) => {
      try {
        console.log(`🔮 [GraphQL] generateRecoveryPaths for sim ${simulationId}`);

        // gRPC → FastAPI → Gemini
        const grpcRes = await generateRecoveryPaths(crises, simulationId);

        const recoveryDoc = {
          bestCase: {
            trajectory: grpcRes.best_case?.trajectory || '',
            probability: grpcRes.best_case?.probability ?? 0,
            description: grpcRes.best_case?.description || '',
            estimatedMonths: grpcRes.best_case?.estimated_months ?? 0,
          },
          expected: {
            trajectory: grpcRes.expected?.trajectory || '',
            probability: grpcRes.expected?.probability ?? 0,
            description: grpcRes.expected?.description || '',
            estimatedMonths: grpcRes.expected?.estimated_months ?? 0,
          },
          worstCase: {
            trajectory: grpcRes.worst_case?.trajectory || '',
            probability: grpcRes.worst_case?.probability ?? 0,
            description: grpcRes.worst_case?.description || '',
            estimatedMonths: grpcRes.worst_case?.estimated_months ?? 0,
          },
          overallRecommendation: grpcRes.overall_recommendation || '',
        };

        // Update simulation record in MongoDB
        await CrisisSimulation.findByIdAndUpdate(simulationId, {
          $set: { recoveryPaths: recoveryDoc }
        });

        // Broadcast to recovery-explorer WS clients
        broadcast({
          type: 'RECOVERY_PATHS_READY',
          simulationId,
          recoveryPaths: recoveryDoc,
        }, '/ws/sandbox');

        return recoveryDoc;
      } catch (err: any) {
        console.error('GraphQL Error generateRecoveryPaths:', err);
        throw err;
      }
    },

    /** Save a named scenario (no AI yet — just crises list persisted) */
    saveScenario: async (
      _: any,
      { crises, scenarioName }: { crises: string[]; scenarioName: string }
    ) => {
      try {
        console.log(`💾 [GraphQL] saveScenario: "${scenarioName}" with crises: ${crises}`);

        // Run AI analysis for the saved scenario
        const grpcRes = await runCrisisScenario(crises, scenarioName);
        const docData = grpcScenarioToDoc(grpcRes);
        const saved = await CrisisSimulation.create(docData);

        broadcast({
          type: 'SCENARIO_SAVED',
          simulationId: saved._id.toString(),
          scenarioName,
          crises,
        }, '/ws/sandbox');

        return formatSimulation(saved);
      } catch (err: any) {
        console.error('GraphQL Error saveScenario:', err);
        throw err;
      }
    },

    // ── Settings Mutations ────────────────────────────────────────────────────
    saveSystemSettings: async (_: any, { input }: { input: Record<string, any> }) => {
      try {
        // Map camelCase GraphQL input to snake_case for gRPC
        const updates: Record<string, any> = {};
        if (input.operatorName !== undefined) updates.operator_name = input.operatorName;
        if (input.operatorId !== undefined) updates.operator_id = input.operatorId;
        if (input.operatorInstitution !== undefined) updates.operator_institution = input.operatorInstitution;
        if (input.operatorRole !== undefined) updates.operator_role = input.operatorRole;
        if (input.operatorTogglesJson !== undefined) updates.operator_toggles_json = input.operatorTogglesJson;
        if (input.modelProcessingBound !== undefined) updates.model_processing_bound = input.modelProcessingBound;
        if (input.clearanceMatrixJson !== undefined) updates.clearance_matrix_json = input.clearanceMatrixJson;
        if (input.activeRegion !== undefined) updates.active_region = input.activeRegion;
        if (input.storagePoliciesJson !== undefined) updates.storage_policies_json = input.storagePoliciesJson;
        if (input.processingBoundary !== undefined) updates.processing_boundary = input.processingBoundary;
        if (input.theme !== undefined) updates.theme = input.theme;
        if (input.telemetryTogglesJson !== undefined) updates.telemetry_toggles_json = input.telemetryTogglesJson;
        if (input.notificationChannelsJson !== undefined) updates.notification_channels_json = input.notificationChannelsJson;
        if (input.networkProtocolsJson !== undefined) updates.network_protocols_json = input.networkProtocolsJson;
        if (input.networkPoliciesJson !== undefined) updates.network_policies_json = input.networkPoliciesJson;

        const s = await saveSystemSettings(updates);
        const result = {
          operatorName: s.operator_name,
          operatorId: s.operator_id,
          operatorInstitution: s.operator_institution,
          operatorRole: s.operator_role,
          operatorTogglesJson: s.operator_toggles_json,
          modelProcessingBound: s.model_processing_bound,
          clearanceMatrixJson: s.clearance_matrix_json,
          activeRegion: s.active_region,
          storagePoliciesJson: s.storage_policies_json,
          processingBoundary: s.processing_boundary,
          theme: s.theme,
          telemetryTogglesJson: s.telemetry_toggles_json,
          notificationChannelsJson: s.notification_channels_json,
          networkProtocolsJson: s.network_protocols_json,
          networkPoliciesJson: s.network_policies_json,
        };
        broadcast({ type: 'SETTINGS_UPDATED', data: result }, '/ws/settings');
        return result;
      } catch (err) {
        console.error('GraphQL Error saveSystemSettings:', err);
        throw err;
      }
    },

    updateSecurityClearance: async (_: any, { id, level, status }: { id: string; level?: string; status?: string }) => {
      try {
        const c = await updateSecurityClearance(id, level, status);
        const result = {
          id: c.id, name: c.name, serviceId: c.service_id,
          level: c.level, status: c.status, expiry: c.expiry,
        };
        broadcast({ type: 'CLEARANCE_UPDATED', data: result }, '/ws/settings');
        return result;
      } catch (err) {
        console.error('GraphQL Error updateSecurityClearance:', err);
        throw err;
      }
    },

    generateAccessToken: async (_: any, { tokenType, environment, permissions, owner }: any) => {
      try {
        const t = await generateAccessToken(tokenType, environment, permissions, owner);
        const result = {
          id: t.id, owner: t.owner, tokenType: t.token_type,
          created: t.created, lastUsed: t.last_used, status: t.status,
        };
        broadcast({ type: 'TOKEN_GENERATED', data: result }, '/ws/settings');
        return result;
      } catch (err) {
        console.error('GraphQL Error generateAccessToken:', err);
        throw err;
      }
    },

    updateAccessToken: async (_: any, { id, action }: { id: string; action: string }) => {
      try {
        const t = await updateAccessToken(id, action);
        const result = {
          id: t.id, owner: t.owner, tokenType: t.token_type,
          created: t.created, lastUsed: t.last_used, status: t.status,
        };
        broadcast({ type: 'TOKEN_UPDATED', data: result }, '/ws/settings');
        return result;
      } catch (err) {
        console.error('GraphQL Error updateAccessToken:', err);
        throw err;
      }
    },

    saveAlertRule: async (_: any, args: any) => {
      try {
        const r = await saveAlertRule({
          id: args.id,
          name: args.name,
          severity: args.severity,
          trigger: args.trigger,
          destination: args.destination,
          active: args.active,
        });
        const result = {
          id: r.id, name: r.name, severity: r.severity,
          trigger: r.trigger, destination: r.destination, active: r.active,
        };
        broadcast({ type: 'ALERT_RULE_SAVED', data: result }, '/ws/settings');
        return result;
      } catch (err) {
        console.error('GraphQL Error saveAlertRule:', err);
        throw err;
      }
    },

    deleteAlertRule: async (_: any, { id }: { id: string }) => {
      try {
        const res = await deleteAlertRule(id);
        broadcast({ type: 'ALERT_RULE_DELETED', id }, '/ws/settings');
        return res;
      } catch (err: any) {
        throw new Error(`gRPC deleteAlertRule failed: ${err.message}`);
      }
    },
    saveComplianceRecord: async (_: any, { input }: any) => {
      try {
        const args = {
          id: input.id || '',
          name: input.name,
          score: input.score,
          risk: input.risk,
          last_audit: input.lastAudit
        };
        const record = await saveComplianceRecord(args);
        const mapped = { ...record, lastAudit: record.last_audit };
        broadcast({ type: 'COMPLIANCE_RECORD_SAVED', record: mapped }, '/ws/settings');
        return mapped;
      } catch (err: any) {
        throw new Error(`gRPC saveComplianceRecord failed: ${err.message}`);
      }
    },
    deleteComplianceRecord: async (_: any, { id }: { id: string }) => {
      try {
        const res = await deleteComplianceRecord(id);
        broadcast({ type: 'COMPLIANCE_RECORD_DELETED', id }, '/ws/settings');
        return res;
      } catch (err: any) {
        throw new Error(`gRPC deleteComplianceRecord failed: ${err.message}`);
      }
    }
  },

  Subscription: {
    sandboxTickStream: {
      subscribe: async function* (_: any, { countryCode }: { countryCode: string }) {
        console.log(`📡 [GraphQL Subscription] Client subscribed to sandbox tick stream for: ${countryCode}`);
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
              status_message: `Epoch ${epoch}: Cascades propagating.`
            }
          };
        }
      }
    }
  }
};
