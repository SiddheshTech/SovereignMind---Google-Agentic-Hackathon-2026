import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  Compass, Eye, ShieldCheck, Globe, Activity, Cpu, Layers, Zap, Check, 
  ArrowRight, Heart, Award, Sparkles, Clock, Settings, Droplets, 
  Sun, Sprout, Users, ShieldAlert, AlertTriangle, RefreshCw, Calendar,
  Navigation, CheckCircle, HelpCircle, ChevronRight
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface HomeNarrativeProps {
  onNavigate: (tab: 'home' | 'platform' | 'solutions' | 'company' | 'pricing' | 'contact') => void;
}

export function HomeNarrative({ onNavigate }: HomeNarrativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hook scroll progress on the whole narrative container for parallax elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth springs for fluid, physics-based slide effects
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 24 });

  // Custom Transform values for Forward & Reverse scrolling marquees
  const marqueeLeft = useTransform(smoothProgress, [0, 1], ['5%', '-45%']);
  const marqueeRight = useTransform(smoothProgress, [0, 1], ['-45%', '5%']);
  
  // Custom parallax translations for asymmetric floating panels (background, midground, foreground)
  const bgFloatY1 = useTransform(smoothProgress, [0, 1], [0, -120]);
  const bgFloatY2 = useTransform(smoothProgress, [0, 1], [0, 80]);
  const fgFloatY = useTransform(smoothProgress, [0, 1], [0, -180]);
  const scaleEffect = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.05, 0.98]);

  // Section 2: Active challenge/stress panel hover state
  const [hoveredChallenge, setHoveredChallenge] = useState<number | null>(null);
  const challenges = [
    { 
      title: 'Reliable Safe Water Reservoirs', 
      desc: 'Anticipates and patterns municipal freshwater reserve levels ahead of extreme dry cycles, letting towns coordinate water storage early.', 
      icon: Droplets, 
      status: 'Protected',
      color: 'text-pink-400',
      fill: '88%'
    },
    { 
      title: 'Stable Crop Distribution Routes', 
      desc: 'Adapts logistics tracks and regional storage allocations to keep farm deliveries moving smoothly during local harvest anomalies.', 
      icon: Sprout, 
      status: 'Optimal',
      color: 'text-indigo-450',
      fill: '94%'
    },
    { 
      title: 'Local Solar & Battery Buffers', 
      desc: 'Models capacity and energy trends for community solar arrays and backup battery banks to prevent power drops when demand spikes.', 
      icon: Zap, 
      status: 'Secured',
      color: 'text-amber-400',
      fill: '91%'
    },
    { 
      title: 'Cohesive Mutual Aid Planners', 
      desc: 'Gives town halls and state managers real-time cooperative pathways to share reserves during unforeseen cold or warm cycles.', 
      icon: Users, 
      status: 'Established',
      color: 'text-purple-400',
      fill: '100%'
    }
  ];

  // Section 3: Live Sandbox Interactive Coordination Simulator
  const [sandboxParams, setSandboxParams] = useState({
    waterReservoirBuffer: 45,
    localBatteryCapacity: 60,
    farmDeliveryRoutes: 2, // 1 to 4 channels
    communityAidParticipation: 75
  });

  // Calculate live dynamic readiness level
  const calculateReadinessScore = () => {
    const base = 40;
    const waterPart = sandboxParams.waterReservoirBuffer * 0.35;
    const batteryPart = sandboxParams.localBatteryCapacity * 0.25;
    const routePart = sandboxParams.farmDeliveryRoutes * 6.5;
    const aidPart = sandboxParams.communityAidParticipation * 0.15;
    return Math.round(Math.min(100, base + waterPart + batteryPart + routePart + aidPart));
  };

  // Section 4: Current active focus module selector
  const [activeSegment, setActiveSegment] = useState<'reservoir' | 'distribution' | 'energy' | 'cabinet'>('reservoir');

  // Multi-step animated interactive simulated timeline year selection
  const [activeYear, setActiveYear] = useState<2026 | 2030 | 2040 | 2050>(2026);
  const yearForecasts = {
    2026: {
      temperatureRisk: 'Low to Moderate',
      aquiferStability: '92% (High Reserve)',
      logisticsBottlenecks: 'Minimal impact projected',
      preparednessIndex: 82,
      strategyPath: 'Initial installation of municipal reserve sensors.'
    },
    2030: {
      temperatureRisk: 'Moderate to High',
      aquiferStability: '85% (Optimal Stability)',
      logisticsBottlenecks: 'Occasional seasonal deviations',
      preparednessIndex: 89,
      strategyPath: 'Interconnected battery bank arrays fully activated across state borders.'
    },
    2040: {
      temperatureRisk: 'High Climate Deviations',
      aquiferStability: '76% (Active Coordination Needed)',
      logisticsBottlenecks: 'Managed rerouting active',
      preparednessIndex: 94,
      strategyPath: 'Automatic grain corridor buffer transfers triggered by seasonal metrics.'
    },
    2050: {
      temperatureRisk: 'Extreme Weather Variations',
      aquiferStability: '68% (Strong Mutual Sharing)',
      logisticsBottlenecks: 'Optimally mitigated by local hubs',
      preparednessIndex: 98,
      strategyPath: 'Complete regional self-reliance. Zero community power failures.'
    }
  };

  // Continuous status logging array for simulation visualization
  const [userSafetyLogs, setUserSafetyLogs] = useState<string[]>([
    'Reservoir water indicators operating in stable zones.',
    'Regional storage balances synchronized.',
    'Cooperative grain delivery pathways fully mapped.',
  ]);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const liveAlerts = [
        'Evaluating local groundwater saturation across rural basins.',
        'Sustaining stable supply channel routes to western distribution points.',
        'Verifying backup solar bank reserve capacity metrics.',
        'Optimizing cooling safe zone locations for summer community programs.',
        'Updating mutual sharing agreements between neighbor municipalities.',
      ];
      const selectedAlert = liveAlerts[Math.floor(Math.random() * liveAlerts.length)];
      setUserSafetyLogs(prev => [
        ...prev.slice(-2),
        `[${new Date().toLocaleTimeString()}] Info: ${selectedAlert}`
      ]);
    }, 4000);
    return () => clearInterval(logInterval);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#030303] text-white">
      
      {/* Background Graphic Grid system with overlapping elements and floating lines */}
      <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden pointer-events-none opacity-20 select-none z-0">
        
        {/* Animated dynamic line path 1 */}
        <svg className="absolute top-[5%] left-[10%] w-[80vw] h-[600px] text-pink-400/10" viewBox="0 0 1000 600" fill="none">
          <motion.path 
            d="M 50,550 C 150,450 250,50 400,250 C 550,450 750,150 950,50" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeDasharray="8 6"
            animate={{ strokeDashoffset: [-60, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
          />
        </svg>

        {/* Animated dynamic line path 2 (Reverse flowing) */}
        <svg className="absolute top-[40%] right-[10%] w-[75vw] h-[500px] text-amber-400/5" viewBox="0 0 1000 500" fill="none">
          <motion.path 
            d="M 950,450 C 800,350 650,50 500,200 C 350,350 200,100 50,50" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeDasharray="12 8"
            animate={{ strokeDashoffset: [0, 80] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          />
        </svg>

        {/* Floating gradient orb fields to give beautiful spatial depth */}
        <motion.div 
          style={{ y: bgFloatY1 }}
          className="absolute top-[12%] left-[15%] w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[140px]"
        />
        <motion.div 
          style={{ y: bgFloatY2 }}
          className="absolute top-[50%] right-[10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px]"
        />
        <motion.div 
          style={{ y: fgFloatY }}
          className="absolute bottom-[10%] left-[20%] w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[130px]"
        />
      </div>

      {/* Main Narrative Structure */}
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto space-y-48 py-24 relative z-10 overflow-hidden">
        
        {/* ======================================= */}
        {/* SECTION 2: THE GLOBAL CHALLENGE */}
        {/* ======================================= */}
        <section id="global-challenge" className="min-h-screen flex flex-col justify-center relative pt-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Content Column - Asymmetric offset styling */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-8 lg:pr-8">
              
              <ScrollReveal>
                <div className="space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 bg-pink-400/10 border border-pink-500/15 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase text-pink-300 font-semibold shadow-[0_0_15px_rgba(45,212,191,0.06)]">
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-ping" />
                    <span>CIVIC RESILIENCE SYSTEM</span>
                  </div>
                  
                  {/* Extreme display typo pairing */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-none text-white font-sans">
                    A changing world <br/>
                    <span className="font-extrabold text-pink-400 drop-shadow-[0_0_20px_rgba(45,212,191,0.15)] italic">proactively</span> managed.
                  </h2>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed font-sans font-light">
                  Our shared community safety is too important to manage with emergency reactions. When unpredictable weather challenges or shipping delays affect essential networks, paper planning spreadsheets are not enough. 
                </p>
              </ScrollReveal>

              {/* Offset asymmetric detail row */}
              <ScrollReveal delay={0.3}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/10 lg:translate-x-4">
                  <div className="space-y-2 border-l-2 border-pink-400 pl-4">
                    <span className="text-xs font-mono font-bold text-pink-400 tracking-wider">01 // RESOURCE INTEGRATION</span>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Instead of tracking water, farming, and electricity in silos, we bundle them into one clear coordinated ecosystem.
                    </p>
                  </div>
                  
                  <div className="space-y-2 border-l-2 border-indigo-450 pl-4">
                    <span className="text-xs font-mono font-bold text-indigo-400 tracking-wider">02 // PREVENTIVE ACTIONS</span>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We model upcoming seasonal dry spells to let agricultural groups and municipal councils set aside reserves beforehand.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

            </div>

            {/* Right Media Graphic Column - Interactive Stress Matrix with zero empty space */}
            <div className="lg:col-span-6 flex items-center">
              <ScrollReveal delay={0.4} className="w-full">
                <div className="relative p-6 md:p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/40 to-neutral-950/90 backdrop-blur-md shadow-2xl overflow-hidden">
                  
                  {/* Decorative background grid vector */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="absolute top-0 right-0 p-4 text-[9px] font-mono text-gray-500 tracking-widest">
                    SYSTEM STATUS: OK
                  </div>

                  <span className="text-xs font-mono text-gray-400 block mb-6 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
                    MUNICIPAL HARMONIZER INDICATORS (HOVER VALUES)
                  </span>

                  <div className="space-y-4">
                    {challenges.map((item, idx) => {
                      const IconComp = item.icon;
                      const isSelected = hoveredChallenge === idx;
                      return (
                        <div
                          key={item.title}
                          onMouseEnter={() => setHoveredChallenge(idx)}
                          onMouseLeave={() => setHoveredChallenge(null)}
                          className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden ${
                            isSelected 
                              ? 'border-pink-500/30 bg-pink-950/10 translate-x-2' 
                              : 'border-white/5 bg-white/[0.01] hover:border-white/15'
                          }`}
                        >
                          {/* Inner bar indicator representing safety margin */}
                          <div className="absolute left-0 top-0 bottom-0 bg-pink-400/[0.02] transition-all" style={{ width: item.fill }} />

                          <div className="flex items-center gap-3.5 relative z-10">
                            <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-pink-400/20 text-pink-300' : 'bg-neutral-800 text-gray-400'}`}>
                              <IconComp size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                              <p className="text-[11px] text-gray-400">Coordination Priority Model</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-right justify-between sm:justify-end relative z-10">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">RESILIENT LEVEL</span>
                              <span className={`text-xs font-mono font-bold ${item.color}`}>{item.status}</span>
                            </div>
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-black/60 font-mono text-xs text-white">
                              {item.fill}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reactive information overlay card - fully filling the matrix container footprint */}
                  <div className="mt-6 p-4 rounded-xl border border-white/5 bg-black/40 min-h-[90px] flex items-center relative z-20">
                    {hoveredChallenge !== null ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 8 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="space-y-1"
                      >
                        <span className="text-[9px] font-mono text-pink-400 uppercase tracking-widest font-bold flex items-center gap-2">
                          <Compass size={12} className="animate-spin text-pink-400" style={{ animationDuration: '6s' }} />
                          PREDICTIVE STRATEGY Blueprints:
                        </span>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {challenges[hoveredChallenge].desc}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-400">
                        <Activity size={18} className="text-pink-400 animate-pulse shrink-0" />
                        <span className="text-xs italic leading-snug">
                          Position your cursor over any priority area above to understand how SovereignMind protects community infrastructure before crises.
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </ScrollReveal>
            </div>

          </div>
        </section>

        {/* ======================================= */}
        {/* SECTION 3: INTRODUCING SOVEREIGNMIND */}
        {/* ======================================= */}
        <section id="introducing-sovereignmind" className="min-h-screen flex flex-col justify-center relative">
          <ScrollReveal>
            <div className="bg-neutral-900/20 border border-white/10 rounded-3xl p-8 lg:p-14 relative overflow-hidden isolate shadow-3xl">
              
              {/* Complex SVG flow layout wrapping the section title to represent connectedness */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[130px] -z-10" />
              <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] -z-10" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Text Block - Left-aligned with deliberate offset padding */}
                <div className="lg:col-span-7 space-y-6 text-left lg:pr-6">
                  <span className="text-xs font-mono text-pink-400 tracking-widest uppercase block font-semibold">
                    CRAFTED FOR COMMUNITY RELIABILITY
                  </span>
                  
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
                    Simple communication. <br/>
                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 underline decoration-purple-400/30">Continuous</span> safety.
                  </h3>
                  
                  <p className="text-base md:text-lg text-gray-350 font-sans font-light leading-relaxed">
                    SovereignMind bridges the divide between physical environments and the planning decisions of community departments. By gathering safe, public, non-personal numbers—such as regional snow levels, soil wetness margins, and backup water basin storage—we construct straightforward, understandable foresight models.
                  </p>

                  <p className="text-sm text-gray-400 font-sans leading-relaxed">
                    Local state managers, town halls, agricultural unions, and water cooperatives can now observe resource trends together in one clear picture, taking smart decisions months before problems start.
                  </p>

                  {/* Asymmetric mini bento highlight list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-6 border-t border-white/5">
                    <div className="flex gap-3 items-start p-3 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl border border-white/5 transition-all">
                      <CheckCircle size={16} className="text-pink-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-mono block text-white font-semibold">Decisions Made Early</span>
                        <p className="text-[11px] text-gray-400">Forecast dry seasons from soil water patterns.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start p-3 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl border border-white/5 transition-all">
                      <CheckCircle size={16} className="text-pink-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-mono block text-white font-semibold">Shared Storage Access</span>
                        <p className="text-[11px] text-gray-400">Cooperative reserves mapped for adjacent towns.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Radar Visualizer Device Frame with zero blank spaces */}
                <div className="lg:col-span-5 bg-black/50 border border-white/10 rounded-2xl p-6 space-y-6 relative flex flex-col justify-between">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-pink-400 block font-bold tracking-widest uppercase">
                        RECONSTRUCTED RADAR BLUEPRINT
                      </span>
                      <span className="text-[11px] text-gray-400 block">Real-time resource radar simulation</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-450 animate-pulse" />
                  </div>

                  <div className="relative h-64 border border-white/5 rounded-xl bg-neutral-950 overflow-hidden flex items-center justify-center">
                    
                    {/* Concentric rings represent reservoir stages */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:16px_16px]" />
                    
                    <motion.div 
                      animate={{ scale: [0.98, 1.05, 0.98] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      className="absolute w-44 h-44 border border-pink-400/15 rounded-full"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
                      className="absolute w-28 h-28 border border-pink-400/10 rounded-full"
                    />
                    <div className="absolute w-12 h-12 border border-pink-400/30 rounded-full" />

                    {/* Laser line sweeping sweep */}
                    <motion.div 
                      className="absolute top-1/2 left-1/2 w-28 h-[2px] bg-gradient-to-r from-pink-400 to-transparent origin-left"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                    />

                    {/* Anchored Nodes with labels */}
                    <div className="absolute top-[22%] left-[28%] flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6] animate-ping" />
                      <span className="text-[9px] font-mono text-pink-300 mt-1 uppercase">Main Basin Secure</span>
                    </div>

                    <div className="absolute bottom-[28%] right-[22%] flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#f472b6] animate-pulse" />
                      <span className="text-[9px] font-mono text-purple-300 mt-1 uppercase">Regional Grain Buffer</span>
                    </div>

                    <div className="absolute bottom-[48%] left-[62%] flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse" />
                      <span className="text-[9px] font-mono text-amber-300 mt-1 uppercase">Backup Power Link</span>
                    </div>

                    {/* Central anchor focus */}
                    <div className="w-3 h-3 bg-white rounded-full border-2 border-black z-10 shadow-[0_0_12px_white]" />
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 pt-1">
                    <span>COOPERATION INDEX SCORE</span>
                    <span className="text-indigo-400 font-semibold uppercase tracking-wider">99.1% RELIABLE</span>
                  </div>
                </div>

              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================= */}
        {/* SECTION 4: CAPABILITY SHOWCASE & LIVE SANDBOX */}
        {/* ======================================= */}
        <section id="capability-showcase" className="min-h-screen flex flex-col justify-center relative">
          <ScrollReveal>
            <div className="space-y-12">
              
              {/* Editorial asymmetric header layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-8 space-y-4 text-left">
                  <span className="text-xs font-mono text-pink-400 tracking-widest uppercase block font-semibold">
                    THE STABILITY PLAYGROUND
                  </span>
                  
                  <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
                    Simulate Preparedness Realities <br/>
                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">Before</span> Challenges Happen
                  </h3>
                </div>
                
                <div className="lg:col-span-4 text-left lg:text-right pb-2">
                  <p className="text-xs text-gray-450 font-sans">
                    Use our interactive simulator inside this panel to forecast how modifying community storage buffer allocations instantly safeguards town resilience.
                  </p>
                </div>
              </div>

              {/* Segment selectors and Sandbox Interface Wrapper - filled entirely, no whitespace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6">
                
                {/* Left Side: Category descriptions card */}
                <div className="lg:col-span-5 flex flex-col col-space gap-4 justify-center">
                  {[
                    {
                      id: 'reservoir',
                      title: 'Water Basin Protection',
                      tag: 'REGIONAL RESERVOIRS',
                      desc: 'Tracks precipitation averages and aquifer levels, projecting safe drainage margins for the seasons.'
                    },
                    {
                      id: 'distribution',
                      title: 'Food Supply Support Paths',
                      tag: 'SUPPLY CHANNELS',
                      desc: 'Identifies neighboring farming cooperative silos and distribution coordinates to redirect food reserves smoothly.'
                    },
                    {
                      id: 'energy',
                      title: 'Clean Electric Microgrids',
                      tag: 'LOCAL POWER FLOW',
                      desc: 'Adjusts storage parameters for neighborhood solar banks and grid batteries to absorb extreme climate peaks.'
                    },
                    {
                      id: 'cabinet',
                      title: 'Civic Resilience Cabinets',
                      tag: 'COORDINATED PLANNING',
                      desc: 'Provides non-technical, simple instructions to town leaders, helping community safety responders work together.'
                    }
                  ].map((segment) => {
                    const isSelected = activeSegment === segment.id;
                    return (
                      <button
                        key={segment.id}
                        onClick={() => setActiveSegment(segment.id as any)}
                        className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'bg-neutral-900/60 border-pink-500/50 shadow-[0_0_25px_rgba(45,212,191,0.06)] translate-x-2' 
                            : 'border-white/5 hover:border-white/10 bg-white/[0.01]'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[9px] font-mono tracking-wider font-bold ${isSelected ? 'text-pink-400' : 'text-gray-500'}`}>
                            {segment.tag}
                          </span>
                          {isSelected && <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />}
                        </div>
                        <h4 className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-gray-350'}`}>
                          {segment.title}
                        </h4>
                        <p className="text-xs text-gray-400 font-sans mt-1.5 leading-relaxed">
                          {segment.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Right Side: Interactive Sandbox Graph panel with zero padding or empty gaps */}
                <div className="lg:col-span-7 bg-[#050505] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden min-h-[500px]">
                  
                  {/* Backdrop glowing aesthetic coordinates lines */}
                  <div className="absolute inset-0 bg-[#000] bg-[linear-gradient(rgba(20,184,166,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.01)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Top segment title and description depending on active state */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-950/20 border border-purple-500/20 px-3 py-1 rounded-sm uppercase font-semibold">
                        ACTIVE LIVE PREVIEW RENDER
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">RESILIENT BLUEPRINTS v1.2</span>
                    </div>

                    <div className="space-y-2">
                      {activeSegment === 'reservoir' && (
                        <motion.div key="reservoir" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <h4 className="text-2xl font-light text-white">Water Basin Protection Profile</h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-sans">
                            Estimates how combining high alpine snow melt trends with active ground aquifer levels prevents municipal fresh water failures. Perfect for water coop administrators.
                          </p>
                        </motion.div>
                      )}
                      
                      {activeSegment === 'distribution' && (
                        <motion.div key="distribution" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <h4 className="text-2xl font-light text-white">Food Supply Support Paths</h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-sans">
                            Helps rural food alliances shift grain reserve deliveries and optimize transport roads to keep local supply lines going. Ensures crop safety.
                          </p>
                        </motion.div>
                      )}

                      {activeSegment === 'energy' && (
                        <motion.div key="energy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <h4 className="text-2xl font-light text-white">Local Electricity Microgrids</h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-sans">
                            Balances demand and cloud-cover patterns for solar microgrids and backup battery banks to guarantee a continuous power supply in dry and hot cycles.
                          </p>
                        </motion.div>
                      )}

                      {activeSegment === 'cabinet' && (
                        <motion.div key="cabinet" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <h4 className="text-2xl font-light text-white">Sovereign Decision Cabinets</h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-sans">
                            Translates highly complicated, overwhelming scientific simulation metrics into simple, bulletproof instructions that town leaders and planners can easily implement together.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Central interactive preview meters showing simulated trends */}
                  <div className="relative z-10 py-6 my-6 border-t border-b border-white/5 space-y-4 bg-black/60 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono text-gray-400 tracking-wider block font-bold uppercase mb-2">
                      LIVE SIMULATED CONTROLS (DRAG PARAMETERS)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Control 1 */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-300">
                          <span>WATER RESERVE CAPACITY:</span>
                          <span className="text-pink-400 font-bold">{sandboxParams.waterReservoirBuffer}%</span>
                        </div>
                        <input 
                          type="range" min="15" max="95" 
                          value={sandboxParams.waterReservoirBuffer} 
                          onChange={(e) => setSandboxParams(prev => ({ ...prev, waterReservoirBuffer: Number(e.target.value) }))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-400" 
                        />
                      </div>

                      {/* Control 2 */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-300">
                          <span>BATTERY STORAGE BUFFER:</span>
                          <span className="text-pink-400 font-bold">{sandboxParams.localBatteryCapacity}%</span>
                        </div>
                        <input 
                          type="range" min="20" max="90" 
                          value={sandboxParams.localBatteryCapacity} 
                          onChange={(e) => setSandboxParams(prev => ({ ...prev, localBatteryCapacity: Number(e.target.value) }))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500" 
                        />
                      </div>

                      {/* Control 3 */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-300">
                          <span>DELIVERY ROUTE REDUNDANCY:</span>
                          <span className="text-pink-400 font-bold">{sandboxParams.farmDeliveryRoutes}x channels</span>
                        </div>
                        <input 
                          type="range" min="1" max="4" 
                          value={sandboxParams.farmDeliveryRoutes} 
                          onChange={(e) => setSandboxParams(prev => ({ ...prev, farmDeliveryRoutes: Number(e.target.value) }))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400" 
                        />
                      </div>

                      {/* Control 4 */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-300">
                          <span>MUTUAL AID PARTICIPATION:</span>
                          <span className="text-pink-400 font-bold">{sandboxParams.communityAidParticipation}%</span>
                        </div>
                        <input 
                          type="range" min="30" max="95" 
                          value={sandboxParams.communityAidParticipation} 
                          onChange={(e) => setSandboxParams(prev => ({ ...prev, communityAidParticipation: Number(e.target.value) }))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                        />
                      </div>

                    </div>
                  </div>

                  {/* Dynamic calculation score bar bottom display */}
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-pink-500/5 border border-pink-500/10 p-4 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <p className="text-[10px] font-mono text-gray-400">CULMINATIVE SHIELD COEFFICIENT:</p>
                      <span className="text-indigo-400 font-mono text-xs font-semibold uppercase animate-pulse">
                        Calculating live...
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-400" style={{ width: `${calculateReadinessScore()}%` }} />
                      </div>
                      <span className="text-lg font-bold font-mono text-pink-400 drop-shadow-[0_0_10px_#f472b6]">
                        {calculateReadinessScore()}% SECURED
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </ScrollReveal>
        </section>

        {/* ======================================= */}
        {/* SECTION 5: HOW IT CHANGES SYSTEM PLANNING */}
        {/* ======================================= */}
        <section id="how-it-changes" className="min-h-screen flex flex-col justify-center relative">
          <ScrollReveal>
            <div className="space-y-12">
              
              <div className="max-w-3xl space-y-4 text-left">
                <span className="text-xs font-mono text-pink-400 tracking-widest uppercase block font-semibold">
                  TRANSITION MATRIX
                </span>
                
                <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
                  Moving Communities Beyond Continuous Emergency Response
                </h3>
                
                <p className="text-sm text-gray-400 font-sans max-w-2xl leading-relaxed">
                  In traditional planning, societies wait for water deficits or winter power disruptions to occur, triggering delayed, hurried reactions. SovereignMind coordinates preparation continuously.
                </p>
              </div>

              {/* Unique asymmetrically offset columns with controlled vertical transformations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6 relative">
                
                {/* Column A: Traditional Legacy (Pillaged background, offset leftwards) */}
                <div className="lg:col-span-4 bg-gradient-to-b from-rose-950/10 to-transparent border border-rose-500/15 rounded-3xl p-6.5 space-y-6 relative hover:border-rose-500/30 transition-all">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-rose-450 tracking-wider font-bold uppercase block">
                      PREVIOUS STATE // REACTIONARY
                    </span>
                    <h4 className="text-2xl font-light text-white">Classic Reactive Planning</h4>
                  </div>

                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Local areas evaluate their challenges independently, with no continuous information sharing across municipal bounds.
                  </p>

                  <ul className="space-y-4 text-xs text-gray-400 font-sans">
                    <li className="flex gap-2.5 items-start">
                      <span className="text-rose-500 font-extrabold text-sm leading-none">•</span>
                      <span>Disjointed agricultural silo buffers managed with outdated, manual record books.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="text-rose-500 font-extrabold text-sm leading-none">•</span>
                      <span>Untouched reservoir systems empty before upstream safety protocols are manually approved.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="text-rose-500 font-extrabold text-sm leading-none">•</span>
                      <span>Local blackout risks when extreme seasonal demand hits neighboring grid circles concurrently.</span>
                    </li>
                  </ul>
                </div>

                {/* Column B: SovereignMind Integration (Offset center, pulled downward for beautiful rhythm) */}
                <div className="lg:col-span-4 bg-neutral-900/40 border border-pink-500/25 rounded-3xl p-7 space-y-6 relative shadow-[0_15px_30px_rgba(0,0,0,0.4)] lg:translate-y-6 hover:border-pink-400/40 transition-all">
                  <div className="absolute top-0 right-0 p-3.5 text-[8px] font-mono text-pink-400 uppercase tracking-widest font-semibold">
                    ACTIVE COORDINATION
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-pink-400 tracking-wider font-bold uppercase block animate-pulse">
                      STEER SCHEMA // LIVE MODELING
                    </span>
                    <h4 className="text-2xl font-light text-white">The Coordinated Pathway</h4>
                  </div>

                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    SovereignMind continuously models the physical resources of adjacent states to create mutual preparation plans.
                  </p>

                  <ul className="space-y-3 text-xs text-gray-200 font-sans">
                    <li className="flex gap-2.5 items-start">
                      <Check size={14} className="text-pink-400 mt-0.5 shrink-0" />
                      <span>Cooperative grain supply paths kept smoothly operational through automated buffers.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check size={14} className="text-pink-400 mt-0.5 shrink-0" />
                      <span>Smart water reserve allocations optimized ahead of seasonal snowmelt and heat cycles.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <Check size={14} className="text-pink-400 mt-0.5 shrink-0" />
                      <span>Interconnected municipal battery grids communicating backup capacities dynamically.</span>
                    </li>
                  </ul>
                </div>

                {/* Column C: Realized Stability Future state */}
                <div className="lg:col-span-4 bg-gradient-to-b from-purple-950/10 to-transparent border border-white/5 rounded-3xl p-6.5 space-y-6 relative hover:border-white/15 transition-all">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-purple-400 tracking-wider font-bold uppercase block">
                      OUTCOME PERSPECTIVE
                    </span>
                    <h4 className="text-2xl font-light text-white">Assured Community Safety</h4>
                  </div>

                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    By making safety parameters easily accessible, neighbor cooperative groups can withstand extreme events seamlessly.
                  </p>

                  <div className="pt-4 border-t border-white/5 space-y-3.5">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                      <span className="text-gray-300">Decision-Making Efficiency:</span>
                      <span className="font-mono text-pink-400 font-semibold">90% faster alignment</span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                      <span className="text-gray-300">Stable Water Provision:</span>
                      <span className="font-mono text-pink-400 font-semibold">99.8% guaranteed continuity</span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                      <span className="text-gray-300">Food Safe Corridors:</span>
                      <span className="font-mono text-pink-400 font-semibold">Multiple fallback tracks</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </ScrollReveal>
        </section>

        {/* ======================================= */}
        {/* SECTION 6: STRATEGIC OUTCOMES */}
        {/* ======================================= */}
        <section id="strategic-outcomes" className="min-h-screen flex flex-col justify-center relative">
          <ScrollReveal>
            <div className="space-y-12">
              
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-xs font-mono text-pink-400 tracking-widest uppercase block font-semibold animate-pulse">
                  TANGIBLE BENEFIT SCHEMES
                </span>
                
                <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
                  Ten Pillars of Modern Civil Protection
                </h3>
                
                <p className="text-sm text-gray-400 font-sans leading-relaxed max-w-xl mx-auto">
                  We verify real preparedness through human-oriented metrics: clean drinking water, accessible food networks, solar buffers, and cooperative planning.
                </p>
              </div>

              {/* Massive, beautifully packed bento grid with zero empty padding */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {[
                  {
                    title: 'Clean Drinking Water Arrays',
                    desc: 'Protects critical reservoir basins, mapping deep groundwater saturation balances ahead of dry heat cycles.',
                    icon: Droplets,
                    code: 'WAT-01',
                    metric: 'Protected aquifers'
                  },
                  {
                    title: 'Cooperative Farm Corridors',
                    desc: 'Maintains transport lines for grain harvest networks, establishing shared supply buffers for rural areas.',
                    icon: Sprout,
                    code: 'FARM-02',
                    metric: 'Zero road delays'
                  },
                  {
                    title: 'Solar Array Battery Reserves',
                    desc: 'Integrates local green energy storage lines to run uninterrupted during winter peak-demand phases.',
                    icon: Zap,
                    code: 'PWR-03',
                    metric: 'Uninterrupted grids'
                  },
                  {
                    title: 'Strategic Wheat & Grain Silos',
                    desc: 'Sustains critical storage coordinates to optimize distribution speeds if logistical bottlenecks open.',
                    icon: Layers,
                    code: 'FOOD-04',
                    metric: 'Reserves guaranteed'
                  },
                  {
                    title: 'Accessible Safety Safe-Zones',
                    desc: 'Identifies well-sheltered public state buildings as cooling or heating safe zones during thermal deviations.',
                    icon: Compass,
                    code: 'ZONE-05',
                    metric: 'Always open'
                  },
                  {
                    title: 'Simple Council Briefing Paths',
                    desc: 'Translates heavy meteorological trends into direct, simple instructions so town councils can acts easily.',
                    icon: Users,
                    code: 'CNCL-06',
                    metric: 'Clear action sheets'
                  },
                  {
                    title: 'Aquifer Recharging Programs',
                    desc: 'Maintains optimal soil wetness indexes, stabilizing river flows and preventing agricultural dry spells.',
                    icon: Sprout,
                    code: 'AQF-07',
                    metric: 'Moisture secured'
                  },
                  {
                    title: 'Adjacent Town Co-ops',
                    desc: 'Supports mutual-aid sharing pacts, letting adjacent municipalities exchange water or power reserves instantly.',
                    icon: Heart,
                    code: 'MUT-08',
                    metric: 'Shared safety'
                  },
                  {
                    title: 'Dynamic Snowmelt Trackers',
                    desc: 'Monitors early mountain snowmelt values to coordinate downstream reservoir capacity safely beforehand.',
                    icon: Activity,
                    code: 'MELT-09',
                    metric: 'Precise safety margins'
                  },
                  {
                    title: 'Uninterrupted Wireless Links',
                    desc: 'Reinforces backup communication channels between local coordinators if central utility servers go offline.',
                    icon: Globe,
                    code: 'COM-10',
                    metric: 'Continuous contact'
                  }
                ].map((pillar, idx) => (
                  <div
                    key={pillar.title}
                    className="group relative p-6 rounded-3xl border border-white/5 bg-[#080808]/40 hover:border-pink-550/30 transition-all duration-300 flex flex-col justify-between h-[230px] overflow-hidden"
                  >
                    {/* SVG faint geometric decor lines to fill bento card spaces */}
                    <svg className="absolute bottom-1 right-1 w-16 h-16 text-white/[0.01] group-hover:text-pink-400/5 transition-colors" viewBox="0 0 100 100">
                      <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="20" y1="0" x2="20" y2="100" stroke="currentColor" strokeWidth="0.5" />
                      <circle cx="20" cy="20" r="4" fill="currentColor" />
                    </svg>

                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-pink-400 font-bold uppercase">
                          {pillar.code} // SECTOR PILLAR
                        </span>
                        <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-500/20">
                          {pillar.metric}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {(() => {
                          const IconComp = pillar.icon;
                          return <IconComp size={16} className="text-pink-400 animate-pulse shrink-0" />;
                        })()}
                        <h4 className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors">
                          {pillar.title}
                        </h4>
                      </div>

                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans font-light">
                        {pillar.desc}
                      </p>
                    </div>

                    <div className="text-[9px] font-mono text-gray-500 relative z-10 flex items-center gap-1.5 uppercase">
                      <Sparkles size={10} className="text-pink-500" />
                      <span>Validated planning standard</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </ScrollReveal>
        </section>

        {/* ======================================= */}
        {/* SECTION 7: WHO IT SERVES & INTERACTIVE TIMELINE FORECAST */}
        {/* ======================================= */}
        <section id="who-it-serves" className="min-h-screen flex flex-col justify-center relative">
          <ScrollReveal>
            <div className="space-y-12">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-8 space-y-4 text-left">
                  <span className="text-xs font-mono text-pink-400 tracking-widest uppercase block font-semibold animate-pulse">
                    YEARS OF FORESIGHT MODELING
                  </span>
                  
                  <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
                    Future Preparedness Index Forecast
                  </h3>
                </div>
                
                <div className="lg:col-span-4 text-left lg:text-right pb-1">
                  <p className="text-xs text-gray-450 font-mono">
                    SELECT CALENDAR YEAR TARGET TO CHANGE FORECASTS
                  </p>
                </div>
              </div>

              {/* Spectacular interactive year slider/forecast matrix */}
              <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-neutral-900/10 backdrop-blur-sm relative overflow-hidden">
                <svg className="absolute top-0 right-0 w-32 h-32 text-pink-400/[0.02]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
                </svg>

                {/* Years Selector Timeline Header */}
                <div className="flex flex-wrap items-center justify-around gap-4 border-b border-white/5 pb-6">
                  {([2026, 2030, 2040, 2050] as const).map((year) => {
                    const isYearActive = activeYear === year;
                    return (
                      <button
                        key={year}
                        onClick={() => setActiveYear(year)}
                        className={`px-6 py-3 rounded-2xl font-mono text-base font-bold tracking-widest transition-all cursor-pointer flex flex-col items-center gap-1 relative ${
                          isYearActive 
                            ? 'bg-pink-400 text-black shadow-[0_0_20px_rgba(45,212,191,0.25)] scale-105' 
                            : 'bg-white/[0.01] text-gray-400 hover:text-white hover:bg-white/[0.03] border border-white/5'
                        }`}
                      >
                        <span>{year}</span>
                        <span className={`text-[9px] uppercase ${isYearActive ? 'text-black/70' : 'text-gray-500'}`}>
                          {year === 2026 ? 'Launch Target' : `+${year - 2026} Years`}
                        </span>
                        
                        {isYearActive && (
                          <span className="absolute -bottom-1 w-2.5 h-2.5 bg-pink-400 rotate-45" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Year Output panels */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
                  
                  {/* Left segment specs */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-pink-400 block font-bold uppercase">
                        HYPOTHETICAL PATTERN AND SYSTEM PLAN
                      </span>
                      <h4 className="text-2xl font-light text-white">
                        Preparedness Landscape at year {activeYear}
                      </h4>
                    </div>

                    <p className="text-sm text-gray-300 font-sans leading-relaxed">
                      SovereignMind continuously simulates weather anomalies and demographic coordinates to protect community lifelines. In {activeYear}, our modeling path indicates:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[9px] font-mono text-gray-500 uppercase">ANTICIPATED TEMPERATURE STRESS</span>
                        <p className="text-sm font-semibold text-white">{yearForecasts[activeYear].temperatureRisk}</p>
                      </div>

                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[9px] font-mono text-gray-500 uppercase">AQUIFER & BASIN STABILITY RATIO</span>
                        <p className="text-sm font-semibold text-white">{yearForecasts[activeYear].aquiferStability}</p>
                      </div>

                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[9px] font-mono text-gray-500 uppercase">DELIVERY LANE BOTTLENECKS EXPECTED</span>
                        <p className="text-sm font-semibold text-white">{yearForecasts[activeYear].logisticsBottlenecks}</p>
                      </div>

                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[9px] font-mono text-gray-505 uppercase">SUSTAINED INITIATIVE BLUEPRINT</span>
                        <p className="text-xs text-pink-400 leading-tight font-sans font-light">
                          {yearForecasts[activeYear].strategyPath}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Right side metric circle */}
                  <div className="lg:col-span-4 bg-black/60 rounded-2xl border border-white/5 p-6 flex flex-col justify-between items-center text-center">
                    <div>
                      <span className="text-[9px] font-mono text-gray-400 tracking-wider block font-bold uppercase mb-1">
                        PROJECTED CIVIL SHIELD
                      </span>
                      <span className="text-[11px] text-gray-500">Predicted Safety Coefficient</span>
                    </div>

                    <div className="relative w-36 h-36 flex items-center justify-center my-4">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Underlay tracking ring */}
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                        {/* Overlay animated colored track representing index score value */}
                        <motion.circle 
                          cx="50" cy="50" r="40" 
                          stroke="#f472b6" strokeWidth="6" fill="transparent" 
                          strokeDasharray="251"
                          strokeDashoffset={251 - (251 * yearForecasts[activeYear].preparednessIndex) / 100}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </svg>
                      
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-extrabold font-mono text-white">
                          {yearForecasts[activeYear].preparednessIndex}
                        </span>
                        <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest font-bold">
                          INDEX RATIO
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-indigo-450 uppercase font-bold tracking-widest animate-pulse">
                      ★ optimal shield criteria met
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </ScrollReveal>
        </section>

        {/* ======================================= */}
        {/* SECTION 8: WHY NOW */}
        {/* ======================================= */}
        <section id="why-now" className="min-h-screen flex flex-col justify-center relative">
          <ScrollReveal>
            <div className="bg-neutral-900/10 border border-white/10 rounded-3xl p-8 lg:p-14 relative overflow-hidden shadow-2xl">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Left informational column */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <span className="text-xs font-mono text-rose-455 tracking-widest uppercase block font-semibold text-rose-400">
                    THE CURRENT CRISIS GAP
                  </span>
                  
                  <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
                    Why Preventive Steps Cannot Wait
                  </h3>
                  
                  <p className="text-base text-gray-300 font-sans font-light leading-relaxed">
                    Unpredictable weather variations, sudden global supply line blockages, and increasing population focus are placing multi-dimensional strains on our foundational systems.
                  </p>

                  <p className="text-sm text-gray-450 font-sans leading-relaxed">
                    By modeling resources continuously with simple, friendly parameters, SovereignMind protects towns from unexpected failures. Relying on simple, offline spreadsheets leaves us exposed when system strains happen at the same time. Modern protection begins with reliable integration.
                  </p>

                  <div className="border-l-2 border-pink-400 pl-4 py-2 bg-pink-950/15 rounded-r-xl p-3">
                    <span className="text-[10px] font-mono text-pink-400 block font-bold uppercase tracking-wider mb-0.5">
                      DIRECTOR COOPERATIVE COUNSEL:
                    </span>
                    <p className="text-xs text-gray-300 italic font-sans">
                      "Charting resource connections in one regional network saves months of frantic emergency response. Cooperation is the ultimate defense layer."
                    </p>
                  </div>
                </div>

                {/* Right Visualizer Curve Trend graph - highly customized to fill the column perfectly */}
                <div className="lg:col-span-5 bg-neutral-950 rounded-2xl border border-white/5 p-6 space-y-6 relative flex flex-col justify-between h-[360px]">
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-widest">
                      PREDICTED CONVERGENCE INDEX
                    </span>
                    <span className="text-[8px] font-mono text-rose-400 bg-rose-950/20 border border-rose-500/20 px-2 py-0.5 animate-pulse uppercase">
                      unmitigated delta risk
                    </span>
                  </div>

                  <div className="relative h-48 border-b border-l border-white/10 flex items-end">
                    
                    {/* SVG Curve for classic reactionary cascade line */}
                    <svg className="absolute inset-0 w-full h-full text-rose-500/10" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 0,90 Q 25,85 50,55 T 100,5" stroke="currentColor" strokeWidth="1" fill="none" />
                      <circle cx="100" cy="5" r="3" fill="#ef4444" className="animate-pulse" />
                    </svg>

                    {/* SVG Curve for SovereignMind managed stable line */}
                    <svg className="absolute inset-0 w-full h-full text-pink-400/25" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 0,90 Q 30,85 60,82 T 100,80" stroke="currentColor" strokeWidth="1.8" fill="none" />
                      <circle cx="100" cy="80" r="3" fill="#f472b6" />
                    </svg>

                    <span className="absolute right-4 top-12 text-[9px] font-mono text-rose-450 uppercase font-bold text-right">
                      UNPLANNED CRITICAL DRY CYCLE <br/>
                      <span className="text-gray-500 font-normal">Silos empty rapidly</span>
                    </span>

                    <span className="absolute right-4 bottom-14 text-[9px] font-mono text-pink-400 uppercase font-bold text-right">
                      SOVEREIGNMIND MANAGED STABILITY <br/>
                      <span className="text-gray-500 font-normal">Silos balanced smoothly</span>
                    </span>
                  </div>

                  <div className="flex justify-between text-[8px] font-mono text-gray-450 leading-none">
                    <span>TIMELINE COMMENCEMENT</span>
                    <span>FUTURE TIMELINES</span>
                  </div>

                </div>

              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ======================================= */}
        {/* SECTION 9: FUTURE VISION & TEXT HIGHLIGHT-ON-SCROLL */}
        {/* ======================================= */}
        <section id="future-vision" className="min-h-screen flex flex-col justify-center relative overflow-hidden">
          <div className="space-y-12">
            
            <ScrollReveal>
              <div className="space-y-4 text-left">
                <span className="text-xs font-mono text-pink-400 tracking-widest uppercase block font-semibold">
                  A PERPETUAL HUMAN ASSURANCE
                </span>
                
                <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
                  Providing Municipalities With Its Primary Coordination Layer
                </h3>
              </div>
            </ScrollReveal>

            {/* Scrolling Highlight paragraph block */}
            <ScrollReveal delay={0.15}>
              <div className="p-6 md:p-12 rounded-3xl border border-white/5 bg-neutral-900/10 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(45,212,191,0.06),transparent_60%)] pointer-events-none" />
                
                <div className="space-y-6 text-lg md:text-2xl font-light max-w-4xl leading-relaxed text-gray-450 font-sans">
                  <p>
                    <span className="text-white font-semibold">Just as companies use robust software to balance their capital, our communities require dependable tools to sustain vital lifelines.</span>
                  </p>
                  <p>
                    SovereignMind integrates environmental patterns, harvest schedules, and battery storages into a single, simple, understandable platform. By keeping safety metrics clear and available, we ensure freshwater pipelines, solar grids, and shipping lanes operate seamlessly through the seasons ahead.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Connected SVG Pipe corridors flows layout to fill space beautifully */}
            <ScrollReveal delay={0.3}>
              <div className="relative h-28 border border-white/5 rounded-3xl bg-black/40 p-5 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/10 rounded-full text-pink-400">
                    <Globe size={18} className="animate-spin" style={{ animationDuration: '30s' }} />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-gray-500 block uppercase">REGIONAL SHIELD NETWORK DEPLOYED</span>
                    <span className="text-xs font-semibold text-white">SovereignMind Regional Feeds Active</span>
                  </div>
                </div>

                {/* Flow lines in center */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-around pointer-events-none select-none opacity-20">
                  <div className="w-1/4 h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse" />
                  <div className="w-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
                  <div className="w-1/4 h-[1px] bg-gradient-to-r from-transparent via-pink-300 to-transparent animate-pulse" style={{ animationDelay: '0.8s' }} />
                </div>

                <div className="text-[10px] font-mono text-pink-400 font-semibold uppercase flex items-center gap-1.5 border border-pink-500/20 px-3.5 py-1.5 rounded-full bg-pink-950/20 z-10 shrink-0">
                  <ShieldCheck size={12} className="animate-bounce" />
                  <span>PREPARATION SEALS CERTIFIED SECURE</span>
                </div>

              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* ======================================= */}
        {/* FORWARD & REVERSE SCROLL PARALLAX BANNERS */}
        {/* ======================================= */}
        <section className="py-14 border-t border-b border-white/5 select-none overflow-hidden bg-black/10">
          <div className="space-y-6">
            
            {/* Banner Row 1: Leftward moving scroll banner */}
            <div className="w-full relative whitespace-nowrap overflow-hidden">
              <motion.div 
                style={{ x: marqueeLeft }}
                className="inline-flex gap-10 text-2xl md:text-3xl text-white/20 tracking-widest font-mono font-light uppercase"
              >
                <span>SAFEGUARD WATER RESERVOIRS</span>
                <span className="text-pink-400 font-semibold">•</span>
                <span>PROTECT SMALLHOLDER FARMS</span>
                <span className="text-pink-400 font-semibold">•</span>
                <span>MUTUAL SHARING AGREEMENTS</span>
                <span className="text-pink-400 font-semibold">•</span>
                <span>SECURE HARVEST TRANSPORT CORRIDORS</span>
                <span className="text-pink-400 font-semibold">•</span>
                <span>MUNICIPAL ENERGY STRENGTH</span>
                <span className="text-pink-400 font-semibold">•</span>
                <span>SAFEGUARD WATER RESERVOIRS</span>
                <span className="text-pink-400 font-semibold">•</span>
                <span>PROTECT SMALLHOLDER FARMS</span>
              </motion.div>
            </div>

            {/* Banner Row 2: Rightward moving scroll banner */}
            <div className="w-full relative whitespace-nowrap overflow-hidden">
              <motion.div 
                style={{ x: marqueeRight }}
                className="inline-flex gap-10 text-2xl md:text-3xl text-pink-400/20 tracking-widest font-mono font-light uppercase"
              >
                <span>PREVENT DROUGHT CYCLE DISRUPTIONS</span>
                <span className="text-white/20 font-semibold">•</span>
                <span>SIMPLE COOPERATIVE ACTION MODELS</span>
                <span className="text-white/20 font-semibold">•</span>
                <span>CONTINUOUS PREPARATION AND CONFIDENCE</span>
                <span className="text-white/20 font-semibold">•</span>
                <span>STABLE CIVIL PROTECTION HORIZON</span>
                <span className="text-white/20 font-semibold">•</span>
                <span>PREVENT DROUGHT CYCLE DISRUPTIONS</span>
                <span className="text-white/20 font-semibold">•</span>
                <span>SIMPLE COOPERATIVE ACTION MODELS</span>
              </motion.div>
            </div>

          </div>
        </section>

        {/* ======================================= */}
        {/* SECTION 10: FINAL CALL TO ACTION */}
        {/* ======================================= */}
        <section id="final-cta" className="min-h-[60vh] flex flex-col justify-center pb-16 relative border-t border-white/5">
          <ScrollReveal>
            <div className="bg-[#050505] border border-pink-500/20 rounded-3xl p-10 md:p-14 text-center max-w-5xl mx-auto space-y-8 relative overflow-hidden shadow-[0_0_40px_rgba(45,212,191,0.06)]">
              
              {/* Radial background visual highlight */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="space-y-3 relative z-10">
                <span className="text-xs font-mono text-pink-400 tracking-widest uppercase block font-semibold animate-pulse">
                  PREPARATION ACTION MATRIX INITIATED
                </span>
                
                <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-none text-white max-w-3xl mx-auto">
                  Protect and Empower Your <br/>
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.1)]">Communities</span> Today
                </h2>
              </div>

              <p className="text-sm md:text-base text-gray-300 font-sans max-w-2xl mx-auto leading-relaxed relative z-10 font-light">
                Secure your municipality, planning committee, or agricultural alliance with the easy-to-use forecasting models needed to run farms, water arrays, and solar microgrids cleanly through upcoming seasons.
              </p>

              <div className="flex flex-wrap justify-center gap-5 pt-4 relative z-10">
                <button
                  id="btn-cta-briefing"
                  onClick={() => onNavigate('contact')}
                  className="bg-white text-black px-8 py-4 rounded-xl font-bold text-sm hover:bg-pink-400 hover:text-black transition-colors duration-250 cursor-pointer flex items-center gap-2.5 shadow-lg"
                >
                  <span>Request Safe Briefing Dossier</span>
                  <ArrowRight size={15} />
                </button>
                
                <button
                  id="btn-cta-demonstration"
                  onClick={() => onNavigate('contact')}
                  className="liquid-glass border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer"
                >
                  Schedule a Live Demonstration
                </button>
              </div>

              {/* Bottom system-status indicators using simple comforting terms */}
              <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-[10px] font-mono text-gray-500 gap-4 relative z-10 uppercase">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                  <span>REGIONAL RESERVOIRS AND SOLAR LINKS: OPTIMIZED</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span>PLANNER CONNECTION CODE: SECURE</span>
                  <span>SERVICE RUNTIME PATHWAY: COMPLIANT</span>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </section>

      </div>
    </div>
  );
}
