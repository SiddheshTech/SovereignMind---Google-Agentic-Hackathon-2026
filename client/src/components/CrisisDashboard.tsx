import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Activity, AlertOctagon, PhoneCall, Radio, Crosshair, Users, Expand, Clock, CheckCircle2, ChevronRight, FileWarning, MessageSquareWarning, ArrowUpRight, Maximize2, BrainCircuit, Scale, FileText, ArrowRight, Gavel, FileCheck, Check, Sparkles, X, Download } from 'lucide-react';

const PALETTE = {
  rose: '#F43F5E',
  amber: '#F59E0B',
  orange: '#FF6900',
  emerald: '#10B981',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  darkBg: '#030712',
  slate: '#0F172A',
  uiBorder: '#1E293B',
};

interface CrisisDashboardProps {
  key?: string;
  initialTab?: 'active-incidents' | 'ops-center' | 'decision-room' | 'cabinet-room';
}

export function CrisisDashboard({ initialTab = 'active-incidents' }: CrisisDashboardProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [actionState, setActionState] = useState<{ id: string; status: 'idle' | 'loading' | 'success', message?: string}>( { id: '', status: 'idle' } );

  const handleAction = async (id: string, customMessage?: string) => {
    setActionState({ id, status: 'loading', message: customMessage });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setActionState({ id, status: 'success', message: customMessage });
      setTimeout(() => setActionState({ id: '', status: 'idle', message: undefined }), 2000);
    } catch {
      setActionState({ id: '', status: 'idle', message: undefined });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {actionState.status === 'success' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 p-3 px-6 rounded-xl bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] text-white text-xs font-mono font-bold tracking-widest uppercase z-50 animate-fade-in border border-red-400">
           {actionState.message || 'CRITICAL BROADCAST DEPLOYED'}
        </div>
      )}
      
      {/* Sub-header controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
          {['active-incidents', 'ops-center', 'decision-room', 'cabinet-room'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                activeTab === t 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.replace('-', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-red-950/40 border border-red-500/30 rounded-lg flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <span className="text-[10px] font-mono text-red-300 uppercase tracking-widest">Defcon: 3</span>
          </div>
          <button 
             onClick={() => handleAction('alert')} 
             disabled={actionState.status === 'loading'}
             className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-lg shadow-red-500/20 disabled:opacity-50"
          >
            <Radio size={14} className={actionState.status === 'loading' && actionState.id === 'alert' ? 'animate-ping' : ''} /> 
            {actionState.status === 'loading' && actionState.id === 'alert' ? 'Broadcasting...' : 'Alert Broadcast'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'active-incidents' && (
          <motion.div
            key="active-incidents"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ActiveIncidentsView handleAction={handleAction} actionState={actionState} />
          </motion.div>
        )}
        {activeTab === 'ops-center' && (
          <motion.div
            key="ops-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <OperationsCenterView handleAction={handleAction} actionState={actionState} />
          </motion.div>
        )}
        {activeTab === 'decision-room' && (
          <motion.div
            key="decision-room"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <DecisionRoomView handleAction={handleAction} />
          </motion.div>
        )}
        {activeTab === 'cabinet-room' && (
          <motion.div
            key="cabinet-room"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <CabinetRoomView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActiveIncidentsView({ handleAction, actionState }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* High Priority Incidents */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-300 flex items-center gap-2 mb-2">
          <AlertOctagon size={16} className="text-rose-500" /> Triage Vectors
        </h3>

        <IncidentCard 
          id="INC-9481"
          title="Regional Grid Collapse & Substation Alpha"
          time="T-minus 14 mins"
          desc="Multiple cascading faults detected along transmission corridor C. Weather anomaly confirmed as primary stressor."
          severity="Critical"
          status="Uncontained"
          responders={8}
        />
        <IncidentCard 
          id="INC-9480"
          title="Logistics Route Blockade"
          time="T-minus 42 mins"
          desc="Critical supply route blocked due to kinetic interference. Affecting medical delivery window."
          severity="High"
          status="Mitigating"
          responders={3}
        />
        <IncidentCard 
          id="INC-9479"
          title="Data Integrity Fluctuation"
          time="T-minus 1.4 hrs"
          desc="Localized ledger desync occurring on Pacific cluster. Node consensus falling below 80%."
          severity="Medium"
          status="Containing"
          responders={1}
        />
      </div>

      {/* Global Status Board */}
      <div className="lg:col-span-1 bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[500px]">
        <h3 className="text-sm font-semibold text-white tracking-wide mb-6">Threat Topology</h3>
        
        <div className="space-y-5">
           <StatusMetric label="Total Active Disruptions" val="3" max={10} color="rose" />
           <StatusMetric label="Available Responder Units" val="14" max={20} color="blue" />
           <StatusMetric label="Automated Contains" val="8" max={10} color="emerald" />
           <StatusMetric label="Comms Network Integrity" val="94%" max={100} color="emerald" isPercent />
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800">
           <button onClick={() => handleAction('map', 'Map Data Successfully Loaded')} disabled={actionState.status === 'loading'} className="w-full py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50">
             <Expand size={14} /> 
             {actionState.status === 'loading' && actionState.id === 'map' ? 'Loading Tactical Map...' : 'View Tactical Map'}
           </button>
        </div>
      </div>
    </div>
  );
}

function IncidentCard({ id, title, time, desc, severity, status, responders }: any) {
  const getColors = () => {
    switch(severity) {
      case 'Critical': return 'border-rose-500/50 bg-rose-500/10 text-rose-300';
      case 'High': return 'border-orange-500/50 bg-orange-500/10 text-orange-300';
      default: return 'border-amber-500/50 bg-amber-500/10 text-amber-300';
    }
  };

  return (
    <div className="bg-[#030712] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
           <div className={`px-2 py-1 border rounded text-[10px] font-bold font-mono tracking-wider uppercase ${getColors()}`}>
             {severity}
           </div>
           <span className="text-gray-500 text-[10px] font-mono">{id}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-mono">
          <Clock size={12} /> {time}
        </div>
      </div>

      <h4 className="text-base font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">{title}</h4>
      <p className="text-xs text-gray-400 leading-relaxed mb-5 line-clamp-2">{desc}</p>

      <div className="flex items-center justify-between text-[11px] font-medium border-t border-slate-800 pt-4">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 text-white">
             <Activity size={14} className={status === 'Uncontained' ? 'text-rose-500' : 'text-pink-500'} />
             {status}
           </div>
           <div className="flex items-center gap-1.5 text-gray-400">
             <Users size={14} className="text-indigo-400" />
             {responders} units deployed
           </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}

function StatusMetric({ label, val, max, color, isPercent }: any) {
  const getHex = () => {
    if (color === 'rose') return PALETTE.rose;
    if (color === 'blue') return PALETTE.blue;
    if (color === 'emerald') return PALETTE.emerald;
    return PALETTE.amber;
  };
  const hex = getHex();
  const width = typeof val === 'number' && typeof max === 'number' 
     ? (val / max) * 100 
     : parseInt(val as string);

  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-semibold text-gray-400">{label}</span>
        <span className="text-sm font-mono font-bold text-white">{val}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${width}%`, backgroundColor: hex }} />
      </div>
    </div>
  )
}

function OperationsCenterView({ handleAction, actionState }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      
      {/* Tactical Map Placeholder */}
      <div className="lg:col-span-2 bg-[#030712] border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4 relative z-10">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
               <Crosshair size={16} className="text-pink-400" />
             </div>
             <div>
               <h3 className="text-sm font-bold text-white tracking-wide">Live Tactical Overlay</h3>
               <span className="text-[10px] text-gray-500 font-mono">SECTOR COMMAND</span>
             </div>
           </div>
           <button className="p-2 bg-slate-900 rounded-lg text-gray-400 hover:text-white border border-slate-800 transition-colors">
             <Maximize2 size={16} />
           </button>
        </div>

        {/* Fake Map visuals */}
        <div className="absolute inset-0 top-20 flex items-center justify-center z-0 opacity-40">
           <div className="relative w-full h-full" style={{ 
             background: `radial-gradient(circle at 50% 50%, ${PALETTE.slate} 0%, transparent 80%), repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px)` 
           }}>
             
             {/* Map nodes */}
             <div className="absolute top-[30%] left-[40%] text-rose-500">
                <div className="w-4 h-4 rounded-full bg-rose-500/20 animate-ping absolute" />
                <div className="w-4 h-4 rounded-full bg-rose-500/50 absolute z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
                </div>
             </div>
             
             {/* Map connection lines */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
               <path d="M 40% 30% L 60% 50%" stroke={PALETTE.blue} strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
               <path d="M 60% 50% L 50% 70%" stroke={PALETTE.blue} strokeWidth="2" className="opacity-80 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
             </svg>

             {/* Secure node */}
             <div className="absolute top-[50%] left-[60%] flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10" />
                <span className="text-[10px] font-mono text-pink-300 mt-1 bg-black/50 px-1 rounded">HQ_NODE_1</span>
             </div>
           </div>
        </div>

        <div className="mt-auto relative z-10 grid grid-cols-3 gap-4">
           <OpsMiniMetric val="+12" label="New Vectors" color="rose" />
           <OpsMiniMetric val="1.4M" label="Affected Pop" color="amber" />
           <OpsMiniMetric val="Secure" label="C2 Link" color="emerald" />
        </div>
      </div>

      {/* Comms & Coordination Panel */}
      <div className="lg:col-span-1 space-y-6 flex flex-col h-full">

        <div className="bg-[#030712] border border-slate-800 rounded-3xl p-5 flex flex-col gap-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Active Channels</h4>
          <div className="space-y-2">
            <OpsChannel name="SECURE: Regional Command" active status="Live" />
            <OpsChannel name="LOGISTICS: Transit Hub B" active status="Live" />
            <OpsChannel name="MEDICAL: Triage Unit 4" active={false} status="Encrypted" />
          </div>
          <button onClick={() => handleAction('channel', 'Secure Channel Established')} disabled={actionState.status === 'loading'} className="w-full py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 hover:bg-slate-800 cursor-pointer disabled:opacity-50">
            <PhoneCall size={14} /> 
            {actionState.status === 'loading' && actionState.id === 'channel' ? 'Connecting...' : 'Open Channel'}
          </button>
        </div>

        <div className="bg-[#030712] border border-slate-800 rounded-3xl p-5 flex-1 flex flex-col overflow-hidden">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Command Log</h4>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <LogEntry time="18:42" msg="Authorized rerouting of medical supplies to Sector 4 Hub." type="authoritative" />
            <LogEntry time="18:35" msg="Automated failover engaged for Substation Alpha." type="automated" />
            <LogEntry time="18:12" msg="Kinetic impact confirmed on transit corridor C. Deploying rapid response." type="critical" />
            <LogEntry time="17:55" msg="Elevated anomaly patterns detected in grid frequency." type="warning" />
          </div>
          <div className="pt-4 border-t border-slate-800 mt-4 relative">
            <input type="text" placeholder="Transmit direct order..." className="w-full bg-slate-900 border border-slate-700 rounded-lg text-xs text-white px-3 py-2 outline-none focus:border-pink-500" />
          </div>
        </div>

      </div>
    </div>
  );
}

function OpsMiniMetric({ val, label, color }: any) {
  const getColors = () => {
    switch(color) {
      case 'rose': return 'border-rose-500/20 bg-rose-500/5 text-rose-300';
      case 'amber': return 'border-amber-500/20 bg-amber-500/5 text-amber-300';
      default: return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300';
    }
  }

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-md flex flex-col justify-between ${getColors()}`}>
      <span className="text-[10px] font-mono uppercase font-bold tracking-widest opacity-80">{label}</span>
      <span className="text-2xl font-bold tracking-tight mt-1">{val}</span>
    </div>
  )
}

function OpsChannel({ name, active, status }: any) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${active ? 'bg-slate-800/50 border-slate-700' : 'bg-transparent border-slate-800/50'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
        <span className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-400'}`}>{name}</span>
      </div>
      <span className="text-[9px] font-mono text-gray-500 uppercase">{status}</span>
    </div>
  )
}

function LogEntry({ time, msg, type }: any) {
  const getIcon = () => {
    switch(type) {
      case 'authoritative': return <CheckCircle2 size={12} className="text-emerald-400" />;
      case 'automated': return <Activity size={12} className="text-pink-400" />;
      case 'critical': return <ShieldAlert size={12} className="text-rose-500" />;
      case 'warning': return <FileWarning size={12} className="text-amber-400" />;
    }
  }

  return (
    <div className="flex items-start gap-3">
      <span className="text-[10px] font-mono text-slate-500 shrink-0 select-none">{time}</span>
      <div className="flex-1 text-xs text-gray-300 leading-relaxed gap-2 items-start mt-[1px]">
        <div className="float-left mt-[2px] mr-2">
          {getIcon()}
        </div>
        <span className={type === 'critical' ? 'text-rose-200 font-medium font-sans' : 'font-sans'}>{msg}</span>
      </div>
    </div>
  )
}

function DecisionRoomView({ handleAction }: any) {
  const [showSummary, setShowSummary] = useState(false);

  const handleExport = (format: string) => {
    const reportSummary = `Executive Overview\n------------------\nInflation and core structural metrics have exceeded control limits...\n\nKey Findings\n------------\n- Deficits projected to rise 1.2% by Q3.\n- Energy supply restricted by 4% YoY.\n\nRisk Assessment\n---------------\nHigh domestic friction in lower quartiles.\n\nStrategic Impact\n----------------\nMoves towards austerity could damage secondary sector.\n\nRecommendations & Action Plan\n------------------------------\n1. Modify rate structures.\n2. Apply target subsidies.\n3. Expand defensive budget reserves.`;
    
    let content = '';
    let mimeType = 'text/plain';
    
    if (format === 'HTML') {
        content = `<html><body><h1>Executive Summary</h1><pre>${reportSummary}</pre></body></html>`;
        mimeType = 'text/html';
    } else {
        content = reportSummary;
        if (format === 'CSV') mimeType = 'text/csv';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-summary.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    handleAction('export-summary', `Summary exported as ${format}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px] relative">
      {showSummary && (
        <div className="absolute inset-0 z-50 bg-[#030712] border border-slate-700 rounded-3xl p-6 flex flex-col shadow-2xl">
           <div className="flex justify-between items-start mb-6">
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Executive Summary Report</h3>
               <p className="text-xs text-gray-400">Generated real-time draft for high-level officials.</p>
             </div>
             <button onClick={() => setShowSummary(false)} className="text-gray-500 hover:text-white cursor-pointer"><X size={20} /></button>
           </div>
           
           <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl p-6 text-sm text-gray-300 font-serif leading-relaxed mb-6">
              <h4 className="text-white font-sans font-bold mb-2">Executive Overview</h4>
              <p className="mb-4">The current systemic inflation combined with structural bottlenecks requires immediate cabinet-level intervention to prevent cascading effects on dependent sectors.</p>
              
              <h4 className="text-white font-sans font-bold mb-2">Key Findings</h4>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                 <li>Core inflation exceeds 4.5% target.</li>
                 <li>Energy reserves depleted by 12% in the last quarter.</li>
                 <li>Public sentiment indicates rising friction regarding cost of living.</li>
              </ul>
              
              <h4 className="text-white font-sans font-bold mb-2">Risk Assessment</h4>
              <p className="mb-4">Without targeted subsidies, the risk of uncoordinated domestic disruptions increases by an estimated 20% in the immediate term.</p>
              
              <h4 className="text-white font-sans font-bold mb-2">Strategic Impact</h4>
              <p className="mb-4">A blunt rate hike will contract GDP growth but stabilize currency valuation over the next 12 months. Precision is required to balance growth.</p>
              
              <h4 className="text-white font-sans font-bold mb-2">Recommendations & Action Plan</h4>
              <ol className="list-decimal pl-5 mb-4 space-y-1">
                 <li>Deploy Option B: Tiered Rate Adjustment.</li>
                 <li>Immediately execute emergency fuel allocations for critical services.</li>
                 <li>Draft a joint resolution for public distribution regarding fiscal stability measures.</li>
              </ol>
           </div>
           
           <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
             <button onClick={() => handleAction('save-report', 'Report Saved')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold cursor-pointer">Save Report</button>
             <button onClick={() => handleAction('share-report', 'Report Shared with Cabinet')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold cursor-pointer">Share Report</button>
             <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded text-xs font-bold cursor-pointer"><Download size={14}/> PDF</button>
             <button onClick={() => handleExport('DOCX')} className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded text-xs font-bold cursor-pointer"><Download size={14}/> DOCX</button>
             <button onClick={() => handleExport('HTML')} className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded text-xs font-bold cursor-pointer"><Download size={14}/> HTML</button>
           </div>
        </div>
      )}

      {/* AI Policy Generator */}
      <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 flex flex-col">
        <h3 className="text-xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
          <BrainCircuit className="text-purple-400" size={20} /> AI Policy Generator
        </h3>
        <p className="text-xs text-gray-500 mb-6">Strategic options synthesis for highest-level decision makers.</p>
        
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
             <input type="text" defaultValue="Reduce inflation" className="w-full bg-slate-900 border border-slate-700 rounded-xl text-sm text-white px-4 py-3 outline-none focus:border-purple-500" />
             <button onClick={() => handleAction('ai-gen', 'Policies Generated Successfully')} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors cursor-pointer">
               <Sparkles size={14} />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-none">
           {/* Option 1 */}
           <div className="p-4 rounded-xl border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 cursor-pointer transition-colors" onClick={() => handleAction('select-a', 'Option A Selected')}>
             <div className="flex items-start justify-between mb-2">
               <h4 className="text-sm font-bold text-white">Interest Rate Adjustment</h4>
               <span className="text-[10px] font-mono text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">OPTION A</span>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed">Central bank intervention to dynamically adjust base rates, aiming for a 0.5% contraction over 6 months to curb monetary velocity.</p>
           </div>
           
           {/* Option 2 */}
           <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer transition-colors" onClick={() => handleAction('select-b', 'Option B Selected')}>
             <div className="flex items-start justify-between mb-2">
               <h4 className="text-sm font-bold text-white">Subsidy Reform</h4>
               <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">OPTION B</span>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed">Targeted removal of broad energy subsidies, reallocating 30% of savings to direct welfare, cooling artificial consumption demand.</p>
           </div>

           {/* Option 3 */}
           <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 cursor-pointer transition-colors" onClick={() => handleAction('select-c', 'Option C Selected')}>
             <div className="flex items-start justify-between mb-2">
               <h4 className="text-sm font-bold text-white">Import Diversification</h4>
               <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">OPTION C</span>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed">Reducing tariffs on regional bloc imports to lower consumer staple prices, accepting short-term deficits for long-term price stability.</p>
           </div>
        </div>
      </div>

      {/* Outcome Comparator */}
      <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 flex flex-col">
        <h3 className="text-xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
          <Scale className="text-sky-400" size={20} /> Outcome Comparator
        </h3>
        <p className="text-xs text-gray-500 mb-6">Side-by-side predictive modeling.</p>
        
        <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-[10px] uppercase tracking-wider text-gray-400 border-b border-slate-800 font-mono">Metric</th>
                <th className="p-3 text-[10px] uppercase tracking-wider text-pink-400 border-b border-slate-800 font-bold min-w-[100px]">Option A<br/>Rate Adj.</th>
                <th className="p-3 text-[10px] uppercase tracking-wider text-emerald-400 border-b border-slate-800 font-bold min-w-[100px]">Option B<br/>Subsidy Ref.</th>
                <th className="p-3 text-[10px] uppercase tracking-wider text-orange-400 border-b border-slate-800 font-bold min-w-[100px]">Option C<br/>Diversify</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-semibold text-gray-300 border-b border-slate-800/50">Cost</td>
                <td className="p-3 text-white font-mono border-b border-slate-800/50">Low</td>
                <td className="p-3 text-white font-mono border-b border-slate-800/50">Medium</td>
                <td className="p-3 text-white font-mono border-b border-slate-800/50">High</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-semibold text-gray-300 border-b border-slate-800/50">Risk</td>
                <td className="p-3 text-emerald-400 border-b border-slate-800/50">Low</td>
                <td className="p-3 text-rose-400 border-b border-slate-800/50">High</td>
                <td className="p-3 text-amber-400 border-b border-slate-800/50">Medium</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-semibold text-gray-300 border-b border-slate-800/50">Public Reaction</td>
                <td className="p-3 text-amber-400 border-b border-slate-800/50">Negative</td>
                <td className="p-3 text-rose-400 border-b border-slate-800/50">Severe</td>
                <td className="p-3 text-emerald-400 border-b border-slate-800/50">Positive</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-semibold text-gray-300 border-b border-slate-800/50">Constitutional</td>
                <td className="p-3 text-white border-b border-slate-800/50 flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Legal</td>
                <td className="p-3 text-white border-b border-slate-800/50 flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Exec. Ord.</td>
                <td className="p-3 text-white border-b border-slate-800/50 flex items-center gap-1"><AlertOctagon size={12} className="text-amber-500" /> Vote Reqd</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-semibold text-gray-300 border-b border-slate-800/50">Long-term</td>
                <td className="p-3 text-white border-b border-slate-800/50">Stagnation</td>
                <td className="p-3 text-white border-b border-slate-800/50">Struct. Fix</td>
                <td className="p-3 text-white border-b border-slate-800/50">Dependency</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
           <button onClick={() => setShowSummary(true)} className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] cursor-pointer">
             Draft Executive Summary
           </button>
        </div>
      </div>
    </div>
  )
}

function CabinetRoomView() {
  return (
    <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[700px] flex flex-col">
       <div className="flex justify-between items-end mb-6">
         <div>
           <h3 className="text-xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
             <Users className="text-emerald-400" size={20} /> Cabinet Collaboration Room
           </h3>
           <p className="text-xs text-gray-500">Shared workspace for Ministers, Advisors, Analysts, and Agencies.</p>
         </div>
         <div className="flex -space-x-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#030712] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white z-10" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: 'cover' }} />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#030712] bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white z-20 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              +12
            </div>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          <div className="lg:col-span-2 flex flex-col overflow-hidden border border-slate-800 bg-slate-900/30 rounded-2xl">
             <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2"><FileText size={16} className="text-pink-400"/> Joint Resolution Draft</h4>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[9px] font-bold uppercase tracking-wider">Top Secret</span>
                  <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded text-[9px] font-bold uppercase tracking-wider">Live</span>
                </div>
             </div>
             <div className="flex-1 p-6 overflow-y-auto text-sm text-gray-300 font-serif leading-relaxed relative scrollbar-none">
                <p className="mb-4">
                  <span className="bg-emerald-500/20 text-emerald-200 border-b border-emerald-500 pb-0.5 cursor-pointer relative group">
                    Whereas the current inflationary pressures
                    <span className="absolute -top-6 left-0 bg-slate-800 text-[10px] px-2 text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap font-sans transition-opacity z-10">Min. of Finance: Agreed.</span>
                  </span> exceed the acceptable threshold of 4.5%, the Cabinet hereby invokes Article 12(b).
                </p>
                <p className="mb-4">
                  The Central Bank is directed to <span className="bg-pink-500/20 text-pink-200 border-b border-pink-500 pb-0.5 relative group cursor-pointer">
                    adjust the lending rate by 0.5%
                    <span className="absolute -top-6 left-0 bg-slate-800 text-[10px] px-2 text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap font-sans transition-opacity z-10">Advisor K: Recommend 0.75%.</span>
                  </span> effective immediately over the next two fiscal quarters.
                </p>
                <p>
                  Furthermore, <span className="bg-orange-500/20 text-orange-200 border-b border-orange-500 pb-0.5 relative group cursor-pointer">
                    energy subsidies will be recalibrated
                    <span className="absolute -top-6 left-0 bg-slate-800 text-[10px] px-2 text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap font-sans transition-opacity z-10">Min. of Energy: Need more time.</span>
                  </span> targeting industrial sectors, while shielding domestic households.
                </p>
                
                <div className="absolute top-[20%] right-[10%] flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-400 animate-pulse"></div>
                  <div className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded shadow-lg">Min. of Finance is typing...</div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-1 flex flex-col overflow-hidden border border-slate-800 bg-slate-900/30 rounded-2xl">
             <div className="p-3 border-b border-slate-800 bg-slate-900/80">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">Signal Chat</h4>
             </div>
             <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-none">
                <ChatMsg name="Chief Advisor" msg="If we push Option B, we lose the union vote." time="10:02" />
                <ChatMsg name="Min. of Finance" msg="We don't have capital for Option C without breaking the debt ceiling." time="10:04" />
                <ChatMsg name="Min. of Defense" msg="Internal security says Option B will trigger protests in Sector 4." time="10:06" />
                <ChatMsg name="AI Copilot" msg="Based on historical data, Option A combined with targeted subsidies offers the highest stability." time="10:07" isAI={true} />
             </div>
             <div className="p-3 border-t border-slate-800 bg-slate-900/80">
               <input type="text" placeholder="Send secure message..." className="w-full bg-slate-950 border border-slate-700 rounded-lg text-xs text-white px-3 py-2 outline-none focus:border-emerald-500" />
             </div>
          </div>

       </div>
    </div>
  )
}

function ChatMsg({ name, msg, time, isAI }: any) {
  return (
    <div className={`flex flex-col ${isAI ? 'items-end' : 'items-start'}`}>
      <span className="text-[10px] text-gray-500 mb-1">{name} • {time}</span>
      <div className={`p-3 rounded-2xl text-xs max-w-[90%] leading-relaxed ${isAI ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30 rounded-tr-none' : 'bg-slate-800 text-gray-300 rounded-tl-none'}`}>
        {isAI && <Sparkles size={10} className="inline-block mr-1 text-purple-400" />}
        {msg}
      </div>
    </div>
  )
}
