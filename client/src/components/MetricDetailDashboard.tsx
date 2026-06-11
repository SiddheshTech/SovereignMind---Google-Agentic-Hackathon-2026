import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, ShieldCheck, AlertTriangle, TrendingDown, 
  Landmark, Users, HeartPulse, ActivitySquare, ArrowLeft,
  Activity, BarChart, FileText, Settings, Download
} from 'lucide-react';
import { fetchMetricDetail } from '../lib/dashboardApi';

const PALETTE = {
  purple: '#7F22FE',     
  orange: '#FF6900',     
  darkBrown: '#56280B',  
  sky: '#00B8DB',        
  deepTeal: '#073F4D',   
};

const iconMap: Record<string, any> = {
  stability: Globe,
  resilience: ShieldCheck,
  crisis: AlertTriangle,
  governance: Landmark,
  economic: TrendingDown,
  trust: Users,
  social: HeartPulse,
  emergency: ActivitySquare,
};

export function MetricDetailDashboard({ metricId, onNavigate }: { metricId: string, onNavigate?: (id: string) => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [settings, setSettings] = useState({ live: true, social: true, anomaly: false });
  const [timeframe, setTimeframe] = useState('1M');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const id = metricId.replace('metric-', '');
        const res = await fetchMetricDetail(id);
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [metricId]);

  const handleExport = async () => {
    setExporting(true);
    await new Promise(res => setTimeout(res, 800));
    setExporting(false);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading || !data) {
    return <div className="text-white text-center p-20 font-mono animate-pulse">Analyzing vector telemetry...</div>;
  }

  const Icon = iconMap[data.id] || Globe;

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
                   <p className="text-sm text-gray-400 max-w-xl">{data.description}</p>
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

             <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}40` }}>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-purple-400" /> AI Strategic Narrative
                </h3>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                   <p className="text-sm text-gray-300 leading-relaxed">
                     {data.aiNarrative}
                   </p>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}40` }}>
               <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-4">Leading Indicators</h3>
               <div className="space-y-4">
                 {data.leadingIndicators.map((ind: any, i: number) => (
                   <div key={i} className="flex justify-between items-center pb-3 border-b border-white/5 last:border-0 last:pb-0">
                     <span className="text-sm font-semibold text-gray-300">{ind.label}</span>
                     <div className="text-right">
                       <div className="text-sm text-white font-bold">{ind.value}</div>
                       <div className="text-[10px] font-mono text-gray-500">{ind.trend}</div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}40` }}>
               <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-4">Risk Composition</h3>
               <div className="space-y-4">
                 {data.riskFactors.map((rf: any, i: number) => (
                   <div key={i}>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-gray-400">{rf.label}</span>
                       <span className="font-mono text-gray-300">{rf.percent}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${rf.color}`} style={{ width: `${rf.percent}%` }} />
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}40` }}>
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">Telemetry Settings</h3>
                  <Settings size={14} className="text-gray-500" />
               </div>
               <div className="space-y-3">
                 <label className="flex items-center justify-between text-xs text-gray-400 cursor-pointer p-2 hover:bg-slate-900 rounded">
                   Live Socket Sync
                   <input type="checkbox" checked={settings.live} onChange={() => toggleSetting('live')} className="accent-sky-500 w-3 h-3 rounded cursor-pointer" />
                 </label>
                 <label className="flex items-center justify-between text-xs text-gray-400 cursor-pointer p-2 hover:bg-slate-900 rounded">
                   Include Social Media Sentiment
                   <input type="checkbox" checked={settings.social} onChange={() => toggleSetting('social')} className="accent-sky-500 w-3 h-3 rounded cursor-pointer" />
                 </label>
                 <label className="flex items-center justify-between text-xs text-gray-400 cursor-pointer p-2 hover:bg-slate-900 rounded">
                   Filter Micro-Anomalies
                   <input type="checkbox" checked={settings.anomaly} onChange={() => toggleSetting('anomaly')} className="accent-sky-500 w-3 h-3 rounded cursor-pointer" />
                 </label>
               </div>
               <button onClick={handleExport} className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-2">
                 {exporting ? <Activity size={14} className="animate-spin" /> : <Download size={14} />} {exporting ? 'Compiling Report...' : 'Export Metric Data'}
               </button>
             </div>
          </div>
       </div>
    </div>
  );
}
