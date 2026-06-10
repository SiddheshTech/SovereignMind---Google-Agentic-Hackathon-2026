import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ShieldAlert, Radio, Activity, Cpu, Database, AlertCircle } from 'lucide-react';

interface ScenarioDetail {
  id: string;
  name: string;
  status: string;
  duration: string;
  impactPath: string;
  mitigationImpact: string;
  summary: string;
  metrics: { name: string; value: string; trend: 'up' | 'down' }[];
}

const SCENARIOS: ScenarioDetail[] = [
  {
    id: 'scen-1',
    name: 'Solar Flare Grid Interference',
    status: 'ACTIVE SIMULATION RUNNING',
    duration: 'Estimated Duration: 14 Days',
    impactPath: 'Physical grid lines saturation → Satellite positioning disruption → Autonomous shipping freeze',
    mitigationImpact: 'Sovereign local redundant fuel reserves deployed; auxiliary ground towers boot within 4 minutes.',
    summary: 'Sovereign Mind simulated a Category X solar burst over sub-national power conduits. Strategic backups diverted thermal loads instantly, preventing an estimated 81% regional economic stall.',
    metrics: [
      { name: 'Grid Capacity', value: '94.2%', trend: 'up' },
      { name: 'Comm Lag', value: '42ms', trend: 'down' },
      { name: 'Corridor Loss', value: '0.4%', trend: 'down' }
    ]
  },
  {
    id: 'scen-2',
    name: 'Sub-National Settlement Freeze',
    status: 'ACTIVE SIMULATION RUNNING',
    duration: 'Estimated Duration: 48 Hours',
    impactPath: 'Central currency pipeline blockage → Regional bank run panic → Cognitive system distrust cascade',
    mitigationImpact: 'Sovereign Mind autonomous ledger balances activated; local trade indices verified via regional nodes.',
    summary: 'A stress test model simulating high-volume institutional withdrawal of monetary liquidity. Secondary ledger credit protocols deployed automatically, keeping local transactions fluid and active.',
    metrics: [
      { name: 'Liquidity Ratio', value: '88.5%', trend: 'up' },
      { name: 'Capital Flow', value: '97.2%', trend: 'up' },
      { name: 'Panic Index', value: '2.1%', trend: 'down' }
    ]
  },
  {
    id: 'scen-3',
    name: 'Agrarian Supply Corridor Halt',
    status: 'ACTIVE SIMULATION RUNNING',
    duration: 'Estimated Duration: 30 Days',
    impactPath: 'Fertilizer trade constraint → Crop output harvest warning → Distribution fleet labor strike',
    mitigationImpact: 'Dynamic relocation of import streams + automated state grain vertical distribution triggers.',
    summary: 'A model mapping systemic crop harvest variables. Sovereign Mind redirected shipping corridors to secondary land networks 12 days before local distributors registered regional depletion limits.',
    metrics: [
      { name: 'Reserve Buffer', value: '120 Days', trend: 'up' },
      { name: 'Transit Speed', value: '+14%', trend: 'up' },
      { name: 'Price Spike Risk', value: '1.2%', trend: 'down' }
    ]
  },
  {
    id: 'scen-4',
    name: 'Cognitive Narrative Polarization Shock',
    status: 'ACTIVE SIMULATION RUNNING',
    duration: 'Estimated Duration: Ongoing',
    impactPath: 'Coordinated narrative flooding → Regional polarization spikes → Local civic coordination freeze',
    mitigationImpact: 'Information validation signatures deployed across state feeds to stabilize cognitive metrics.',
    summary: 'Simulation of system-wide cognitive disruption under targeted narrative drops. High-fidelity verification tags displayed immediately on all state interfaces, slowing polarization momentum.',
    metrics: [
      { name: 'Cohesion Score', value: '91.8%', trend: 'up' },
      { name: 'Polarization Speed', value: '-35%', trend: 'down' },
      { name: 'Info Conf', value: '94.5%', trend: 'up' }
    ]
  }
];

export function BentoResilience() {
  const [activeTab, setActiveTab] = useState<string>('scen-1');
  const activeScenario = SCENARIOS.find(s => s.id === activeTab) || SCENARIOS[0];

  return (
    <div className="w-full">
      <div className="mb-8">
        <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">Resilience Engineering Architecture</span>
        <h3 className="text-2xl md:text-3xl font-normal text-white mt-1">Sovereign Defensive Systems</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        
        {/* Tile 1: Control Panel (Span col-1) */}
        <div className="liquid-glass border border-white/20 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-mono text-white font-semibold">BLACK SWAN SIMULATOR</span>
            </div>
            <h4 className="text-xl font-normal text-white">Trigger Stresstests</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Launch dynamic systemic crisis simulations to observe real-time risk cascades and verify Sovereign Minds pre-allocated defensive strategies.
            </p>
          </div>

          <div className="space-y-3">
            {SCENARIOS.map((scen) => {
              const isActive = activeTab === scen.id;
              return (
                <button
                  key={scen.id}
                  onClick={() => setActiveTab(scen.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black border-white'
                      : 'bg-black/20 text-gray-400 border-white/5 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span className="truncate">{scen.name}</span>
                  <Play size={12} className={isActive ? 'text-black fill-black' : 'text-gray-500'} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Tile 2: Live Screen Simulation (Span col-2 on lg) */}
        <div className="lg:col-span-2 liquid-glass border border-white/20 rounded-2xl p-6 lg:p-8 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4 gap-2">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Simulation Output Diagnostics</span>
              <h4 className="text-lg font-medium text-white">{activeScenario.name}</h4>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 bg-white/5 text-pink-400 font-semibold rounded-md border border-white/10 w-fit">
              {activeScenario.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Vector Layout */}
            <div className="lg:col-span-4 flex flex-col justify-center items-center py-4 bg-black/30 border border-white/5 rounded-xl">
              <span className="text-[10px] font-mono text-gray-500 mb-2 uppercase">Cascade Vector Path</span>
              
              <svg className="w-24 h-24 overflow-visible" viewBox="0 0 100 100">
                {/* SVG path mapping cascade connection nodes */}
                <circle cx="50" cy="15" r="5" className="fill-white" />
                <circle cx="20" cy="55" r="5" className="fill-white" />
                <circle cx="80" cy="55" r="5" className="fill-white" />
                <circle cx="50" cy="85" r="6" className="fill-pink-400 animate-pulse" />

                {/* Animated Paths */}
                <line x1="50" y1="15" x2="20" y2="55" className="stroke-white/30" strokeWidth="2" />
                <line x1="50" y1="15" x2="80" y2="55" className="stroke-white/30" strokeWidth="2" />
                <line x1="20" y1="55" x2="50" y2="85" className="stroke-white/30" strokeWidth="2 animate-pulse" />
                <line x1="80" y1="55" x2="50" y2="85" className="stroke-white/30" strokeWidth="2 animate-pulse" />
                
                {/* Glowing points */}
                <path d="M 50,15 L 20,55" className="stroke-white" strokeWidth="2" strokeDasharray="100" strokeDashoffset="100">
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="2s" repeatCount="indefinite" />
                </path>
                <path d="M 50,15 L 80,55" className="stroke-white" strokeWidth="2" strokeDasharray="100" strokeDashoffset="100">
                  <animate attributeName="stroke-dashoffset" values="100;0" dur="2s" repeatCount="indefinite" />
                </path>
              </svg>

              <span className="text-[9px] font-mono text-pink-400 mt-3 animate-pulse uppercase tracking-widest">
                Mitigation Succeeded
              </span>
            </div>

            {/* Metrics and text detail */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Cascader Impact Chain</span>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed italic bg-white/5 p-2 rounded border border-white/5">
                  {activeScenario.impactPath}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Sovereign Recovery Factor</span>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed font-mono">
                  {activeScenario.mitigationImpact}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                {activeScenario.metrics.map((m, idx) => (
                  <div key={idx} className="border border-white/5 bg-white/[0.02] p-2.5 rounded-lg text-center">
                    <span className="block text-[9px] font-mono text-gray-400 uppercase truncate">{m.name}</span>
                    <span className="text-xs font-semibold text-white mt-1 block">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Deep Narrative Summary */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex gap-3">
            <ShieldAlert size={20} className="text-gray-300 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              {activeScenario.summary}
            </p>
          </div>
        </div>

        {/* Tile 3: Modern Methodology Strategy (Span col-1) */}
        <div className="liquid-glass border border-white/20 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block"><Radio size={12} className="inline mr-1" /> CORE VECTOR THEORY</span>
            <h4 className="text-lg font-normal text-white">Resilience Engineering</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sovereign Mind operates on the absolute tenet that traditional reactive risk models are obsolete. True protection requires pre-allocated material buffers and real-time informational defenses operating at autonomous speeds.
            </p>
          </div>
          <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-[10px] font-mono text-gray-400 leading-relaxed">
            Methodologies incorporate dynamic multi-lateral trade route shifting, high-fidelity source verification hashes, and sub-national energy balance coordination.
          </div>
        </div>

        {/* Tile 4: Dynamic SVG Micro-Plot (Span col-1) */}
        <div className="liquid-glass border border-white/20 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block"><Activity size={12} className="inline mr-1" /> MULTI-CHANNEL BUFFER</span>
            <h4 className="text-lg font-normal text-white">Sovereign Buffer Quotient</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Real-time monitoring of essential state capacity margins across primary strategic physical distribution hubs.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-gray-400">Physical Buffer Flow</span>
              <span className="text-pink-400">+14% (Optimized)</span>
            </div>
            <div className="w-full h-8 bg-black/40 border border-white/5 rounded p-1 flex items-end gap-[2px]">
              {/* Custom simulated bar columns */}
              {[40, 55, 60, 45, 70, 85, 90, 75, 80, 95].map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-white hover:bg-pink-400 transition-colors cursor-pointer"
                  style={{ height: `${val}%` }}
                  title={`Sub-channel cluster buffer load: ${val}%`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Tile 5: Digital Sovereign Assets Axiom (Span grid col-1) */}
        <div className="liquid-glass border border-white/20 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block"><Cpu size={12} className="inline mr-1" /> INFOLOGY MATRIX</span>
            <h4 className="text-lg font-normal text-white">Cognitive Safeguards</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Algorithmic verification layers integrated directly within national informational corridors to secure societal narrative alignment.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-pink-400 bg-pink-950/20 border border-pink-500/20 p-2.5 rounded-xl">
            <Database size={12} />
            <span>Encrypted Network Coherence: ACTV</span>
          </div>
        </div>

      </div>
    </div>
  );
}
