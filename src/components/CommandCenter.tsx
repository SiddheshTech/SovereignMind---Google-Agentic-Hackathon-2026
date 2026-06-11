import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, ShieldCheck, AlertTriangle, Sparkles, TrendingUp, Cpu, 
  Zap, Droplet, Wheat, Sliders, Database, MapPin, RotateCw, 
  Search, ShieldAlert, FileText, ChevronRight, CheckCircle2, Play, Info,
  TrendingDown, Layers, Activity, Server, BarChart3, HelpCircle,
  Clock, ActivitySquare, Target, Users, Landmark, Scale, HeartPulse, Building2
} from 'lucide-react';

const PALETTE = {
  purple: '#7F22FE',     // Primary High-Tech accent
  orange: '#FF6900',     // Warning / Critical Action accent
  darkBrown: '#56280B',  // Shadow offsets
  sky: '#00B8DB',        // Strategic indicators
  deepTeal: '#073F4D',   // Deep framing lines
};

export function CommandCenter({ user, onNavigate }: { user?: any; onNavigate?: (id: string) => void }) {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-24 text-gray-200 font-sans">
      <ExecutiveIntelligenceBanner onNavigate={onNavigate} />
      
      <div>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 px-2">Civilization Health Metrics</h2>
        <CivilizationHealthMetrics onNavigate={onNavigate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         <div className="lg:col-span-8 space-y-6">
            <WorldIntelligenceMap onNavigate={onNavigate} />
            <AIStrategicBrief onNavigate={onNavigate} />
         </div>
         <div className="lg:col-span-4 space-y-6">
            <ActiveThreatFeed />
            <FutureRiskRadar onNavigate={onNavigate} />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <NationalRankings onNavigate={onNavigate} />
         <DecisionRecommendationEngine onNavigate={onNavigate} />
      </div>

      <div>
        <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 px-2">Intelligence Timeline</h2>
        <IntelligenceTimeline />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 1: Executive Intelligence Banner
// -------------------------------------------------------------
function ExecutiveIntelligenceBanner({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [actionState, setActionState] = useState<{ id: string; status: 'idle' | 'loading' | 'success'}>( { id: '', status: 'idle' } );

  const handleAction = async (id: string) => {
    setActionState({ id, status: 'loading' });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setActionState({ id, status: 'success' });
      setTimeout(() => setActionState({ id: '', status: 'idle' }), 2000);
    } catch {
      setActionState({ id: '', status: 'idle' });
    }
  };

  return (
    <div className="bg-[#030712] border rounded-3xl p-6 relative overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.6)]" style={{ borderColor: `${PALETTE.deepTeal}80` }}>
      {actionState.status === 'success' && (
        <div className="absolute top-0 left-0 right-0 p-1.5 text-center bg-[#7F22FE]/20 text-[#7F22FE] text-[10px] font-mono font-bold tracking-widest uppercase border-b border-[#7F22FE]/20 z-50 animate-pulse">
           Action Processed Successfully
        </div>
      )}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-900/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#00B8DB] to-[#7F22FE]" />
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-widest text-[#00B8DB] uppercase font-bold border border-[#00B8DB]/30 bg-[#00B8DB]/10 px-2 py-0.5 rounded">
              Global Stability Status
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00B8DB] animate-pulse" />
          </div>
          <h2 className="text-4xl font-light tracking-tight text-white flex items-baseline gap-3">
            Stable <span className="text-2xl font-bold font-mono text-[#00B8DB]">72/100</span>
          </h2>
        </div>

        <div className="flex-1 w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 gap-4 px-0 lg:px-8 border-y lg:border-y-0 lg:border-x border-white/10 py-4 lg:py-0">
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase">Trend (30d)</div>
            <div className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1">↑ +2.1%</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase">Active Threats</div>
            <div className="text-lg font-bold text-[#FF6900] mt-1">17</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase">Critical Nations</div>
            <div className="text-lg font-bold text-rose-500 mt-1">4</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase">Emerging Risks</div>
            <div className="text-lg font-bold text-amber-400 mt-1">11</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
          <button type="button" onClick={() => onNavigate?.('view-full-intelligence')} className="w-full sm:w-auto px-4 py-2.5 bg-[#030712] border text-white text-xs font-bold rounded-xl transition-all hover:bg-white/5 cursor-pointer" style={{ borderColor: `${PALETTE.deepTeal}80` }}>
            View Full Intelligence
          </button>
          <button type="button" onClick={() => onNavigate?.('ai-strategic-briefing')} className="w-full sm:w-auto px-4 py-2.5 bg-[#7F22FE] text-white text-xs font-bold rounded-xl transition-all shadow-lg hover:shadow-xl shadow-purple-500/20 flex items-center justify-center gap-1.5 cursor-pointer">
            <Sparkles size={14} /> AI Strategic Briefing
          </button>

          {/* Hidden Advanced Controls */}
          <div className="relative group/controls">
            <button type="button" className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer">
              <Sliders size={14} />
            </button>
            <div className="absolute right-0 top-12 w-56 bg-slate-900/95 backdrop-blur border rounded-xl p-2 opacity-0 invisible group-hover/controls:opacity-100 group-hover/controls:visible transition-all z-50 shadow-xl" style={{ borderColor: `${PALETTE.deepTeal}50` }}>
               <div className="text-[10px] font-mono text-gray-500 uppercase px-2 py-1">Scenario Mode</div>
               <button onClick={() => onNavigate?.('scenario-mode')} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded cursor-pointer">Pandemic Model</button>
               <button onClick={() => onNavigate?.('scenario-mode')} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded cursor-pointer">War & Conflict Model</button>
               <button onClick={() => onNavigate?.('scenario-mode')} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded cursor-pointer">Economic Collapse</button>
               <div className="my-1 border-t border-white/5" />
               <div className="text-[10px] font-mono text-gray-500 uppercase px-2 py-1">AI Intelligence</div>
               <button onClick={() => handleAction('toggle')} disabled={actionState.status === 'loading'} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded disabled:opacity-50 cursor-pointer">
                 {actionState.id === 'toggle' && actionState.status === 'loading' ? 'Processing...' : 'Toggle Confidence Layer'}
               </button>
               <button onClick={() => handleAction('explain')} disabled={actionState.status === 'loading'} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded disabled:opacity-50 cursor-pointer">
                 {actionState.id === 'explain' && actionState.status === 'loading' ? 'Processing...' : 'Explain AI Logic Chains'}
               </button>
               <div className="my-1 border-t border-white/5" />
               <button onClick={() => handleAction('command')} disabled={actionState.status === 'loading'} className="w-full text-left px-3 py-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded disabled:opacity-50 cursor-pointer">
                 {actionState.id === 'command' && actionState.status === 'loading' ? 'Activating...' : 'Activate Command Mode'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 2: Civilization Health Metrics
// -------------------------------------------------------------
const METRICS = [
  { id: 'stability', label: 'Civilization Stability', score: '83', status: 'Stable', details: 'Institutions, Economy, Social', icon: Globe, color: PALETTE.sky },
  { id: 'resilience', label: 'National Resilience', score: '76', status: 'Optimal', details: 'Governance, Infra, Economy', icon: ShieldCheck, color: PALETTE.purple },
  { id: 'crisis', label: 'Crisis Probability', score: '18', status: 'Low Risk', details: 'Political, Economic, Climate', icon: AlertTriangle, color: PALETTE.orange },
  { id: 'governance', label: 'Governance Effectiveness', score: '89', status: 'High', details: 'Policy, Bureaucracy, Trust', icon: Landmark, color: PALETTE.sky },
  { id: 'economic', label: 'Economic Fragility', score: '32', status: 'Warning', details: 'Debt, Inflation, Trade', icon: TrendingDown, color: PALETTE.orange },
  { id: 'trust', label: 'Institutional Trust', score: '64', status: 'Moderate', details: 'Gov, Media, Military', icon: Users, color: '#10B981' },
  { id: 'social', label: 'Social Cohesion', score: '71', status: 'Stable', details: 'Polarization, Divide', icon: HeartPulse, color: '#F43F5E' },
  { id: 'emergency', label: 'Emergency Readiness', score: '92', status: 'Ready', details: 'Reserves, Hospitals, Teams', icon: ActivitySquare, color: PALETTE.purple },
];

function CivilizationHealthMetrics({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((m) => {
        const Icon = m.icon;
        const isSelected = activeMetric === m.id;
        return (
          <div 
            key={m.id}
            onClick={() => setActiveMetric(isSelected ? null : m.id)}
            className={`bg-[#030712] border rounded-2xl p-5 cursor-pointer transition-all group overflow-hidden relative ${isSelected ? 'ring-2 ring-white/10 scale-[1.02]' : 'hover:border-white/20'}`}
            style={{ borderColor: `${PALETTE.deepTeal}30` }}
          >
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none" style={{ backgroundColor: m.color }} />
            
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-semibold text-gray-300 w-2/3 leading-tight uppercase tracking-wider">{m.label}</h3>
              <div className="p-1.5 rounded-lg border bg-slate-950" style={{ borderColor: `${m.color}30`, color: m.color }}>
                <Icon size={14} />
              </div>
            </div>

            <div className="flex items-end gap-2 mb-2">
              <div className="text-3xl font-light text-white tracking-tight">{m.score}</div>
              <div className="text-[10px] font-mono font-bold uppercase pb-1" style={{ color: m.color }}>{m.status}</div>
            </div>

            <div className="text-[10px] text-gray-500 font-mono tracking-wide">{m.details}</div>
            
            <div 
              className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500 group-hover:text-white transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onNavigate?.(`metric-${m.id}`); }}
            >
              <span>EXPLORE METRIC</span>
              <ChevronRight size={10} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 3: World Intelligence Map
// -------------------------------------------------------------
function WorldIntelligenceMap({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const layers = ['Active Crises', 'Conflict Zones', 'Economic Instability Hotspots', 'Migration Pressure Zones', 'Climate Risk Regions', 'Supply Chain Disruptions'];
  const [activeLayer, setActiveLayer] = useState('Active Crises');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const points = [
    { id: 'US', x: '20%', y: '35%', color: PALETTE.purple, pulse: true },
    { id: 'BR', x: '32%', y: '65%', color: PALETTE.sky, pulse: false },
    { id: 'EU', x: '50%', y: '25%', color: PALETTE.sky, pulse: false },
    { id: 'NG', x: '52%', y: '52%', color: PALETTE.orange, pulse: true },
    { id: 'IN', x: '70%', y: '45%', color: PALETTE.orange, pulse: true },
    { id: 'CN', x: '78%', y: '35%', color: PALETTE.purple, pulse: false },
  ];

  return (
    <div className="bg-[#030712] border rounded-3xl p-6 relative flex flex-col h-[600px] shadow-[0_20px_45px_rgba(0,0,0,0.6)]" style={{ borderColor: `${PALETTE.deepTeal}50` }}>
      <div className="flex justify-between items-start mb-4 z-10">
        <div>
           <div className="text-[10px] font-mono tracking-widest text-[#00B8DB] uppercase mb-1">Interactive Sandbox</div>
           <h3 className="text-xl font-bold text-white tracking-tight">World Intelligence Map</h3>
        </div>
        <div className="flex flex-wrap gap-2 justify-end max-w-sm">
           {layers.map(layer => (
             <button
               type="button"
               key={layer}
               onClick={() => setActiveLayer(layer)}
               className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold transition-all border cursor-pointer ${activeLayer === layer ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-gray-500 border-transparent hover:text-white'}`}
             >
               {layer}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 relative mt-4 border border-white/5 rounded-2xl bg-[#010205] overflow-hidden group">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at center, #073F4D 0%, transparent 70%), linear-gradient(0deg, rgba(3,7,18,1) 0%, rgba(3,7,18,0) 100%)'
        }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {points.map(pt => (
          <div 
            key={pt.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: pt.x, top: pt.y }}
            onClick={() => setSelectedCountry(pt.id)}
          >
            {pt.pulse && <div className="absolute inset-0 rounded-full animate-ping opacity-40 size-6 -m-2" style={{ backgroundColor: pt.color }} />}
            <div className="w-2.5 h-2.5 rounded-full z-10 relative shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ backgroundColor: pt.color }} />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-white bg-black/50 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {pt.id} Node
            </div>
          </div>
        ))}

        {selectedCountry && (
          <div className="absolute top-4 right-4 w-64 bg-slate-900/90 backdrop-blur border rounded-xl p-4 shadow-2xl animate-fade-in" style={{ borderColor: `${PALETTE.deepTeal}50` }}>
             <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
               <h4 className="text-sm font-bold text-white uppercase tracking-wide">Nation Intelligence: {selectedCountry}</h4>
               <button type="button" onClick={() => setSelectedCountry(null)} className="text-gray-500 hover:text-white cursor-pointer">&times;</button>
             </div>
             <div className="space-y-3 text-xs mb-4">
                <div className="flex justify-between"><span className="text-gray-400">Stability:</span> <span className="text-white font-mono">81/100</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Resilience:</span> <span className="text-white font-mono">74/100</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Active Risk:</span> <span className="text-[#FF6900] font-mono">Drought</span></div>
             </div>
             <button type="button" onClick={() => onNavigate?.('nation-model')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-mono tracking-wider rounded border border-white/10 transition-colors uppercase cursor-pointer">
               Open Digital Twin &rarr;
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 4: AI Strategic Brief
// -------------------------------------------------------------
function AIStrategicBrief({ onNavigate }: { onNavigate?: (id: string) => void }) {
  return (
    <div className="bg-[#030712] border rounded-3xl p-6 relative" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
       <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-2">
           <Sparkles size={16} className="text-[#7F22FE]" />
           <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">AI Strategic Brief</h3>
         </div>
         <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Updates Daily</span>
       </div>

       <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl">
         <p className="text-sm text-gray-200 leading-relaxed">
           <span className="text-[#10B981] font-bold">India's</span> resilience score increased by <span className="text-emerald-400 font-bold">3.8%</span> due to infrastructure investments. However, water stress and urban migration pressures are projected to increase instability by <span className="text-amber-400 font-bold">2032</span>.
         </p>
       </div>

       <div className="mt-6 pt-4 border-t border-white/5">
         <button type="button" onClick={() => onNavigate?.('ai-strategic-briefing')} className="text-xs font-mono font-bold text-purple-400 hover:text-purple-300 cursor-pointer transition-colors uppercase flex items-center gap-1">
           Expand Full Analysis <ChevronRight size={12} />
         </button>
       </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 5: Active Threat Feed
// -------------------------------------------------------------
function ActiveThreatFeed() {
  const threats = [
    { title: 'Water Stress', trend: '↑', color: PALETTE.orange, time: 'Live' },
    { title: 'Food Inflation', trend: '↑', color: PALETTE.orange, time: '-2m' },
    { title: 'Migration Pressure', trend: '↑', color: PALETTE.purple, time: '-14m' },
    { title: 'Energy Shortage', trend: 'Warning', color: '#EF4444', time: '-1h' },
  ];

  return (
    <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
       <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
         <ShieldAlert size={14} className="text-[#FF6900]" /> Active Threat Feed
       </h3>
       <div className="space-y-3">
         {threats.map((t, i) => (
           <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:bg-slate-900 transition-colors cursor-pointer group">
             <div className="flex items-center gap-3">
               <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
               <span className="text-xs font-semibold text-gray-200 group-hover:text-white">{t.title}</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-[10px] font-mono font-bold" style={{ color: t.color }}>{t.trend}</span>
               <span className="text-[9px] font-mono text-gray-500 w-6 text-right">{t.time}</span>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 6: Future Risk Radar
// -------------------------------------------------------------
function FutureRiskRadar({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const risks = [
    { year: 2026, risk: 'Water Crisis', prob: '85%' },
    { year: 2027, risk: 'Political Instability', prob: '60%' },
    { year: 2028, risk: 'Economic Slowdown', prob: '72%' },
    { year: 2029, risk: 'Energy Crisis', prob: '45%' },
    { year: 2030, risk: 'Climate Shock', prob: '90%' },
  ];

  return (
    <div className="bg-[#030712] border rounded-3xl p-6 overflow-hidden relative group h-full" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
       <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-6 flex items-center gap-2">
         <Search size={14} className="text-[#00B8DB]" /> Future Risk Radar
       </h3>
       
       <div className="relative pl-6 border-l border-white/10 space-y-6">
         {risks.map((r, i) => (
           <div key={i} onClick={() => onNavigate?.('risk-radar')} className="relative cursor-pointer group/item">
             <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full border border-[#00B8DB] bg-[#030712] group-hover/item:bg-[#00B8DB] transition-colors pointer-events-none" />
             <div className="flex justify-between items-center">
               <div className="text-[10px] font-mono font-bold text-[#00B8DB] mb-1">{r.year}</div>
               <div className="text-[9px] font-mono text-gray-500 border border-white/10 px-1.5 rounded bg-white/5">PROB: {r.prob}</div>
             </div>
             <div className="text-xs text-gray-300 font-semibold group-hover/item:text-white transition-colors">{r.risk}</div>
           </div>
         ))}
       </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 7: National Rankings
// -------------------------------------------------------------
function NationalRankings({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const ranks = [
    { cat: 'Most Stable', n: 'Switzerland' },
    { cat: 'Most Resilient', n: 'Norway' },
    { cat: 'Fastest Recovering', n: 'Singapore' },
    { cat: 'Highest Trust', n: 'Denmark' },
  ];
  return (
    <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
      <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-6">National Rankings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ranks.map((r, i) => (
          <div key={i} onClick={() => onNavigate?.('metrics')} className="p-4 rounded-xl bg-slate-950 border border-white/5 hover:border-white/20 transition-all cursor-pointer">
            <div className="text-[9px] text-gray-500 font-mono uppercase mb-1">{r.cat}</div>
            <div className="text-base font-bold text-white flex justify-between items-center">
              {r.n}
              <ChevronRight size={14} className="text-gray-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 8: Decision Recommendation Engine
// -------------------------------------------------------------
function DecisionRecommendationEngine({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const decisions = [
    { text: 'Expand Water Infrastructure', impact: '+12% Resilience', icon: Droplet },
    { text: 'Increase Food Reserves', impact: '+8% Stability', icon: Wheat },
    { text: 'Strengthen Local Governance', impact: '+5% Trust', icon: Building2 },
    { text: 'Diversify Energy Imports', impact: '-14% Fragility', icon: Zap },
  ];

  return (
    <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2">
          <Cpu size={14} className="text-[#7F22FE]" /> Engine Recommendations
        </h3>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">LIVE COMPUTE</span>
      </div>
      
      <div className="space-y-3">
        {decisions.map((d, i) => {
          const Icon = d.icon;
          return (
            <div key={i} onClick={() => onNavigate?.('decision-room')} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-transparent hover:border-[#7F22FE]/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-950 rounded text-gray-400 group-hover:text-[#7F22FE]"><Icon size={14} /></div>
                <span className="text-xs font-semibold text-gray-200 group-hover:text-white">{d.text}</span>
              </div>
              <div className="text-[10px] font-mono font-bold text-emerald-400 mt-2 sm:mt-0 px-2 py-1 bg-emerald-400/10 rounded w-fit">
                {d.impact}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 9: Intelligence Timeline
// -------------------------------------------------------------
function IntelligenceTimeline() {
  const events = [
    { year: '2024', name: 'Global Floods', type: 'Climate' },
    { year: '2025', name: 'Inflation Spike', type: 'Economic' },
    { year: '2026', name: 'Migration Increase', type: 'Social' },
    { year: '2028', name: 'Water Stress Forecast', type: 'Predictive' },
    { year: '2031', name: 'Energy Crisis Risk', type: 'Predictive' },
  ];

  return (
    <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
        {events.map((e, i) => (
          <div key={i} className="min-w-[180px] p-4 rounded-xl border border-white/5 bg-slate-950 hover:bg-slate-900 transition-colors cursor-pointer cursor-ew-resize">
            <div className="text-[10px] font-mono text-[#00B8DB] mb-2">{e.year}</div>
            <div className="text-xs font-bold text-white mb-2">{e.name}</div>
            <div className="text-[9px] font-mono uppercase bg-white/5 text-gray-400 px-2 py-0.5 rounded w-max">{e.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
