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

  const handleAction = async (id: string, promiseCb?: () => Promise<void>) => {
    setActionState({ id, status: 'loading' });
    try {
      if (promiseCb) { await promiseCb(); } else { await new Promise(resolve => setTimeout(resolve, 800)); }
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


const GQL_GET_NATION_MODEL = `
  query {
    getNationModelData {
      economyVal economyTrend societyVal societySubtitle
      governanceVal governanceSubtitle infrastructureVal infrastructureTrend
      securityVal securitySubtitle taxationVelocity borderFriction
      cohesionIndex supplyIntegration volatilityIndex integrityPercentage
    }
  }
`;

const GQL_EXECUTE_SHOCK = `
  mutation ExecuteShock($shockName: String!) {
    executeShockScenario(shockName: $shockName) {
      id
    }
  }
`;

const GQL_GET_DEPENDENCIES = `
  query {
    getDependenciesData {
      nodes { id title status icon }
      edges { fromId toId status }
    }
  }
`;

const GQL_GENERATE_DEPENDENCIES = `
  mutation {
    generateDependenciesData {
      id
    }
  }
`;


const GQL_GET_INFRASTRUCTURE = `
  query {
    getInfrastructureData {
      nodes { id title icon status statusColor load metrics { label val } }
    }
  }
`;

const GQL_SIMULATE_INFRASTRUCTURE_UPDATE = `
  mutation {
    simulateInfrastructureUpdate {
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

function NationModelView({ handleAction, actionState }: any) {
  const [model, setModel] = React.useState<any>(null);
  const [selectedShock, setSelectedShock] = React.useState("Kinetic Impact: Grid Substation");
  const wsRef = React.useRef<WebSocket | null>(null);

  const fetchModel = async () => {
    try {
      const res = await graphqlRequest(GQL_GET_NATION_MODEL);
      if (res.getNationModelData) {
        setModel(res.getNationModelData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchModel();

    const wsUrl = window.location.protocol === 'https:' 
      ? `wss://${window.location.host}/ws/nation-model`
      : `ws://localhost:4000/ws/nation-model`;
      
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'NATION_MODEL_UPDATED') {
            setModel(msg.data);
          }
        } catch (err) {
          console.error('WS parsing error', err);
        }
      };
    } catch (err) {
      console.error('WS Connection error', err);
    }
    
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const econLevel = model ? model.taxationVelocity : 45;
  const threatLevel = model ? (model.borderFriction === 'High' ? 80 : 60) : 60;
  const trustLevel = model ? model.cohesionIndex : 82;

  const onExecuteShock = async () => {
    handleAction('shock', async () => {
      await graphqlRequest(GQL_EXECUTE_SHOCK, { shockName: selectedShock });
    });
  };

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
            <ShieldCheck size={16} /> Integrity: {model ? model.integrityPercentage.toFixed(1) : '94.2'}%
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-5 gap-3 mt-auto">
          <NationStat icon={<Activity size={18} />} title="Economy" val={model ? model.economyVal : "1.42x"} trend={model ? model.economyTrend : "+0.04"} />
          <NationStat icon={<Users size={18} />} title="Society" val={model ? model.societyVal : "Nominal"} subtitle={model ? model.societySubtitle : `Cohesion 82%`} />
          <NationStat icon={<Shield size={18} />} title="Governance" val={model ? model.governanceVal : "Stable"} subtitle={model ? model.governanceSubtitle : "Approval 54%"} />
          <NationStat icon={<Factory size={18} />} title="Infrastructure" val={model ? model.infrastructureVal : "88%"} trend={model ? model.infrastructureTrend : "-2%"} />
          <NationStat icon={<ShieldCheck size={18} />} title="Security" val={model ? model.securityVal : "DEFCON 4"} subtitle={model ? model.securitySubtitle : "Active Threats: 2"} />
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6">
          <h4 className="text-sm font-semibold text-white tracking-wide mb-5 flex items-center gap-2">
            <Database size={16} className="text-cyan-400" /> Macroscopic Parameters
          </h4>
          <div className="space-y-4">
            <ParameterSlider label="Taxation Velocity" val={`${econLevel}%`} level={econLevel} />
            <ParameterSlider label="Border Friction" val={model ? model.borderFriction : "Medium"} level={threatLevel} />
            <ParameterSlider label="Social Cohesion Index" val={`${Math.round(trustLevel)}`} level={trustLevel} />
            <ParameterSlider label="Supply Integration" val={model ? model.supplyIntegration : "Optimal"} level={model && model.supplyIntegration === 'Critical' ? 30 : 90} />
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
            <select 
              value={selectedShock} 
              onChange={(e) => setSelectedShock(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option>Kinetic Impact: Grid Substation</option>
              <option>Financial: Currency Devaluation</option>
              <option>Biological: Pathogen Variant Delta</option>
            </select>
            <button onClick={onExecuteShock} disabled={actionState.status === 'loading'} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer text-sm disabled:opacity-50">
              {actionState.status === 'loading' && actionState.id === 'shock' ? 'Executing...' : 'Execute Shock Scenario'}
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-800">
             <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Simulated Volatility Index</span>
                <span className="text-lg font-bold text-white">{model ? model.volatilityIndex : 18}%</span>
             </div>
             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-500" style={{ width: `${model ? model.volatilityIndex : 18}%` }} />
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


const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap size={16} />,
  droplets: <Droplets size={16} />,
  database: <Database size={16} />,
  factory: <Factory size={16} />,
  users: <Users size={16} />,
  shield: <Shield size={16} />,
  activity: <Activity size={16} />
};

function DependenciesView({ handleAction, actionState }: any) {
  const [data, setData] = React.useState<any>(null);
  const wsRef = React.useRef<WebSocket | null>(null);

  const fetchData = async () => {
    try {
      const res = await graphqlRequest(GQL_GET_DEPENDENCIES);
      if (res.getDependenciesData) setData(res.getDependenciesData);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchData();

    const wsUrl = window.location.protocol === 'https:' 
      ? `wss://${window.location.host}/ws/dependencies`
      : `ws://localhost:4000/ws/dependencies`;
      
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'DEPENDENCIES_DATA_UPDATED') {
            setData(msg.data);
          }
        } catch (err) {
          console.error('WS parsing error', err);
        }
      };
    } catch (err) {
      console.error('WS Connection error', err);
    }
    
    return () => wsRef.current?.close();
  }, []);

  const onGenerate = async () => {
    handleAction('deps', async () => {
      await graphqlRequest(GQL_GENERATE_DEPENDENCIES);
    });
  };

  const nodes = data?.nodes || [];
  const edges = data?.edges || [];

  return (
    <div className="bg-[#030712] border border-slate-800 rounded-3xl p-6 h-[700px] flex flex-col relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10 max-w-sm">
        <h3 className="text-xl font-bold text-white tracking-tight mb-2 flex items-center justify-between">
          System Dependency Graph
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          Mapping critical cascading nodes. Highlighted paths indicate high vulnerability to chained failures where one disruption's cascading effects become visible instantly.
        </p>
        <button onClick={onGenerate} disabled={actionState.status === 'loading'} className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700 text-xs disabled:opacity-50">
          {actionState.status === 'loading' && actionState.id === 'deps' ? 'Simulating...' : 'Simulate New Cascade'}
        </button>
      </div>

      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-4">
        <div className="text-[10px] font-mono text-gray-400 mb-2 uppercase tracking-wider">Node Status Legend</div>
        <div className="flex items-center gap-3 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Optimal</div>
        <div className="flex items-center gap-3 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-amber-500" /> Strained</div>
        <div className="flex items-center gap-3 text-xs text-gray-300"><div className="w-2 h-2 rounded-full bg-rose-500" /> High Vulnerability</div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-80 mt-12">
        <div className="relative w-full max-w-4xl h-full ml-20 mt-10">
          
          {nodes.map((n: any, idx: number) => {
             const yPercent = nodes.length > 1 ? 15 + (idx * (80 / (nodes.length - 1))) : 50;
             const color = n.status === 'high_vulnerability' ? 'rose' : (n.status === 'strained' ? 'amber' : 'emerald');
             return (
               <DependencyNode 
                 key={n.id} 
                 x="50%" 
                 y={`${yPercent}%`} 
                 color={color as 'emerald'|'amber'|'rose'} 
                 icon={iconMap[n.icon] || <Zap size={16} />} 
                 title={n.title} 
               />
             )
          })}

          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
             {edges.map((e: any, idx: number) => {
                const fromIdx = nodes.findIndex((n: any) => n.id === e.fromId);
                const toIdx = nodes.findIndex((n: any) => n.id === e.toId);
                if (fromIdx === -1 || toIdx === -1) return null;

                const y1 = nodes.length > 1 ? 15 + (fromIdx * (80 / (nodes.length - 1))) : 50;
                const y2 = nodes.length > 1 ? 15 + (toIdx * (80 / (nodes.length - 1))) : 50;
                
                let strokeColor = PALETTE.emerald;
                let strokeWidth = "2";
                let classes = "opacity-80";
                
                if (e.status === 'high_vulnerability') {
                   strokeColor = PALETTE.rose;
                   strokeWidth = "3";
                   classes = "opacity-80 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)] animate-pulse";
                } else if (e.status === 'strained') {
                   strokeColor = PALETTE.amber;
                   classes = "opacity-50";
                }

                return (
                  <path key={idx} d={`M 50% ${y1}% L 50% ${y2}%`} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={e.status === 'high_vulnerability' ? "none" : "4 2"} fill="none" className={classes} />
                )
             })}
          </svg>
        </div>
      </div>
    </div>
  );
}
function DependencyNode({ x, y, color, icon, title }: { key?: React.Key, x: string, y: string, color: 'emerald'|'amber'|'rose', icon: React.ReactNode, title: string }) {
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

function InfrastructureView({ handleAction, actionState }: any) {
  const [data, setData] = React.useState<any>(null);
  const wsRef = React.useRef<WebSocket | null>(null);

  const fetchData = async () => {
    try {
      const res = await graphqlRequest(GQL_GET_INFRASTRUCTURE);
      if (res.getInfrastructureData) setData(res.getInfrastructureData);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchData();

    const wsUrl = window.location.protocol === 'https:' 
      ? `wss://${window.location.host}/ws/infrastructure`
      : `ws://localhost:4000/ws/infrastructure`;
      
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'INFRASTRUCTURE_DATA_UPDATED') {
            setData(msg.data);
          }
        } catch (err) {
          console.error('WS parsing error', err);
        }
      };
    } catch (err) {
      console.error('WS Connection error', err);
    }
    
    return () => wsRef.current?.close();
  }, []);

  const onSimulate = async () => {
    handleAction('infra', async () => {
      await graphqlRequest(GQL_SIMULATE_INFRASTRUCTURE_UPDATE);
    });
  };

  const nodes = data?.nodes || [];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Real-Time Infrastructure</h3>
          <p className="text-xs text-gray-400 mt-1">Live telemetry from critical national nodes.</p>
        </div>
        <button onClick={onSimulate} disabled={actionState.status === 'loading'} className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700 text-xs disabled:opacity-50">
          {actionState.status === 'loading' && actionState.id === 'infra' ? 'Updating...' : 'Simulate Live Update'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {nodes.map((n: any) => (
          <InfrastructureCard 
            key={n.id}
            id={n.id}
            title={n.title} 
            icon={iconMap[n.icon] || <Server size={20} className="text-indigo-400" />}
            status={n.status}
            statusColor={n.statusColor}
            load={n.load}
            metrics={n.metrics}
          />
        ))}
      </div>
    </div>
  );
}

function InfrastructureCard({ id, title, icon, status, statusColor, load, metrics }: any) {
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
              NODE_ID: {id}
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
