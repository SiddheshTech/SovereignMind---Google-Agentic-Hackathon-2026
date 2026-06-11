import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, AlertTriangle, Cpu, Globe, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  category: 'cognitive' | 'infrastructure' | 'macroeconomics' | 'geopolitical';
  severity: 'Critical' | 'Warning' | 'Predictive';
  systemAffected: string;
  description: string;
  foresightAction: string;
  probability: string;
  cascadingScore: string;
}

const EVENTS: TimelineEvent[] = [
  {
    id: 'ev-1',
    year: 'L-Minus 36 Months',
    title: 'Cognitive Synergy Fragmentation',
    category: 'cognitive',
    severity: 'Critical',
    systemAffected: 'State Informational Networks',
    description: 'Autonomous propagation of coordinated narrative interference models across major networks, leading to a system-wide descent in public institutional confidence scores.',
    foresightAction: 'Deploy cognitive defensive guardrails and algorithmic stabilization models to rebuild regional truth metrics.',
    probability: '94.2%',
    cascadingScore: '9.4/10',
  },
  {
    id: 'ev-2',
    year: 'L-Minus 18 Months',
    title: 'Trans-Continental Freight Grid Lock',
    category: 'infrastructure',
    severity: 'Critical',
    systemAffected: 'Primary Agri-Distribution Nodes',
    description: 'Systemic failure in autonomous sea-lane pathfinders due to magnetic distortion interference. Results in an immediate 14-day supply corridor freeze.',
    foresightAction: 'Dynamic relocation of land corridors and sovereign redundant reserve deployment before retail levels depleted.',
    probability: '88.7%',
    cascadingScore: '8.1/10',
  },
  {
    id: 'ev-3',
    year: 'L-Minus 6 Months',
    title: 'Sub-National Sovereign Bond Flight',
    category: 'macroeconomics',
    severity: 'Warning',
    systemAffected: 'Municipal Liquidity Pools',
    description: 'Algorithms detect anomalous volume of capital withdrawal from sub-national critical accounts into decentralized hard assets.',
    foresightAction: 'Programmed liquidity injection protocols triggered by regional central frameworks, keeping rates stable.',
    probability: '91.0%',
    cascadingScore: '7.8/10',
  },
  {
    id: 'ev-4',
    year: 'Active Model',
    title: 'High-Altitude Mineral Corridor Scarcity',
    category: 'geopolitical',
    severity: 'Predictive',
    systemAffected: 'Rare-earth Superfluid Logistics',
    description: 'Geopolitical realignment leads to unilateral regulatory holds on essential super-conductor raw deposits in high alpine regions.',
    foresightAction: 'Simulation of multi-lateral alternative trade streams and autonomous material substitution reserves.',
    probability: '74.5%',
    cascadingScore: '8.3/10',
  },
  {
    id: 'ev-5',
    year: 'Projection +12 Months',
    title: 'Hyper-Local Thermal Grid Saturation',
    category: 'infrastructure',
    severity: 'Predictive',
    systemAffected: 'Metropolitan Cooling Corridors',
    description: 'Extreme thermal heat dome projections overload regional distribution structures, stressing sub-national population health grids.',
    foresightAction: 'Pre-emptive decentralized hydrogen cooling backup allocation and load sharing algorithm dispatch.',
    probability: '81.4%',
    cascadingScore: '6.9/10',
  }
];

export function RiskTimeline() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent>(EVENTS[0]);

  const categories = [
    { id: 'all', label: 'All Foresights', count: EVENTS.length, icon: Layers },
    { id: 'cognitive', label: 'Cognitive Infrastructure', count: EVENTS.filter(e => e.category === 'cognitive').length, icon: Cpu },
    { id: 'infrastructure', label: 'Physical Logistics', count: EVENTS.filter(e => e.category === 'infrastructure').length, icon: Globe },
    { id: 'macroeconomics', label: 'Economic Liquidity', count: EVENTS.filter(e => e.category === 'macroeconomics').length, icon: ShieldAlert },
    { id: 'geopolitical', label: 'Sovereign Alignment', count: EVENTS.filter(e => e.category === 'geopolitical').length, icon: AlertTriangle },
  ];

  const filteredEvents = EVENTS.filter(e => activeCategory === 'all' || e.category === activeCategory);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">Systemic Risk Anticipation</span>
          <h3 className="text-2xl md:text-3xl font-normal text-white mt-1">Live Crisis Registry</h3>
        </div>
        
        {/* Category Toggles */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  const firstOfCat = EVENTS.find(e => cat.id === 'all' || e.category === cat.id);
                  if (firstOfCat) setSelectedEvent(firstOfCat);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black border-white'
                    : 'bg-black/30 text-gray-400 border-white/10 hover:border-white/30'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-black/10 text-black' : 'bg-white/5 text-gray-300'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Timeline Layout */}
        <div className="lg:col-span-7 space-y-6 relative pl-6 border-l border-white/10">
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent"></div>
          
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((item, index) => {
              const isSelected = selectedEvent.id === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedEvent(item)}
                  className={`group relative p-5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'liquid-glass border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                      : 'bg-black/20 border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Outer Timeline Dot */}
                  <span className={`absolute -left-[31px] top-6 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                    isSelected ? 'bg-white border-white scale-125' : 'bg-black border-white/30 group-hover:border-white/60'
                  }`} />

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-400 font-semibold tracking-wide bg-white/5 px-2.5 py-1 rounded-md">
                      {item.year}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-md ${
                      item.severity === 'Critical' 
                        ? 'bg-rose-950/40 text-rose-300 border border-rose-500/20' 
                        : item.severity === 'Warning' 
                          ? 'bg-amber-950/40 text-amber-300 border border-amber-500/20' 
                          : 'bg-pink-950/40 text-pink-300 border border-pink-500/20'
                    }`}>
                      {item.severity}
                    </span>
                  </div>

                  <h4 className="text-lg font-medium text-white group-hover:text-gray-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs font-mono text-gray-500">
                    <span>Probability: <strong className="text-white font-normal">{item.probability}</strong></span>
                    <span>Cascade Force: <strong className="text-white font-normal">{item.cascadingScore}</strong></span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <motion.div
            key={selectedEvent.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="liquid-glass border border-white/20 rounded-2xl p-6 lg:p-8 space-y-6"
          >
            <div>
              <div className="inline-block bg-white text-black px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                Diagnostic File
              </div>
              <h3 className="text-xl md:text-2xl font-normal text-white tracking-tight leading-tight">
                {selectedEvent.title}
              </h3>
              <p className="text-xs font-mono text-gray-400 mt-2">
                Primary Target Grid: <span className="text-white font-medium">{selectedEvent.systemAffected}</span>
              </p>
            </div>

            <hr className="border-white/10" />

            <div>
              <h5 className="text-xs font-mono font-medium text-gray-400 tracking-wide uppercase mb-2 flex items-center gap-1.5">
                <BookOpen size={14} className="text-gray-400" /> Systemic Vulnerability
              </h5>
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 space-y-2">
              <h5 className="text-xs font-mono font-medium text-white tracking-wide uppercase flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-pink-400" /> Pre-Emptive Mitigation Blueprint
              </h5>
              <p className="text-sm text-gray-400 leading-relaxed">
                {selectedEvent.foresightAction}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border border-white/5 rounded-lg p-3">
                <span className="block text-[10px] font-mono text-gray-400 uppercase">Detection Timeline</span>
                <span className="text-base font-normal text-white mt-1 block">Autonomous Realtime</span>
              </div>
              <div className="border border-white/5 rounded-lg p-3">
                <span className="block text-[10px] font-mono text-gray-400 uppercase">System Cohesion Score</span>
                <span className="text-base font-normal text-pink-400 mt-1 block">Optimized (9.8/10)</span>
              </div>
            </div>

            <button className="w-full bg-white text-black py-3 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 group">
              <span>View Sovereign Resolution Strategy</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
