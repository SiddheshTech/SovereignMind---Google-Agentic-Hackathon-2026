import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Cpu, Clock, AlertTriangle, Users, TrendingDown, ShieldAlert, 
  Sparkles, Send, RefreshCw, Layers, ShieldCheck, Activity, BarChart2, 
  Flame, DollarSign, MessageSquare, Landmark, Zap, Shield, Navigation, 
  ShoppingBag, HelpCircle
} from 'lucide-react';

import { ScenarioBuilder } from './ScenarioBuilder';

// Color Scheme Matches the Command and Constitutional Modules perfectly
const STATE_COLORS = {
  purple: '#7F22FE',     // Primary technological accent
  orange: '#FF6900',     // Warning / Critical Action accent
  sky: '#00B8DB',        // Strategic indicators, safe state labels
  deepTeal: '#073F4D',    // Deep framing lines, background panels
  green: '#818cf8',      // Valid green
  yellow: '#FBBF24',     // Uncertain Yellow
  red: '#EF4444',        // High crisis Red
  slateBg: '#020617',    // Deep container dark
};

interface SyntheticCivilizationSandboxProps {
  key?: string;
  initialTab?: 'scenario-builder' | 'simulations' | 'recovery-explorer' | string;
}

export function SyntheticCivilizationSandbox({ initialTab = 'scenario-builder' }: SyntheticCivilizationSandboxProps) {
  const [activeTab, setActiveTab] = useState(initialTab === 'launch-simulation' ? 'scenario-builder' : initialTab);
  
  // Available crises for combined combinatorics
  const AVAILABLE_CRISES = [
    { id: 'Cyberattack', label: 'Quantum Cyberattack', desc: 'Disruption of routing channels & power systems', icon: Zap, color: '#00B8DB' },
    { id: 'Major earthquake', label: 'Major Earthquake', desc: 'Substantial structural & transport corridor failures', icon: Flame, color: '#FF6900' },
    { id: 'Banking collapse', label: 'Banking & Ledger Collapse', desc: 'Sovereign deposit limits & digital runs', icon: Landmark, color: '#FBBF24' },
    { id: 'Border conflict', label: 'Border Tactical Conflict', desc: 'Kinetic aerospace intrusions & containment lines', icon: ShieldAlert, color: '#EF4444' },
    { id: 'Pandemic resurgence', label: 'Pandemic Resurgence', desc: 'Biosafety locks & movement restrictions', icon: Activity, color: '#7F22FE' }
  ];

  const [selectedCrises, setSelectedCrises] = useState<string[]>(['Cyberattack', 'Banking collapse']);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);

  // Sync tab trigger changes
  useEffect(() => {
    setActiveTab(initialTab === 'launch-simulation' ? 'scenario-builder' : initialTab);
  }, [initialTab]);

  // Initial trigger to load default combined state with fallback/Gemini on load
  useEffect(() => {
    runCivilizationSimulation(selectedCrises);
  }, []);

  const toggleCrisis = (id: string) => {
    if (selectedCrises.includes(id)) {
      if (selectedCrises.length > 1) { // keep at least 1
        setSelectedCrises(selectedCrises.filter(c => c !== id));
      }
    } else {
      setSelectedCrises([...selectedCrises, id]);
    }
  };

  const runCivilizationSimulation = async (targetCrises: string[]) => {
    setIsSimulating(true);
    try {
      const response = await fetch('/api/sandbox/simulate-crises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crises: targetCrises })
      });
      const data = await response.json();
      if (data.result) {
        setSimulationData(data.result);
      }
    } catch (e) {
      console.error("Simulation run error:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleTriggerSimulation = () => {
    runCivilizationSimulation(selectedCrises);
  };

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
              Activate combinatoric scenario triggers. Model real-time demographic shifts across millions of virtual citizens, compute deep economic index shock variables, assess panic sentiment spread, and plot recovery paths.
            </p>
          </div>
        </div>
      </div>

      {/* Local Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        <TabButton id="scenario-builder" active={activeTab === 'scenario-builder'} icon={Cpu} label="Scenario Builder" onClick={() => setActiveTab('scenario-builder')} />
        <TabButton id="simulations" active={activeTab === 'simulations'} icon={Activity} label="Simulations" onClick={() => setActiveTab('simulations')} />
        <TabButton id="recovery-explorer" active={activeTab === 'recovery-explorer'} icon={Clock} label="Recovery Explorer" onClick={() => setActiveTab('recovery-explorer')} />
      </div>

      {/* Main Sandbox Interactive Framework */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="space-y-8 min-h-[400px]"
        >
          
          {/* VIEW 1: SCENARIO BUILDER (Crisis Formulation Hub) */}
          {activeTab === 'scenario-builder' && (
            <ScenarioBuilder />
          )}

          {/* VIEW 2: SIMULATIONS (Demographics & Economic Shock Engine Details) */}
          {activeTab === 'simulations' && (
            <div className="space-y-8">
              
              {!simulationData ? (
                <div className="bg-[#030712] border rounded-3xl p-12 text-center" style={{ borderColor: `${STATE_COLORS.deepTeal}20` }}>
                  <Users className="text-[#7F22FE] mb-4 mx-auto" size={36} />
                  <h3 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">No Active Simulation State Found</h3>
                  <p className="text-xs text-gray-450 mt-1">Please formulate your crises scenario in the Crisis Lab first.</p>
                  <button onClick={() => setActiveTab('scenario-builder')} className="mt-4 px-4 py-2 rounded-xl bg-[#7F22FE] text-xs font-bold font-mono">Back to Crisis Lab</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                  
                  {/* Left Column: Synthetic Population Generator */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${STATE_COLORS.deepTeal}30` }}>
                      <div className="mb-4">
                        <span className="text-[9px] font-mono tracking-widest text-[#00B8DB] bg-[#00B8DB]/10 px-2 py-0.5 rounded border border-[#00B8DB]/20 uppercase">Demographics Engine</span>
                        <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono mt-1.5 flex items-center gap-2">
                          <Users size={15} className="text-[#00B8DB]" /> Virtual Population Characteristics
                        </h3>
                        <p className="text-xs text-gray-450 leading-relaxed font-sans mt-0.5">
                          Calculated behaviors and strategic responses modeled across {simulationData.simulatedPopulation.totalAgents.toLocaleString()} simulation agents.
                        </p>
                      </div>

                      {/* Age groups container */}
                      <div className="space-y-4 pt-2 border-t border-white/5">
                        <h4 className="text-[10px] font-mono tracking-wider uppercase text-gray-400">1. Age Cohort Demographics & Reactions</h4>
                        <div className="space-y-3">
                          {simulationData.simulatedPopulation.ageGroups.map((age: any, idx: number) => (
                            <div key={idx} className="bg-slate-950/60 p-3.5 rounded-2xl border border-[#073F4D]/15">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-white">{age.group}</span>
                                <span className="text-xs text-[#00B8DB] font-mono font-bold">{age.percentage}%</span>
                              </div>
                              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mb-2">
                                <div className="bg-[#00B8DB]/70 h-full rounded-full" style={{ width: `${age.percentage}%` }} />
                              </div>
                              <p className="text-[10px] text-gray-400 leading-relaxed font-sans italic">“{age.reaction}”</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Income classes vulnerability */}
                      <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
                        <h4 className="text-[10px] font-mono tracking-wider uppercase text-gray-400">2. Income Class Vulnerability Factors</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {simulationData.simulatedPopulation.incomeClasses.map((income: any, idx: number) => (
                            <div key={idx} className="bg-slate-950/40 p-3 rounded-xl border border-white/5 text-left">
                              <span className="text-[10px] text-gray-400 font-mono block">{income.class} ({income.percentage}%)</span>
                              <p className="text-[10px] text-gray-300 leading-relaxed font-sans mt-1.5">{income.vulnerability}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Migration and consumption trends */}
                      <div className="space-y-4 pt-6 mt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Migration tendencies */}
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
                          <span className="text-[9px] font-mono uppercase text-pink-400 flex items-center gap-1">
                            <Navigation size={10} /> Migration Tendencies
                          </span>
                          <div className="flex justify-between items-center text-[10px] text-white">
                            <span className="font-semibold">{simulationData.simulatedPopulation.migrationTendencies.rate}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {simulationData.simulatedPopulation.migrationTendencies.hotspots.map((spot: string, idx: number) => (
                              <span key={idx} className="text-[8px] bg-slate-900 px-1.5 py-0.5 rounded text-gray-400 border border-white/5">
                                {spot}
                              </span>
                            ))}
                          </div>
                          <p className="text-[10px] text-gray-400 leading-tight">{simulationData.simulatedPopulation.migrationTendencies.description}</p>
                        </div>

                        {/* Consumption patterns */}
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
                          <span className="text-[9px] font-mono uppercase text-[#FF6900] flex items-center gap-1">
                            <ShoppingBag size={10} /> Consumption Patterns
                          </span>
                          <div className="flex justify-between items-center text-[10px] text-white">
                            <span>Panic Hoarding risk:</span>
                            <span className="font-bold text-[#FF6900]">{simulationData.simulatedPopulation.consumptionPatterns.hoardingRisk}</span>
                          </div>
                          <p className="text-[9px] text-[#00B8DB] font-mono leading-none">{simulationData.simulatedPopulation.consumptionPatterns.essentialGoodDemand}</p>
                          <p className="text-[10px] text-gray-450 leading-tight">{simulationData.simulatedPopulation.consumptionPatterns.description}</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Economic Shock Engine & Sentiment simulator */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* Shock Engine detailed parameters */}
                    <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${STATE_COLORS.deepTeal}30` }}>
                      <div className="mb-4">
                        <span className="text-[9px] font-mono tracking-widest text-[#FF6900] bg-[#FF6900]/10 px-2 py-0.5 rounded border border-[#FF6900]/20 uppercase">Engine Details</span>
                        <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono mt-1.5 flex items-center gap-2">
                          <TrendingDown size={15} className="text-[#FF6900]" /> Economic Shock Variables
                        </h3>
                        <p className="text-xs text-gray-450 leading-relaxed font-sans mt-0.5">
                          Calculated global pricing shocks, inflation curves, and physical commodity availability factors.
                        </p>
                      </div>

                      {/* Variables Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-white/5">
                        
                        {/* Oil Premium */}
                        <div className="bg-slate-950 p-4 rounded-2xl border" style={{ borderColor: `${STATE_COLORS.deepTeal}10` }}>
                          <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider block">Energy Crisis Premium</span>
                          <span className="text-xl font-black text-[#FF6900] font-mono block mt-1">+${simulationData.economicShock.oilCrisisPremium}/bbl</span>
                          <p className="text-[9px] text-gray-500 mt-1">Simulated impact on localized industrial grid supply chains.</p>
                        </div>

                        {/* Food Index */}
                        <div className="bg-slate-950 p-4 rounded-2xl border" style={{ borderColor: `${STATE_COLORS.deepTeal}10` }}>
                          <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider block">Food Shortages Index</span>
                          <span className="text-xl font-black text-amber-500 font-mono block mt-1">{simulationData.economicShock.foodShortagesIndex} <span className="text-xs font-normal text-gray-500">/ 100</span></span>
                          <p className="text-[9px] text-gray-500 mt-1">Ration allocation deficit and caloric distribution strain warning.</p>
                        </div>

                      </div>

                      {/* Political preference trends */}
                      <div className="mt-6 border-t pt-6" style={{ borderColor: `${STATE_COLORS.deepTeal}15` }}>
                        <h4 className="text-[10px] font-mono tracking-wider uppercase text-gray-400 mb-4">Political Pref Alignment Changes</h4>
                        <div className="space-y-3">
                          {simulationData.simulatedPopulation.politicalPreferences.map((pol: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="w-28 text-[11px] text-gray-400 truncate font-semibold">{pol.faction}</div>
                              <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5 relative">
                                <div className="bg-violet-600 h-full rounded-full" style={{ width: `${pol.percentage}%` }} />
                              </div>
                              <div className="w-12 text-right text-[11px] font-mono text-white font-bold">{pol.percentage}%</div>
                              <div className="hidden md:block text-[9px] text-gray-400 truncate max-w-xs">{pol.sentiment}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Sentiment Real-time narrative feed */}
                    <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${STATE_COLORS.deepTeal}30` }}>
                      <div className="mb-4">
                        <span className="text-[9px] font-mono tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase font-bold">Simulator Monitoring</span>
                        <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono mt-1.5 flex items-center gap-2">
                          <MessageSquare size={15} className="text-purple-400" /> Panic Sentiment Logs & Narratives
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed font-sans mt-0.5">
                          Streaming virtual citizen agitation monitors, news networks, and misinformation vectors.
                        </p>
                      </div>

                      {/* Narratives logs lists */}
                      <div className="space-y-2 border-t pt-4 border-white/5">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-gray-550 block mb-2 font-bold">Consolidated Crisis Feeds</span>
                        {simulationData.panicSentiment.realtimeNarratives.map((feed: string, idx: number) => (
                          <div key={idx} className="bg-[#010206] p-3 rounded-xl border border-white/5 flex gap-2.5 items-start leading-relaxed">
                            <span className="text-purple-400 text-xs shrink-0 mt-0.5 font-bold font-mono">[{12+idx}:14]</span>
                            <p className="text-[11px] text-gray-300 font-sans italic">“{feed}”</p>
                          </div>
                        ))}
                      </div>

                      {/* Advanced sub indicators */}
                      <div className="grid grid-cols-2 gap-4 mt-6 border-t pt-4 border-white/5">
                        <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                          <span className="text-[9px] uppercase font-mono text-gray-500 block">Protest Propensity</span>
                          <span className="text-lg font-black text-[#FF6900] font-mono">{simulationData.panicSentiment.protestPropensity}%</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                          <span className="text-[9px] uppercase font-mono text-gray-500 block">Misinformation Vector Strength</span>
                          <span className="text-lg font-black text-[#00B8DB] font-mono">{simulationData.panicSentiment.misinformationStrength} / 100</span>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* VIEW 3: RECOVERY PATH EXPLORER */}
          {activeTab === 'recovery-explorer' && (
            <div className="space-y-6">
              
              {!simulationData ? (
                <div className="bg-[#030712] border rounded-3xl p-12 text-center" style={{ borderColor: `${STATE_COLORS.deepTeal}20` }}>
                  <Clock className="text-[#7F22FE] mb-4 mx-auto" size={36} />
                  <h3 className="text-xs font-semibold text-white tracking-widest uppercase font-mono">No Active Simulation State Found</h3>
                  <p className="text-xs text-gray-450 mt-1">Please formulate your crises scenario in the Crisis Lab first.</p>
                  <button onClick={() => setActiveTab('scenario-builder')} className="mt-4 px-4 py-2 rounded-xl bg-[#7F22FE] text-xs font-bold font-mono">Back to Crisis Lab</button>
                </div>
              ) : (
                <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${STATE_COLORS.deepTeal}30` }}>
                  <div className="mb-6">
                    <span className="text-[9px] font-mono tracking-widest text-[#00B8DB] bg-[#00B8DB]/10 px-2 py-0.5 rounded border border-[#00B8DB]/20 uppercase">Foresight Matrix</span>
                    <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono mt-1.5">Recovery Path Explorer</h3>
                    <p className="text-xs text-gray-400">Generative probability trajectories computed over a multi-year recovery horizon.</p>
                  </div>

                  {/* Three path comparative cards layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Best-case */}
                    <div className="bg-slate-950 rounded-2xl p-6 border relative overflow-hidden flex flex-col justify-between hover:border-indigo-500/20 transition-all border-[#073F4D]/25">
                      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">Best Case Path</span>
                            <h4 className="text-xs font-bold font-mono text-white mt-2 uppercase tracking-wide">{simulationData.recoveryPath.bestCase.trajectory}</h4>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[9px] text-gray-500 font-mono block">Probability</span>
                            <span className="text-lg font-black font-mono text-indigo-400">{simulationData.recoveryPath.bestCase.probability}%</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed font-sans">{simulationData.recoveryPath.bestCase.description}</p>
                      </div>

                      <div className="mt-6 border-t pt-4 border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                        <span>Stabilized Reserve Buffer</span>
                        <span className="text-indigo-400 font-bold">&#8594; Fast Return</span>
                      </div>
                    </div>

                    {/* Expected case */}
                    <div className="bg-slate-950 rounded-2xl p-6 border relative overflow-hidden flex flex-col justify-between hover:border-amber-500/20 transition-all border-[#073F4D]/25">
                      <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">Expected Vector</span>
                            <h4 className="text-xs font-bold font-mono text-white mt-2 uppercase tracking-wide">{simulationData.recoveryPath.expected.trajectory}</h4>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[9px] text-gray-500 font-mono block">Probability</span>
                            <span className="text-lg font-black font-mono text-amber-400">{simulationData.recoveryPath.expected.probability}%</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed font-sans">{simulationData.recoveryPath.expected.description}</p>
                      </div>

                      <div className="mt-6 border-t pt-4 border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                        <span>Managed Inflation Cap</span>
                        <span className="text-amber-400 font-bold">&#8618; Gradual Transition</span>
                      </div>
                    </div>

                    {/* Worst-case */}
                    <div className="bg-slate-950 rounded-2xl p-6 border relative overflow-hidden flex flex-col justify-between hover:border-red-500/20 transition-all border-[#073F4D]/25">
                      <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-500">Worst Case Strain</span>
                            <h4 className="text-xs font-bold font-mono text-white mt-2 uppercase tracking-wide">{simulationData.recoveryPath.worstCase.trajectory}</h4>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[9px] text-gray-500 font-mono block">Probability</span>
                            <span className="text-lg font-black font-mono text-red-500">{simulationData.recoveryPath.worstCase.probability}%</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed font-sans">{simulationData.recoveryPath.worstCase.description}</p>
                      </div>

                      <div className="mt-6 border-t pt-4 border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                        <span>Cascading Sovereignty Fail</span>
                        <span className="text-red-500 font-bold">&#8623; Extreme Hazard</span>
                      </div>
                    </div>

                  </div>

                  {/* Graphic chart indicator projection visualizer */}
                  <div className="mt-8 border-t pt-6" style={{ borderColor: `${STATE_COLORS.deepTeal}20` }}>
                    <h4 className="text-xs font-bold tracking-wider uppercase font-mono text-white mb-3">Sovereign Recovery Horizon Timeline</h4>
                    <div className="bg-slate-950 rounded-2xl p-5 border relative h-48 flex flex-col justify-between" style={{ borderColor: `${STATE_COLORS.deepTeal}15` }}>
                      
                      {/* Grid background overlay */}
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 opacity-10 pointer-events-none">
                        {Array.from({ length: 18 }).map((_, i) => (
                          <div key={i} className="border-b border-r border-[#00B8DB]" />
                        ))}
                      </div>

                      {/* Trajectory vector paths rendered using inline CSS SVG nodes */}
                      <div className="absolute inset-0 p-4 flex items-center justify-center pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 600 150">
                          {/* Baseline axis */}
                          <line x1="10" y1="120" x2="590" y2="120" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
                          
                          {/* Best Case line (Emerald green, recovering fast) */}
                          <path d="M 10 100 Q 150 115, 300 40 T 590 10" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="1" className="opacity-80" />
                          
                          {/* Expected Case line (Amber, steady recovery) */}
                          <path d="M 10 100 Q 150 125, 300 70 T 590 45" fill="none" stroke="#FBBF24" strokeWidth="2.5" />
                          
                          {/* Worst Case line (Red, plunging and stagnating) */}
                          <path d="M 10 100 Q 150 145, 300 135 T 590 120" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3" className="opacity-80" />
                        </svg>
                      </div>

                      {/* Coordinates texts overlays */}
                      <div className="relative z-10 flex justify-between text-[9px] font-mono text-gray-500 uppercase">
                        <span>Horizon (T+0: Event Tectonic Spurt)</span>
                        <span>Phase II (T+12M: Infrastructure Buffer Stabilization)</span>
                        <span>Phase III (T+24M+: Consolidation Target)</span>
                      </div>

                      <div className="relative z-10 flex flex-wrap justify-center gap-6 mt-1.5 text-[9px] font-mono">
                        <span className="flex items-center gap-1.5 text-[#818cf8]">
                          <span className="w-2.5 h-0.5 bg-[#818cf8]" /> Best-Case Path Vector
                        </span>
                        <span className="flex items-center gap-1.5 text-[#FBBF24]">
                          <span className="w-2.5 h-0.5 bg-[#FBBF24]" /> Expected-Case Curve
                        </span>
                        <span className="flex items-center gap-1.5 text-[#EF4444]">
                          <span className="w-2.5 h-0.5 bg-[#EF4444]" /> Worst-Case Deficit
                        </span>
                      </div>
                    </div>
                  </div>

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
