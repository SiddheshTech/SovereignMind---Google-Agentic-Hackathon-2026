import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, GitBranch, Cpu, Activity, Database, Network, Shield, AlertTriangle, Battery, BatteryCharging, Factory, Building, CloudRain, ShieldCheck, Zap, Server, Settings, Droplets, Map, Users, Globe } from 'lucide-react';

const PALETTE = {
  emerald: '#10B981',    // Operational, healthy
  cyan: '#06B6D4',       // Data flows, infrastructure
  indigo: '#6366F1',     // Dependencies, logic
  amber: '#F59E0B',      // Warning, high load
  rose: '#F43F5E',       // Critical, failure
  darkBg: '#030712',
  borderDark: '#1E293B',
};

interface DigitalTwinDashboardProps {
  key?: string;
  initialTab?: 'nation-model' | 'dependencies' | 'infrastructure';
}

export function DigitalTwinDashboard({ initialTab = 'nation-model' }: DigitalTwinDashboardProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
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
    <div className="max-w-[1200px] mx-auto space-y-6">
      {actionState.status === 'success' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-80 p-3 px-6 rounded-xl bg-indigo-600 shadow-[0_0_30px_rgba(99,102,241,0.5)] text-white text-xs font-mono font-bold tracking-widest uppercase z-50 animate-fade-in border border-indigo-400 text-center">
           Action Processed Successfully
        </div>
      )}
      
      {/* Sub-header controls */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">Live Sync: 12ms</span>
          </div>
          <button 
             onClick={() => handleAction('config')} 
             disabled={actionState.status === 'loading'}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-950 border border-indigo-500/30 text-indigo-300 text-xs font-medium rounded-xl transition-colors cursor-pointer hover:bg-indigo-900 disabled:opacity-50"
          >
            <Settings size={14} className={actionState.status === 'loading' && actionState.id === 'config' ? 'animate-spin' : ''} />
            {actionState.status === 'loading' && actionState.id === 'config' ? 'Configuring...' : 'Configure Twin'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'nation-model' && (
          <motion.div
            key="nation-model"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <NationModelView handleAction={handleAction} actionState={actionState} />
          </motion.div>
        )}
        {activeTab === 'dependencies' && (
          <motion.div
            key="dependencies"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <DependenciesView />
          </motion.div>
        )}
        {activeTab === 'infrastructure' && (
          <motion.div
            key="infrastructure"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <InfrastructureView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NationModelView({ handleAction, actionState }: any) {
  const [globalParams, setGlobalParams] = React.useState<any>(null);

  React.useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('sovereign_global_params');
      if (saved) setGlobalParams(JSON.parse(saved));
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    const intv = setInterval(handleStorage, 1000);
    return () => {
       window.removeEventListener('storage', handleStorage);
       clearInterval(intv);
    }
  }, []);

  const econLevel = globalParams ? globalParams.econResilience : 45;
  const threatLevel = globalParams ? globalParams.threatSense : 60;
  const trustLevel = globalParams ? 100 - (globalParams.volatility * 5) : 82;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#030712] border border-slate-800 rounded-3xl p-6 relative h-[550px] overflow-hidden flex flex-col justify-between">
        
        {/* Holographic Nation Projection placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[500px] h-[500px] relative">
            {/* Base grid */}
            <div className="absolute inset-0 border border-indigo-500/20 rounded-full" style={{ transform: 'rotateX(70deg)' }}>
              <div className="absolute inset-x-0 top-1/2 h-px bg-indigo-500/20" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-indigo-500/20" />
            </div>
            {/* Core structural elements */}
            <div className="absolute inset-8 border border-cyan-500/30 rounded-full" style={{ transform: 'rotateX(70deg) translateZ(40px)' }} />
            <div className="absolute inset-16 border border-emerald-500/40 rounded-full" style={{ transform: 'rotateX(70deg) translateZ(80px)' }} />
            
            {/* Vertical data streams */}
            <div className="absolute left-1/2 bottom-1/2 w-px h-64 bg-gradient-to-t from-indigo-500/0 via-indigo-400 to-indigo-500/0 -translate-x-1/2 opacity-50" />
            <div className="absolute left-1/2 bottom-1/2 w-32 h-64 -translate-x-1/2 opacity-20" style={{ background: 'conic-gradient(from 180deg at 50% 100%, transparent, #6366F1 180deg, transparent)' }} />
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white mb-1 flex items-center gap-2"><Globe className="text-indigo-400" size={20} /> Live Nation Model</h3>
            <p className="text-xs text-indigo-400 font-mono">POP. 8.4M • REGION: PACIFIC NW • NATIONAL DIGITAL TWIN</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <ShieldCheck size={16} /> Integrity: {globalParams ? Math.max(0, 100 - (globalParams.volatility * 2.5)).toFixed(1) : 94.2}%
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-5 gap-3 mt-auto">
          <NationStat icon={<Activity size={18} />} title="Economy" val="1.42x" trend="+0.04" />
          <NationStat icon={<Users size={18} />} title="Society" val="Nominal" subtitle={`Cohesion ${Math.round(trustLevel)}%`} />
          <NationStat icon={<Shield size={18} />} title="Governance" val="Stable" subtitle="Approval 54%" />
          <NationStat icon={<Factory size={18} />} title="Infrastructure" val="88%" trend="-2%" />
          <NationStat icon={<ShieldCheck size={18} />} title="Security" val={`DEFCON ${globalParams ? (globalParams.threatSense > 80 ? '2' : '4') : '4'}`} subtitle={`Active Threats: ${globalParams ? Math.round(globalParams.volatility) : 2}`} />
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6">
          <h4 className="text-sm font-semibold text-white tracking-wide mb-5 flex items-center gap-2">
            <Database size={16} className="text-cyan-400" /> Macroscopic Parameters
          </h4>
          <div className="space-y-4">
            <ParameterSlider label="Taxation Velocity" val={`${econLevel}%`} level={econLevel} />
            <ParameterSlider label="Border Friction" val={threatLevel > 60 ? "High" : "Medium"} level={threatLevel} />
            <ParameterSlider label="Social Cohesion Index" val={`${Math.round(trustLevel)}`} level={trustLevel} />
            <ParameterSlider label="Supply Integration" val="Optimal" level={90} />
          </div>
        </div>

        <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 h-64 flex flex-col">
          <h4 className="text-sm font-semibold text-white tracking-wide mb-3 flex items-center gap-2">
            <Activity size={16} className="text-indigo-400" /> Predictive Stress Test
          </h4>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Run a simulated exogenous shock against the current twin model.
          </p>
          <div className="mt-auto space-y-3">
            <select className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500">
              <option>Kinetic Impact: Grid Substation</option>
              <option>Financial: Currency Devaluation</option>
              <option>Biological: Pathogen Variant Delta</option>
            </select>
            <button onClick={() => handleAction('shock')} disabled={actionState.status === 'loading'} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer text-sm disabled:opacity-50">
              {actionState.status === 'loading' && actionState.id === 'shock' ? 'Executing...' : 'Execute Shock Scenario'}
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-800">
             <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Simulated Volatility Index</span>
                <span className="text-lg font-bold text-white">{globalParams ? Math.round(globalParams.volatility) : 18}%</span>
             </div>
             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-500" style={{ width: `${globalParams ? globalParams.volatility : 18}%` }} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NationStat({ icon, title, val, trend, subtitle }: any) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
      <div className="flex items-center gap-2 text-indigo-300 mb-4">
        {icon}
        <span className="text-[10px] font-mono tracking-wider uppercase">{title}</span>
      </div>
      <div>
        <div className="text-xl font-bold text-white flex items-baseline gap-2">
          {val}
          {trend && (
            <span className={`text-[10px] font-mono font-bold ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend}
            </span>
          )}
        </div>
        {subtitle && <div className="text-[10px] text-gray-500 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

function ParameterSlider({ label, val, level }: { label: string, val: string, level: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-[10px] font-mono text-cyan-400">{val}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

function DependenciesView() {
  return (
    <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[700px] flex flex-col relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10 max-w-sm">
        <h3 className="text-xl font-bold text-white tracking-tight mb-2">System Dependency Graph</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          Mapping critical cascading nodes. Highlighted paths indicate high vulnerability to chained failures where one disruption's cascading effects become visible instantly.
        </p>
      </div>

      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-4">
        <div className="text-[10px] font-mono text-gray-400 mb-2 uppercase tracking-wider">Node Status Legend</div>
        <div className="flex items-center gap-3 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Optimal</div>
        <div className="flex items-center gap-3 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-amber-500" /> Strained</div>
        <div className="flex items-center gap-3 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-rose-500" /> High Vulnerability</div>
      </div>

      {/* Abstract Node Map */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-80 mt-12">
        <div className="relative w-full max-w-4xl h-full ml-20 mt-10">
          
          {/* Level 1 Core */}
          <DependencyNode x="50%" y="15%" color="emerald" icon={<Zap size={16} />} title="National Energy Grid" />
          
          {/* Level 2 Systems */}
          <DependencyNode x="50%" y="35%" color="emerald" icon={<Droplets size={16} />} title="Water Infrastructure" />
          
          {/* Level 3 Edges */}
          <DependencyNode x="50%" y="55%" color="amber" icon={<Database size={16} />} title="Agricultural Production" />
          
          {/* Level 4 */}
          <DependencyNode x="50%" y="75%" color="rose" icon={<Factory size={16} />} title="Food Supply Chain" />

          {/* Level 5 */}
          <DependencyNode x="50%" y="95%" color="rose" icon={<Users size={16} />} title="Public Stability Index" />

          {/* SVGs rendering connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
             <path d="M 50% 15% L 50% 35%" stroke={PALETTE.emerald} strokeWidth="2" strokeDasharray="4 2" fill="none" className="opacity-80 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
             <path d="M 50% 35% L 50% 55%" stroke={PALETTE.amber} strokeWidth="2" strokeDasharray="4 2" fill="none" className="opacity-50" />
             <path d="M 50% 55% L 50% 75%" stroke={PALETTE.rose} strokeWidth="3" fill="none" className="opacity-80 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)] animate-pulse" />
             <path d="M 50% 75% L 50% 95%" stroke={PALETTE.rose} strokeWidth="3" fill="none" className="opacity-80 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)] animate-pulse" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function DependencyNode({ x, y, color, icon, title }: { x: string, y: string, color: 'emerald'|'amber'|'rose', icon: React.ReactNode, title: string }) {
  const bgColors = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse',
  };

  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer" style={{ left: x, top: y }}>
      <div className={`flex flex-col items-center gap-2`}>
        <div className={`p-4 rounded-xl border backdrop-blur-md shadow-lg transition-transform group-hover:scale-110 ${bgColors[color]}`}>
          {icon}
        </div>
        <div className={`text-[11px] font-semibold whitespace-nowrap bg-black/60 px-2 py-1 rounded-md border border-white/10 text-white mt-1 shadow-lg`}>
          {title}
        </div>
      </div>
    </div>
  );
}

function InfrastructureView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <InfrastructureCard 
        title="Power Substation Alpha" 
        icon={<Zap size={20} className="text-amber-400" />}
        status="Warning"
        statusColor="amber"
        load={88}
        metrics={[
          { label: 'Voltage Stabilizer', val: 'Active' },
          { label: 'Current Draw', val: '4.2 GW' },
          { label: 'Temperature', val: '82°C' },
        ]}
      />
      <InfrastructureCard 
        title="Aquifer Pump Station 4" 
        icon={<Droplets size={20} className="text-cyan-400" />}
        status="Optimal"
        statusColor="emerald"
        load={42}
        metrics={[
          { label: 'Flow Rate', val: '12k L/s' },
          { label: 'Filter Integrity', val: '98%' },
          { label: 'Reservoir Level', val: 'High' },
        ]}
      />
      <InfrastructureCard 
        title="Core Data Facility (Underground)" 
        icon={<Server size={20} className="text-indigo-400" />}
        status="Optimal"
        statusColor="emerald"
        load={60}
        metrics={[
          { label: 'Uptime', val: '99.999%' },
          { label: 'Latency', val: '4ms' },
          { label: 'Coolant Flow', val: 'Nominal' },
        ]}
      />
      <InfrastructureCard 
        title="Logistics Hub 22" 
        icon={<Factory size={20} className="text-gray-400" />}
        status="Offline"
        statusColor="rose"
        load={0}
        metrics={[
          { label: 'Throughput', val: '0 TPM' },
          { label: 'Route Blockage', val: 'Detected' },
          { label: 'Personnel', val: 'Evacuated' },
        ]}
      />
    </div>
  );
}

function InfrastructureCard({ title, icon, status, statusColor, load, metrics }: any) {
  const badgeClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };
  
  const barClasses = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 flex flex-col hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
            {icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>
            <div className="text-[10px] text-gray-500 font-mono mt-1 w-fit border px-1.5 py-0.5 rounded uppercase" style={{ borderColor: PALETTE.borderDark }}>
              NODE_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
            </div>
          </div>
        </div>
        <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${badgeClasses[statusColor as keyof typeof badgeClasses]}`}>
          {status}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs text-gray-400 font-semibold">System Load</span>
          <span className="text-sm font-mono text-white tracking-tight">{load}%</span>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${barClasses[statusColor as keyof typeof barClasses]}`} style={{ width: `${load}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-auto pt-5 border-t border-slate-800">
        {metrics.map((m: any, idx: number) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider truncate">{m.label}</span>
            <span className="text-xs font-mono text-gray-200">{m.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
