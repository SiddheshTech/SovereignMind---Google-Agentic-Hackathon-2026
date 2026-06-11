import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, ShieldCheck, AlertTriangle, TrendingDown, 
  Landmark, Users, HeartPulse, ActivitySquare, ArrowLeft,
  Activity, BarChart, FileText, Settings, Download
} from 'lucide-react';

const PALETTE = {
  purple: '#7F22FE',     
  orange: '#FF6900',     
  darkBrown: '#56280B',  
  sky: '#00B8DB',        
  deepTeal: '#073F4D',   
};

const METRIC_DATA = {
  'stability': { label: 'Civilization Stability', score: '83', trend: '+1.2%', icon: Globe, color: PALETTE.sky, desc: 'Overall measure of the civilization\'s ability to maintain status quo and endure macro forces.' },
  'resilience': { label: 'National Resilience', score: '76', trend: '+0.5%', icon: ShieldCheck, color: PALETTE.purple, desc: 'Capacity to absorb shocks and recover from infrastructure or governance failures.' },
  'crisis': { label: 'Crisis Probability', score: '18', trend: '-2.1%', icon: AlertTriangle, color: PALETTE.orange, desc: 'Likelihood of a multi-sector crisis occurring within the next 90 days.' },
  'governance': { label: 'Governance Effectiveness', score: '89', trend: '+3.4%', icon: Landmark, color: PALETTE.sky, desc: 'Efficiency of policy deployment, bureaucratic transparency, and rule of law.' },
  'economic': { label: 'Economic Fragility', score: '32', trend: '+4.0%', icon: TrendingDown, color: PALETTE.orange, desc: 'Exposure to supply chain disruptions, debt crises, or sudden inflation.' },
  'trust': { label: 'Institutional Trust', score: '64', trend: '-1.0%', icon: Users, color: '#10B981', desc: 'Public confidence in government, media, military, and financial institutions.' },
  'social': { label: 'Social Cohesion', score: '71', trend: '+0.2%', icon: HeartPulse, color: '#F43F5E', desc: 'Internal harmony, lack of polarization, and overall unity of the population.' },
  'emergency': { label: 'Emergency Readiness', score: '92', trend: '+0.1%', icon: ActivitySquare, color: PALETTE.purple, desc: 'Availability of strategic reserves, emergency response teams, and medical facilities.' },
};

export function MetricDetailDashboard({ metricId, onNavigate }: { metricId: string, onNavigate?: (id: string) => void }) {
  const data = METRIC_DATA[metricId as keyof typeof METRIC_DATA] || METRIC_DATA['stability'];
  const Icon = data.icon;
  const [exporting, setExporting] = useState(false);
  const [settings, setSettings] = useState({ live: true, social: true, anomaly: false });
  const [timeframe, setTimeframe] = useState('1M');

  const handleExport = async () => {
    setExporting(true);
    await new Promise(res => setTimeout(res, 800));
    setExporting(false);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-24 text-gray-200 font-sans">
       <button 
         onClick={() => onNavigate?.('dashboard')}
         className="text-xs font-mono font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
       >
         <ArrowLeft size={14} /> BACK TO COMMAND CENTER
       </button>

       {/* Header */}
       <div className="bg-[#030712] border rounded-3xl p-8 relative overflow-hidden" style={{ borderColor: `${PALETTE.deepTeal}80` }}>
          <div className="absolute top-0 right-0 w-96 h-96 blur-[100px] rounded-full pointer-events-none opacity-20" style={{ backgroundColor: data.color }} />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-slate-900 border" style={{ borderColor: `${data.color}40`, color: data.color }}>
                   <Icon size={40} />
                </div>
                <div>
                   <h2 className="text-3xl font-light tracking-tight text-white mb-2">{data.label}</h2>
                   <p className="text-sm text-gray-400 max-w-xl">{data.desc}</p>
                </div>
             </div>
             <div className="text-left md:text-right bg-slate-900/50 p-4 rounded-2xl border border-white/5 min-w-[200px]">
                <div className="text-[10px] font-mono uppercase text-gray-500 mb-1">Current Score</div>
                <div className="text-5xl font-light text-white tracking-tight flex items-baseline gap-2 md:justify-end">
                   {data.score} <span className="text-lg font-bold font-mono" style={{ color: data.color }}>/100</span>
                </div>
                <div className="text-xs font-mono mt-2" style={{ color: data.trend.startsWith('+') ? '#10B981' : '#F43F5E' }}>
                   {data.trend} (30d Trend)
                </div>
             </div>
          </div>
       </div>

       {/* Detailed Modules */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-[#030712] border rounded-3xl p-6 h-[400px] flex flex-col" style={{ borderColor: `${PALETTE.deepTeal}40` }}>
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2">
                     <Activity size={16} style={{ color: data.color }} /> Historical Trajectory
                   </h3>
                   <div className="flex gap-2">
                     <button onClick={() => setTimeframe('1W')} className={`px-3 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${timeframe === '1W' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>1W</button>
                     <button onClick={() => setTimeframe('1M')} className={`px-3 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${timeframe === '1M' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>1M</button>
                     <button onClick={() => setTimeframe('1Y')} className={`px-3 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${timeframe === '1Y' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>1Y</button>
                   </div>
                </div>
                <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-slate-900/30">
                   <div className="text-center text-sm font-mono text-gray-500">
                     [ AI Model generated graph placeholder ]<br/>
                     <span className="text-[10px] mt-2 block opacity-60">Plotting moving average for {timeframe}</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}40` }}>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-4">Leading Indicators</h3>
                    <ul className="space-y-3">
                       <li className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-900/50">
                         <span className="text-gray-300">Policy Adherence</span>
                         <span className="font-mono text-emerald-400">+2.1%</span>
                       </li>
                       <li className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-900/50">
                         <span className="text-gray-300">Budget Deficit</span>
                         <span className="font-mono text-rose-400">-0.8%</span>
                       </li>
                       <li className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-900/50">
                         <span className="text-gray-300">Public Sentiment</span>
                         <span className="font-mono text-gray-400">~0.0%</span>
                       </li>
                    </ul>
                 </div>
                 <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}40` }}>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-4">Risk Contributing Factors</h3>
                    <ul className="space-y-3">
                       <li className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-900/50">
                         <span className="text-gray-300">Resource Scarcity</span>
                         <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-rose-500 w-[70%]" /></div>
                       </li>
                       <li className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-900/50">
                         <span className="text-gray-300">External Conflicts</span>
                         <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[40%]" /></div>
                       </li>
                       <li className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-900/50">
                         <span className="text-gray-300">Market Volatility</span>
                         <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[15%]" /></div>
                       </li>
                    </ul>
                 </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}40` }}>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
                  <FileText size={16} style={{ color: data.color }} /> AI Narrative Report
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed bg-slate-950 p-4 rounded-xl border border-white/5">
                   The <strong className="text-white">{data.label}</strong> score is currently stable but shows underlying vulnerabilities. 
                   Recent systemic stress tests indicate an elevated exposure to rapid supply-chain contractions. AI-driven predictive modeling suggests implementing local redundancies within the next quarter to mitigate potential downward drifts in the index.
                </p>
                <button onClick={handleExport} disabled={exporting} className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 transition-colors uppercase text-[10px] font-mono tracking-widest font-bold text-white rounded-xl border border-white/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                  <Download size={12} className={exporting ? "animate-bounce" : ""} /> {exporting ? 'Exporting...' : 'Export Intelligence'}
                </button>
             </div>

             <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}40` }}>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
                  <Settings size={16} className="text-gray-400" /> Metric Settings
                </h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Live Telemetry Data</span>
                      <div onClick={() => toggleSetting('live')} className={`w-8 h-4 rounded-full relative cursor-pointer ${settings.live ? 'bg-emerald-500' : 'bg-slate-700'}`}><div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${settings.live ? 'right-0.5' : 'left-0.5'}`} /></div>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Include Social Scraping</span>
                      <div onClick={() => toggleSetting('social')} className={`w-8 h-4 rounded-full relative cursor-pointer ${settings.social ? 'bg-emerald-500' : 'bg-slate-700'}`}><div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${settings.social ? 'right-0.5' : 'left-0.5'}`} /></div>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Anomaly Alerts</span>
                      <div onClick={() => toggleSetting('anomaly')} className={`w-8 h-4 rounded-full relative cursor-pointer ${settings.anomaly ? 'bg-emerald-500' : 'bg-slate-700'}`}><div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${settings.anomaly ? 'right-0.5' : 'left-0.5'}`} /></div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
