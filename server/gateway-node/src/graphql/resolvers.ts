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
  generateRiskRadarData,
  generateForecastData,
  generateBlackSwanData,
  getNationModelData,
  executeShockScenario,
  generateDependenciesData,
  getInfrastructureData,
  simulateInfrastructureUpdate,
  getAnalyticsData,
  simulateAnalyticsUpdate,
  generateSynthesisReport,
  getCrisisData,
  simulateCrisisUpdate,
  generatePolicyOptions,
  getProcurementData,
  simulateProcurementUpdate,
  getIntelligenceGraphData,
  simulateIntelligenceUpdate,
  sendCopilotMessage,
  getCollaborationData,
  createCollaborationRoom,
  sendCollaborationMessage,
  getCommandCenterData as grpcGetCommandCenterData,
  refreshCommandCenterData as grpcRefreshCommandCenterData,
  getExecutiveBriefingData as grpcGetExecutiveBriefingData,
  refreshExecutiveBriefingData as grpcRefreshExecutiveBriefingData,
  getMetricDetail as grpcGetMetricDetail,
  simulateEmergencyPowers as grpcSimulateEmergencyPowers,
  analyzeTreatyConstraints as grpcAnalyzeTreatyConstraints,
  getOperatorDashboardData as grpcGetOperatorDashboardData,
  triggerModelTraining as grpcTriggerModelTraining
} from '../grpc/client';
import { triggerSandboxStream, broadcast, triggerDetailedSimStream } from '../websockets/simulation_stream';
import { AuthorityProposal } from '../models/AuthorityProposal';
import { CrisisSimulation } from '../models/CrisisSimulation';
import { CivilizationGenome } from '../models/CivilizationGenome';
import { RiskRadarThreat, EarlyWarningSignal } from '../models/RiskRadar';
import { Forecast } from '../models/Forecast';
import { BlackSwan } from '../models/BlackSwan';
import { NationModel } from '../models/NationModel';
import { DependenciesGraph } from '../models/DependenciesGraph';
import { InfrastructureData } from '../models/InfrastructureData';
import { AnalyticsData } from '../models/AnalyticsData';
import { CrisisData } from '../models/CrisisData';
import { ProcurementData } from '../models/ProcurementData';
import { IntelligenceData } from '../models/IntelligenceData';
import CopilotSession from '../models/CopilotData';
import { CollaborationData } from '../models/CollaborationData';
import { CommandCenterSnapshot } from '../models/CommandCenterData';
import { ExecutiveBriefingSnapshot } from '../models/ExecutiveBriefingData';
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
    },
    getRiskRadarData: async () => {
      try {
        const threats = await RiskRadarThreat.find().sort({ probability: -1 });
        const signals = await EarlyWarningSignal.find().sort({ createdAt: -1 });
        return {
          threats: threats.map(t => ({ id: t._id.toString(), threatName: t.threatName, probability: t.probability, severity: t.severity, timeToImpact: t.timeToImpact })),
          signals: signals.map(s => ({ id: s._id.toString(), signalName: s.signalName, impact: s.impact, probabilityTrend: s.probabilityTrend })),
        };
      } catch (err) {
        console.error('GraphQL Error getRiskRadarData:', err);
        throw err;
      }
    },
    getForecastData: async () => {
      try {
        const forecast = await Forecast.findOne().sort({ createdAt: -1 });
        if (!forecast) return null;
        return {
          id: forecast._id.toString(),
          timelinePoints: forecast.timelinePoints,
          stabilityDeviation: forecast.stabilityDeviation,
          convergencePointDescription: forecast.convergencePointDescription,
          createdAt: forecast.createdAt.toISOString()
        };
      } catch (err) {
        console.error('GraphQL Error getForecastData:', err);
        throw err;
      }
    },
    getBlackSwanData: async () => {
      try {
        const bs = await BlackSwan.findOne().sort({ createdAt: -1 });
        if (!bs) return null;
        return {
          id: bs._id.toString(),
          anomalies: bs.anomalies,
          permutationsRun: bs.permutationsRun,
          createdAt: bs.createdAt.toISOString()
        };
      } catch (err) {
        console.error('GraphQL Error getBlackSwanData:', err);
        throw err;
      }
    },
    getNationModelData: async () => {
      try {
        // Find existing or fetch initial from gRPC if none exists
        let model = await NationModel.findOne().sort({ updatedAt: -1 });
        if (!model) {
          console.log('🔄 [GraphQL] Fetching initial Nation Model from gRPC');
          const grpcRes = await getNationModelData();
          model = await NationModel.create({
            economyVal: grpcRes.economy_val,
            economyTrend: grpcRes.economy_trend,
            societyVal: grpcRes.society_val,
            societySubtitle: grpcRes.society_subtitle,
            governanceVal: grpcRes.governance_val,
            governanceSubtitle: grpcRes.governance_subtitle,
            infrastructureVal: grpcRes.infrastructure_val,
            infrastructureTrend: grpcRes.infrastructure_trend,
            securityVal: grpcRes.security_val,
            securitySubtitle: grpcRes.security_subtitle,
            taxationVelocity: grpcRes.taxation_velocity,
            borderFriction: grpcRes.border_friction,
            cohesionIndex: grpcRes.cohesion_index,
            supplyIntegration: grpcRes.supply_integration,
            volatilityIndex: grpcRes.volatility_index,
            integrityPercentage: grpcRes.integrity_percentage
          });
        }
        return {
          id: model._id.toString(),
          economyVal: model.economyVal,
          economyTrend: model.economyTrend,
          societyVal: model.societyVal,
          societySubtitle: model.societySubtitle,
          governanceVal: model.governanceVal,
          governanceSubtitle: model.governanceSubtitle,
          infrastructureVal: model.infrastructureVal,
          infrastructureTrend: model.infrastructureTrend,
          securityVal: model.securityVal,
          securitySubtitle: model.securitySubtitle,
          taxationVelocity: model.taxationVelocity,
          borderFriction: model.borderFriction,
          cohesionIndex: model.cohesionIndex,
          supplyIntegration: model.supplyIntegration,
          volatilityIndex: model.volatilityIndex,
          integrityPercentage: model.integrityPercentage,
          updatedAt: model.updatedAt.toISOString()
        };
      } catch (err) {
        console.error('GraphQL Error getNationModelData:', err);
        throw err;
      }
    },
    getDependenciesData: async () => {
      try {
        const graph = await DependenciesGraph.findOne().sort({ createdAt: -1 });
        if (!graph) return null;
        return {
          id: graph._id.toString(),
          nodes: graph.nodes,
          edges: graph.edges,
          createdAt: graph.createdAt.toISOString()
        };
      } catch (err) {
        console.error('GraphQL Error getDependenciesData:', err);
        throw err;
      }
    },
    getInfrastructureData: async () => {
      try {
        const data = await InfrastructureData.findOne().sort({ createdAt: -1 });
        if (!data) return null;
        return {
          id: data._id.toString(),
          nodes: data.nodes,
          createdAt: data.createdAt.toISOString()
        };
      } catch (err) {
        console.error('GraphQL Error getInfrastructureData:', err);
        throw err;
      }
    },
    getAnalyticsData: async () => {
      try {
        let data = await AnalyticsData.findOne().sort({ createdAt: -1 });
        if (!data) {
          console.log('🔄 [GraphQL] Fetching initial Analytics from gRPC');
          const grpcRes = await getAnalyticsData();
          data = await AnalyticsData.create({
            keyMetrics: grpcRes.keyMetrics || [],
            vectorData: grpcRes.vectorData || [],
            scoring: grpcRes.scoring || [],
            reports: grpcRes.reports || []
          });
        }
        return {
          id: data._id.toString(),
          keyMetrics: data.keyMetrics,
          vectorData: data.vectorData,
          scoring: data.scoring,
          reports: data.reports,
          createdAt: data.createdAt.toISOString()
        };
      } catch (err) {
        console.error('GraphQL Error getAnalyticsData:', err);
        throw err;
      }
    },
    getCrisisData: async () => {
      try {
        const latest = await CrisisData.findOne().sort({ createdAt: -1 });
        if (latest) {
          return {
            id: latest._id.toString(),
            incidents: latest.incidents,
            mapNodes: latest.mapNodes,
            channels: latest.channels,
            logs: latest.logs,
            policyOptions: latest.policyOptions,
            comparatorRows: latest.comparatorRows,
            chatMsgs: latest.chatMsgs,
            jointResolutionDraft: latest.jointResolutionDraft,
            activeDefcon: latest.activeDefcon,
            createdAt: latest.createdAt.toISOString()
          };
        }

        const grpcRes = await getCrisisData();
        const incidents = grpcRes.incidents.map((i: any) => ({
          id: i.id, title: i.title, time: i.time, desc: i.desc, severity: i.severity, status: i.status, responders: i.responders
        }));
        const mapNodes = grpcRes.mapNodes.map((m: any) => ({
          id: m.id, x: m.x, y: m.y, type: m.type, status: m.status
        }));
        const channels = grpcRes.channels.map((c: any) => ({
          name: c.name, active: c.active, status: c.status
        }));
        const logs = grpcRes.logs.map((l: any) => ({
          time: l.time, msg: l.msg, type: l.type
        }));
        const policyOptions = grpcRes.policyOptions.map((p: any) => ({
          title: p.title, desc: p.desc, tag: p.tag
        }));
        const comparatorRows = grpcRes.comparatorRows.map((r: any) => ({
          metric: r.metric, optA: r.optA, optB: r.optB, optC: r.optC
        }));
        const chatMsgs = grpcRes.chatMsgs.map((c: any) => ({
          name: c.name, msg: c.msg, time: c.time, isAI: c.isAI
        }));

        const data = await CrisisData.create({
          incidents, mapNodes, channels, logs, policyOptions, comparatorRows, chatMsgs,
          jointResolutionDraft: grpcRes.jointResolutionDraft, activeDefcon: grpcRes.activeDefcon
        });

        return {
          id: data._id.toString(),
          incidents: data.incidents,
          mapNodes: data.mapNodes,
          channels: data.channels,
          logs: data.logs,
          policyOptions: data.policyOptions,
          comparatorRows: data.comparatorRows,
          chatMsgs: data.chatMsgs,
          jointResolutionDraft: data.jointResolutionDraft,
          activeDefcon: data.activeDefcon,
          createdAt: data.createdAt.toISOString()
        };
      } catch (err) {
        console.error('GraphQL Error getCrisisData:', err);
        throw err;
      }
    },
    getProcurementData: async () => {
      try {
        console.log("⚡ [GraphQL] getProcurementData called");
        const existingData = await ProcurementData.findOne().sort({ updatedAt: -1 });
        if (existingData) return {
          vendors: existingData.vendors,
          contracts: existingData.contracts,
          mapNodes: existingData.mapNodes,
          mapPaths: existingData.mapPaths,
          riskVectors: existingData.riskVectors,
          defcon: existingData.defcon,
          activeScanAgents: existingData.activeScanAgents
        };
        
        console.log("⚡ [GraphQL] No existing Procurement data found. Fetching from gRPC...");
        const grpcRes = await getProcurementData();
        const data = await ProcurementData.create({
          vendors: grpcRes.vendors || [],
          contracts: grpcRes.contracts || [],
          mapNodes: grpcRes.mapNodes || [],
          mapPaths: grpcRes.mapPaths || [],
          riskVectors: grpcRes.riskVectors || [],
          defcon: grpcRes.defcon || "3",
          activeScanAgents: grpcRes.activeScanAgents || 0
        });
        return {
          vendors: data.vendors,
          contracts: data.contracts,
          mapNodes: data.mapNodes,
          mapPaths: data.mapPaths,
          riskVectors: data.riskVectors,
          defcon: data.defcon,
          activeScanAgents: data.activeScanAgents
        };
      } catch (err) {
        console.error('GraphQL Error getProcurementData:', err);
        throw err;
      }
    },
    getIntelligenceData: async () => {
      try {
        console.log("⚡ [GraphQL] getIntelligenceData called");
        const existingData = await IntelligenceData.findOne().sort({ updatedAt: -1 });
        if (existingData) return {
          nodes: existingData.nodes,
          edges: existingData.edges,
          topologyStats: existingData.topologyStats,
          simulations: existingData.simulations
        };

        console.log("⚡ [GraphQL] No existing Intelligence data found. Fetching from gRPC...");
        const grpcRes = await getIntelligenceGraphData();
        const data = await IntelligenceData.create({
          nodes: grpcRes.nodes || [],
          edges: grpcRes.edges || [],
          topologyStats: grpcRes.topologyStats || {
            totalNodes: "0", activeEdges: "0", densityScore: "0", centralityDrift: "0"
          },
          simulations: grpcRes.simulations || []
        });
        return {
          nodes: data.nodes,
          edges: data.edges,
          topologyStats: data.topologyStats,
          simulations: data.simulations
        };
      } catch (err) {
        console.error('GraphQL Error getIntelligenceData:', err);
        throw err;
      }
    },
    getCopilotSession: async (_: any, { sessionId }: { sessionId: string }) => {
      let session = await CopilotSession.findOne({ sessionId });
      if (!session) {
        session = new CopilotSession({
          sessionId,
          messages: [{
            id: Date.now(),
            role: 'assistant',
            content: 'Initializing SovereignMind interface... Good morning. I have full read-access to the National Digital Twin, Constitutional Intelligence engine, and Global Actor Network. How can I assist you with strategic decisions today?'
          }]
        });
        await session.save();
      }
      return session;
    },
    getCollaborationData: async () => {
      try {
        console.log("📡 [GraphQL] getCollaborationData called");
        let localData = await CollaborationData.findOne().sort({ createdAt: -1 });

        if (!localData) {
          const grpcRes = await getCollaborationData();
          localData = await CollaborationData.create({
            rooms: grpcRes.rooms || [],
            users: grpcRes.users || [],
            artifacts: grpcRes.artifacts || [],
            messages: grpcRes.messages || []
          });
        }

        return {
          rooms: localData.rooms,
          users: localData.users,
          artifacts: localData.artifacts,
          messages: localData.messages
        };
      } catch (err) {
        console.error('GraphQL Error getCollaborationData:', err);
        throw err;
      }
    },

    getCommandCenterData: async () => {
      try {
        console.log("📡 [GraphQL] getCommandCenterData called");
        let localData = await CommandCenterSnapshot.findOne().sort({ createdAt: -1 });

        if (!localData) {
          const grpcRes = await grpcGetCommandCenterData();
          localData = await CommandCenterSnapshot.create(grpcRes);
        }

        return {
          stabilityScore: localData.stabilityScore,
          stabilityLabel: localData.stabilityLabel,
          trend30d: localData.trend30d,
          activeThreats: localData.activeThreats,
          criticalNations: localData.criticalNations,
          emergingRisks: localData.emergingRisks,
          aiBriefing: localData.aiBriefing,
          threats: localData.threats,
          futureRisks: localData.futureRisks,
          rankings: localData.rankings,
          recommendations: localData.recommendations,
          timelineEvents: localData.timelineEvents,
          metrics: localData.metrics,
          mapPoints: localData.mapPoints
        };
      } catch (err) {
        console.error('GraphQL Error getCommandCenterData:', err);
        throw err;
      }
    },

    getExecutiveBriefingData: async () => {
      try {
        console.log("📡 [GraphQL] getExecutiveBriefingData called");
        let localData = await ExecutiveBriefingSnapshot.findOne().sort({ createdAt: -1 });

        if (!localData) {
          const grpcRes = await grpcGetExecutiveBriefingData();
          localData = await ExecutiveBriefingSnapshot.create(grpcRes);
        }

        return {
          tasks: localData.tasks,
          meetings: localData.meetings,
          totalDirectives: localData.totalDirectives,
          resolvedLoops: localData.resolvedLoops,
          recalibrationRate: localData.recalibrationRate,
          interruptVectors: localData.interruptVectors
        };
      } catch (err) {
        console.error('GraphQL Error getExecutiveBriefingData:', err);
        throw err;
      }
    },

    getMetricDetail: async (_: any, { metricId }: { metricId: string }) => {
      try {
        console.log(`📡 [GraphQL] getMetricDetail called for: ${metricId}`);
        const grpcRes = await grpcGetMetricDetail(metricId);
        return grpcRes;
      } catch (err) {
        console.error('GraphQL Error getMetricDetail:', err);
        throw err;
      }
    },

    getOperatorDashboardData: async () => {
      try {
        console.log("📡 [GraphQL] getOperatorDashboardData called");
        const grpcRes = await grpcGetOperatorDashboardData();
        return grpcRes;
      } catch (err) {
        console.error('GraphQL Error getOperatorDashboardData:', err);
        throw err;
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
    },
    generateRiskRadarData: async () => {
      try {
        console.log(`🚀 [GraphQL] generateRiskRadarData called`);
        const grpcRes = await generateRiskRadarData();

        // Clear existing mock data
        await RiskRadarThreat.deleteMany({});
        await EarlyWarningSignal.deleteMany({});

        // Insert new generated data from gRPC (FastAPI)
        const newThreats = grpcRes.threats || [];
        const newSignals = grpcRes.signals || [];

        const threatDocs = await RiskRadarThreat.insertMany(
          newThreats.map((t: any) => ({
            threatName: t.threat_name,
            probability: t.probability,
            severity: t.severity,
            timeToImpact: t.time_to_impact,
          }))
        );

        const signalDocs = await EarlyWarningSignal.insertMany(
          newSignals.map((s: any) => ({
            signalName: s.signal_name,
            impact: s.impact,
            probabilityTrend: s.probability_trend,
          }))
        );

        const result = {
          threats: threatDocs.map(t => ({ id: t._id.toString(), threatName: t.threatName, probability: t.probability, severity: t.severity, timeToImpact: t.timeToImpact })),
          signals: signalDocs.map(s => ({ id: s._id.toString(), signalName: s.signalName, impact: s.impact, probabilityTrend: s.probabilityTrend })),
        };

        broadcast({ type: 'RISK_RADAR_DATA_UPDATED', data: result }, '/ws/risk-radar');
        return result;
      } catch (err) {
        console.error('GraphQL Error generateRiskRadarData:', err);
        throw err;
      }
    },
    generateForecastData: async () => {
      try {
        console.log('🔮 [GraphQL] generateForecastData called');
        const grpcRes = await generateForecastData('10_years');
        
        await Forecast.deleteMany({});
        const newForecast = await Forecast.create({
          timelinePoints: grpcRes.timeline_points.map((tp: any) => ({
            year: tp.year,
            title: tp.title,
            description: tp.description
          })),
          stabilityDeviation: grpcRes.stability_deviation,
          convergencePointDescription: grpcRes.convergence_point_description
        });

        const result = {
          id: newForecast._id.toString(),
          timelinePoints: newForecast.timelinePoints,
          stabilityDeviation: newForecast.stabilityDeviation,
          convergencePointDescription: newForecast.convergencePointDescription,
          createdAt: newForecast.createdAt.toISOString()
        };

        broadcast({ type: 'FORECAST_DATA_UPDATED', data: result }, '/ws/forecasting');
        return result;
      } catch (err) {
        console.error('GraphQL Error generateForecastData:', err);
        throw err;
      }
    },
    generateBlackSwanData: async () => {
      try {
        console.log('🔮 [GraphQL] generateBlackSwanData called');
        const grpcRes = await generateBlackSwanData();
        
        await BlackSwan.deleteMany({});
        const newBs = await BlackSwan.create({
          anomalies: grpcRes.anomalies.map((a: any) => ({
            title: a.title,
            probability: a.probability,
            severity: a.severity,
            description: a.description
          })),
          permutationsRun: grpcRes.permutations_run
        });

        const result = {
          id: newBs._id.toString(),
          anomalies: newBs.anomalies,
          permutationsRun: newBs.permutationsRun,
          createdAt: newBs.createdAt.toISOString()
        };

        broadcast({ type: 'BLACK_SWAN_DATA_UPDATED', data: result }, '/ws/black-swan');
        return result;
      } catch (err) {
        console.error('GraphQL Error generateBlackSwanData:', err);
        throw err;
      }
    },
    executeShockScenario: async (_: any, { shockName }: { shockName: string }) => {
      try {
        console.log(`⚡ [GraphQL] executeShockScenario called: ${shockName}`);
        const grpcRes = await executeShockScenario(shockName);
        
        const updatedModel = await NationModel.create({
          economyVal: grpcRes.economy_val,
          economyTrend: grpcRes.economy_trend,
          societyVal: grpcRes.society_val,
          societySubtitle: grpcRes.society_subtitle,
          governanceVal: grpcRes.governance_val,
          governanceSubtitle: grpcRes.governance_subtitle,
          infrastructureVal: grpcRes.infrastructure_val,
          infrastructureTrend: grpcRes.infrastructure_trend,
          securityVal: grpcRes.security_val,
          securitySubtitle: grpcRes.security_subtitle,
          taxationVelocity: grpcRes.taxation_velocity,
          borderFriction: grpcRes.border_friction,
          cohesionIndex: grpcRes.cohesion_index,
          supplyIntegration: grpcRes.supply_integration,
          volatilityIndex: grpcRes.volatility_index,
          integrityPercentage: grpcRes.integrity_percentage
        });

        const result = {
          id: updatedModel._id.toString(),
          economyVal: updatedModel.economyVal,
          economyTrend: updatedModel.economyTrend,
          societyVal: updatedModel.societyVal,
          societySubtitle: updatedModel.societySubtitle,
          governanceVal: updatedModel.governanceVal,
          governanceSubtitle: updatedModel.governanceSubtitle,
          infrastructureVal: updatedModel.infrastructureVal,
          infrastructureTrend: updatedModel.infrastructureTrend,
          securityVal: updatedModel.securityVal,
          securitySubtitle: updatedModel.securitySubtitle,
          taxationVelocity: updatedModel.taxationVelocity,
          borderFriction: updatedModel.borderFriction,
          cohesionIndex: updatedModel.cohesionIndex,
          supplyIntegration: updatedModel.supplyIntegration,
          volatilityIndex: updatedModel.volatilityIndex,
          integrityPercentage: updatedModel.integrityPercentage,
          updatedAt: updatedModel.updatedAt.toISOString()
        };

        broadcast({ type: 'NATION_MODEL_UPDATED', data: result }, '/ws/nation-model');
        return result;
      } catch (err) {
        console.error('GraphQL Error executeShockScenario:', err);
        throw err;
      }
    },
    generateDependenciesData: async () => {
      try {
        console.log('⚡ [GraphQL] generateDependenciesData called');
        const grpcRes = await generateDependenciesData();
        
        const nodes = grpcRes.nodes.map((n: any) => ({
          id: n.id,
          title: n.title,
          status: n.status,
          icon: n.icon
        }));

        const edges = grpcRes.edges.map((e: any) => ({
          fromId: e.from_id,
          toId: e.to_id,
          status: e.status
        }));

        const graph = await DependenciesGraph.create({ nodes, edges });

        const result = {
          id: graph._id.toString(),
          nodes: graph.nodes,
          edges: graph.edges,
          createdAt: graph.createdAt.toISOString()
        };

        broadcast({ type: 'DEPENDENCIES_DATA_UPDATED', data: result }, '/ws/dependencies');
        return result;
      } catch (err) {
        console.error('GraphQL Error generateDependenciesData:', err);
        throw err;
      }
    },
    simulateInfrastructureUpdate: async () => {
      try {
        console.log('⚡ [GraphQL] simulateInfrastructureUpdate called');
        const grpcRes = await simulateInfrastructureUpdate();
        
        const nodes = grpcRes.nodes.map((n: any) => ({
          id: n.id,
          title: n.title,
          icon: n.icon,
          status: n.status,
          statusColor: n.statusColor,
          load: n.load,
          metrics: n.metrics.map((m: any) => ({ label: m.label, val: m.val }))
        }));

        const data = await InfrastructureData.create({ nodes });

        const result = {
          id: data._id.toString(),
          nodes: data.nodes,
          createdAt: data.createdAt.toISOString()
        };

        broadcast({ type: 'INFRASTRUCTURE_DATA_UPDATED', data: result }, '/ws/infrastructure');
        return result;
      } catch (err) {
        console.error('GraphQL Error simulateInfrastructureUpdate:', err);
        throw err;
      }
    },
    simulateAnalyticsUpdate: async () => {
      try {
        console.log('⚡ [GraphQL] simulateAnalyticsUpdate called');
        const grpcRes = await simulateAnalyticsUpdate();
        
        const keyMetrics = grpcRes.keyMetrics.map((m: any) => ({
          title: m.title, value: m.value, trend: m.trend, trendDir: m.trendDir, statusColor: m.statusColor
        }));
        const vectorData = grpcRes.vectorData.map((v: any) => ({
          value: v.value, isAnomaly: v.isAnomaly
        }));
        const scoring = grpcRes.scoring.map((s: any) => ({
          label: s.label, score: s.score, baseline: s.baseline, color: s.color
        }));
        const reports = grpcRes.reports.map((r: any) => ({
          id: r.id, title: r.title, desc: r.desc, date: r.date, confidence: r.confidence, category: r.category, isCritical: r.isCritical
        }));

        const data = await AnalyticsData.create({ keyMetrics, vectorData, scoring, reports });

        const result = {
          id: data._id.toString(),
          keyMetrics: data.keyMetrics,
          vectorData: data.vectorData,
          scoring: data.scoring,
          reports: data.reports,
          createdAt: data.createdAt.toISOString()
        };

        broadcast({ type: 'ANALYTICS_DATA_UPDATED', data: result }, '/ws/analytics');
        return result;
      } catch (err) {
        console.error('GraphQL Error simulateAnalyticsUpdate:', err);
        throw err;
      }
    },
    generateSynthesisReport: async (_: any, { domain, horizon }: { domain: string; horizon: string }) => {
      try {
        console.log('⚡ [GraphQL] generateSynthesisReport called');
        const reportGrpc = await generateSynthesisReport(domain, horizon);
        
        // Fetch current analytics data
        const currentData = await AnalyticsData.findOne().sort({ createdAt: -1 });
        let keyMetrics = currentData?.keyMetrics || [];
        let vectorData = currentData?.vectorData || [];
        let scoring = currentData?.scoring || [];
        let reports = currentData?.reports.map(r => ({ ...r })) || [];

        const newReport = {
          id: reportGrpc.id, title: reportGrpc.title, desc: reportGrpc.desc, date: reportGrpc.date, confidence: reportGrpc.confidence, category: reportGrpc.category, isCritical: reportGrpc.isCritical
        };
        
        reports.unshift(newReport);
        reports = reports.slice(0, 4); // Keep top 4

        const data = await AnalyticsData.create({ keyMetrics, vectorData, scoring, reports });

        const result = {
          id: data._id.toString(),
          keyMetrics: data.keyMetrics,
          vectorData: data.vectorData,
          scoring: data.scoring,
          reports: data.reports,
          createdAt: data.createdAt.toISOString()
        };

        broadcast({ type: 'ANALYTICS_DATA_UPDATED', data: result }, '/ws/analytics');
        return result;
      } catch (err) {
        console.error('GraphQL Error generateSynthesisReport:', err);
        throw err;
      }
    },
    simulateCrisisUpdate: async () => {
      try {
        const grpcRes = await simulateCrisisUpdate();
        const incidents = grpcRes.incidents.map((i: any) => ({
          id: i.id, title: i.title, time: i.time, desc: i.desc, severity: i.severity, status: i.status, responders: i.responders
        }));
        const mapNodes = grpcRes.mapNodes.map((m: any) => ({
          id: m.id, x: m.x, y: m.y, type: m.type, status: m.status
        }));
        const channels = grpcRes.channels.map((c: any) => ({
          name: c.name, active: c.active, status: c.status
        }));
        const logs = grpcRes.logs.map((l: any) => ({
          time: l.time, msg: l.msg, type: l.type
        }));
        const policyOptions = grpcRes.policyOptions.map((p: any) => ({
          title: p.title, desc: p.desc, tag: p.tag
        }));
        const comparatorRows = grpcRes.comparatorRows.map((r: any) => ({
          metric: r.metric, optA: r.optA, optB: r.optB, optC: r.optC
        }));
        const chatMsgs = grpcRes.chatMsgs.map((c: any) => ({
          name: c.name, msg: c.msg, time: c.time, isAI: c.isAI
        }));

        const data = await CrisisData.create({
          incidents, mapNodes, channels, logs, policyOptions, comparatorRows, chatMsgs,
          jointResolutionDraft: grpcRes.jointResolutionDraft, activeDefcon: grpcRes.activeDefcon
        });

        const result = {
          id: data._id.toString(),
          incidents: data.incidents,
          mapNodes: data.mapNodes,
          channels: data.channels,
          logs: data.logs,
          policyOptions: data.policyOptions,
          comparatorRows: data.comparatorRows,
          chatMsgs: data.chatMsgs,
          jointResolutionDraft: data.jointResolutionDraft,
          activeDefcon: data.activeDefcon,
          createdAt: data.createdAt.toISOString()
        };

        broadcast({ type: 'CRISIS_DATA_UPDATED', data: result }, '/ws/crisis');
        return result;
      } catch (err) {
        console.error('GraphQL Error simulateCrisisUpdate:', err);
        throw err;
      }
    },
    generatePolicyOptions: async (_: any, { prompt }: { prompt: string }) => {
      try {
        console.log(`⚡ [GraphQL] generatePolicyOptions called prompt=${prompt}`);
        const policyGrpc = await generatePolicyOptions(prompt);
        
        // Fetch current crisis data to merge with new policy options
        const currentData = await CrisisData.findOne().sort({ createdAt: -1 });
        let incidents = currentData?.incidents || [];
        let mapNodes = currentData?.mapNodes || [];
        let channels = currentData?.channels || [];
        let logs = currentData?.logs || [];
        let chatMsgs = currentData?.chatMsgs || [];
        let jointResolutionDraft = currentData?.jointResolutionDraft || "";
        let activeDefcon = currentData?.activeDefcon || "3";

        const options = policyGrpc.options.map((p: any) => ({ title: p.title, desc: p.desc, tag: p.tag }));
        const rows = policyGrpc.rows.map((r: any) => ({ metric: r.metric, optA: r.optA, optB: r.optB, optC: r.optC }));

        const data = await CrisisData.create({
          incidents, mapNodes, channels, logs, policyOptions: options, comparatorRows: rows, chatMsgs,
          jointResolutionDraft, activeDefcon
        });

        const result = {
          id: data._id.toString(),
          incidents: data.incidents,
          mapNodes: data.mapNodes,
          channels: data.channels,
          logs: data.logs,
          policyOptions: data.policyOptions,
          comparatorRows: data.comparatorRows,
          chatMsgs: data.chatMsgs,
          jointResolutionDraft: data.jointResolutionDraft,
          activeDefcon: data.activeDefcon,
          createdAt: data.createdAt.toISOString()
        };

        broadcast({ type: 'CRISIS_DATA_UPDATED', data: result }, '/ws/crisis');
        return { options, rows };
      } catch (err) {
        console.error('GraphQL Error generatePolicyOptions:', err);
        throw err;
      }
    },
    simulateProcurementUpdate: async () => {
      try {
        console.log("⚡ [GraphQL] simulateProcurementUpdate called");
        const grpcRes = await simulateProcurementUpdate();
        const data = await ProcurementData.create({
          vendors: grpcRes.vendors || [],
          contracts: grpcRes.contracts || [],
          mapNodes: grpcRes.mapNodes || [],
          mapPaths: grpcRes.mapPaths || [],
          riskVectors: grpcRes.riskVectors || [],
          defcon: grpcRes.defcon || "3",
          activeScanAgents: grpcRes.activeScanAgents || 0
        });

        const result = {
          vendors: data.vendors,
          contracts: data.contracts,
          mapNodes: data.mapNodes,
          mapPaths: data.mapPaths,
          riskVectors: data.riskVectors,
          defcon: data.defcon,
          activeScanAgents: data.activeScanAgents,
          updatedAt: data.updatedAt
        };

        broadcast({ type: 'PROCUREMENT_DATA_UPDATED', data: result }, '/ws/procurement');
        return result;
      } catch (err) {
        console.error('GraphQL Error simulateProcurementUpdate:', err);
        throw err;
      }
    },
    simulateIntelligenceUpdate: async () => {
      try {
        console.log("⚡ [GraphQL] simulateIntelligenceUpdate triggered");
        const grpcRes = await simulateIntelligenceUpdate();
        await IntelligenceData.deleteMany({});
        const data = await IntelligenceData.create({
          nodes: grpcRes.nodes || [],
          edges: grpcRes.edges || [],
          topologyStats: grpcRes.topologyStats || {
            totalNodes: "0", activeEdges: "0", densityScore: "0", centralityDrift: "0"
          },
          simulations: grpcRes.simulations || []
        });
        const result = {
          nodes: data.nodes,
          edges: data.edges,
          topologyStats: data.topologyStats,
          simulations: data.simulations
        };
        
        broadcast({
          type: 'INTELLIGENCE_DATA_UPDATED',
          data: result
        }, '/ws/intelligence');

        return result;
      } catch (err) {
        console.error('GraphQL Error simulateIntelligenceUpdate:', err);
        throw err;
      }
    },
    sendCopilotMessage: async (_: any, { sessionId, prompt }: { sessionId: string, prompt: string }) => {
      let session = await CopilotSession.findOne({ sessionId });
      if (!session) {
        session = new CopilotSession({ sessionId, messages: [] });
      }

      const userMsg = { id: Date.now(), role: 'user', content: prompt, timestamp: new Date() };
      session.messages.push(userMsg as any);
      await session.save();

      const response = await sendCopilotMessage(prompt);
      
      const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: response.content, timestamp: new Date() };
      session.messages.push(assistantMsg as any);
      await session.save();

      return assistantMsg;
    },
    clearCopilotSession: async (_: any, { sessionId }: { sessionId: string }) => {
      await CopilotSession.deleteOne({ sessionId });
      return true;
    },
    createCollaborationRoom: async (_: any, { name, type, category }: { name: string; type: string; category: string }) => {
      try {
        const grpcRes = await createCollaborationRoom(name, type, category);
        
        let localData = await CollaborationData.findOne().sort({ createdAt: -1 });
        if (localData) {
          localData.rooms.unshift(grpcRes);
          await localData.save();

          broadcast({
            type: 'COLLABORATION_ROOM_CREATED',
            data: grpcRes
          }, '/ws/collaboration');
        }

        return grpcRes;
      } catch (err) {
        console.error('GraphQL Error createCollaborationRoom:', err);
        throw err;
      }
    },
    sendCollaborationMessage: async (_: any, { roomId, sender, text }: { roomId: string; sender: string; text: string }) => {
      try {
        const grpcRes = await sendCollaborationMessage(roomId, sender, text);
        
        let localData = await CollaborationData.findOne().sort({ createdAt: -1 });
        if (localData) {
          localData.messages.push(grpcRes);
          await localData.save();

          broadcast({
            type: 'COLLABORATION_MESSAGE_SENT',
            data: grpcRes
          }, '/ws/collaboration');
        }

        return grpcRes;
      } catch (err) {
        console.error('GraphQL Error sendCollaborationMessage:', err);
        throw err;
      }
    },

    simulateEmergencyPowers: async (_: any, { scenario }: { scenario: string }) => {
      try {
        console.log("⚡ [GraphQL] simulateEmergencyPowers triggered");
        const grpcRes = await grpcSimulateEmergencyPowers(scenario);
        return grpcRes;
      } catch (err) {
        console.error('GraphQL Error simulateEmergencyPowers:', err);
        throw err;
      }
    },

    analyzeTreatyConstraints: async (_: any, { proposal }: { proposal: string }) => {
      try {
        console.log("⚡ [GraphQL] analyzeTreatyConstraints triggered");
        const grpcRes = await grpcAnalyzeTreatyConstraints(proposal);
        return grpcRes;
      } catch (err) {
        console.error('GraphQL Error analyzeTreatyConstraints:', err);
        throw err;
      }
    },

    refreshCommandCenterData: async () => {
      try {
        console.log("⚡ [GraphQL] refreshCommandCenterData triggered");
        const grpcRes = await grpcRefreshCommandCenterData();
        const localData = await CommandCenterSnapshot.create(grpcRes);

        broadcast({
          type: 'COMMAND_CENTER_DATA_UPDATED',
          data: localData
        }, '/ws/command-center');

        return localData;
      } catch (err) {
        console.error('GraphQL Error refreshCommandCenterData:', err);
        throw err;
      }
    },

    refreshExecutiveBriefingData: async () => {
      try {
        console.log("⚡ [GraphQL] refreshExecutiveBriefingData triggered");
        const grpcRes = await grpcRefreshExecutiveBriefingData();
        const localData = await ExecutiveBriefingSnapshot.create(grpcRes);

        broadcast({
          type: 'EXECUTIVE_BRIEFING_DATA_UPDATED',
          data: localData
        }, '/ws/executive-briefing');

        return localData;
      } catch (err) {
        console.error('GraphQL Error refreshExecutiveBriefingData:', err);
        throw err;
      }
    },

    triggerModelTraining: async () => {
      try {
        console.log("⚡ [GraphQL] triggerModelTraining triggered");
        const grpcRes = await grpcTriggerModelTraining();
        return grpcRes;
      } catch (err) {
        console.error('GraphQL Error triggerModelTraining:', err);
        throw err;
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
