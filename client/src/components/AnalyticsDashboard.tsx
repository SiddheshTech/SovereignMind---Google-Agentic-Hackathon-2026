import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Activity, FileText, Download, Filter, TrendingUp, TrendingDown, Target, Shield, Clock, BrainCircuit, LineChart, PieChart, Search, AlertCircle } from 'lucide-react';

const PALETTE = {
  emerald: '#10B981',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  amber: '#F59E0B',
  rose: '#F43F5E',
  slate: '#0F172A'
};

interface AnalyticsDashboardProps {
  key?: string;
  initialTab?: 'metrics' | 'scoring' | 'reports';
}


const GQL_GET_ANALYTICS = `
  query {
    getAnalyticsData {
      keyMetrics { title value trend trendDir statusColor }
      vectorData { value isAnomaly }
      scoring { label score baseline color }
      reports { id title desc date confidence category isCritical }
    }
  }
`;

const GQL_SIMULATE_ANALYTICS = `
  mutation {
    simulateAnalyticsUpdate {
      id
    }
  }
`;

const GQL_GENERATE_SYNTHESIS = `
  mutation GenerateSynthesis($domain: String!, $horizon: String!) {
    generateSynthesisReport(domain: $domain, horizon: $horizon) {
      id
    }
  }
`;

async function graphqlRequest(query: string, variables: any = {}) {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

export function AnalyticsDashboard({ initialTab = 'metrics' }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [actionState, setActionState] = useState<{ id: string; status: 'idle' | 'loading' | 'success'}>( { id: '', status: 'idle' } );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({ dateRange: '30d', region: 'Global', category: 'All' });

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const wsRef = React.useRef<WebSocket | null>(null);

  const fetchAnalytics = async () => {
    try {
      const res = await graphqlRequest(GQL_GET_ANALYTICS);
      if (res.getAnalyticsData) setAnalyticsData(res.getAnalyticsData);
    } catch (e) { console.error(e); }
  };

  React.useEffect(() => {
    fetchAnalytics();
    const wsUrl = window.location.protocol === 'https:' ? `wss://${window.location.host}/ws/analytics` : `ws://localhost:4000/ws/analytics`;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'ANALYTICS_DATA_UPDATED') {
            setAnalyticsData(msg.data);
          }
        } catch (err) {}
      };
    } catch (err) {}
    return () => wsRef.current?.close();
  }, []);


  const handleAction = async (id: string, cb?: () => Promise<void>) => {
    if (id === 'filter') {
      setShowFilterModal(true);
      return;
    }
    
    if (id === 'export') {
      setActionState({ id, status: 'loading' });
      await graphqlRequest(GQL_SIMULATE_ANALYTICS); // We will hijack export to simulate update for demonstration

      
      const csvContent = "Date,Metric,Value\n2026-06-01,Global Resilience Index,84.2\n2026-06-01,Supply Shock Delta,2.8\n2026-06-01,Systemic Volatility,14.1\n";
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${filters.dateRange}-${filters.region}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setActionState({ id, status: 'success' });
      setTimeout(() => setActionState({ id: '', status: 'idle' }), 2000);
      return;
    }

    setActionState({ id, status: 'loading' });
    try {
      if (cb) { await cb(); } else { await new Promise(resolve => setTimeout(resolve, 800)); }
      setActionState({ id, status: 'success' });
      setTimeout(() => setActionState({ id: '', status: 'idle' }), 2000);
    } catch {
      setActionState({ id: '', status: 'idle' });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 relative">
      {showFilterModal && (
        <div className="absolute top-16 right-0 z-50 w-80 bg-[#030712] border border-slate-700 rounded-xl p-4 shadow-2xl">
          <h4 className="text-white text-sm font-bold mb-4">Parametric Filters</h4>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Date Range</label>
              <select value={filters.dateRange} onChange={e => setFilters(f => ({...f, dateRange: e.target.value}))} className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 text-xs outline-none">
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last 1 Year</option>
              </select>
            </div>
            
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Region</label>
              <select value={filters.region} onChange={e => setFilters(f => ({...f, region: e.target.value}))} className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 text-xs outline-none">
                <option value="Global">Global</option>
                <option value="NA">North America</option>
                <option value="EU">Europe</option>
                <option value="APAC">Asia Pacific</option>
              </select>
            </div>
            
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Threat Category</label>
              <select value={filters.category} onChange={e => setFilters(f => ({...f, category: e.target.value}))} className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 text-xs outline-none">
                <option value="All">All Categories</option>
                <option value="Economic">Economic</option>
                <option value="Cyber">Cyber Security</option>
                <option value="Geopolitical">Geopolitical</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setShowFilterModal(false)} className="px-3 py-1.5 border border-slate-700 text-gray-400 text-xs font-bold rounded hover:bg-slate-800">Close</button>
            <button onClick={() => { setShowFilterModal(false); setActionState({ id: 'apply-filters', status: 'success' }); setTimeout(() => setActionState({ id: '', status: 'idle' }), 2000); }} className="px-3 py-1.5 bg-pink-600 text-white text-xs font-bold rounded hover:bg-pink-500">Apply Filters</button>
          </div>
        </div>
      )}

      {actionState.status === 'success' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-80 p-3 px-6 rounded-xl bg-pink-600 shadow-[0_0_30px_rgba(37,130,246,0.5)] text-white text-xs font-mono font-bold tracking-widest uppercase z-50 animate-fade-in border border-pink-400 text-center">
           Action Processed Successfully
        </div>
      )}
      {/* Sub-header controls */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => handleAction('filter')} className="flex items-center gap-2 px-3 py-1.5 bg-[#030712] border border-slate-700 text-gray-300 text-xs font-medium rounded-lg transition-colors cursor-pointer hover:bg-white/5">
            <Filter size={14} /> Parametric Filter
          </button>
          <button 
             onClick={() => handleAction('export')} 
             disabled={actionState.status === 'loading'}
             className="flex items-center gap-2 px-3 py-1.5 bg-pink-950/50 border border-pink-500/30 text-pink-300 text-xs font-medium rounded-lg transition-colors cursor-pointer hover:bg-pink-900/50 disabled:opacity-50"
          >
            <Download size={14} className={actionState.status === 'loading' && actionState.id === 'export' ? 'animate-bounce' : ''} /> 
            {actionState.status === 'loading' && actionState.id === 'export' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'metrics' && (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <MetricsView data={analyticsData} />
          </motion.div>
        )}
        {activeTab === 'scoring' && (
          <motion.div
            key="scoring"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ScoringView data={analyticsData} />
          </motion.div>
        )}
        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <IntelligenceReportsView data={analyticsData} actionState={actionState} handleAction={handleAction} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricsView({ data }: { data: any }) {
  const [chartType, setChartType] = useState<'line'|'bar'>('bar');
  const keyMetrics = data?.keyMetrics || [
    { title: "Global Resilience Index", value: "84.2", trend: "+1.4%", trendDir: "up", statusColor: "blue" },
    { title: "Supply Shock Delta", value: "2.8%", trend: "-0.5%", trendDir: "down", statusColor: "emerald" },
    { title: "Systemic Volatility", value: "14.1", trend: "+2.2%", trendDir: "up", statusColor: "amber" },
    { title: "Critical Node failures", value: "0", trend: "Nominal", trendDir: "neutral", statusColor: "emerald" }
  ];
  const vectorData = data?.vectorData || Array.from({length: 40}).map((_, i) => ({ value: 40 + Math.random() * 60, isAnomaly: i === 12 || i === 28 }));


  return (
    <div className="space-y-6">
      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {keyMetrics.map((m: any, idx: number) => (
          <MetricKeyCard key={idx} {...m} />
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 relative overflow-hidden h-[400px]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">Aggregated Vector Analysis</h3>
            <div className="text-[10px] text-gray-500 font-mono mt-1">TIME SERIES: T-30D</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setChartType('line')} className={`p-1.5 rounded-md transition-colors cursor-pointer ${chartType === 'line' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-gray-500 hover:bg-slate-800'}`}>
              <LineChart size={16} />
            </button>
            <button onClick={() => setChartType('bar')} className={`p-1.5 rounded-md transition-colors cursor-pointer ${chartType === 'bar' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-gray-500 hover:bg-slate-800'}`}>
              <BarChart3 size={16} />
            </button>
          </div>
        </div>

        {/* CSS Chart representation */}
        <div className="absolute inset-x-6 inset-y-24 flex items-end justify-between gap-2 opacity-80">
           {/* Grid */}
           <div className="absolute inset-0 flex flex-col justify-between pointer-events-none mb-6 border-b border-l border-slate-800">
             {[1,2,3,4].map(i => <div key={i} className="w-full h-px bg-slate-800/50" />)}
           </div>
           
           {vectorData.map((dp: any, i: number) => {
             const height = dp.value;
             const isAnomaly = dp.isAnomaly;
             return (
              <div key={i} className="relative w-full flex items-end h-[calc(100%-24px)] group">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-500 relative ${isAnomaly ? 'bg-rose-500' : 'bg-pink-500/60'}`}
                  style={chartType === 'bar' ? { height: `${height}%` } : { height: '2px', top: `calc(100% - ${height}%)` }}
                >
                  {chartType === 'bar' && <div className="absolute top-0 inset-x-0 h-1 bg-white/30 rounded-t-sm" />}
                </div>
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 border border-slate-800 transition-opacity">
                  Value: {height.toFixed(1)}
                </div>
              </div>
             )
           })}
        </div>
      </div>
    </div>
  );
}

function MetricKeyCard({ title, value, trend, trendDir, statusColor }: any) {
  const colorMap: Record<string, string> = {
    blue: PALETTE.blue,
    emerald: PALETTE.emerald,
    amber: PALETTE.amber,
    rose: PALETTE.rose
  };
  const color = colorMap[statusColor] || PALETTE.slate;
  
  return (
    <div className="bg-[#030712] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{title}</h4>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-slate-900 border border-slate-800`} style={{ color }}>
          {trendDir === 'up' && <TrendingUp size={12} />}
          {trendDir === 'down' && <TrendingDown size={12} />}
          {trendDir === 'neutral' && <Activity size={12} />}
          {trend}
        </div>
      </div>
    </div>
  )
}

function ScoringView({ data }: { data: any }) {
  const scoring = data?.scoring || [
    { label: "Institutional Viability", score: 92, baseline: 85, color: "emerald" },
    { label: "Energy Grid Resilience", score: 78, baseline: 80, color: "amber" },
    { label: "Financial Vector Stability", score: 64, baseline: 70, color: "rose" },
    { label: "Cyber Defense Posture", score: 88, baseline: 85, color: "blue" },
    { label: "Logistics & Supply Link", score: 94, baseline: 90, color: "emerald" }
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Scoring Index */}
      <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[500px]">
        <div className="flex items-center gap-2 mb-8">
          <Target size={18} className="text-pink-400" />
          <h3 className="text-sm font-semibold tracking-wide text-white">Dynamic Matrix Scoring</h3>
        </div>

        <div className="space-y-6">
           {scoring.map((s: any, idx: number) => (
             <ScoreBar key={idx} {...s} />
           ))}
        </div>
      </div>

      {/* Spider Chart abstraction */}
      <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[500px] flex flex-col justify-center relative items-center overflow-hidden">
        <h3 className="absolute top-6 left-6 text-sm font-semibold tracking-wide text-white">System Profile Symmetry</h3>
        
        <div className="relative w-64 h-64 mt-8 flex items-center justify-center">
          {/* Radial grid lines */}
          <div className="absolute inset-0 rounded-full border border-slate-700/50" />
          <div className="absolute inset-8 rounded-full border border-slate-700/50" />
          <div className="absolute inset-16 rounded-full border border-slate-700/50" />
          
          <div className="absolute w-px h-full bg-slate-700/50" />
          <div className="absolute w-full h-px bg-slate-700/50" />
          <div className="absolute w-px h-full bg-slate-700/50 rotate-45" />
          <div className="absolute w-full h-px bg-slate-700/50 rotate-45" />

          {/* Polygon representation */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
             <polygon 
               points={scoring.map((s: any, i: number) => {
                 const angle = (Math.PI * 2 * i) / scoring.length - Math.PI / 2;
                 const radius = (s.score / 100) * 45; // Max radius 45 to fit in viewBox
                 const x = 50 + radius * Math.cos(angle);
                 const y = 50 + radius * Math.sin(angle);
                 return `${x},${y}`;
               }).join(' ')} 
               fill="rgba(59, 130, 246, 0.2)" 
               stroke={PALETTE.blue} 
               strokeWidth="1.5" 
             />
             <polygon 
               points={scoring.map((s: any, i: number) => {
                 const angle = (Math.PI * 2 * i) / scoring.length - Math.PI / 2;
                 const radius = (s.baseline / 100) * 45; // Max radius 45
                 const x = 50 + radius * Math.cos(angle);
                 const y = 50 + radius * Math.sin(angle);
                 return `${x},${y}`;
               }).join(' ')} 
               fill="none" 
               stroke="rgba(255,255,255,0.2)" 
               strokeWidth="1" 
               strokeDasharray="2 2"
             />
          </svg>

          {/* Labels */}
          {scoring.map((s: any, i: number) => {
             const angle = (Math.PI * 2 * i) / scoring.length - Math.PI / 2;
             const radius = 55; // Labels outside the polygon
             const x = 50 + radius * Math.cos(angle);
             const y = 50 + radius * Math.sin(angle);
             return (
               <div key={i} className="absolute text-[10px] font-mono text-gray-400 text-center whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                 {s.label.split(' ')[0].toUpperCase()}
               </div>
             );
          })}
        </div>
      </div>

    </div>
  );
}

function ScoreBar({ label, score, color, baseline }: { label: string, score: number, color: string, baseline: number }) {
  const colorMap: Record<string, string> = {
    emerald: PALETTE.emerald,
    amber: PALETTE.amber,
    rose: PALETTE.rose,
    blue: PALETTE.blue
  };
  const hex = colorMap[color] || PALETTE.slate;
  
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-semibold text-gray-300">{label}</span>
        <div className="flex gap-3 text-[10px] font-mono items-center">
          <span className="text-gray-500">BSL: {baseline}</span>
          <span className="font-bold text-white text-sm" style={{ color: hex }}>{score}/100</span>
        </div>
      </div>
      <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div className="absolute top-0 bottom-0 left-0 bg-white/20 z-0" style={{ width: `${baseline}%` }} />
        <div className="absolute top-0 bottom-0 left-0 transition-all duration-1000 z-10" style={{ width: `${score}%`, backgroundColor: hex }} />
      </div>
    </div>
  );
}

function IntelligenceReportsView({ data, actionState, handleAction }: any) {
  const [domain, setDomain] = useState("All Systems Overview");
  const [horizon, setHorizon] = useState("180 Days (N_STEP)");

  const onGenerate = async () => {
    handleAction('generate', async () => {
      await graphqlRequest(GQL_GENERATE_SYNTHESIS, { domain, horizon });
    });
  };

  const reports = data?.reports || [
    { id: '1', title: "Macro-Economic Stress Analysis (Q3 Projection)", desc: "Analysis of compound effects of fiat volatility...", date: "2 hours ago", confidence: 94, category: "Strategic", isCritical: false }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Report Feed */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-sm font-semibold tracking-wide text-white">Synthesized Intelligence Streams</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Query reports..." 
              className="bg-[#030712] border border-slate-800 text-xs text-white rounded-lg pl-9 pr-4 py-2 w-64 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {reports.map((r: any) => (
          <ReportRow key={r.id} {...r} />
        ))}
      </div>

      {/* Automated Synthesis Generator */}
      <div className="lg:col-span-1 bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[600px] flex flex-col justify-between">
        <div>
           <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center mb-6">
             <BrainCircuit size={20} className="text-purple-400" />
           </div>
           <h3 className="text-lg font-bold text-white mb-2 tracking-tight">On-Demand Synthesis</h3>
           <p className="text-xs text-gray-400 leading-relaxed mb-6">
             Trigger a deep-dives synthesis report using current live variables, historical baselines, and active simulation parameters.
           </p>

           <div className="space-y-4 mb-8">
             <div className="flex flex-col gap-2">
               <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Focus Domain</label>
               <select value={domain} onChange={e => setDomain(e.target.value)} className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none">
                 <option value="All Systems Overview">All Systems Overview</option>
                 <option value="Supply Chain Integrity">Supply Chain Integrity</option>
                 <option value="Geopolitical Kinetic Risks">Geopolitical Kinetic Risks</option>
               </select>
             </div>
             <div className="flex flex-col gap-2">
               <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Time Horizon</label>
               <select value={horizon} onChange={e => setHorizon(e.target.value)} className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none">
                 <option value="180 Days (N_STEP)">180 Days (N_STEP)</option>
                 <option value="30 Days (Tactical)">30 Days (Tactical)</option>
                 <option value="3 Years (Strategic)">3 Years (Strategic)</option>
               </select>
             </div>
           </div>
        </div>

        <button 
          onClick={onGenerate} 
          disabled={actionState.status === 'loading'}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {actionState.status === 'loading' && actionState.id === 'generate' ? (
             <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : 'Generate Brief'}
        </button>
      </div>

    </div>
  );
}

function ReportRow({ title, desc, date, confidence, category, isCritical }: any) {
  return (
    <div className="bg-[#030712] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors group cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {isCritical ? (
            <div className="p-1.5 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-400">
              <AlertCircle size={14} />
            </div>
          ) : (
            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-md text-gray-400">
              <FileText size={14} />
            </div>
          )}
          <h4 className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors line-clamp-1">{title}</h4>
        </div>
        <div className="text-[10px] text-gray-500 font-mono whitespace-nowrap">{date}</div>
      </div>
      
      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">{desc}</p>
      
      <div className="flex items-center gap-4 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-pink-400">
          <Clock size={12} /> {category}
        </div>
        <div className="text-gray-500">
          <span className="text-white font-semibold">C-SCORE: {confidence}%</span>
        </div>
      </div>
    </div>
  );
}
