import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, GitBranch, Search, Filter, Layers, Database, Eye, Share2, ZoomIn, Download, Zap, Link2, Shield, Activity, Share } from 'lucide-react';

const PALETTE = {
  purple: '#8B5CF6',
  indigo: '#6366F1',
  blue: '#3B82F6',
  cyan: '#06B6D4',
  emerald: '#10B981',
  orange: '#F97316',
  rose: '#F43F5E',
  slate: '#0F172A',
  uiBorder: '#1E293B',
};

interface IntelligenceGraphDashboardProps {
  key?: string;
  initialTab?: 'networks' | 'cascades';
}

export function IntelligenceGraphDashboard({ initialTab = 'networks' }: IntelligenceGraphDashboardProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [layoutTrigger, setLayoutTrigger] = useState(0);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [actionState, setActionState] = useState<{ id: string; status: 'idle' | 'loading' | 'success', message?: string}>( { id: '', status: 'idle' } );

  const [data, setData] = useState<any>(null);
  let ws: WebSocket;

  const fetchData = async () => {
    try {
      const query = `
        query {
          getIntelligenceData {
            nodes { id type baseColor connections x y size classStr dot pulse }
            edges { source target color width dashed opacity pulse }
            topologyStats { totalNodes activeEdges densityScore centralityDrift }
            simulations {
              id trigger
              mitigations { label val pct }
              steps { time title desc color isWarning isFinal }
            }
          }
        }
      `;
      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const json = await res.json();
      if (json.data?.getIntelligenceData) {
        setData(json.data.getIntelligenceData);
      }
    } catch (e) {
      console.error("Error fetching intelligence data:", e);
    }
  };

  useEffect(() => {
    fetchData();

    ws = new WebSocket(`ws://${window.location.hostname}:4000/ws/intelligence`);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'INTELLIGENCE_DATA_UPDATED') {
          setData(msg.data);
        }
      } catch (err) {}
    };

    return () => ws.close();
  }, []);

  const handleAction = async (id: string, customMessage?: string) => {
    setActionState({ id, status: 'loading', message: customMessage });
    try {
      if (id === 'brain') {
        const mutation = `
          mutation {
            simulateIntelligenceUpdate {
              nodes { id }
            }
          }
        `;
        await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: mutation })
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      setActionState({ id, status: 'success', message: customMessage });
      setTimeout(() => setActionState({ id: '', status: 'idle', message: undefined }), 2000);
    } catch {
      setActionState({ id: '', status: 'idle', message: undefined });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {actionState.status === 'success' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 p-3 px-6 rounded-xl bg-indigo-600 shadow-[0_0_30px_rgba(99,102,241,0.5)] text-white text-xs font-mono font-bold tracking-widest uppercase z-50 animate-fade-in border border-indigo-400">
           {actionState.message || 'ACTION COMPLETED'}
        </div>
      )}

      {/* Sub-header controls */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { handleAction('layout', 'Layout Engine Optimized'); setLayoutTrigger(prev => prev + 1); }} disabled={actionState.status === 'loading'} className="flex items-center gap-2 px-3 py-1.5 bg-[#030712] border border-slate-800 text-gray-300 text-xs font-medium rounded-lg transition-colors cursor-pointer hover:bg-white/5 disabled:opacity-50">
            <Filter size={14} /> Layout Engine
          </button>
          <button onClick={() => handleAction('export', 'Graph Exported Successfully')} disabled={actionState.status === 'loading'} className="flex items-center gap-2 px-4 py-2 bg-indigo-950 border border-indigo-500/30 hover:bg-indigo-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50">
            <Share2 size={14} /> Export Graph
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'networks' && (
          <motion.div
            key="networks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <NetworksView handleAction={handleAction} actionState={actionState} layoutTrigger={layoutTrigger} data={data} />
          </motion.div>
        )}
        {activeTab === 'cascades' && (
          <motion.div
            key="cascades"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <CascadesView handleAction={handleAction} actionState={actionState} layoutTrigger={layoutTrigger} data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const INITIAL_NODES = [
  { id: 'Gov Hub', type: 'Governments', baseColor: 'indigo', connections: 124, x: 50, y: 45, size: 80, classStr: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300', dot: 'bg-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.6)]' },
  { id: 'Treaty Network', type: 'Treaties', baseColor: 'cyan', connections: 89, x: 30, y: 20, size: 64, classStr: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300', dot: 'bg-cyan-500/40' },
  { id: 'Supply Matrix', type: 'Supply Chains', baseColor: 'emerald', connections: 210, x: 25, y: 65, size: 56, classStr: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300', dot: 'bg-emerald-500/40' },
  { id: 'Corp Entities', type: 'Corporations', baseColor: 'purple', connections: 340, x: 75, y: 30, size: 64, classStr: 'bg-purple-500/10 border-purple-500/30 text-purple-300', dot: 'bg-purple-500/40' },
  { id: 'Global Inst', type: 'Institutions', baseColor: 'blue', connections: 45, x: 70, y: 75, size: 48, classStr: 'bg-pink-500/10 border-pink-500/40 text-pink-300', dot: 'bg-pink-500/40' },
  { id: 'Infra Core', type: 'Infrastructure', baseColor: 'orange', connections: 78, x: 55, y: 15, size: 40, classStr: 'bg-orange-500/10 border-orange-500/40 text-orange-300', dot: 'bg-orange-500/40' },
  { id: 'Crisis Nodes', type: 'Crises', baseColor: 'rose', connections: 12, x: 35, y: 80, size: 64, classStr: 'bg-rose-500/10 border-rose-500/40 text-rose-400', dot: 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]', pulse: true }
];

const INITIAL_EDGES = [
  { source: 'Gov Hub', target: 'Corp Entities', color: PALETTE.purple, width: 2, dashed: true, opacity: 0.5 },
  { source: 'Gov Hub', target: 'Treaty Network', color: PALETTE.cyan, width: 2, dashed: true, opacity: 0.5 },
  { source: 'Gov Hub', target: 'Supply Matrix', color: PALETTE.emerald, width: 3, dashed: false, opacity: 0.6 },
  { source: 'Supply Matrix', target: 'Treaty Network', color: PALETTE.slate, width: 1, dashed: false, opacity: 0.4 },
  { source: 'Gov Hub', target: 'Global Inst', color: PALETTE.blue, width: 2, dashed: false, opacity: 0.5 },
  { source: 'Supply Matrix', target: 'Crisis Nodes', color: PALETTE.rose, width: 2, dashed: false, opacity: 0.8, pulse: true },
  { source: 'Corp Entities', target: 'Global Inst', color: PALETTE.slate, width: 1, dashed: true, opacity: 0.3 },
  { source: 'Infra Core', target: 'Gov Hub', color: PALETTE.orange, width: 2, dashed: false, opacity: 0.5 },
  { source: 'Infra Core', target: 'Treaty Network', color: PALETTE.slate, width: 1, dashed: true, opacity: 0.3 }
];

function NetworksView({ handleAction, actionState, layoutTrigger, data }: any) {
  const [scale, setScale] = useState(1);
  const [selectedNode, setSelectedNode] = useState<{ id: string, type: string, connections: number } | null>(null);
  const [query, setQuery] = useState({ entity: '', relationship: '' });
  const [nodes, setNodes] = useState<any[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data?.nodes) {
      setNodes(data.nodes);
    }
  }, [data?.nodes]);

  useEffect(() => {
    if (layoutTrigger > 0) {
      setNodes(prev => prev.map(n => ({
        ...n,
        x: Math.max(15, Math.min(85, n.x + (Math.random() * 30 - 15))),
        y: Math.max(15, Math.min(85, n.y + (Math.random() * 30 - 15)))
      })));
    }
  }, [layoutTrigger]);

  const handleExtraction = async () => {
    await handleAction('extract', `Generated Extract for ${query.entity || 'selection'}`);
    const q = query.entity.toLowerCase();
    if (!q) {
      setHighlightedNodes(new Set());
      return;
    }
    const matches = nodes.filter(n => n.id.toLowerCase().includes(q) || n.type.toLowerCase().includes(q)).map(n => n.id);
    setHighlightedNodes(new Set(matches));
  };

  const isSimulatingBrain = actionState.status === 'loading' && actionState.id === 'brain';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Graph Visualizer Main Area */}
      <div className="lg:col-span-3 bg-[#030712] border border-slate-800 rounded-3xl p-6 relative h-[650px] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center z-10 relative pointer-events-none">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border transition-colors ${isSimulatingBrain ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
              <Network size={18} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white mb-1">Sovereign Intelligence Graph</h3>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">GEOPOLITICAL NEURAL NETWORK • RELATIONSHIP MAP</div>
            </div>
          </div>
          <div className="flex gap-2 items-center pointer-events-auto">
            <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 mr-2">
              <button className="p-1 hover:bg-slate-800 rounded text-gray-400 hover:text-white cursor-pointer" onClick={() => setScale(s => Math.max(0.4, s - 0.2))}><ZoomIn size={14} className="rotate-180" /></button>
              <span className="text-xs font-mono text-gray-500 min-w-[3.5ch] text-center pt-0.5">{Math.round(scale * 100)}%</span>
              <button className="p-1 hover:bg-slate-800 rounded text-gray-400 hover:text-white cursor-pointer" onClick={() => setScale(s => Math.min(2.0, s + 0.2))}><ZoomIn size={14} /></button>
            </div>
            <button onClick={() => handleAction('brain', 'Brain Analysis Active')} disabled={actionState.status === 'loading'} className={`px-3 py-1.5 rounded-md text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${isSimulatingBrain ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
              <Zap size={14} className={`inline mr-1 ${isSimulatingBrain ? 'animate-pulse text-white' : ''}`}/> {isSimulatingBrain ? 'Activating...' : 'Brain Active'}
            </button>
          </div>
        </div>

        {/* Dynamic Network Graph */}
        <div className="absolute inset-0 top-20 flex items-center justify-center overflow-auto">
          <div className="relative w-full h-[500px] max-w-4xl transition-transform duration-300" style={{ transform: `scale(${scale})` }}>
             
             {/* Dynamic SVG connection lines */}
             <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
               {(data?.edges || []).map((edge: any, i: number) => {
                  const sourceNode = nodes.find((n: any) => n.id === edge.source);
                  const targetNode = nodes.find((n: any) => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;
                  
                  const isSourceHighlighted = highlightedNodes.size > 0 && highlightedNodes.has(sourceNode.id);
                  const isTargetHighlighted = highlightedNodes.size > 0 && highlightedNodes.has(targetNode.id);
                  const isEdgeHighlighted = highlightedNodes.size === 0 || (isSourceHighlighted || isTargetHighlighted);
                  
                  const isActivePulse = edge.pulse || isSimulatingBrain;

                  return (
                    <line 
                      key={i}
                      x1={`${sourceNode.x}%`} 
                      y1={`${sourceNode.y}%`} 
                      x2={`${targetNode.x}%`} 
                      y2={`${targetNode.y}%`} 
                      stroke={edge.color} 
                      strokeWidth={edge.width} 
                      strokeDasharray={edge.dashed ? "6 6" : ""}
                      className={`transition-all duration-1000 ${isActivePulse ? 'animate-pulse drop-shadow-[0_0_5px_rgba(244,63,94,0.6)]' : ''}`}
                      style={{ opacity: isEdgeHighlighted ? edge.opacity : 0.05 }}
                    />
                  );
               })}
             </svg>

             {/* Dynamic Nodes */}
             {nodes.map(n => {
                const isHighlighted = highlightedNodes.size === 0 || highlightedNodes.has(n.id);
                return (
                  <div 
                    key={n.id} 
                    className={`absolute cursor-pointer group hover:z-20 transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2 ${n.pulse || isSimulatingBrain ? 'animate-pulse' : ''}`} 
                    style={{ left: `${n.x}%`, top: `${n.y}%`, opacity: isHighlighted ? 1 : 0.2 }}
                    onClick={() => setSelectedNode(n)}>
                    <div style={{ width: `${n.size}px`, height: `${n.size}px` }} className={`rounded-full border flex flex-col items-center justify-center transition-all ${n.classStr} ${selectedNode?.id === n.id ? 'ring-2 ring-white/30 scale-110 shadow-xl' : 'hover:scale-110 shadow-md hover:ring-1 ring-white/20'}`}>
                      <div className={`w-1/2 h-1/2 rounded-full blur-[2px] ${n.dot}`} />
                      <span className="absolute -bottom-6 text-[10px] font-bold font-mono transition-opacity bg-black/80 px-2 py-0.5 rounded border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100">
                        {n.type}
                      </span>
                    </div>
                  </div>
                );
             })}
          </div>
        </div>
        
        {/* Selected Node Details popup */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-24 right-6 w-64 bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 p-5 rounded-xl shadow-2xl z-20 pointer-events-auto">
               <div className="flex justify-between items-start mb-4">
                 <div>
                    <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">{selectedNode.type}</div>
                    <h4 className="text-sm text-white font-bold">{selectedNode.id}</h4>
                 </div>
                 <button onClick={() => setSelectedNode(null)} className="text-gray-500 hover:text-white cursor-pointer"><Share size={14} className="rotate-45" /></button>
               </div>
               <p className="text-xs text-gray-400 mb-4 leading-relaxed bg-[#030712] p-3 rounded-lg border border-slate-800">
                 High-leverage node within isolated sectors. Monitoring structural anomaly frequency and baseline volatility.
               </p>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                   <span className="text-gray-500">Connections</span>
                   <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded shadow-inner">{selectedNode.connections}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-500">Pulse Status</span>
                   <span className="font-mono text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> STABLE</span>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Graph Legend Overlay */}
        <div className="absolute bottom-6 left-6 flex flex-wrap max-w-sm gap-3 text-[10px] font-mono text-gray-400 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-xl pointer-events-none shadow-lg">
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-400" /> Government</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-400" /> Corporation</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Supply Chain</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400" /> Treaty</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400" /> Infra Core</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" /> Threat/Crisis</div>
        </div>
      </div>

      {/* Network Metrics Sidebar */}
      <div className="lg:col-span-1 space-y-4">
         <div className="bg-[#030712] border border-slate-800 rounded-3xl p-5">
           <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Topology Stats</h4>
           <div className="space-y-3">
             <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-xs text-gray-300">Total Nodes</span>
                <span className="font-mono text-white text-sm font-bold">{data?.topologyStats?.totalNodes || "..."}</span>
             </div>
             <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-xs text-gray-300">Active Edges</span>
                <span className="font-mono text-indigo-300 text-sm font-bold">{data?.topologyStats?.activeEdges || "..."}</span>
             </div>
             <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-xs text-gray-300">Density Score</span>
                <span className="font-mono text-white text-sm">{data?.topologyStats?.densityScore || "..."}</span>
             </div>
             <div className="flex justify-between items-center pb-2">
                <span className="text-xs text-gray-300">Centrality Drift</span>
                <span className="font-mono text-emerald-400 text-sm">{data?.topologyStats?.centralityDrift || "..."}</span>
             </div>
           </div>
         </div>

         <div className="bg-[#030712] border border-slate-800 rounded-3xl p-5 flex-1 h-[360px] flex flex-col">
           <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Query Subgraph</h4>
           <p className="text-xs text-gray-500 leading-relaxed mb-4">
             Extract localized networks using semantic criteria or direct node ID matching.
           </p>
           
           <div className="space-y-3 mb-4">
             <div className="relative">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Entity or System (e.g., Gov Hub)..." 
                 value={query.entity} 
                 onChange={e => {
                   setQuery({...query, entity: e.target.value});
                   if (!e.target.value) setHighlightedNodes(new Set());
                 }} 
                 className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs py-2 pl-9 pr-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
               />
             </div>
             <select value={query.relationship} onChange={e => setQuery({...query, relationship: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs py-2 px-3 text-white focus:outline-none outline-none cursor-pointer">
               <option value="">Select Relationship Type...</option>
               <option value="financial">Financial Transfer</option>
               <option value="information">Information Flow</option>
               <option value="kinetic">Kinetic Control</option>
             </select>
             <button onClick={handleExtraction} disabled={actionState.status === 'loading'} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2">
                {actionState.status === 'loading' && actionState.id === 'extract' ? 'Generating Map...' : 'Generate Extraction'}
             </button>
           </div>
           {highlightedNodes.size > 0 && (
             <div className="mt-2 text-[10px] text-emerald-400 font-mono tracking-widest bg-emerald-500/10 border border-emerald-500/20 p-2 rounded">
                 {highlightedNodes.size} NODES MATCHED
             </div>
           )}
         </div>
      </div>

    </div>
  );
}

function CascadesView({ handleAction, actionState, layoutTrigger, data }: any) {
  const [trigger, setTrigger] = useState('');
  const [scenario, setScenario] = useState('');
  const [simPlaying, setSimPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const activeSim = (data?.simulations || []).find((s: any) => s.id === scenario) || (data?.simulations || [])[0];

  useEffect(() => {
    if (activeSim && !scenario) {
      setScenario(activeSim.id);
      setTrigger(activeSim.trigger);
    }
  }, [activeSim, scenario]);

  React.useEffect(() => {
    let interval: any;
    if (simPlaying && currentStep < activeSim.steps.length) {
      interval = setInterval(() => {
        setCurrentStep(s => s + 1);
      }, 1500);
    } else if (currentStep >= activeSim.steps.length) {
      setSimPlaying(false);
    }
    return () => clearInterval(interval);
  }, [simPlaying, currentStep, activeSim]);

  const handleScenarioChange = (e: any) => {
    const selected = (data?.simulations || []).find((s: any) => s.id === e.target.value);
    setScenario(e.target.value);
    if (selected) {
      setTrigger(selected.trigger);
    }
    setCurrentStep(0);
    setSimPlaying(false);
  };

  const computeSim = async () => {
    setCurrentStep(0);
    await handleAction('compute', 'Cascade Path Computed');
    setSimPlaying(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Simulation Setup */}
      <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[600px] flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
               <GitBranch size={18} className="text-rose-400" />
             </div>
             <div>
               <h3 className="text-xl font-bold tracking-tight text-white mb-1">Cascade Analysis</h3>
               <div className="text-[10px] text-gray-500 font-mono mt-0.5">AI-DRIVEN EVENT CHAIN VISUALIZER</div>
             </div>
          </div>
        </div>

        <div className="space-y-6 flex-1">
           <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
             <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 block">Scenario Library</label>
             <select value={scenario} onChange={handleScenarioChange} className="w-full bg-[#030712] border border-slate-700 text-white rounded p-3 text-xs mb-4 outline-none cursor-pointer">
               {(data?.simulations || []).map((s: any) => (
                 <option key={s.id} value={s.id}>{s.id.toUpperCase()} - {s.trigger}</option>
               ))}
             </select>
             
             <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 block">Trigger Event</label>
             <div className="flex items-center gap-2 bg-[#030712] border border-slate-700 rounded-lg p-2 relative">
                <input type="text" value={trigger} onChange={e => setTrigger(e.target.value)} className="w-full bg-transparent border-none text-sm text-white px-2 py-1 outline-none font-semibold" />
                <button onClick={computeSim} disabled={actionState.status === 'loading'} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded text-white text-xs font-bold transition-colors shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer disabled:opacity-50 tracking-wide">
                  {actionState.status === 'loading' && actionState.id === 'compute' ? '...' : (currentStep === 0 ? 'START' : 'RESTART')}
                </button>
             </div>
           </div>

           <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
             <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 block">Mitigation Variables</label>
             <div className="space-y-4">
                {(activeSim?.mitigations || []).map((m: any, i: number) => (
                  <Slider key={i} label={m.label} val={m.val} pct={m.pct} />
                ))}
             </div>
           </div>
        </div>

        {currentStep > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 border border-rose-500/30 bg-rose-500/10 rounded-xl backdrop-blur-md">
             <h4 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-2"><Activity size={14} className="animate-pulse" /> Severe Systemic Risk Detected</h4>
             <p className="text-[11px] text-rose-200/80 leading-relaxed font-sans">
               A seemingly isolated "{trigger}" propagates across structural boundaries, terminating in high-probability risk within the simulated horizon.
             </p>
          </motion.div>
        )}
      </div>

      {/* Traversal Results Feed */}
      <div className="space-y-4 flex flex-col h-[600px] relative">
         <div className="flex justify-between items-center px-2 pt-2 pb-2 border-b border-white/5">
           <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Simulated Propagation Path</h4>
           {currentStep > 0 && (
             <button onClick={() => setSimPlaying(!simPlaying)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold uppercase transition-colors cursor-pointer">
               {simPlaying ? 'Pause' : 'Play'}
             </button>
           )}
         </div>
         
         <div className="overflow-y-auto pr-2 scrollbar-none flex-1 pb-10">
           <div className="relative space-y-4 pl-4 before:absolute before:inset-y-4 before:left-[19px] before:w-px before:bg-slate-800">
              <AnimatePresence>
                {(activeSim?.steps || []).slice(0, currentStep).map((step: any, idx: number) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <CascadeStep 
                       step={idx + 1}
                       time={step.time}
                       title={step.title}
                       desc={step.desc}
                       color={step.color}
                       isWarning={step.isWarning}
                       isFinal={step.isFinal}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {simPlaying && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-8 py-4 text-xs font-mono text-indigo-400 animate-pulse flex items-center gap-3">
                   <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div></div>
                   Calculating node propagation...
                 </motion.div>
              )}
           </div>
         </div>
      </div>

    </div>
  );
}

function TargetNode({ label, id, removable }: any) {
  return (
    <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-2 py-1.5 rounded-md">
      <Zap size={12} className="text-indigo-400" />
      <span className="text-xs font-semibold text-indigo-100">{label}</span>
      <span className="text-[9px] font-mono text-indigo-400/70 border border-indigo-400/20 px-1 rounded">{id}</span>
    </div>
  )
}

function Slider({ label, val, pct = 50 }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-mono font-medium text-white">{val}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className="h-full bg-slate-400 rounded-full" />
      </div>
    </div>
  )
}

function CascadeStep({ step, time, title, desc, color, isWarning, isFinal }: any) {
  const getColors = () => {
    switch(color) {
      case 'orange': return 'bg-orange-500 border-orange-500 text-orange-200 bg-orange-500/10 box-shadow-[0_0_10px_rgba(249,115,22,0.3)]';
      case 'blue': return 'bg-pink-500 border-pink-500 text-pink-200 bg-pink-500/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
      case 'amber': return 'bg-amber-500 border-amber-500 text-amber-200 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
      case 'rose': return 'bg-rose-500 border-rose-500 text-rose-200 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
      case 'emerald': return 'bg-emerald-500 border-emerald-500 text-emerald-200 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
      default: return 'bg-slate-500 border-slate-500 text-slate-200 bg-slate-500/10';
    }
  }

  const chunks = getColors().split(' ');
  const dotColor = chunks[0];
  const borderColor = chunks[1];
  const textColor = chunks[2];
  const bg = chunks[3];
  const shadow = chunks[4] || '';

  return (
    <div className="relative pl-8 pb-5 group">
       <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full z-10 box-content border-[3px] border-[#030712] ${dotColor} ${shadow}`} />
       
       <div className={`p-4 rounded-xl border transition-colors ${borderColor.replace('border-', 'border-').concat('/40')} ${bg} hover:bg-opacity-20`}>
         <div className="flex justify-between items-start mb-2">
            <h5 className={`text-sm font-bold flex items-center gap-2 ${textColor.replace('text-', 'text-').concat(' text-white')}`}>
              {title}
              {isWarning && <Activity size={14} className="text-rose-400 animate-pulse" />}
              {isFinal && <Shield size={14} className="text-rose-500" />}
            </h5>
            <span className="text-[10px] font-mono text-gray-400 px-1.5 py-0.5 border border-slate-700 bg-black/60 rounded shadow-inner">{time}</span>
         </div>
         <p className="text-xs text-gray-400 leading-relaxed font-sans">{desc}</p>
       </div>
    </div>
  )
}

