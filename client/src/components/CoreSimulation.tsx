import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sliders, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';

export function CoreSimulation() {
  const DEFAULT_SIMULATION_STATE = Object.freeze({
    year: 2050,
    redundantGrid: true,
    cognitiveGuards: false,
    strategicCorridors: true
  });

  const [projectionYear, setProjectionYear] = useState<number>(DEFAULT_SIMULATION_STATE.year);
  const [hasRedundantGrid, setHasRedundantGrid] = useState<boolean>(DEFAULT_SIMULATION_STATE.redundantGrid);
  const [hasCognitiveGuards, setHasCognitiveGuards] = useState<boolean>(DEFAULT_SIMULATION_STATE.cognitiveGuards);
  const [hasStrategicCorridors, setHasStrategicCorridors] = useState<boolean>(DEFAULT_SIMULATION_STATE.strategicCorridors);

  // Computations based on slider and toggle values
  const systemState = useMemo(() => {
    const yearDiff = projectionYear - 2026;
    
    // Base deteriorations over time
    let resourceBuffer = Math.max(12, 85 - yearDiff * 0.85);
    let cognitiveCohesion = Math.max(20, 92 - yearDiff * 1.1);
    let sovereignAlignment = Math.max(10, 78 - yearDiff * 0.6);

    // Apply active mitigation factors
    if (hasRedundantGrid) {
      resourceBuffer = Math.min(98, resourceBuffer + 20);
    }
    if (hasCognitiveGuards) {
      cognitiveCohesion = Math.min(95, cognitiveCohesion + 25);
    }
    if (hasStrategicCorridors) {
      sovereignAlignment = Math.min(90, sovereignAlignment + 18);
      resourceBuffer = Math.min(98, resourceBuffer + 8);
    }

    // Overall Civilizational Stability Score calculation
    const overallStability = Math.round((resourceBuffer * 0.4) + (cognitiveCohesion * 0.35) + (sovereignAlignment * 0.25));

    // Dynamic warning card determined by selections
    let statusPhrase = "Stable Cohesion State";
    let statusClass = "text-pink-400";
    let statusCardClass = "border-pink-500/20 bg-pink-950/20";
    let statusNotice = "All critical physical and informative flows are operating within standard parameters under current resilience models.";

    if (overallStability < 50) {
      statusPhrase = "System Collapse Velocity Initiated";
      statusClass = "text-rose-400";
      statusCardClass = "border-rose-500/30 bg-rose-950/30";
      statusNotice = "Critical systemic failure cascade detected. Systemic trust deficits and logistical resource blockages exceed buffer reserves.";
    } else if (overallStability < 70) {
      statusPhrase = "Elevated Transition Stress";
      statusClass = "text-amber-400";
      statusCardClass = "border-amber-500/30 bg-amber-950/30";
      statusNotice = "System under transition pressure. Marginal buffers require active state deployment. Decentralized logistics are advised.";
    }

    // Points for custom SVG chart
    const chartPoints = Array.from({ length: 8 }, (_, i) => {
      const x = i * 40;
      const yr = 2026 + i * 10;
      const yrDiff = yr - 2026;
      let val = 85 - yrDiff * 0.85;
      if (hasRedundantGrid) val += 15;
      if (hasCognitiveGuards && yr > 2040) val += 12;
      if (hasStrategicCorridors) val += 10;
      
      const valPercentage = Math.round(Math.max(15, Math.min(95, val)));
      const y = 120 - (valPercentage / 100) * 100;
      return { x, y, val: valPercentage, year: yr };
    });

    const svgPath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return {
      resourceBuffer: Math.round(resourceBuffer),
      cognitiveCohesion: Math.round(cognitiveCohesion),
      sovereignAlignment: Math.round(sovereignAlignment),
      overallStability,
      statusPhrase,
      statusClass,
      statusCardClass,
      statusNotice,
      chartPoints,
      svgPath,
    };
  }, [projectionYear, hasRedundantGrid, hasCognitiveGuards, hasStrategicCorridors]);

  return (
    <div className="w-full liquid-glass border border-white/20 rounded-3xl p-6 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Panel Controls Left */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-mono text-gray-400 tracking-wider flex items-center gap-1.5 uppercase">
              <Sliders size={14} /> Interactive Scenario Engine
            </span>
            <h4 className="text-2xl font-normal text-white mt-1">Projection Console</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Vary the temporal scope slider and allocate defensive infrastructure policies dynamically to observe their compound effect on civilization systems.
            </p>
          </div>

          <hr className="border-white/10" />

          {/* Temporal Horizon Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-400 uppercase">Target Horizon</span>
              <span className="text-white font-semibold text-sm">Year {projectionYear}</span>
            </div>
            <input
              type="range"
              min={2026}
              max={2100}
              value={projectionYear}
              onChange={(e) => setProjectionYear(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-ew-resize accent-white"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span>2026 (Now)</span>
              <span>2060</span>
              <span>2100 (Horizon)</span>
            </div>
          </div>

          {/* System Toggles */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-gray-400 uppercase block">Active Redundancy Layers</span>
            
            {/* Toggle 1 */}
            <div
              onClick={() => setHasRedundantGrid(!hasRedundantGrid)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                hasRedundantGrid 
                  ? 'border-white/30 bg-white/5 text-white' 
                  : 'border-white/5 bg-transparent text-gray-400 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium">Physical Infrastructure Redundancy</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Dual-channel sub-national energy grids</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${hasRedundantGrid ? 'bg-white' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full bg-black transition-transform duration-200 ${hasRedundantGrid ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>

            {/* Toggle 2 */}
            <div
              onClick={() => setHasCognitiveGuards(!hasCognitiveGuards)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                hasCognitiveGuards 
                  ? 'border-white/30 bg-white/5 text-white' 
                  : 'border-white/5 bg-transparent text-gray-400 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium">Algorithmic Information Guardrails</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Real-time deepfake & polarization dampening</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${hasCognitiveGuards ? 'bg-white' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full bg-black transition-transform duration-200 ${hasCognitiveGuards ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>

            {/* Toggle 3 */}
            <div
              onClick={() => setHasStrategicCorridors(!hasStrategicCorridors)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                hasStrategicCorridors 
                  ? 'border-white/30 bg-white/5 text-white' 
                  : 'border-white/5 bg-transparent text-gray-400 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium">Sovereign Supply Corridor Alignment</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Multi-lateral land-corridor material treaties</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${hasStrategicCorridors ? 'bg-white' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 rounded-full bg-black transition-transform duration-200 ${hasStrategicCorridors ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setProjectionYear(DEFAULT_SIMULATION_STATE.year);
              setHasRedundantGrid(DEFAULT_SIMULATION_STATE.redundantGrid);
              setHasCognitiveGuards(DEFAULT_SIMULATION_STATE.cognitiveGuards);
              setHasStrategicCorridors(DEFAULT_SIMULATION_STATE.strategicCorridors);
            }}
            className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-fit self-center"
          >
            <RefreshCw size={12} /> Reset Parameters
          </button>
        </div>

        {/* Output Diagnostics Right */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 bg-black/45 border border-white/5 p-6 rounded-2xl relative">
          
          {/* Stability Metric Circle Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase flex items-center gap-1">
              <BarChart2 size={14} /> Live Computations
            </span>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-mono block">Systemic Stability Code</span>
              <span className="text-xs font-mono text-white font-medium">SM-INDEX-{systemState.overallStability}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            
            {/* Visual Gauge */}
            <div className="flex flex-col justify-center items-center relative">
              <div className="relative w-36 h-36 flex items-center justify-center">
                
                {/* SVG Radial Gauge */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-white/5"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-white transition-all duration-500 ease-out"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - systemState.overallStability / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                
                <div className="absolute text-center">
                  <span className="text-4xl font-light text-white tracking-tight">
                    {systemState.overallStability}%
                  </span>
                  <span className="block text-[9px] font-mono text-gray-400 uppercase tracking-widest mt-1">
                    Stability Index
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics List */}
            <div className="flex flex-col justify-center space-y-4">
              {/* Metric 1 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-gray-400 font-medium">Resolidated Infrastructure Buffer</span>
                  <span className="text-white font-mono">{systemState.resourceBuffer}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: `${systemState.resourceBuffer}%` }} />
                </div>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-gray-400 font-medium">Cognitive Cohesion Index</span>
                  <span className="text-white font-mono">{systemState.cognitiveCohesion}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: `${systemState.cognitiveCohesion}%` }} />
                </div>
              </div>

              {/* Metric 3 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-gray-400 font-medium">Sovereign Alliance Alignment</span>
                  <span className="text-white font-mono">{systemState.sovereignAlignment}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: `${systemState.sovereignAlignment}%` }} />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* SVG Trend Chart */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
              70-Year Coexistence Trend projection
            </span>
            <div className="w-full h-24 bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
              <svg className="w-full h-12 overflow-visible">
                {/* SVG trend line path */}
                <path
                  d={systemState.svgPath}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
                
                {/* Nodes */}
                {systemState.chartPoints.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    className="fill-black stroke-white hover:r-5 cursor-pointer transition-all"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
              <div className="flex justify-between text-[8px] font-mono text-gray-500">
                <span>2026 (Now)</span>
                <span>2050</span>
                <span>2070</span>
                <span>2100 (Horizon)</span>
              </div>
            </div>
          </div>

          {/* Dynamic Warning Alert Card */}
          <div className={`p-4 border rounded-xl transition-all ${systemState.statusCardClass}`}>
            <span className={`text-xs font-mono font-semibold uppercase flex items-center gap-1.5 ${systemState.statusClass}`}>
              <ShieldAlert size={14} /> {systemState.statusPhrase}
            </span>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              {systemState.statusNotice}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
