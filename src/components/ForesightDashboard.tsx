import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Activity, Settings, Filter, Download, Clock, Zap, Search, Eye, TrendingUp, Sparkles, Navigation, AlertTriangle, ChevronRight, Wind, Waves, ShieldAlert, AlertCircle, X } from 'lucide-react';

const PALETTE = {
  purple: '#7F22FE',     // Primary High-Tech accent
  orange: '#FF6900',     // Warning / Critical Action accent
  darkBrown: '#56280B',  // Shadow offsets, rich border inserts
  sky: '#00B8DB',        // Strategic indicators, safe state labels
  deepTeal: '#073F4D',    // Deep framing lines, background panels
};

interface ForesightDashboardProps {
  key?: string;
  initialTab?: 'risk-radar' | 'forecasting' | 'black-swan';
}

export function ForesightDashboard({ initialTab = 'risk-radar' }: ForesightDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [actionState, setActionState] = useState<{ id: string; status: 'idle' | 'loading' | 'success', message?: string}>( { id: '', status: 'idle' } );
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [reportProgress, setReportProgress] = useState(0);

  const DEFAULT_PARAMS = { threshold: 70, severity: 50, sensitivity: 80, probability: 60 };
  const [params, setParams] = useState(DEFAULT_PARAMS);

  const handleAction = async (id: string, customMessage?: string) => {
    if (id === 'param-reset' || id === 'param-default') {
      setParams(DEFAULT_PARAMS);
    }
    setActionState({ id, status: 'loading', message: customMessage });
    if (id === 'report') {
      setActiveModal('report');
      // Simulate progress
      let p = 0;
      const interval = setInterval(() => {
        p += 20;
        setReportProgress(p);
        if (p >= 100) clearInterval(interval);
      }, 300);
      setTimeout(() => {
         setActionState({ id, status: 'success', message: customMessage });
      }, 1500);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setActionState({ id, status: 'success', message: customMessage });
      setTimeout(() => setActionState({ id: '', status: 'idle', message: undefined }), 2000);
    } catch {
      setActionState({ id: '', status: 'idle', message: undefined });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 relative">
      {actionState.status === 'success' && actionState.id !== 'report' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-80 p-3 px-6 rounded-xl bg-[#00B8DB] shadow-[0_0_30px_rgba(0,184,219,0.5)] text-[#030712] text-xs font-mono font-bold tracking-widest uppercase z-50 animate-fade-in border border-[#00B8DB] text-center">
           {actionState.message || 'Action Processed Successfully'}
        </div>
      )}
      
      {/* Sub-header controls */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveModal('params')} className="flex items-center gap-2 px-4 py-2 bg-[#030712] border text-white text-xs font-medium rounded-xl transition-colors cursor-pointer hover:bg-white/5" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
            <Filter size={14} className="opacity-70" />
            Parameters
          </button>
          <button onClick={() => handleAction('export', 'Intel Export Generated')} disabled={actionState.status === 'loading'} className="flex items-center gap-2 px-4 py-2 bg-[#030712] border text-white text-xs font-medium rounded-xl transition-colors cursor-pointer hover:bg-white/5 disabled:opacity-50" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
            <Download size={14} className={`opacity-70 ${actionState.id === 'export' && actionState.status === 'loading' ? 'animate-bounce' : ''}`} style={{ color: PALETTE.sky }} />
            {actionState.status === 'loading' && actionState.id === 'export' ? 'Exporting...' : 'Export Intel'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'risk-radar' && (
          <motion.div
            key="risk-radar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <RiskRadarView handleAction={handleAction} actionState={actionState} setActiveModal={setActiveModal} />
          </motion.div>
        )}
        {activeTab === 'forecasting' && (
          <motion.div
            key="forecasting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ForecastingView handleAction={handleAction} />
          </motion.div>
        )}
        {activeTab === 'black-swan' && (
          <motion.div
            key="black-swan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <BlackSwanView handleAction={handleAction} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#030712] border rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" style={{ borderColor: `${PALETTE.deepTeal}80` }}>
            <div className="flex items-center justify-between p-4 px-6 border-b" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
               <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                 {activeModal === 'params' && 'Parameters Configuration'}
                 {activeModal === 'report' && 'Sentinel Report Generation'}
                 {activeModal.startsWith('threat-') && 'Threat Analysis Drawer'}
               </h4>
               <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-white cursor-pointer p-1"><X size={16} /></button>
            </div>
            
            <div className="p-6">
               {activeModal === 'params' && (
                 <div className="space-y-6 text-sm">
                   <div className="grid grid-cols-2 gap-4 text-gray-300">
                     <p>Threat Thresholds <input type="range" className="w-full mt-2" value={params.threshold} onChange={(e) => setParams({...params, threshold: Number(e.target.value)})} /></p>
                     <p>Severity Scoring <input type="range" className="w-full mt-2" value={params.severity} onChange={(e) => setParams({...params, severity: Number(e.target.value)})} /></p>
                     <p>Alert Sensitivity <input type="range" className="w-full mt-2" value={params.sensitivity} onChange={(e) => setParams({...params, sensitivity: Number(e.target.value)})} /></p>
                     <p>Probability Weighting <input type="range" className="w-full mt-2" value={params.probability} onChange={(e) => setParams({...params, probability: Number(e.target.value)})} /></p>
                   </div>
                   <div className="flex gap-4 pt-4 border-t border-white/10">
                      <button onClick={() => { handleAction('param-save', 'Parameters Saved'); setActiveModal(null); }} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold transition-all text-xs cursor-pointer">Save Parameters</button>
                      <button onClick={() => { handleAction('param-reset', 'Parameters Reset'); setActiveModal(null); }} className="px-4 py-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold transition-all text-xs cursor-pointer">Reset Parameters</button>
                      <button onClick={() => { handleAction('param-default', 'Defaults Restored'); setActiveModal(null); }} className="px-4 py-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold transition-all text-xs cursor-pointer">Restore Defaults</button>
                   </div>
                 </div>
               )}

               {activeModal === 'report' && (
                 <div className="space-y-6 text-sm text-gray-300">
                   {reportProgress < 100 ? (
                     <div className="space-y-4 text-center py-8">
                       <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                       <p className="text-white font-bold tracking-wider">GENERATING INTEL SECTIONS...</p>
                       <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                         <div className="bg-sky-500 h-full transition-all duration-300" style={{ width: `${reportProgress}%` }}></div>
                       </div>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       <div className="p-4 bg-sky-900/20 border border-sky-500/30 rounded-xl text-sky-400 font-bold mb-6">
                         Report Genesis Completed Successfully.
                       </div>
                       <div className="grid grid-cols-2 gap-2 font-mono text-xs mb-6">
                         <div className="p-2 bg-slate-900 rounded">1. Executive Summary</div>
                         <div className="p-2 bg-slate-900 rounded">2. Threat Overview</div>
                         <div className="p-2 bg-slate-900 rounded">3. Risk Rankings</div>
                         <div className="p-2 bg-slate-900 rounded">4. Early Warning Signals</div>
                         <div className="p-2 bg-slate-900 rounded">5. Probability Trends</div>
                         <div className="p-2 bg-slate-900 rounded">6. Impact Forecast</div>
                         <div className="p-2 bg-slate-900 rounded">7. Geographic Exposure</div>
                         <div className="p-2 bg-slate-900 rounded">8. Recommended Actions</div>
                         <div className="p-2 bg-slate-900 rounded">9. Strategic Assessment</div>
                         <div className="p-2 bg-slate-900 rounded">10. Supporting Data</div>
                       </div>
                       <div className="flex gap-3 justify-center pt-4 border-t border-white/10">
                          <button onClick={() => { handleAction('download', 'Report Downloaded'); setActiveModal(null); }} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold transition-all text-xs cursor-pointer flex items-center gap-2"><Download size={14}/> Download PDF</button>
                          <button onClick={() => { handleAction('download', 'Report Downloaded'); setActiveModal(null); }} className="px-4 py-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold transition-all text-xs cursor-pointer flex items-center gap-2"><Download size={14}/> DOCX / HTML</button>
                          <button onClick={() => { handleAction('save', 'Report Saved to Archives'); setActiveModal(null); }} className="px-4 py-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold transition-all text-xs cursor-pointer">Save Report</button>
                          <button onClick={() => { handleAction('share', 'Share Link Generated'); setActiveModal(null); }} className="px-4 py-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold transition-all text-xs cursor-pointer">Share Report</button>
                       </div>
                     </div>
                   )}
                 </div>
               )}

               {activeModal.startsWith('threat-') && (
                 <div className="space-y-4 text-sm text-gray-300">
                    <h3 className="text-white text-lg font-bold border-b border-white/10 pb-2 mb-4 capitalize">{activeModal.replace('threat-', '').replace('-', ' ')}</h3>
                    <p><strong>Severity History:</strong> Consistently elevated over the past 30 days due to compound systemic pressures.</p>
                    <p><strong>Related Risks:</strong> Supply chain domino effect, civil unrest vectors, economic instability multipliers.</p>
                    <p><strong>Mitigation Actions:</strong> Deploy strategic reserve allocations, tighten predictive modeling algorithms, engage diplomatic backchannels.</p>
                    <p><strong>Regional Impact:</strong> Primary destabilization expected in emerging markets with secondary shocks traversing core financial hubs.</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RiskRadarView({ handleAction, actionState, setActiveModal }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Radar Main Panel */}
      <div className="lg:col-span-8 bg-[#030712] border rounded-3xl p-6 relative overflow-hidden h-[500px]" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <div className="p-1.5 bg-slate-900 border rounded-lg" style={{ borderColor: `${PALETTE.purple}50` }}>
            <Target size={16} style={{ color: PALETTE.purple }} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Threat Heatmap</h3>
            <div className="text-[10px] text-gray-500 font-mono mt-1">PROBABILITY VS SEVERITY VS TIME</div>
          </div>
        </div>

        <div className="h-full pt-20 flex flex-col justify-center">
           <table className="w-full text-left">
             <thead>
               <tr className="border-b border-white/5">
                 <th className="pb-3 px-4 text-[10px] font-mono text-gray-400 uppercase tracking-wider">Threat</th>
                 <th className="pb-3 px-4 text-[10px] font-mono text-gray-400 uppercase tracking-wider">Probability</th>
                 <th className="pb-3 px-4 text-[10px] font-mono text-gray-400 uppercase tracking-wider">Severity</th>
                 <th className="pb-3 px-4 text-[10px] font-mono text-gray-400 uppercase tracking-wider">Time to Impact</th>
               </tr>
             </thead>
             <tbody>
               <tr onClick={() => setActiveModal('threat-water-crisis')} className="border-b border-white/5 hover:bg-white/[0.02] group cursor-pointer">
                 <td className="py-4 px-4 text-sm font-semibold text-gray-200 group-hover:text-white flex items-center gap-2"><Waves size={14} className="text-red-500"/> Water Crisis</td>
                 <td className="py-4 px-4">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-mono font-bold text-red-500">82%</span>
                     <div className="w-16 h-1 bg-slate-900 rounded-full"><div className="w-[82%] h-full bg-red-500 rounded-full" /></div>
                   </div>
                 </td>
                 <td className="py-4 px-4"><span className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-[10px] uppercase rounded">Very High</span></td>
                 <td className="py-4 px-4 text-xs font-mono text-gray-400">48 Months</td>
               </tr>
               <tr onClick={() => setActiveModal('threat-inflation')} className="border-b border-white/5 hover:bg-white/[0.02] group cursor-pointer">
                 <td className="py-4 px-4 text-sm font-semibold text-gray-200 group-hover:text-white flex items-center gap-2"><TrendingUp size={14} className="text-orange-500"/> Inflation</td>
                 <td className="py-4 px-4">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-mono font-bold text-orange-500">67%</span>
                     <div className="w-16 h-1 bg-slate-900 rounded-full"><div className="w-[67%] h-full bg-orange-500 rounded-full" /></div>
                   </div>
                 </td>
                 <td className="py-4 px-4"><span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-[10px] uppercase rounded">High</span></td>
                 <td className="py-4 px-4 text-xs font-mono text-gray-400">12 Months</td>
               </tr>
               <tr onClick={() => setActiveModal('threat-cyberattack')} className="border-b border-white/5 hover:bg-white/[0.02] group cursor-pointer">
                 <td className="py-4 px-4 text-sm font-semibold text-gray-200 group-hover:text-white flex items-center gap-2"><ShieldAlert size={14} className="text-amber-500"/> Cyberattack</td>
                 <td className="py-4 px-4">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-mono font-bold text-amber-500">54%</span>
                     <div className="w-16 h-1 bg-slate-900 rounded-full"><div className="w-[54%] h-full bg-amber-500 rounded-full" /></div>
                   </div>
                 </td>
                 <td className="py-4 px-4"><span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-[10px] uppercase rounded">Medium</span></td>
                 <td className="py-4 px-4 text-xs font-mono text-gray-400">Imminent</td>
               </tr>
               <tr onClick={() => setActiveModal('threat-political-instability')} className="border-b border-white/5 hover:bg-white/[0.02] group cursor-pointer">
                 <td className="py-4 px-4 text-sm font-semibold text-gray-200 group-hover:text-white flex items-center gap-2"><AlertCircle size={14} className="text-yellow-500"/> Political Instability</td>
                 <td className="py-4 px-4">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-mono font-bold text-yellow-500">42%</span>
                     <div className="w-16 h-1 bg-slate-900 rounded-full"><div className="w-[42%] h-full bg-yellow-500 rounded-full" /></div>
                   </div>
                 </td>
                 <td className="py-4 px-4"><span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-[10px] uppercase rounded">Medium</span></td>
                 <td className="py-4 px-4 text-xs font-mono text-gray-400">24 Months</td>
               </tr>
             </tbody>
           </table>
        </div>
      </div>

      {/* Early Warning Signals Menu */}
      <div className="lg:col-span-4 bg-[#030712] border rounded-3xl p-6 flex flex-col h-[500px]" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
        <h3 className="text-sm font-semibold text-white tracking-wide mb-6 flex items-center gap-2"><Zap size={16} className="text-sky-400" /> Early Warning Signals</h3>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-none">
          <ThreatCard title="Political Instability" impact="High" probability="Rising" trend="rising" type="critical" />
          <ThreatCard title="Food Insecurity" impact="Severe" probability="Stable" trend="stable" type="critical" />
          <ThreatCard title="Energy Shortages" impact="High" probability="Rising" trend="rising" type="warning" />
          <ThreatCard title="Civil Unrest" impact="Medium" probability="Falling" trend="falling" type="neutral" />
          <ThreatCard title="Economic Shocks" impact="Unknown" probability="Volatile" trend="stable" type="warning" />
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/5">
          <button onClick={() => handleAction('report')} className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer">
            Generate Sentinel Report
          </button>
        </div>
      </div>
    </div>
  );
}

function RiskNode({ top, left, type, label, desc }: { top: string, left: string, type: 'critical'|'warning'|'neutral', label: string, desc: string }) {
  const color = type === 'critical' ? PALETTE.orange : type === 'warning' ? PALETTE.purple : PALETTE.sky;
  
  return (
    <div className="absolute group" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
      <div 
        className="relative w-3 h-3 rounded-full cursor-pointer animate-pulse z-10"
        style={{ 
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`
        }}
      >
        <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ backgroundColor: color }} />
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border rounded-lg p-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl" style={{ borderColor: `${color}40` }}>
        <div className="text-xs font-bold text-white mb-1 leading-tight">{label}</div>
        <div className="text-[10px] text-gray-400 font-mono">{desc}</div>
      </div>
    </div>
  );
}

function ThreatCard({ title, impact, probability, trend, type }: { title: string, impact: string, probability: string, trend: 'rising'|'falling'|'stable', type: string }) {
  const color = type === 'critical' ? PALETTE.orange : type === 'warning' ? PALETTE.purple : PALETTE.sky;
  
  return (
    <div className="bg-slate-900/60 border rounded-xl p-3 flex flex-col group cursor-pointer hover:bg-slate-900 transition-colors" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs font-semibold text-gray-200">{title}</h4>
        <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: color }} />
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase">Impact</span>
            <span className="text-[11px] font-mono font-medium" style={{ color: color }}>{impact}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase">Prob</span>
            <span className="text-[11px] font-mono font-medium text-white">{probability}</span>
          </div>
        </div>
        <div className="flex items-center">
          {trend === 'rising' && <Activity size={12} className="text-red-400" />}
          {trend === 'falling' && <Activity size={12} className="text-pink-400 transform scale-y-[-1]" />}
          {trend === 'stable' && <Activity size={12} className="text-gray-400" />}
        </div>
      </div>
    </div>
  );
}

function ForecastingView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI Future Timeline */}
      <div className="bg-[#030712] border rounded-3xl p-6 relative overflow-hidden" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
        <div className="flex justify-between items-start mb-8">
           <div>
             <h3 className="text-xl font-bold font-mono text-white tracking-tight flex items-center gap-2"><Clock className="text-purple-400" /> AI Future Timeline</h3>
             <p className="text-xs text-gray-400 mt-2">Projected trajectory based on current global markers. (Today → 2030)</p>
           </div>
        </div>

        <div className="relative border-l border-white/10 ml-4 py-4 space-y-8">
           <div className="relative pl-6">
             <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-400 blur-[1px]"></div>
             <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-indigo-300"></div>
             <span className="text-xs font-mono text-indigo-400 font-bold block mb-1">Today</span>
             <h4 className="text-sm font-bold text-white mb-1">Current State</h4>
             <p className="text-[11px] text-gray-400 leading-relaxed font-sans">Baseline stability maintained. Mild supply chain friction detected, but institutional trust holds nominal.</p>
           </div>

           <div className="relative pl-6">
             <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 blur-[1px]"></div>
             <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-amber-400"></div>
             <span className="text-xs font-mono text-amber-500 font-bold block mb-1">2027</span>
             <h4 className="text-sm font-bold text-white mb-1">Urban Migration Surge</h4>
             <p className="text-[11px] text-gray-400 leading-relaxed font-sans">Climate and economic pressures accelerate rural-to-urban migration, straining housing, infrastructure, and local governance.</p>
           </div>

           <div className="relative pl-6">
             <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-orange-500 blur-[1px]"></div>
             <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-orange-400"></div>
             <span className="text-xs font-mono text-orange-500 font-bold block mb-1">2028</span>
             <h4 className="text-sm font-bold text-white mb-1">Energy Deficit Risk</h4>
             <p className="text-[11px] text-gray-400 leading-relaxed font-sans">Renewable transition lags behind raw power demand from AI and industrial growth, creating grid instability and rolling blackout risks.</p>
           </div>

           <div className="relative pl-6">
             <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-500 blur-[1px]"></div>
             <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-red-400"></div>
             <span className="text-xs font-mono text-red-500 font-bold block mb-1">2030</span>
             <h4 className="text-sm font-bold text-white mb-1">Water Stress Emergency</h4>
             <p className="text-[11px] text-gray-400 leading-relaxed font-sans">Critical aquifer depletion in multiple breadbasket regions leads to cascading agricultural failures and geopolitical tension over cross-border rivers.</p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#030712] border rounded-3xl p-6" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
          <h3 className="text-sm font-semibold tracking-wide text-white mb-4">Strategic Trajectory Delta</h3>
           <div className="space-y-4">
             <div className="flex justify-between items-end border-b border-white/5 pb-3">
               <div>
                 <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Stability Deviation (2030)</span>
                 <span className="text-2xl font-mono text-orange-400 font-bold">-14.2%</span>
               </div>
               <Activity className="text-orange-400" />
             </div>
             
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <span className="flex items-center gap-2 text-xs font-bold text-red-400 mb-2"><AlertTriangle size={14} /> Convergence Point</span>
                <p className="text-[11px] text-red-300/80 leading-relaxed">Energy deficits (2028) overlapping with water stress (2030) create a severe compounding vulnerability window.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ForecastMetricCard({ title, val, status, color }: { title: string, val: string, status: string, color: string }) {
  return (
    <div className="bg-[#030712] border rounded-2xl p-5" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">{title}</h4>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-white tracking-tight">{val}</div>
        <div 
          className="px-2 py-1 rounded-md text-[10px] font-mono uppercase border" 
          style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30` }}
        >
          {status}
        </div>
      </div>
    </div>
  );
}

function BlackSwanView() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSynthesis = () => {
    setLoading(true);
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div className="bg-[#030712] border rounded-3xl p-8 h-[600px] flex flex-col justify-center relative overflow-hidden" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black to-slate-900 border-[1px] border-white/5 opacity-50 m-4 rounded-2xl" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-violet-900/20 blur-3xl rounded-full mix-blend-screen" />
        
        <div className="relative z-10 text-center max-w-md mx-auto">
          {success && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-mono font-bold animate-fade-in border border-indigo-500/20">
              ✓ Synthesis Complete: 3 Anomalies Detected
            </div>
          )}
          <div className="w-16 h-16 mx-auto mb-6 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles size={28} style={{ color: PALETTE.orange }} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Generative Black Swan Engine</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            Running unconstrained semantic permutations across global datasets to identify "impossible" cascading failures before they materialize.
          </p>
          
          <button 
             onClick={handleSynthesis} 
             disabled={loading}
             className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 flex items-center gap-2 mx-auto cursor-pointer"
          >
            {loading ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Synthesizing...</> : 'Initialize Deep Synthesis'}
          </button>
          
          <div className="mt-8 pt-8 border-t border-white/10 flex justify-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xl font-mono text-white font-bold">14,281</span>
              <span className="text-[10px] text-gray-500 uppercase mt-1 tracking-wider">Permutations</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-mono" style={{ color: PALETTE.purple }}>3</span>
              <span className="text-[10px] text-gray-500 uppercase mt-1 tracking-wider">Anomalies</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex flex-col">
        <h3 className="text-sm font-semibold text-white tracking-wide">Synthesized Anomalies</h3>
        <BlackSwanCard 
          title="Simultaneous Subsea Cable / LEO Cascade"
          probability="0.04%"
          severity="Extinction-Class"
          desc="Solar flare interference precisely timed with targeted kinetic strikes on 4 major subsea trunk lines. Bypasses standard redundancies."
        />
        <BlackSwanCard 
          title="Synthesized Agricultural Pathogen Alpha"
          probability="0.12%"
          severity="Catastrophic"
          desc="AI-optimized crop pathogen resistant to standard fungicides, emerging simultaneously in 3 disconnected global breadbaskets."
        />
        <BlackSwanCard 
          title="Recursive Financial Ledger Corruption"
          probability="0.08%"
          severity="Catastrophic"
          desc="Quantum-seeded weakness in standard ledger hashing propagates silently over 18 months before triggering a synchronistic liquidation."
        />
        
        <div className="mt-auto p-4 border border-dashed rounded-2xl bg-white/[0.02]" style={{ borderColor: `${PALETTE.deepTeal}50` }}>
          <div className="flex items-center gap-3 mb-2">
            <Activity size={14} style={{ color: PALETTE.sky }} className="animate-pulse" />
            <span className="text-xs font-semibold text-white">Engine Status: Synthesizing</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
      
    </div>
  );
}

function BlackSwanCard({ title, probability, severity, desc }: { title: string, probability: string, severity: string, desc: string }) {
  return (
    <div className="bg-[#030712] border rounded-2xl p-5 hover:border-white/20 transition-colors group" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">{title}</h4>
        <div className="px-2 py-0.5 rounded border border-red-500/30 bg-red-500/10 text-red-500 text-[9px] font-mono font-bold uppercase shrink-0 ml-4">
          P: {probability}
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-4">{desc}</p>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 uppercase">Projected Severity:</span>
        <span className="text-xs font-mono" style={{ color: PALETTE.orange }}>{severity}</span>
      </div>
    </div>
  );
}
