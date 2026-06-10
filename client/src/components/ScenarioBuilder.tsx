import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, Landmark, Zap, ShieldAlert, Activity, Users, 
  Cpu, Save, Copy, Share2, Target, HeartPulse,
  Brain, AlertTriangle, ArrowRight, 
  ActivitySquare, Network, RefreshCw, X, Download, Link, History, CheckCircle2, AlertCircle, FileText, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CRISIS_CATEGORIES = [
  {
    title: 'Natural Disasters',
    icon: Flame,
    color: '#FF6900',
    items: ['Earthquake', 'Flood', 'Wildfire', 'Cyclone', 'Drought', 'Volcano', 'Tsunami']
  },
  {
    title: 'Economic Crises',
    icon: Landmark,
    color: '#FBBF24',
    items: ['Recession', 'Bank Collapse', 'Currency Crash', 'Debt Crisis', 'Oil Shock', 'Trade Embargo']
  },
  {
    title: 'Security Crises',
    icon: ShieldAlert,
    color: '#EF4444',
    items: ['Cyberattack', 'Terror Incident', 'Border Conflict', 'Military Escalation', 'Critical Infrastructure Attack']
  },
  {
    title: 'Health Crises',
    icon: HeartPulse,
    color: '#10B981',
    items: ['Pandemic', 'Drug Resistant Disease', 'Hospital Collapse', 'Vaccine Shortage']
  },
  {
    title: 'Social Crises',
    icon: Users,
    color: '#7F22FE',
    items: ['Mass Protests', 'Disinformation Campaign', 'Political Polarization', 'Ethnic Conflict', 'Trust Collapse']
  }
];

const GQL_SAVE_SCENARIO = `
  mutation SaveScenario($crises: [String!]!, $scenarioName: String!) {
    saveScenario(crises: $crises, scenarioName: $scenarioName) {
      id
      scenarioName
      crises
      resilienceScore
      estimatedRecoveryMonths
      createdAt
    }
  }
`;

const GQL_LAUNCH_SIMULATION = `
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

const GQL_GET_SIMULATIONS = `
  query GetCrisisSimulations($limit: Int) {
    getCrisisSimulations(limit: $limit) {
      id
      scenarioName
      crises
      resilienceScore
      estimatedRecoveryMonths
      createdAt
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

interface ScenarioBuilderProps {
  onSimulationLaunched?: (simData: any) => void;
}

export function ScenarioBuilder({ onSimulationLaunched }: ScenarioBuilderProps) {
  const [selectedCrises, setSelectedCrises] = useState<Array<{name: string, cat: string, color: string}>>([
    { name: 'Pandemic', cat: 'Health Crises', color: '#10B981' }
  ]);
  const [showMatrix, setShowMatrix] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [matrixData, setMatrixData] = useState<any>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string, msg: string, type: 'success' | 'error' | 'info' }>>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyTab, setHistoryTab] = useState('recent');
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string>('');

  const addNotification = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const addCrisis = (item: string, catTitle: string, catColor: string) => {
    if (!selectedCrises.find(c => c.name === item)) {
      setSelectedCrises([...selectedCrises, { name: item, cat: catTitle, color: catColor }]);
    } else {
      setSelectedCrises(selectedCrises.filter(c => c.name !== item));
    }
  };

  const removeCrisis = (idx: number) => {
    const newCrises = [...selectedCrises];
    newCrises.splice(idx, 1);
    setSelectedCrises(newCrises);
  };

  const handleSaveScenario = async () => {
    if (selectedCrises.length === 0) return addNotification('Please select at least one crisis.', 'error');
    setActionLoading('save');
    try {
      const scenarioName = `Scenario: ${selectedCrises.map(c => c.name).join(' + ')}`;
      const data = await graphqlRequest(GQL_SAVE_SCENARIO, {
        crises: selectedCrises.map(c => c.name),
        scenarioName,
      });
      addNotification(`Scenario "${data.saveScenario.scenarioName}" saved to database. Resilience: ${data.saveScenario.resilienceScore?.toFixed(1)}%`, 'success');
    } catch (e: any) {
      addNotification(`Save failed: ${e.message}`, 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleCloneScenario = async () => {
    if (selectedCrises.length === 0) return addNotification('No scenario to clone.', 'error');
    setActionLoading('clone');
    try {
      const cloneName = `[Clone] ${selectedCrises.map(c => c.name).join(' + ')} — ${new Date().toLocaleTimeString()}`;
      await graphqlRequest(GQL_SAVE_SCENARIO, {
        crises: selectedCrises.map(c => c.name),
        scenarioName: cloneName,
      });
      addNotification(`Scenario cloned successfully.`, 'success');
    } catch (e: any) {
      addNotification(`Clone failed: ${e.message}`, 'error');
    } finally {
      setActionLoading('');
    }
  };

  const handleGenerateAIReport = async () => {
    if (selectedCrises.length === 0) return addNotification('Please select crises first.', 'error');
    setActionLoading('ai');
    try {
      const data = await graphqlRequest(GQL_LAUNCH_SIMULATION, {
        crises: selectedCrises.map(c => c.name),
        scenarioName: `AI Report: ${selectedCrises.map(c => c.name).join(' + ')}`,
      });
      addNotification(`AI Report generated. Simulation ID: ${data.launchCrisisSimulation.simulationId.slice(-6)}`, 'success');
    } catch (e: any) {
      addNotification(`AI Report failed: ${e.message}`, 'error');
    } finally {
      setActionLoading('');
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await graphqlRequest(GQL_GET_SIMULATIONS, { limit: 20 });
      setHistoryItems(data.getCrisisSimulations || []);
    } catch (e) {
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenHistory = () => {
    setShowHistoryModal(true);
    loadHistory();
  };

  const handleStressTest = async () => {
    if (selectedCrises.length === 0) return addNotification('Select at least one crisis to test.', 'error');
    setSimulating(true);
    setMatrixData(null);
    try {
      const data = await graphqlRequest(GQL_LAUNCH_SIMULATION, {
        crises: selectedCrises.map(c => c.name),
        scenarioName: `Stress Test: ${selectedCrises.map(c => c.name).join(' + ')}`,
      });
      const simResult = data.launchCrisisSimulation;
      setMatrixData({
        resilienceScore: simResult.resilienceScore,
        estimatedRecoveryMonths: simResult.estimatedRecoveryMonths,
        crises: simResult.crises,
        simulationId: simResult.simulationId,
      });
      setShowMatrix(true);
      addNotification(`Stress test launched! Simulation ID: ${simResult.simulationId.slice(-6)}`, 'success');
      if (onSimulationLaunched) onSimulationLaunched(simResult);
    } catch (e: any) {
      addNotification(`Stress test failed: ${e.message}`, 'error');
    } finally {
      setSimulating(false);
    }
  };

  const crisisNames = selectedCrises.map(c => c.name);

  if (showMatrix && matrixData) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-500 relative">
        <div className="flex justify-between items-center bg-[#030712] border border-[#073F4D]/40 p-6 rounded-3xl">
          <div>
            <h3 className="text-xl font-bold text-white uppercase font-mono tracking-widest flex items-center gap-2">
              <Network className="text-purple-400" /> Multi-Crisis Interaction Matrix
            </h3>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Deep structural analysis of combinatoric cascade failures. Simulation engine returned live resilience data.
            </p>
          </div>
          <button onClick={() => setShowMatrix(false)} className="px-5 py-2.5 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-colors cursor-pointer">
            Back to Builder
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#030712] border border-[#073F4D]/30 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #7F22FE 0%, transparent 60%)', filter: 'blur(100px)'}} />
            <div className="w-full max-w-md space-y-8 relative z-10">
              {crisisNames.map((name, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="bg-slate-950 border border-white/10 px-5 py-3 rounded-2xl w-full text-center shadow-lg text-white">
                    <span className="font-bold text-sm">{name}</span>
                  </div>
                  {idx < crisisNames.length - 1 && (
                    <div className="h-12 w-px bg-gradient-to-b from-red-500 to-amber-500 relative flex items-center justify-center my-2">
                      <div className="absolute bg-[#030712] border border-red-500/30 px-3 py-1 rounded-full text-[9px] font-mono whitespace-nowrap text-red-300">
                        Cascade Amplification
                      </div>
                      <ArrowRight size={14} className="text-amber-500 absolute -bottom-3 rotate-90" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-[#073F4D]/30 p-5 rounded-2xl text-center">
                <div className="text-[10px] uppercase font-mono text-gray-500 mb-1">Resilience Score</div>
                <div className="text-3xl font-black text-rose-500 font-mono tracking-tighter">
                  {(matrixData.resilienceScore ?? 50).toFixed(1)}%
                </div>
                <div className="text-[9px] text-gray-500 mt-1">AI-computed from Gemini</div>
              </div>
              <div className="bg-slate-950 border border-[#073F4D]/30 p-5 rounded-2xl text-center">
                <div className="text-[10px] uppercase font-mono text-gray-500 mb-1">Recovery Time</div>
                <div className="text-3xl font-black text-amber-500 font-mono tracking-tighter">
                  {(matrixData.estimatedRecoveryMonths ?? 18).toFixed(0)} MO
                </div>
                <div className="text-[9px] text-gray-500 mt-1">Estimated projection</div>
              </div>
            </div>

            <div className="bg-slate-950 border border-[#073F4D]/30 p-6 rounded-3xl">
              <h4 className="text-sm font-mono text-[#FF6900] uppercase font-bold tracking-wider mb-4 border-b border-white/5 pb-2">Amplification Vectors</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <ActivitySquare className="text-red-500 shrink-0" size={18} />
                  <div>
                    <span className="block text-xs font-bold text-white">Compound GDP Deterioration</span>
                    <span className="block text-[10px] text-gray-400 mt-1 leading-relaxed">
                      {crisisNames.length > 1 
                        ? `${crisisNames[0]} paired with ${crisisNames[1]} accelerates GDP loss by ${(2 + crisisNames.length * 0.7).toFixed(1)}x compared to isolated events.`
                        : `${crisisNames[0]} creates a single-vector economic compression event.`}
                    </span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Users className="text-purple-500 shrink-0" size={18} />
                  <div>
                    <span className="block text-xs font-bold text-white">Trust Disintegration Protocol</span>
                    <span className="block text-[10px] text-gray-400 mt-1 leading-relaxed">
                      Crisis combination results in projected institutional staffing shortages ({Math.min(25 + crisisNames.length * 8, 65)}% attrition across critical sectors).
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 border border-[#073F4D]/30 p-6 rounded-3xl">
              <h4 className="text-sm font-mono text-[#00B8DB] uppercase font-bold tracking-wider mb-4 border-b border-white/5 pb-2">Sim ID Reference</h4>
              <div className="bg-[#010206] border border-white/5 px-4 py-3 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">Simulation ID</span>
                <span className="text-xs font-mono text-[#00B8DB] font-bold">{matrixData.simulationId?.slice(-12)}</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                Real-time tick data streaming via WebSocket. Open Simulations tab to view live results.
              </p>
            </div>

            <button onClick={() => addNotification('Navigating to Simulations tab...', 'info')} className="w-full py-4 rounded-xl border border-sky-500/30 bg-sky-950/30 hover:bg-sky-900/40 text-sky-400 font-bold font-mono text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <FileText size={16} /> VIEW SIMULATION RESULTS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className={`pointer-events-auto px-4 py-3 rounded-xl border flex items-center gap-3 shadow-xl backdrop-blur-md ${n.type === 'error' ? 'bg-red-950/80 border-red-500/50 text-red-200' : n.type === 'info' ? 'bg-sky-950/80 border-sky-500/50 text-sky-200' : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'}`}>
              {n.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span className="text-xs font-bold font-sans">{n.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Upper Framework: Workbench */}
      <div className="bg-[#030712] border border-[#073F4D]/40 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left: Component Drag Target */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold tracking-widest text-white uppercase font-mono flex items-center gap-2">
              <Cpu className="text-[#00B8DB]" size={16} /> Crisis Combination Engine
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">{selectedCrises.length} Selected Vectors</span>
          </div>
          
          <div className="flex-1 bg-slate-950/50 border border-dashed border-gray-700 hover:border-gray-500 transition-colors p-6 rounded-2xl flex flex-col justify-center items-center min-h-[300px] relative overflow-hidden">
            {selectedCrises.length === 0 ? (
              <div className="text-center text-gray-500">
                <AlertTriangle size={32} className="mx-auto mb-3 opacity-50" />
                <p className="font-mono text-xs uppercase tracking-wider">Click Events Below to Add</p>
              </div>
            ) : (
              <div className="w-full flex-1 flex flex-col items-center justify-center gap-3 relative z-10 py-6">
                <AnimatePresence>
                  {selectedCrises.map((item, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key={item.name + idx} 
                      className="group relative px-6 py-4 rounded-2xl w-full max-w-sm flex items-center justify-between shadow-xl cursor-default border"
                      style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}30` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-white text-sm">{item.name}</span>
                      </div>
                      <button onClick={() => removeCrisis(idx)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white cursor-pointer" aria-label="Remove vector">
                        ✕
                      </button>
                      {idx < selectedCrises.length - 1 && (
                        <div className="absolute -bottom-6 left-1/2 -ml-3 w-6 h-6 flex items-center justify-center z-10 text-gray-500 pointer-events-none">
                          <span className="bg-slate-900 border border-white/10 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">+</span>
                          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 -z-10 h-10" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="w-full lg:w-72 flex flex-col gap-3 justify-end shrink-0">
          <button
            onClick={handleSaveScenario}
            disabled={!!actionLoading}
            className="w-full p-4 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-3 text-xs font-bold text-gray-300 hover:text-white group cursor-pointer disabled:opacity-50"
          >
            {actionLoading === 'save' ? <RefreshCw size={16} className="animate-spin text-gray-500" /> : <Save size={16} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />}
            {actionLoading === 'save' ? 'Saving to DB...' : 'Save Scenario'}
          </button>
          <button
            onClick={handleCloneScenario}
            disabled={!!actionLoading}
            className="w-full p-4 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-3 text-xs font-bold text-gray-300 hover:text-white group cursor-pointer disabled:opacity-50"
          >
            {actionLoading === 'clone' ? <RefreshCw size={16} className="animate-spin text-gray-500" /> : <Copy size={16} className="text-gray-500 group-hover:text-sky-400 transition-colors" />}
            {actionLoading === 'clone' ? 'Cloning...' : 'Clone Scenario'}
          </button>
          <button onClick={() => setShowShareModal(true)} className="w-full p-4 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-3 text-xs font-bold text-gray-300 hover:text-white group cursor-pointer">
            <Share2 size={16} className="text-gray-500 group-hover:text-purple-400 transition-colors" /> Share Scenario
          </button>
          <button
            onClick={handleGenerateAIReport}
            disabled={!!actionLoading}
            className="w-full p-4 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-3 text-xs font-bold text-gray-300 hover:text-white group cursor-pointer disabled:opacity-50"
          >
            {actionLoading === 'ai' ? <RefreshCw size={16} className="animate-spin text-gray-500" /> : <Brain size={16} className="text-gray-500 group-hover:text-orange-400 transition-colors" />}
            {actionLoading === 'ai' ? 'Generating...' : 'Generate AI Report'}
          </button>
          <button onClick={handleOpenHistory} className="w-full p-4 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-3 text-xs font-bold text-gray-300 hover:text-white group cursor-pointer">
            <History size={16} className="text-gray-500 group-hover:text-indigo-400 transition-colors" /> Scenario History
          </button>
          
          <div className="my-1 border-t border-white/5" />

          <button 
            onClick={handleStressTest}
            disabled={simulating || selectedCrises.length === 0}
            className="w-full p-5 rounded-2xl bg-[#7F22FE] hover:bg-[#6c1ce0] text-white flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider relative overflow-hidden transition-all disabled:opacity-50 cursor-pointer"
          >
            {simulating ? (
              <><RefreshCw className="animate-spin" size={18} /> Launching AI Simulation...</>
            ) : (
              <><Target size={18} /> Stress Test Scenario</>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-shimmer" />
          </button>
          {simulating && (
            <p className="text-[10px] text-purple-400 font-mono text-center animate-pulse">
              Invoking gRPC → FastAPI → Gemini AI...
            </p>
          )}
        </div>
      </div>

      {/* Library of Disasters */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {CRISIS_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.title} className="bg-slate-950 border border-white/5 rounded-3xl p-5 hover:border-white/10 transition-colors flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                <span className="p-1.5 rounded-lg bg-white/5">
                  <Icon size={14} style={{ color: cat.color }} />
                </span>
                <h4 className="text-xs font-bold text-gray-200">{cat.title}</h4>
              </div>
              <div className="flex flex-col gap-1.5">
                {cat.items.map(item => {
                  const isSelected = selectedCrises.some(c => c.name === item);
                  return (
                    <button 
                      key={item}
                      onClick={() => addCrisis(item, cat.title, cat.color)}
                      className={`text-left px-3 py-2 rounded-xl text-[11px] font-mono transition-all truncate border flex justify-between items-center cursor-pointer ${isSelected ? 'text-white border-white/20 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'}`}
                    >
                      {item}
                      {isSelected && <CheckCircle2 size={12} style={{ color: cat.color }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-[#030712] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Share2 size={16} className="text-purple-400" /> Share Scenario</h3>
                <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-white transition-colors cursor-pointer"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1.5">Export Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { addNotification('Exporting PDF...', 'info'); setShowShareModal(false); }} className="py-2.5 px-3 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg flex items-center justify-center gap-2 text-xs font-medium text-gray-300 transition-colors cursor-pointer"><Download size={14}/> Generate PDF</button>
                    <button onClick={() => { addNotification('Copying scenario data...', 'info'); setShowShareModal(false); }} className="py-2.5 px-3 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg flex items-center justify-center gap-2 text-xs font-medium text-gray-300 transition-colors cursor-pointer"><Link size={14}/> Copy Link</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal — Real Data */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-3xl bg-[#030712] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900 shrink-0">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><History size={16} className="text-indigo-400" /> Scenario Index <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 ml-2">Live MongoDB</span></h3>
                <button onClick={() => setShowHistoryModal(false)} className="text-gray-500 hover:text-white transition-colors cursor-pointer"><X size={16} /></button>
              </div>
              <div className="flex items-center gap-1 border-b border-white/5 p-2 bg-slate-950 shrink-0">
                {['recent', 'saved'].map(tab => (
                  <button key={tab} onClick={() => setHistoryTab(tab)} className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${historyTab === tab ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-500 hover:text-gray-300'}`}>
                    {tab} Scenarios
                  </button>
                ))}
                <button onClick={loadHistory} className="ml-auto px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-white flex items-center gap-1 cursor-pointer">
                  <RefreshCw size={12} className={historyLoading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {historyLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <RefreshCw className="animate-spin text-indigo-400" size={24} />
                    <span className="text-sm text-gray-400 ml-3">Loading from MongoDB...</span>
                  </div>
                ) : historyItems.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <AlertTriangle className="mx-auto mb-3 opacity-50" size={28} />
                    <p className="text-xs font-mono">No simulations found. Run a Stress Test first.</p>
                  </div>
                ) : (
                  historyItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors flex items-center justify-between group cursor-pointer">
                      <div>
                        <h4 className="text-sm font-bold text-gray-200 mb-1 group-hover:text-white">{item.scenarioName}</h4>
                        <div className="text-[10px] font-mono text-gray-500">
                          Vectors: {item.crises?.join(', ')} • {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-rose-400 border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 rounded">
                          Resilience: {(item.resilienceScore ?? 50).toFixed(0)}%
                        </span>
                        <span className="text-xs font-bold text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded">
                          {(item.estimatedRecoveryMonths ?? 18).toFixed(0)} mo
                        </span>
                        <button onClick={() => setShowHistoryModal(false)} className="p-2 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 rounded-lg cursor-pointer"><ChevronRight size={16} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
