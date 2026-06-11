import { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, Shield, MapPin, Activity, CheckCircle2 } from 'lucide-react';

interface NetworkNode {
  id: string;
  city: string;
  region: string;
  coords: { x: number; y: number };
  status: 'OPTIMAL' | 'STRESSED' | 'ALERT';
  stability: string;
  cognitiveCohesion: string;
  activeMitigation: string;
  summary: string;
}

const NODES: NetworkNode[] = [
  {
    id: 'node-lon',
    city: 'Geneva Cluster',
    region: 'European Transit Coordination Zone',
    coords: { x: 44, y: 35 }, // SVG mapping x/y percentage coordinates
    status: 'OPTIMAL',
    stability: '96.2%',
    cognitiveCohesion: '94.8%',
    activeMitigation: 'Physical Corridor Pre-clearance Protocols',
    summary: 'The primary Sovereign Mind coordination cluster in Geneva manages trade-lane pre-clearing treaties across Continental corridors, acting as an automated structural shock absorber.',
  },
  {
    id: 'node-sin',
    city: 'Singapore Cluster',
    region: 'Asia-Pacific Logistics Core',
    coords: { x: 74, y: 58 },
    status: 'OPTIMAL',
    stability: '98.0%',
    cognitiveCohesion: '91.2%',
    activeMitigation: 'Sea-lane Path Diversion Autopilot',
    summary: 'Located at the heart of trans-oceanic freight corridors, this Singapore-centered cluster coordinates maritime alternative paths pre-emptively under climate or sovereign cargo blocks.',
  },
  {
    id: 'node-was',
    city: 'Washington Axis',
    region: 'North American Informational Defense',
    coords: { x: 22, y: 38 },
    status: 'ALERT',
    stability: '78.5%',
    cognitiveCohesion: '64.1%',
    activeMitigation: 'Algorithmic Narrative Stabilization',
    summary: 'The Washington cluster registers increased cognitive narrative fragmentation. AI defenses are actively injecting origin-signature metadata into primary informational networks.',
  },
  {
    id: 'node-tok',
    city: 'Tokyo Core',
    region: 'East-Asian Tech Grid Redundancy',
    coords: { x: 82, y: 41 },
    status: 'OPTIMAL',
    stability: '95.4%',
    cognitiveCohesion: '97.1%',
    activeMitigation: 'Autonomous Battery Grid Backup',
    summary: 'Tokyo core manages high-altitude super-conductor distribution reserves. Seamlessly switches load targets dynamically across decentralized regional storage networks.',
  }
];

interface Connection {
  fromId: string;
  toId: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

const CONNECTIONS: Connection[] = [
  { fromId: 'node-was', toId: 'node-lon', from: { x: 220, y: 190 }, to: { x: 440, y: 175 } },
  { fromId: 'node-lon', toId: 'node-sin', from: { x: 440, y: 175 }, to: { x: 740, y: 290 } },
  { fromId: 'node-sin', toId: 'node-tok', from: { x: 740, y: 290 }, to: { x: 820, y: 205 } },
  { fromId: 'node-tok', toId: 'node-was', from: { x: 820, y: 205 }, to: { x: 220, y: 190 } },
  { fromId: 'node-lon', toId: 'node-tok', from: { x: 440, y: 175 }, to: { x: 820, y: 205 } },
  { fromId: 'node-was', toId: 'node-sin', from: { x: 220, y: 190 }, to: { x: 740, y: 290 } },
];

const getArcPath = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 - Math.abs(x1 - x2) * 0.12;
  return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
};

export function GlobalNetwork() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(NODES[0]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">Global Security Topology</span>
          <h3 className="text-2xl md:text-3xl font-normal text-white mt-1">Sovereign Coordinating Network</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-gray-300">
          <Globe size={14} className="text-pink-400 animate-spin-slow" />
          <span>Active Central Nodes: {NODES.length} online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Interactive SVG World Map Column */}
        <div className="lg:col-span-7 bg-white/[0.01] border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center items-center h-[320px] sm:h-[400px]">
          
          {/* Subtle Grid Net */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Abstract SVG Map Contours */}
          <svg className="w-full h-full max-h-[360px] select-none pointer-events-none" viewBox="0 0 1000 500">
            {/* Custom high-tech glowing gradients */}
            <defs>
              <linearGradient id="active-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f472b6" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="passive-white" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.01)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
              </linearGradient>
            </defs>

            {/* Extremely basic mock abstract outline of continents */}
            <path d="M150,150 Q180,180 200,120 T250,140 T300,100 T350,150 T310,220 T240,250 T180,240 Z" fill="rgba(255,255,255,0.05)" />
            <path d="M400,100 Q460,80 500,120 T580,110 T650,150 T600,220 T520,280 T440,210 Z" fill="rgba(255,255,255,0.05)" />
            <path d="M680,120 Q720,100 780,110 T840,150 T890,200 T830,280 T760,250 T700,200 Z" fill="rgba(255,255,255,0.05)" />
            <path d="M220,280 Q250,330 280,380 T290,440 T260,450 T230,370 T200,320 Z" fill="rgba(255,255,255,0.03)" />
            <path d="M500,320 Q540,360 580,410 T600,450 T560,450 T510,400 T480,350 Z" fill="rgba(255,255,255,0.03)" />
            
            {/* Dynamic animated vector lines connecting centers */}
            {CONNECTIONS.map((c, index) => {
              const isConnectedToSelected = selectedNode.id === c.fromId || selectedNode.id === c.toId;
              const pathData = getArcPath(c.from.x, c.from.y, c.to.x, c.to.y);
              
              return (
                <g key={`coord-path-${index}`}>
                  {/* Underlay / static glow line */}
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke={isConnectedToSelected ? "#f472b6" : "white"}
                    strokeWidth={isConnectedToSelected ? "1.5" : "1"}
                    strokeOpacity={isConnectedToSelected ? 0.35 : 0.08}
                    strokeDasharray={isConnectedToSelected ? "none" : "3,3"}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      pathLength: { duration: 1.8, ease: "easeInOut", delay: index * 0.12 },
                    }}
                  />
                  
                  {/* Active glowing line revealed on entering viewport */}
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke={isConnectedToSelected ? "url(#active-teal)" : "url(#passive-white)"}
                    strokeWidth={isConnectedToSelected ? "2.5" : "1.2"}
                    strokeOpacity={isConnectedToSelected ? 0.8 : 0.3}
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      pathLength: { duration: 2.2, ease: "easeInOut", delay: index * 0.15 },
                      opacity: { duration: 0.4, delay: index * 0.15 }
                    }}
                  />

                  {/* Traveling data transmission light pulse on connected routes */}
                  {isConnectedToSelected && (
                    <motion.path
                      d={pathData}
                      fill="none"
                      stroke="#51e2f5"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="15 150"
                      initial={{ strokeDashoffset: 165 }}
                      animate={{ strokeDashoffset: -165 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 3 + index * 0.3,
                        ease: "linear"
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Absolute Placed Nodes on the container */}
          {NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all focus:outline-none group"
                style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
              >
                {/* Node Ring Pulsing */}
                <span className={`absolute inset-0 rounded-full w-6 h-6 -m-2 border transition-all duration-500 opacity-60 ${
                  isSelected 
                    ? 'border-white animate-ping scale-110' 
                    : 'border-white/10 group-hover:border-white/30 group-hover:scale-105'
                }`} />

                {/* Core Dot */}
                <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all flex items-center justify-center ${
                  isSelected 
                    ? 'bg-white border-black scale-125 shadow-[0_0_15px_rgba(255,255,255,0.7)]' 
                    : node.status === 'ALERT'
                      ? 'bg-amber-500 border-black animate-pulse'
                      : 'bg-black border-white/60 group-hover:bg-white'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>

                {/* Floating Micro Label */}
                <span className="absolute left-5 top-0 whitespace-nowrap text-[10px] font-mono text-gray-400 bg-black/90 border border-white/10 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {node.city}
                </span>
              </button>
            );
          })}
        </div>

        {/* Node Metadata Side Info Column */}
        <div className="lg:col-span-5 h-full">
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="liquid-glass border border-white/20 rounded-2xl p-6 lg:p-8 flex flex-col justify-between h-full space-y-6"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 uppercase">
                <MapPin size={12} className="text-gray-400" /> Strategic Cluster Anchor
              </div>
              <h4 className="text-2xl font-normal text-white mt-2 flex items-center gap-2">
                {selectedNode.city}
              </h4>
              <span className="text-xs text-gray-400 block mt-0.5 font-mono">{selectedNode.region}</span>
            </div>

            <hr className="border-white/10" />

            {/* Local Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/5 bg-white/[0.02] p-3 rounded-lg">
                <span className="text-[10px] text-gray-400 font-mono block uppercase">Regional Stability Quotient</span>
                <span className="text-lg font-normal text-white block mt-1">{selectedNode.stability}</span>
              </div>
              <div className="border border-white/5 bg-white/[0.02] p-3 rounded-lg">
                <span className="text-[10px] text-gray-400 font-mono block uppercase">Information Trust Rating</span>
                <span className="text-lg font-normal text-white block mt-1">{selectedNode.cognitiveCohesion}</span>
              </div>
            </div>

            {/* Active Policy Action */}
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Deployed Tactical Safeguard</span>
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                <Shield size={16} className="text-pink-400 shrink-0" />
                <span className="text-xs text-white font-medium">{selectedNode.activeMitigation}</span>
              </div>
            </div>

            {/* Narrative explanation */}
            <div>
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mb-1">Operational Audit</span>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {selectedNode.summary}
              </p>
            </div>

            {/* Status Checklist foot */}
            <div className="flex items-center justify-between text-[11px] font-mono text-pink-400 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Simulation Corridors Verified: True</span>
              </div>
              <Activity size={12} className="animate-pulse" />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
