import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Cpu, Clock, AlertTriangle, Users, TrendingDown, ShieldAlert, 
  Sparkles, RefreshCw, ShieldCheck, Activity, BarChart2, 
  Flame, DollarSign, MessageSquare, Landmark, Zap, Shield, Navigation, 
  ShoppingBag, Wifi, WifiOff
} from 'lucide-react';

import { ScenarioBuilder } from './ScenarioBuilder';

const STATE_COLORS = {
  purple: '#7F22FE',
  orange: '#FF6900',
  sky: '#00B8DB',
  deepTeal: '#073F4D',
  green: '#818cf8',
  yellow: '#FBBF24',
  red: '#EF4444',
  slateBg: '#020617',
};

const AVAILABLE_CRISES = [
  { id: 'Cyberattack', label: 'Quantum Cyberattack', desc: 'Disruption of routing channels & power systems', icon: Zap, color: '#00B8DB' },
  { id: 'Major earthquake', label: 'Major Earthquake', desc: 'Substantial structural & transport corridor failures', icon: Flame, color: '#FF6900' },
  { id: 'Banking collapse', label: 'Banking & Ledger Collapse', desc: 'Sovereign deposit limits & digital runs', icon: Landmark, color: '#FBBF24' },
  { id: 'Border conflict', label: 'Border Tactical Conflict', desc: 'Kinetic aerospace intrusions & containment lines', icon: ShieldAlert, color: '#EF4444' },
  { id: 'Pandemic resurgence', label: 'Pandemic Resurgence', desc: 'Biosafety locks & movement restrictions', icon: Activity, color: '#7F22FE' }
];

const GQL_LAUNCH = `
  mutation LaunchCrisisSimulation($crises: [String!]!, $scenarioName: String) {
    launchCrisisSimulation(crises: $crises, scenarioName: $scenarioName) {
      simulationId
      scenarioName
      status
      crises
      resilienceScore
      estimatedRecoveryMonths
    }
  }
`;

const GQL_GET_SIM = `
  query GetCrisisSimulation($id: ID!) {
    getCrisisSimulation(id: $id) {
      id scenarioName crises resilienceScore estimatedRecoveryMonths
      simulatedPopulation {
        totalAgents
        ageGroups { group percentage reaction }
        incomeClasses { class percentage vulnerability }
        migrationTendencies { rate hotspots description }
        consumptionPatterns { hoardingRisk essentialGoodDemand description }
        politicalPreferences { faction percentage sentiment }
      }
      economicShock { oilCrisisPremium foodShortagesIndex disruptionSummary }
      panicSentiment { realtimeNarratives protestPropensity misinformationStrength }
      cascadeLinks
      recoveryPaths {
        bestCase { trajectory probability description estimatedMonths }
        expected { trajectory probability description estimatedMonths }
        worstCase { trajectory probability description estimatedMonths }
        overallRecommendation
      }
      createdAt
    }
  }
`;

const GQL_RECOVERY = `
  mutation GenerateRecoveryPaths($simulationId: ID!, $crises: [String!]!) {
    generateRecoveryPaths(simulationId: $simulationId, crises: $crises) {
      bestCase { trajectory probability description estimatedMonths }
      expected { trajectory probability description estimatedMonths }
      worstCase { trajectory probability description estimatedMonths }
      overallRecommendation
    }
  }
`;

async function graphqlRequest(query: string, variables: any = {}) {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');
  return json.data;
}

interface SyntheticCivilizationSandboxProps {
  key?: string;
  initialTab?: 'scenario-builder' | 'simulations' | 'recovery-explorer' | string;
}

export function SyntheticCivilizationSandbox({ initialTab = 'scenario-builder' }: SyntheticCivilizationSandboxProps) {
  const [activeTab, setActiveTab] = useState(initialTab === 'launch-simulation' ? 'scenario-builder' : initialTab);
  const [selectedCrises, setSelectedCrises] = useState<string[]>(['Cyberattack', 'Banking collapse']);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [currentSimId, setCurrentSimId] = useState<string | null>(null);
  const [simTicks, setSimTicks] = useState<any[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsStatus, setWsStatus] = useState<string>('Disconnected');
  const [recoveryData, setRecoveryData] = useState<any>(null);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setActiveTab(initialTab === 'launch-simulation' ? 'scenario-builder' : initialTab);
  }, [initialTab]);

  // Connect WebSocket for real-time updates
  useEffect(() => {
    const connectWS = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.hostname}:4000/ws/sandbox`;
      
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setWsConnected(true);
          setWsStatus('Live');
          console.log('✅ [SandboxWS] Connected');
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            handleWsMessage(msg);
          } catch (e) {
            console.error('[SandboxWS] Parse error:', e);
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          setWsStatus('Reconnecting...');
          console.log('[SandboxWS] Disconnected — reconnecting in 3s...');
          setTimeout(connectWS, 3000);
        };

        ws.onerror = (err) => {
          console.error('[SandboxWS] Error:', err);
          ws.close();
        };
      } catch (e) {
        console.error('[SandboxWS] Failed to connect:', e);
        setTimeout(connectWS, 5000);
      }
    };

    connectWS();
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const handleWsMessage = useCallback((msg: any) => {
    console.log('[SandboxWS] Message:', msg.type);
    switch (msg.type) {
      case 'SIMULATION_LAUNCHED':
        setWsStatus(`Sim ${msg.simulationId?.slice(-6)} launched`);
        break;
      case 'SIM_TICKS_STARTED':
        setSimTicks([]);
        setWsStatus(`Simulation ticking (${msg.totalEpochs} epochs)...`);
        break;
      case 'SIM_TICK':
        setSimTicks(prev => [...prev, msg.tick]);
        break;
      case 'SIM_TICKS_COMPLETE':
        setWsStatus(`Simulation complete — ${msg.totalTicks} epochs`);
        break;
      case 'RECOVERY_PATHS_READY':
        setRecoveryData(msg.recoveryPaths);
        setWsStatus('Recovery paths computed');
        break;
      case 'SCENARIO_SAVED':
        setWsStatus(`Scenario saved: ${msg.scenarioName}`);
        break;
    }
  }, []);

  const toggleCrisis = (id: string) => {
    if (selectedCrises.includes(id)) {
      if (selectedCrises.length > 1) {
        setSelectedCrises(selectedCrises.filter(c => c !== id));
      }
    } else {
      setSelectedCrises([...selectedCrises, id]);
    }
  };

  const runCivilizationSimulation = async (targetCrises: string[]) => {
    setIsSimulating(true);
    setSimTicks([]);
    setSimulationData(null);
    try {
      const data = await graphqlRequest(GQL_LAUNCH, {
        crises: targetCrises,
        scenarioName: `Sandbox: ${targetCrises.join(' + ')}`,
      });
      const launchResult = data.launchCrisisSimulation;
      setCurrentSimId(launchResult.simulationId);

      // Fetch full simulation data from MongoDB
      setTimeout(async () => {
        try {
          const simData = await graphqlRequest(GQL_GET_SIM, { id: launchResult.simulationId });
          if (simData.getCrisisSimulation) {
            setSimulationData(simData.getCrisisSimulation);
          }
        } catch (e) {
          console.error('Error fetching sim data:', e);
        }
      }, 1000);

    } catch (e: any) {
      console.error('Simulation run error:', e);
      setWsStatus(`Error: ${e.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const generateRecovery = async () => {
    if (!currentSimId || !simulationData) return;
    setRecoveryLoading(true);
    try {
      const data = await graphqlRequest(GQL_RECOVERY, {
        simulationId: currentSimId,
        crises: simulationData.crises || selectedCrises,
      });
      setRecoveryData(data.generateRecoveryPaths);
    } catch (e: any) {
      console.error('Recovery path error:', e);
    } finally {
      setRecoveryLoading(false);
    }
  };

  // Auto-generate recovery paths when switching to that tab if we have a simulation
  useEffect(() => {
    if (activeTab === 'recovery-explorer' && currentSimId && !recoveryData) {
      generateRecovery();
    }
  }, [activeTab]);

  const latestTick = simTicks.length > 0 ? simTicks[simTicks.length - 1] : null;

  return (
    <div id="synthetic-civilization-sandbox" className="max-w-[1240px] mx-auto space-y-8 pb-16 font-sans text-white">
      
      {/* Module Title Section */}
      <div className="relative overflow-hidden rounded-3xl border p-6 md:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-[#030616] shadow-[0_4px_30px_rgba(0,0,0,0.4)]" style={{ borderColor: `${STATE_COLORS.deepTeal}30` }}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-violet-500/10 via-pink-500/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#00B8DB]/15 border border-[#00B8DB]/30 text-xs font-mono font-semibold tracking-wider text-[#00B8DB] uppercase">
                Laboratory
              </span>
              <span className="flex items-center gap-1.5 text-xs text-purple-400 font-mono">
                <Globe size={12} /> Biosphere & Economic Sandbox
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Synthetic Civilization Sandbox <Cpu className="text-[#7F22FE]" size={26} />
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
              Activate combinatoric scenario triggers. Model real-time demographic shifts, compute deep economic index shock variables, assess panic sentiment spread, and plot recovery paths — all powered by real AI analysis.
            </p>
          </div>
          {/* WS Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono ${wsConnected ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-gray-500/10 border-gray-500/30 text-gray-400'}`}>
            {wsConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {wsStatus}
          </div>
        </div>
      </div>

      {/* Sandbox Crisis Selector (for Simulations & Recovery tabs) */}
      {activeTab !== 'scenario-builder' && (
        <div className="bg-[#030712] border rounded-3xl p-5" style={{ borderColor: `${STATE_COLORS.deepTeal}20` }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[#00B8DB] uppercase block mb-1">Active Crisis Stack</span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_CRISES.map(crisis => {
                  const Icon = crisis.icon;
                  const isSelected = selectedCrises.includes(crisis.id);
                  return (
                    <button
                      key={crisis.id}
                      onClick={() => toggleCrisis(crisis.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? `text-white border-opacity-60`
                          : 'text-gray-500 border-transparent bg-slate-900 hover:bg-slate-800'
                      }`}
                      style={isSelected ? { backgroundColor: `${crisis.color}20`, borderColor: crisis.color, color: crisis.color } : {}}
                    >
                      <Icon size={12} />
                      {crisis.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => runCivilizationSimulation(selectedCrises)}
              disabled={isSimulating}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#7F22FE] hover:bg-[#6c1ce0] text-white font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
            >
              {isSimulating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {isSimulating ? 'Running...' : 'Run Simulation'}
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        <TabButton id="scenario-builder" active={activeTab === 'scenario-builder'} icon={Cpu} label="Scenario Builder" onClick={() => setActiveTab('scenario-builder')} />
        <TabButton id="simulations" active={activeTab === 'simulations'} icon={Activity} label="Simulations" onClick={() => setActiveTab('simulations')} />
        <TabButton id="recovery-explorer" active={activeTab === 'recovery-explorer'} icon={Clock} label="Recovery Explorer" onClick={() => setActiveTab('recovery-explorer')} />
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="space-y-8 min-h-[400px]"
        >
          
          {/* VIEW 1: SCENARIO BUILDER */}
          {activeTab === 'scenario-builder' && (
            <ScenarioBuilder onSimulationLaunched={(simResult) => {
              setCurrentSimId(simResult.simulationId);
              // After 1s fetch full data
              setTimeout(async () => {
                try {
                  const data = await graphqlRequest(GQL_GET_SIM, { id: simResult.simulationId });
                  if (data.getCrisisSimulation) {
                    setSimulationData(data.getCrisisSimulation);
                  }
                } catch (e) {}
              }, 1200);
            }} />
          )}

          {/* VIEW 2: SIMULATIONS */}
          {activeTab === 'simulations' && (
            <div className="space-y-8">
              
              {!simulationData && !isSimulating ? (
                <div className="bg-[#030712] border rounded-3xl p-12 text-center" style={{ borderColor: `${STATE_COLORS.deepTeal}20` }}>
                  <Users className="text-[#7F22FE] mb-4 mx-auto" size={36} />
                  <h3 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">No Active Simulation State Found</h3>
                  <p className="text-xs text-gray-400 mt-1">Select crises above and click Run Simulation to load real AI data.</p>
                  <button onClick={() => runCivilizationSimulation(selectedCrises)} className="mt-4 px-4 py-2 rounded-xl bg-[#7F22FE] text-xs font-bold font-mono">
                    Launch Simulation
                  </button>
                </div>
              ) : isSimulating ? (
                <div className="bg-[#030712] border rounded-3xl p-12 text-center" style={{ borderColor: `${STATE_COLORS.deepTeal}20` }}>
                  <RefreshCw className="text-[#7F22FE] mb-4 mx-auto animate-spin" size={36} />
                  <h3 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">AI Simulation Engine Active</h3>
                  <p className="text-xs text-gray-400 mt-2">gRPC → FastAPI → Gemini processing your crisis scenario...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Live Tick Monitor */}
                  {simTicks.length > 0 && (
                    <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${STATE_COLORS.deepTeal}30` }}>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">Live PyTorch Engine</span>
                          <h3 className="text-sm font-semibold text-white uppercase font-mono mt-1.5 flex items-center gap-2">
                            <Activity size={15} className="text-emerald-400" /> Real-time Simulation Ticks — {simTicks.length} Epochs
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Streaming
                        </div>
                      </div>
                      
                      {latestTick && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 border-t border-white/5 pt-4">
                          {[
                            { label: 'Panic Level', value: latestTick.panicLevel, color: '#EF4444' },
                            { label: 'Econ Disruption', value: latestTick.economicDisruption, color: '#FF6900' },
                            { label: 'Infra Instability', value: latestTick.infraInstability, color: '#FBBF24' },
                            { label: 'Supply Failure', value: latestTick.supplyChainFailure, color: '#7F22FE' },
                            { label: 'Civil Unrest', value: latestTick.civilUnrest, color: '#F97316' },
                            { label: 'Collapse Prob.', value: latestTick.collapseProbability, color: '#EF4444' },
                          ].map(({ label, value, color }) => (
                            <div key={label} className="bg-slate-950 p-3 rounded-xl border border-white/5">
                              <span className="text-[9px] uppercase font-mono text-gray-500 block">{label}</span>
                              <span className="text-lg font-black font-mono" style={{ color }}>{(value * 100).toFixed(1)}%</span>
                              <div className="w-full bg-slate-900 h-1 rounded-full mt-1 overflow-hidden">
                                <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} animate={{ width: `${value * 100}%` }} transition={{ duration: 0.3 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {latestTick && (
                        <div className="mt-4 bg-[#010206] border border-white/5 rounded-xl p-3 flex gap-2 items-start">
                          <span className="text-emerald-400 text-xs font-mono font-bold shrink-0">E{latestTick.epoch}</span>
                          <p className="text-[11px] text-gray-300 font-sans italic">"{latestTick.statusMessage}"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {simulationData && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                      
                      {/* Left Column: Demographics Engine */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${STATE_COLORS.deepTeal}30` }}>
                          <div className="mb-4">
                            <span className="text-[9px] font-mono tracking-widest text-[#00B8DB] bg-[#00B8DB]/10 px-2 py-0.5 rounded border border-[#00B8DB]/20 uppercase">Demographics Engine</span>
                            <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono mt-1.5 flex items-center gap-2">
                              <Users size={15} className="text-[#00B8DB]" /> Virtual Population Characteristics
                            </h3>
                            <p className="text-xs text-gray-400 leading-relaxed font-sans mt-0.5">
                              Calculated behaviors modeled across {(simulationData.simulatedPopulation?.totalAgents || 10000000).toLocaleString()} simulation agents.
                            </p>
                          </div>

                          <div className="space-y-4 pt-2 border-t border-white/5">
                            <h4 className="text-[10px] font-mono tracking-wider uppercase text-gray-400">1. Age Cohort Demographics & Reactions</h4>
                            <div className="space-y-3">
                              {(simulationData.simulatedPopulation?.ageGroups || []).map((age: any, idx: number) => (
                                <div key={idx} className="bg-slate-950/60 p-3.5 rounded-2xl border border-[#073F4D]/15">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-white">{age.group}</span>
                                    <span className="text-xs text-[#00B8DB] font-mono font-bold">{age.percentage}%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mb-2">
                                    <div className="bg-[#00B8DB]/70 h-full rounded-full" style={{ width: `${age.percentage}%` }} />
                                  </div>
                                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans italic">"{age.reaction}"</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
                            <h4 className="text-[10px] font-mono tracking-wider uppercase text-gray-400">2. Income Class Vulnerability</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {(simulationData.simulatedPopulation?.incomeClasses || []).map((income: any, idx: number) => (
                                <div key={idx} className="bg-slate-950/40 p-3 rounded-xl border border-white/5 text-left">
                                  <span className="text-[10px] text-gray-400 font-mono block">{income.class} ({income.percentage}%)</span>
                                  <p className="text-[10px] text-gray-300 leading-relaxed font-sans mt-1.5">{income.vulnerability}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 pt-6 mt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
                              <span className="text-[9px] font-mono uppercase text-pink-400 flex items-center gap-1">
                                <Navigation size={10} /> Migration Tendencies
                              </span>
                              <div className="text-[10px] text-white font-semibold">{simulationData.simulatedPopulation?.migrationTendencies?.rate}</div>
                              <div className="flex flex-wrap gap-1">
                                {(simulationData.simulatedPopulation?.migrationTendencies?.hotspots || []).map((spot: string, idx: number) => (
                                  <span key={idx} className="text-[8px] bg-slate-900 px-1.5 py-0.5 rounded text-gray-400 border border-white/5">{spot}</span>
                                ))}
                              </div>
                              <p className="text-[10px] text-gray-400">{simulationData.simulatedPopulation?.migrationTendencies?.description}</p>
                            </div>
                            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
                              <span className="text-[9px] font-mono uppercase text-[#FF6900] flex items-center gap-1">
                                <ShoppingBag size={10} /> Consumption Patterns
                              </span>
                              <div className="flex justify-between text-[10px] text-white">
                                <span>Panic Hoarding risk:</span>
                                <span className="font-bold text-[#FF6900]">{simulationData.simulatedPopulation?.consumptionPatterns?.hoardingRisk}</span>
                              </div>
                              <p className="text-[9px] text-[#00B8DB] font-mono">{simulationData.simulatedPopulation?.consumptionPatterns?.essentialGoodDemand}</p>
                              <p className="text-[10px] text-gray-400">{simulationData.simulatedPopulation?.consumptionPatterns?.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Economic Shock & Sentiment */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${STATE_COLORS.deepTeal}30` }}>
                          <div className="mb-4">
                            <span className="text-[9px] font-mono tracking-widest text-[#FF6900] bg-[#FF6900]/10 px-2 py-0.5 rounded border border-[#FF6900]/20 uppercase">Engine Details</span>
                            <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono mt-1.5 flex items-center gap-2">
                              <TrendingDown size={15} className="text-[#FF6900]" /> Economic Shock Variables
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-white/5">
                            <div className="bg-slate-950 p-4 rounded-2xl border" style={{ borderColor: `${STATE_COLORS.deepTeal}10` }}>
                              <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider block">Energy Crisis Premium</span>
                              <span className="text-xl font-black text-[#FF6900] font-mono block mt-1">
                                +${(simulationData.economicShock?.oilCrisisPremium ?? 0).toFixed(1)}/bbl
                              </span>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-2xl border" style={{ borderColor: `${STATE_COLORS.deepTeal}10` }}>
                              <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider block">Food Shortages Index</span>
                              <span className="text-xl font-black text-amber-500 font-mono block mt-1">
                                {(simulationData.economicShock?.foodShortagesIndex ?? 0).toFixed(0)} <span className="text-xs font-normal text-gray-500">/ 100</span>
                              </span>
                            </div>
                          </div>

                          {simulationData.economicShock?.disruptionSummary && (
                            <div className="mt-4 border-t pt-4 border-white/5">
                              <p className="text-[11px] text-gray-400 italic">{simulationData.economicShock.disruptionSummary}</p>
                            </div>
                          )}

                          <div className="mt-6 border-t pt-6" style={{ borderColor: `${STATE_COLORS.deepTeal}15` }}>
                            <h4 className="text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-4">Political Preference Changes</h4>
                            <div className="space-y-3">
                              {(simulationData.simulatedPopulation?.politicalPreferences || []).map((pol: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4">
                                  <div className="w-28 text-[11px] text-gray-400 truncate font-semibold">{pol.faction}</div>
                                  <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-violet-600 h-full rounded-full" style={{ width: `${pol.percentage}%` }} />
                                  </div>
                                  <div className="w-12 text-right text-[11px] font-mono text-white font-bold">{pol.percentage}%</div>
                                  <div className="hidden md:block text-[9px] text-gray-400 truncate max-w-xs">{pol.sentiment}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${STATE_COLORS.deepTeal}30` }}>
                          <div className="mb-4">
                            <span className="text-[9px] font-mono tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase font-bold">Simulator Monitoring</span>
                            <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono mt-1.5 flex items-center gap-2">
                              <MessageSquare size={15} className="text-purple-400" /> Panic Sentiment Logs & Narratives
                            </h3>
                          </div>

                          <div className="space-y-2 border-t pt-4 border-white/5">
                            {(simulationData.panicSentiment?.realtimeNarratives || []).map((feed: string, idx: number) => (
                              <div key={idx} className="bg-[#010206] p-3 rounded-xl border border-white/5 flex gap-2.5 items-start">
                                <span className="text-purple-400 text-xs shrink-0 mt-0.5 font-bold font-mono">[{12+idx}:14]</span>
                                <p className="text-[11px] text-gray-300 font-sans italic">"{feed}"</p>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-6 border-t pt-4 border-white/5">
                            <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                              <span className="text-[9px] uppercase font-mono text-gray-500 block">Protest Propensity</span>
                              <span className="text-lg font-black text-[#FF6900] font-mono">{(simulationData.panicSentiment?.protestPropensity ?? 0).toFixed(1)}%</span>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                              <span className="text-[9px] uppercase font-mono text-gray-500 block">Misinformation Vector</span>
                              <span className="text-lg font-black text-[#00B8DB] font-mono">{(simulationData.panicSentiment?.misinformationStrength ?? 0).toFixed(0)} / 100</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: RECOVERY PATH EXPLORER */}
          {activeTab === 'recovery-explorer' && (
            <div className="space-y-6">
              {!simulationData && !recoveryData ? (
                <div className="bg-[#030712] border rounded-3xl p-12 text-center" style={{ borderColor: `${STATE_COLORS.deepTeal}20` }}>
                  <Clock className="text-[#7F22FE] mb-4 mx-auto" size={36} />
                  <h3 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">No Active Simulation State Found</h3>
                  <p className="text-xs text-gray-400 mt-1">Please run a simulation first, then return here for recovery paths.</p>
                  <button onClick={() => runCivilizationSimulation(selectedCrises)} className="mt-4 px-4 py-2 rounded-xl bg-[#7F22FE] text-xs font-bold font-mono">
                    Launch Simulation
                  </button>
                </div>
              ) : recoveryLoading ? (
                <div className="bg-[#030712] border rounded-3xl p-12 text-center" style={{ borderColor: `${STATE_COLORS.deepTeal}20` }}>
                  <RefreshCw className="text-[#7F22FE] mb-4 mx-auto animate-spin" size={36} />
                  <h3 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">Generating Recovery Paths</h3>
                  <p className="text-xs text-gray-400 mt-2">Gemini AI computing multi-path probabilistic trajectories...</p>
                </div>
              ) : (
                <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${STATE_COLORS.deepTeal}30` }}>
                  <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-[#00B8DB] bg-[#00B8DB]/10 px-2 py-0.5 rounded border border-[#00B8DB]/20 uppercase">Foresight Matrix</span>
                      <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono mt-1.5">Recovery Path Explorer</h3>
                      <p className="text-xs text-gray-400">AI-generated probability trajectories computed for a multi-year recovery horizon.</p>
                    </div>
                    {currentSimId && (
                      <button
                        onClick={generateRecovery}
                        disabled={recoveryLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#00B8DB]/30 bg-[#00B8DB]/10 text-[#00B8DB] text-xs font-bold font-mono transition-colors hover:bg-[#00B8DB]/20 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw size={14} className={recoveryLoading ? 'animate-spin' : ''} />
                        Regenerate Paths
                      </button>
                    )}
                  </div>

                  {(recoveryData || simulationData?.recoveryPaths) && (() => {
                    const rp = recoveryData || simulationData?.recoveryPaths;
                    return (
                      <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Best Case */}
                          <div className="bg-slate-950 rounded-2xl p-6 border relative overflow-hidden flex flex-col justify-between hover:border-indigo-500/20 transition-all border-[#073F4D]/25">
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
                            <div className="space-y-4">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">Best Case Path</span>
                                  <h4 className="text-xs font-bold font-mono text-white mt-2 uppercase tracking-wide">{rp.bestCase?.trajectory}</h4>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] text-gray-500 font-mono block">Probability</span>
                                  <span className="text-lg font-black font-mono text-indigo-400">{rp.bestCase?.probability}%</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 leading-relaxed font-sans">{rp.bestCase?.description}</p>
                            </div>
                            <div className="mt-6 border-t pt-4 border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                              <span>Est. {rp.bestCase?.estimatedMonths} months</span>
                              <span className="text-indigo-400 font-bold">&#8594; Fast Return</span>
                            </div>
                          </div>

                          {/* Expected */}
                          <div className="bg-slate-950 rounded-2xl p-6 border relative overflow-hidden flex flex-col justify-between hover:border-amber-500/20 transition-all border-[#073F4D]/25">
                            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                            <div className="space-y-4">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">Expected Vector</span>
                                  <h4 className="text-xs font-bold font-mono text-white mt-2 uppercase tracking-wide">{rp.expected?.trajectory}</h4>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] text-gray-500 font-mono block">Probability</span>
                                  <span className="text-lg font-black font-mono text-amber-400">{rp.expected?.probability}%</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 leading-relaxed font-sans">{rp.expected?.description}</p>
                            </div>
                            <div className="mt-6 border-t pt-4 border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                              <span>Est. {rp.expected?.estimatedMonths} months</span>
                              <span className="text-amber-400 font-bold">&#8618; Gradual</span>
                            </div>
                          </div>

                          {/* Worst Case */}
                          <div className="bg-slate-950 rounded-2xl p-6 border relative overflow-hidden flex flex-col justify-between hover:border-red-500/20 transition-all border-[#073F4D]/25">
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                            <div className="space-y-4">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-500">Worst Case Strain</span>
                                  <h4 className="text-xs font-bold font-mono text-white mt-2 uppercase tracking-wide">{rp.worstCase?.trajectory}</h4>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] text-gray-500 font-mono block">Probability</span>
                                  <span className="text-lg font-black font-mono text-red-500">{rp.worstCase?.probability}%</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 leading-relaxed font-sans">{rp.worstCase?.description}</p>
                            </div>
                            <div className="mt-6 border-t pt-4 border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                              <span>Est. {rp.worstCase?.estimatedMonths} months</span>
                              <span className="text-red-500 font-bold">&#8623; Extreme Hazard</span>
                            </div>
                          </div>
                        </div>

                        {rp.overallRecommendation && (
                          <div className="mt-6 border border-[#00B8DB]/20 bg-[#00B8DB]/5 rounded-2xl p-5">
                            <span className="text-[9px] font-mono tracking-widest text-[#00B8DB] uppercase block mb-2">Overall Policy Recommendation</span>
                            <p className="text-sm text-gray-300 leading-relaxed">{rp.overallRecommendation}</p>
                          </div>
                        )}

                        {/* Recovery Timeline Chart */}
                        <div className="mt-8 border-t pt-6" style={{ borderColor: `${STATE_COLORS.deepTeal}20` }}>
                          <h4 className="text-xs font-bold tracking-wider uppercase font-mono text-white mb-3">Sovereign Recovery Horizon Timeline</h4>
                          <div className="bg-slate-950 rounded-2xl p-5 border relative h-48 flex flex-col justify-between" style={{ borderColor: `${STATE_COLORS.deepTeal}15` }}>
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 opacity-10 pointer-events-none">
                              {Array.from({ length: 18 }).map((_, i) => (
                                <div key={i} className="border-b border-r border-[#00B8DB]" />
                              ))}
                            </div>
                            <div className="absolute inset-0 p-4 flex items-center justify-center pointer-events-none">
                              <svg className="w-full h-full" viewBox="0 0 600 150">
                                <line x1="10" y1="120" x2="590" y2="120" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                                <path d="M 10 100 Q 150 115, 300 40 T 590 10" fill="none" stroke="#818cf8" strokeWidth="2" className="opacity-80" />
                                <path d="M 10 100 Q 150 125, 300 70 T 590 45" fill="none" stroke="#FBBF24" strokeWidth="2.5" />
                                <path d="M 10 100 Q 150 145, 300 135 T 590 120" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3" className="opacity-80" />
                              </svg>
                            </div>
                            <div className="relative z-10 flex justify-between text-[9px] font-mono text-gray-500 uppercase">
                              <span>Horizon (T+0: Event)</span>
                              <span>Phase II (T+{Math.floor((rp.expected?.estimatedMonths || 18)/2)}M)</span>
                              <span>Phase III (T+{rp.expected?.estimatedMonths || 24}M+)</span>
                            </div>
                            <div className="relative z-10 flex flex-wrap justify-center gap-6 mt-1.5 text-[9px] font-mono">
                              <span className="flex items-center gap-1.5 text-[#818cf8]"><span className="w-2.5 h-0.5 bg-[#818cf8]" /> Best-Case Path</span>
                              <span className="flex items-center gap-1.5 text-[#FBBF24]"><span className="w-2.5 h-0.5 bg-[#FBBF24]" /> Expected Curve</span>
                              <span className="flex items-center gap-1.5 text-[#EF4444]"><span className="w-2.5 h-0.5 bg-[#EF4444]" /> Worst-Case Deficit</span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, icon: Icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-[11px] font-mono tracking-wider transition-colors whitespace-nowrap border-b-2 ${
        active 
          ? 'bg-white/5 text-[#00B8DB] border-[#00B8DB]' 
          : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02] border-transparent'
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  );
}
