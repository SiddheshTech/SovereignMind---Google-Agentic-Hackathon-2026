import { useState, useEffect, useRef, MouseEvent, FormEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  Shield, 
  Cpu, 
  Database, 
  Network, 
  Globe, 
  ArrowRight, 
  Layers, 
  Compass, 
  Sliders, 
  ExternalLink, 
  Sparkles, 
  Workflow, 
  ChevronRight, 
  TrendingUp, 
  Zap, 
  User, 
  CheckCircle2, 
  Lock,
  MousePointer,
  Droplets,
  Sun,
  Activity,
  Radio,
  Clock,
  Heart,
  Eye,
  ArrowUpRight,
  RefreshCw,
  Anchor,
  Minimize2,
  ListFilter
} from 'lucide-react';
import { SpaceImmersionCanvas } from './SpaceImmersionCanvas';

interface PlatformPageProps {
  onNavigate: (tab: 'home' | 'platform' | 'solutions' | 'company' | 'pricing' | 'contact' | 'signin' | 'signup') => void;
}

export function PlatformPage({ onNavigate }: PlatformPageProps) {
  // Reveal status for loading screen
  const [isRevealed, setIsRevealed] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);

  // States for live interactive sliders
  const [solarVault, setSolarVault] = useState(82);
  const [waterVitality, setWaterVitality] = useState(72);
  const [airPurity, setAirPurity] = useState(88);
  const [communitySpirit, setCommunitySpirit] = useState(94);
  const [limestoneWarmth, setLimestoneWarmth] = useState(65);

  // Greenhouse Dome States
  const [domeHydration, setDomeHydration] = useState(60);
  const [domeWarmth, setDomeWarmth] = useState(24); // °C
  const [domeVentOpen, setDomeVentOpen] = useState(false);
  const [bloomStage, setBloomStage] = useState(2); // 1 = Sprout, 2 = Bud, 3 = Flowering
  const [isWatering, setIsWatering] = useState(false);

  // Local Community Board States
  const [communityNotes, setCommunityNotes] = useState([
    { id: 1, author: "Lucas (Sector 03)", content: "Harvested fresh mountain rosemary. Placed 4 baskets in the shared cold room.", age: "2 mins ago", thumbs: 12 },
    { id: 2, author: "Aunt Sarah (Sector 01)", content: "Surplus wool blankets prepared for the winter cold shifts. Pick them up any evening.", age: "1 hr ago", thumbs: 18 },
    { id: 3, author: "Clara & Max (Sector 12)", content: "Alpine spring line #W-2 washed and tested clean. Flow rates are beautifully steady.", age: "4 hrs ago", thumbs: 24 }
  ]);
  const [newNoteAuthor, setNewNoteAuthor] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [activeResilienceSystem, setActiveResilienceSystem] = useState<'water' | 'solar' | 'communication' | 'thermal'>('water');
  const [activeStoryCorridor, setActiveStoryCorridor] = useState<'dawn' | 'noon' | 'dusk' | 'midnight'>('dawn');
  const [selectedCoreSector, setSelectedCoreSector] = useState<number | null>(null);

  // Household Independence Calculator States
  const [householdSize, setHouseholdSize] = useState(4);
  const [sunlightHours, setSunlightHours] = useState(6);
  const [activeWaterSource, setActiveWaterSource] = useState<'spring' | 'rain' | 'well'>('spring');

  const [livePeers, setLivePeers] = useState(384);
  const [activeSanctuaries, setActiveSanctuaries] = useState(49);

  // Reference for Mouse Follow Parallax
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-12, 12]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Scroll Tracking & Advanced Anim Vectors
  const { scrollY, scrollYProgress } = useScroll();

  // Scroll-linked background transformations
  const parallaxHeaderY = useTransform(scrollY, [0, 1000], [0, 300]);
  const parallaxGridRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const parallaxSlowerY = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const parallaxFasterY = useTransform(scrollYProgress, [0, 1], [0, -400]);
  
  // Forward & Reverse Marquee Scroll Transforms
  const marqueeForwardX = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const marqueeReverseX = useTransform(scrollYProgress, [0, 1], [200, -200]);

  // SVG Scroll path dash offset control
  const drawLinePathOffset = useTransform(scrollYProgress, [0, 1], [1000, 0]);

  // Text Reveal on Scroll Word highlight controls
  const textOpacityProgress = useTransform(scrollYProgress, [0.4, 0.65], [0, 1]);

  useEffect(() => {
    // Simulator loader
    const interval = setInterval(() => {
      setLoaderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsRevealed(true), 200);
          return 100;
        }
        return prev + 5;
      });
    }, 30);

    // Fluctuate active nodes
    const nodeInterval = setInterval(() => {
      setLivePeers(p => p + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(nodeInterval);
    };
  }, []);

  const DEFAULT_PLATFORM_STATE = Object.freeze({
    solarVault: 80,
    waterVitality: 75,
    airPurity: 90,
    communitySpirit: 95,
    limestoneWarmth: 60
  });

  const resetAllControls = () => {
    setSolarVault(DEFAULT_PLATFORM_STATE.solarVault);
    setWaterVitality(DEFAULT_PLATFORM_STATE.waterVitality);
    setAirPurity(DEFAULT_PLATFORM_STATE.airPurity);
    setCommunitySpirit(DEFAULT_PLATFORM_STATE.communitySpirit);
    setLimestoneWarmth(DEFAULT_PLATFORM_STATE.limestoneWarmth);
  };

  const handleWaterDome = () => {
    if (isWatering) return;
    setIsWatering(true);
    setDomeHydration(prev => Math.min(100, prev + 15));
    setTimeout(() => {
      setIsWatering(false);
      setBloomStage(prev => (prev < 3 ? prev + 1 : 3));
    }, 1500);
  };

  const calculateAutonomyWeeks = () => {
    const baselineDays = 12; // Base days per person for spring
    const sunlightSustenance = sunlightHours * 2.5;
    const waterMultiplier = activeWaterSource === 'spring' ? 1.5 : activeWaterSource === 'well' ? 1.2 : 0.8;
    const totalDaysSustained = Math.round(((baselineDays * 8) / householdSize) * waterMultiplier + sunlightSustenance);
    return (totalDaysSustained / 7).toFixed(1);
  };

  const handlePostNote = (e: FormEvent) => {
    e.preventDefault();
    if (!newNoteAuthor || !newNoteContent) return;
    const note = {
      id: communityNotes.length + 1,
      author: `${newNoteAuthor} (Sector M)`,
      content: newNoteContent,
      age: "Just now",
      thumbs: 1
    };
    setCommunityNotes([note, ...communityNotes]);
    setNewNoteAuthor("");
    setNewNoteContent("");
  };

  const upvoteNote = (id: number) => {
    setCommunityNotes(prev => prev.map(n => n.id === id ? { ...n, thumbs: n.thumbs + 1 } : n));
  };

  const coreSectors = [
    {
      id: 1,
      title: "Alpine Water Siphon",
      subtitle: "Pure mountain pressure flow",
      description: "Harness natural pressure from elevated rock fissures. The mountain feeds your home reservoirs directly downward, meaning you will retain pure, fresh drinking mineral water even during complete zero-power events.",
      simpleLabel: "SIPHON NEST 01",
      val: "95,000 Liters Daily Source Flow",
      accent: "text-pink-400 bg-pink-950/40 border-pink-500/30",
      x: "18%",
      y: "32%"
    },
    {
      id: 2,
      title: "Crystalline Heat Vault",
      subtitle: "Mountain-sheltered solar safety",
      description: "High-absorption silicon shields charge massive battery packs nestled safe beneath solid granite ceilings. Fully protected from climate freezes or regional electricity shortages.",
      simpleLabel: "AMPERE COVE 02",
      val: "320 Kilowatt-Hours Secure Reserve",
      accent: "text-amber-400 bg-amber-950/40 border-amber-500/30",
      x: "72%",
      y: "28%"
    },
    {
      id: 3,
      title: "Cozy Greenhouse Dome",
      subtitle: "Off-Grid Garden Atrium",
      description: "Year-round layered growing zones designed around home-vent warm currents. Clean soil and gravity moisture trickles supply fresh greens effortlessly without chemicals.",
      simpleLabel: "ATRIUM FIELD 03",
      val: "100% Home Food Resilience",
      accent: "text-indigo-400 bg-indigo-950/40 border-indigo-500/30",
      x: "38%",
      y: "72%"
    }
  ];

  return (
    <div 
      id="platform-page-root" 
      ref={containerRef} 
      className="w-full bg-[#030303] text-white overflow-hidden relative font-sans selection:bg-indigo-500 selection:text-black"
    >
      {/* -------------------------------------------------------- */}
      {/* 1. CINEMATIC MULTI-LAYER PRELOADER PANEL                 */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div 
            id="platform-preloader"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center p-6 space-y-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_65%)] pointer-events-none" />
            
            <div className="space-y-6 text-center relative z-10 max-w-lg">
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-t-2 border-l-2 border-indigo-400/90 border-r border-r-purple-400/35 rounded-full mx-auto flex items-center justify-center p-2 mb-4"
              >
                <div className="w-14 h-14 border-b-2 border-purple-400 rounded-full animate-spin duration-4000" />
              </motion.div>
              
              <span className="text-[10px] font-mono tracking-[0.3em] text-indigo-400 uppercase block">
                Initializing Sovereign Space Dashboard
              </span>
              <h2 className="text-4xl font-extralight tracking-tight text-white leading-none">
                The Living <span className="font-semibold text-transparent bg-gradient-to-r from-indigo-400 via-pink-300 to-purple-300 bg-clip-text">Platform</span>
              </h2>
            </div>

            {/* Custom Premium progress track */}
            <div className="w-72 h-[3px] bg-white/[0.04] rounded-full overflow-hidden relative z-10 p-[1px] border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-400 via-pink-300 to-purple-300 rounded-full" 
                style={{ width: `${loaderProgress}%` }}
              />
            </div>

            <div className="flex items-center gap-2 font-mono text-[9px] text-gray-500 relative z-10">
              <RefreshCw size={11} className="animate-spin text-indigo-400" />
              <span>ESTABLISHING SECURE NATURAL MICRO-CYCLES: {loaderProgress}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky top mini-bar */}
      <div className="sticky top-0 left-0 right-0 z-40 bg-[#040404]/85 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          <span className="text-[10px] font-mono tracking-wider text-gray-400">
            SYSTEM STATUS: <span className="text-indigo-400 font-bold">100% REGENERATIVE LIVING</span>
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-mono text-gray-400">
          <a href="#simulator-sandbox" className="hover:text-white transition-colors uppercase tracking-widest">// COEXISTENCE DIALS</a>
          <a href="#structural-asymmetry" className="hover:text-white transition-colors uppercase tracking-widest">// THE SEVEN HARMONIES</a>
          <a href="#interactive-atrium" className="hover:text-white transition-colors uppercase tracking-widest">// THE GREENHOUSE DOME</a>
          <a href="#interactive-calculators" className="hover:text-white transition-colors uppercase tracking-widest">// INDEPENDENCE METER</a>
          <a href="#community-logs" className="hover:text-white transition-colors uppercase tracking-widest">// COOPERATIVE BOARD</a>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-500/20">
            {livePeers} VERIFIED NEST NODES
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CHOREOGRAPHED PARALLAX HERO (NO EMPTY SPACES)         */}
      {/* ======================================================== */}
      <section 
        id="hero-section"
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[110vh] flex items-center justify-center pt-24 pb-32 px-6 md:px-12 lg:px-16 overflow-hidden"
      >
        <SpaceImmersionCanvas />

        {/* Floating backgrounds reacting to scroll parallax */}
        <motion.div 
          style={{ y: parallaxHeaderY, rotate: parallaxGridRotate }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#818cf803_2px,transparent_2px),linear-gradient(to_bottom,#818cf803_2px,transparent_2px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" 
        />
        
        {/* Colorful fuzzy vectors representing energy bounds */}
        <div className="absolute top-[18%] left-[8%] w-[45rem] h-[45rem] bg-indigo-500/[0.02] rounded-full blur-[110px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[15%] right-[8%] w-[40rem] h-[40rem] bg-purple-500/[0.025] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto w-full z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-8">
          
          {/* LEFT COLUMN: Modern scattered title styling */}
          <div className="lg:col-span-7 space-y-10 text-left relative">
            
            {/* Asymmetrical Floating Absolute Ribbon Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-pink-500/5 border border-indigo-400/20 text-indigo-400 rounded-xl backdrop-blur-md"
            >
              <Sparkles size={11} className="animate-spin text-indigo-400" />
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-extrabold">
                Sovereign Living System
              </span>
            </motion.div>

            {/* Structured dynamic header with word split elements */}
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl md:text-8xl font-extralight tracking-tight text-white leading-none relative"
              >
                Life Flows <br />
                <span className="font-semibold bg-gradient-to-r from-indigo-400 via-pink-300 to-purple-300 bg-clip-text text-transparent relative block mt-2">
                  In Absolute Calm
                </span>
              </motion.h1>

              {/* Asymmetrical helper label placed right inside title break */}
              <div className="translate-y-2 border-l border-indigo-500/30 pl-4 mt-2 max-w-lg lg:ml-2">
                <p className="text-[11px] font-mono text-indigo-400 tracking-widest uppercase">
                  No municipal grid drop. No chemical water filters. Just beautiful natural independence.
                </p>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.35 }}
                className="text-sm text-gray-400 max-w-xl font-light leading-relaxed font-sans pt-4"
              >
                Avoid the stress of brittle public central pipelines. Sovereign Mind unifies clean fresh alpine springs, granite energy battery vaults, and organic greenhouse warmth into a gorgeous natural home sanctuary for your entire family. Simple, reliable, and deeply comforting to operate.
              </motion.p>
            </div>

            {/* Asymmetrical offset rows representing status values */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
              {[
                { title: "Pure Water", desc: "Alpine gravity flow", color: "text-pink-400" },
                { title: "Safe Solar", desc: "Granite batteries", color: "text-amber-400" },
                { title: "Dome Bloom", desc: "Soil without chemicals", color: "text-indigo-400" },
                { title: "Cooperative", desc: "Surplus shared nearby", color: "text-purple-400" }
              ].map((obj, i) => (
                <div 
                  key={i} 
                  className={`p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-2xl transition-all ${
                    i % 2 === 1 ? 'translate-y-3' : '-translate-y-1'
                  }`}
                >
                  <div className={`text-xs font-mono font-bold tracking-wider ${obj.color}`}>
                    {obj.title}
                  </div>
                  <div className="text-[9px] text-gray-550 mt-1 uppercase font-mono font-bold leading-tight">{obj.desc}</div>
                </div>
              ))}
            </div>

            {/* Interaction guidance button layout */}
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button
                onClick={() => {
                  const s = document.getElementById('simulator-sandbox');
                  s?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group px-7 py-3.5 bg-white hover:bg-gray-100 text-black font-semibold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(255,255,255,0.08)]"
              >
                <span>Tweak Coexistence Dials</span>
                <Sliders size={12} className="text-indigo-500 animate-bounce" />
              </button>

              <button
                onClick={() => {
                  const sect = document.getElementById('structural-asymmetry');
                  sect?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 text-white font-mono text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              >
                Review Sanctuary pink-prints
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Outstanding Interactive Radar Widget with Hover effects */}
          <div className="lg:col-span-5 w-full flex justify-center relative">
            <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/[0.015] rounded-full [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)] pointer-events-none border border-purple-500/5 animate-[spin_25s_linear_infinite]" />

            <motion.div
              style={{ rotateX, rotateY }}
              className="w-full max-w-md liquid-glass border border-indigo-500/20 bg-[#060606]/95 p-7 rounded-[2.5rem] relative overflow-hidden shadow-[0_15px_45px_rgba(16,185,129,0.08)] space-y-6"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 font-mono text-[9px] text-gray-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                  <span>Sovereign State Simulator</span>
                </div>
                <span className="text-[8px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-500/20">
                  REAL-TIME DIALS
                </span>
              </div>

              {/* Slider list */}
              <div className="space-y-4">
                <div className="text-left space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1"><Sun size={12} className="text-amber-400" /> Crystalline Solar Vault</span>
                    <span className="text-amber-400 font-bold">{solarVault}% Stored</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    value={solarVault} 
                    onChange={(e) => setSolarVault(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" 
                  />
                </div>

                <div className="text-left space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1"><Droplets size={12} className="text-pink-400" /> Mountain Gravity Water</span>
                    <span className="text-pink-400 font-bold">{waterVitality}% Flowing</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    value={waterVitality} 
                    onChange={(e) => setWaterVitality(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-400" 
                  />
                </div>

                <div className="text-left space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1"><Compass size={12} className="text-pink-400" /> Carbon Ventilation Air</span>
                    <span className="text-pink-400 font-bold">{airPurity}% Clean</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    value={airPurity} 
                    onChange={(e) => setAirPurity(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-400" 
                  />
                </div>

                <div className="text-left space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1"><Heart size={12} className="text-purple-400" /> Co-Op Shared Reserve</span>
                    <span className="text-purple-400 font-bold">{communitySpirit}% Linked</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    value={communitySpirit} 
                    onChange={(e) => setCommunitySpirit(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400" 
                  />
                </div>
              </div>

              {/* Real-time human feedback box */}
              <div className="p-4 bg-indigo-500/[0.02] border border-indigo-500/15 rounded-2xl text-left space-y-2">
                <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                  AUTONOMOUS BALANCE REVIEW
                </div>
                <p className="text-xs text-gray-200 font-sans leading-relaxed">
                  {solarVault + waterVitality + airPurity > 250 ? (
                    <span className="text-indigo-400 font-semibold">• OPTIMAL COEXISTENCE: Pure springs and sun rays are filling active home reservoirs continuously. System is fully offline and self-sustained.</span>
                  ) : solarVault + waterVitality + airPurity > 180 ? (
                    <span className="text-purple-300 font-semibold">• STEADY INDEPENDENCE: Core buffers are holding standard pressure. Granite battery silos are perfectly cool.</span>
                  ) : (
                    <span className="text-amber-400 font-semibold">• LOW INTENSITY DETECTED: Tap additional energy storage cells or increase alpine water stream flows to return to optimal safety coefficients.</span>
                  )}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] font-mono text-gray-500">
                <button onClick={resetAllControls} className="text-indigo-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <RefreshCw size={11} /> Reset All Dials
                </button>
                <span>90-DAY RESERVE GAINS SAVED</span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Dynamic down arrow indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-55 text-[9px] tracking-widest font-mono text-gray-400">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <ChevronRight size={14} className="transform rotate-90 text-indigo-400" />
          </motion.div>
          <span>SWIPE DOWN TO OBSERVE OFF-GRID SYSTEM</span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FORWARD-REVERSE VERTICAL MOTION MARQUEES (ADVANCED)   */}
      {/* ======================================================== */}
      <section className="py-14 bg-gradient-to-b from-[#030303] to-[#050505] border-y border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(6,182,212,0.035)_0%,transparent_50%)] pointer-events-none" />
        
        {/* Row 1: Forward scrolling marquee */}
        <div className="flex whitespace-nowrap overflow-hidden py-3">
          <motion.div 
            style={{ x: marqueeForwardX }}
            className="flex items-center gap-12 text-sm sm:text-2xl font-mono text-gray-300/40 uppercase tracking-[0.2em]"
          >
            {[1, 2, 3, 4, 5].map((_, i) => (
              <span key={i} className="flex items-center gap-6">
                <span>✦ Alpine Spring Flow</span>
                <span className="text-indigo-500">✦</span>
                <span>Off-Grid Sunshine Silos</span>
                <span className="text-purple-400">✦</span>
                <span>Cozy Warm Limestone</span>
                <span className="text-amber-500">✦</span>
                <span>Sovereign Food Atriums</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Reverse scrolling marquee */}
        <div className="flex whitespace-nowrap overflow-hidden py-3 border-t border-white/[0.02]">
          <motion.div 
            style={{ x: marqueeReverseX }}
            className="flex items-center gap-12 text-sm sm:text-2xl font-mono text-gray-300/30 uppercase tracking-[0.2em]"
          >
            {[1, 2, 3, 4, 5].map((_, i) => (
              <span key={i} className="flex items-center gap-6">
                <span>✦ Clean Gravity Pressure</span>
                <span className="text-purple-400">✦</span>
                <span>Zero Background Electric Noise</span>
                <span className="text-pink-400">✦</span>
                <span>Honest Coexisting Neighbors</span>
                <span className="text-pink-400">✦</span>
                <span>90-Day Household Comfort</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. DENSE SIMULATOR SANDBOX GRID (ZERO EMPTY SPACES)      */}
      {/* ======================================================== */}
      <section 
        id="simulator-sandbox"
        className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto relative bg-[#040404]"
      >
        {/* Absolute Background element drifting slightly with scroll */}
        <motion.div 
          style={{ y: parallaxSlowerY }} 
          className="absolute top-1/4 right-[5%] w-[400px] h-[400px] bg-purple-500/[0.01] rounded-full blur-[100px] pointer-events-none" 
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Scattered descriptive typography */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-36">
            <span className="text-xs font-mono text-pink-400 tracking-wider block uppercase">
              // BALANCING NATURAL FORCES
            </span>
            <h3 className="text-3xl md:text-5.5xl font-light text-white leading-tight">
              Tweak Indicators, <br />
              <span className="font-semibold text-transparent bg-gradient-to-r from-pink-300 via-indigo-300 to-purple-300 bg-clip-text">
                Secure Calm Living
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
              These cozy modules are made of clean timber and thermal stones. Slide the ranges of water, sun, ventilation, or limestone heat and watch the local parameters balance beautifully. Survival comes from proportions, not giant noisy motors.
            </p>

            <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3 font-mono text-[11px] text-left">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-extrabold">
                Current Equilibrium Factors
              </span>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Comfort Margin:</span>
                <span className="text-indigo-400 font-bold">100% Secure Space</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Spring Volume:</span>
                <span className="text-pink-400 font-bold">1.2 Gravity Bars</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Silo Moisture Content:</span>
                <span className="text-purple-405 font-bold">22% Humidity Normal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Surplus Grid Outward Share:</span>
                <span className="text-purple-400 font-bold">Automatic Active</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Densely packed visual control cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            
            {/* Card 1: Sunshine Vault */}
            <div className="p-7 rounded-[2rem] border border-white/10 bg-[#060606] hover:border-amber-500/25 transition-all space-y-5 group relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.015] rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sun size={18} className="animate-spin duration-15000" />
                </div>
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider">SECURE VAULT CORRIDOR</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white">Mountain Sun Accumulators</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Captures absolute raw rays via thick stone-clad crystalline shield structures. Stamped safe under real mountain granite sheets to stay perfectly secure.
                </p>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[9px] font-mono text-amber-400 mb-1">
                  <span>STORAGE RANGE COEFFICIENT</span>
                  <span>{solarVault}% FULL</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500" style={{ width: `${solarVault}%` }} />
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button onClick={() => setSolarVault(prev => Math.min(100, prev + 10))} className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/10 rounded-lg text-[9px] font-mono text-white transition-all cursor-pointer">
                    + BOOST COLLECTION
                  </button>
                  <button onClick={() => setSolarVault(prev => Math.max(20, prev - 10))} className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/10 rounded-lg text-[9px] font-mono text-white transition-all cursor-pointer">
                    - REDUCE MATRIX
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Fresh Spring Droplets */}
            <div className="p-7 rounded-[2rem] border border-white/10 bg-[#060606] hover:border-pink-500/25 transition-all space-y-5 group relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/[0.015] rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-pink-950/40 text-pink-400 border border-pink-500/25">
                  <Droplets size={18} className="animate-bounce duration-1000" />
                </div>
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider font-bold">GRAVITY FLOW TUBE</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white">Gravity Spring Springs</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Naturally forced pipelines moving from high alpine valleys down directly. No pumps or electric drives needed. Fresh mineral water sweeps in endlessly.
                </p>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[9px] font-mono text-pink-400 mb-1">
                  <span>ACTIVE BASIN METER</span>
                  <span>{waterVitality}% FILLED</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400" style={{ width: `${waterVitality}%` }} />
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button onClick={() => setWaterVitality(prev => Math.min(100, prev + 10))} className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/10 rounded-lg text-[9px] font-mono text-white transition-all cursor-pointer">
                    + EXPAND SIPHONS
                  </button>
                  <button onClick={() => setWaterVitality(prev => Math.max(20, prev - 10))} className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/10 rounded-lg text-[9px] font-mono text-white transition-all cursor-pointer">
                    - DAMPEN FORCES
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Carbon Ventilation */}
            <div className="p-7 rounded-[2rem] border border-white/10 bg-[#060606] hover:border-pink-500/25 transition-all space-y-5 group relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/[0.015] rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-pink-950/40 text-pink-400 border border-pink-500/25">
                  <Compass size={18} className="animate-spin duration-12000" />
                </div>
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider">NATURAL REFRESH TUBE</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white">Forest Moss Air Vents</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Passive tubes layered with damp carbon forest moss. Constantly sweeps incoming mountain breeze clean of microdust or city residues naturally.
                </p>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[9px] font-mono text-pink-400 mb-1">
                  <span>VENTILATION CURRENT RANGE</span>
                  <span>{airPurity}% FLOW SPEED</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-450 to-indigo-400" style={{ width: `${airPurity}%` }} />
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button onClick={() => setAirPurity(prev => Math.min(100, prev + 10))} className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/10 rounded-lg text-[9px] font-mono text-white transition-all cursor-pointer">
                    + EXPAND FLOWS
                  </button>
                  <button onClick={() => setAirPurity(prev => Math.max(20, prev - 10))} className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/10 rounded-lg text-[9px] font-mono text-white transition-all cursor-pointer">
                    - RESTRICT DUCTS
                  </button>
                </div>
              </div>
            </div>

            {/* Card 4: Limestone Stone warmth */}
            <div className="p-7 rounded-[2rem] border border-white/10 bg-[#060606] hover:border-pink-500/25 transition-all space-y-5 group relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/[0.015] rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-pink-950/40 text-pink-400 border border-pink-500/25">
                  <Activity size={18} className="animate-pulse" />
                </div>
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider font-bold">LIMESTONE HEARTH</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white">limestone Floor Radiant</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Deep limestone steps gather natural daytime heat and release it gradually inland throughout freezing nights, keeping beds perfectly warm.
                </p>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[9px] font-mono text-pink-400 mb-1">
                  <span>THERMAL DISCHARGE RADIANTS</span>
                  <span>{limestoneWarmth}% HEATING POWER</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-400 to-orange-400" style={{ width: `${limestoneWarmth}%` }} />
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button onClick={() => setLimestoneWarmth(prev => Math.min(100, prev + 10))} className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/10 rounded-lg text-[9px] font-mono text-white transition-all cursor-pointer">
                    + INWARD RADIANCE
                  </button>
                  <button onClick={() => setLimestoneWarmth(prev => Math.max(20, prev - 10))} className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/10 rounded-lg text-[9px] font-mono text-white transition-all cursor-pointer">
                    - DAMPEN DECAY
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. INTERACTIVE ADVANCED GREENHOUSE DOME (MEDIA COMPIL)   */}
      {/* ======================================================== */}
      <section 
        id="interactive-atrium"
        className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto border-t border-white/5 relative bg-[#030303]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right graphics area representing interactive bloom dome */}
          <div className="lg:col-span-7 bg-[#050505] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between min-h-[480px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/[0.015] rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 border-b border-white/5 pb-4">
              <span>ACTIVE LIVING GARDEN SCHEMA</span>
              <span className="text-indigo-400 animate-pulse uppercase tracking-wider font-bold">// SECURE GROW MODE</span>
            </div>

            {/* DOM DESIGN: Click and Watch Interactive flower growth based on stats */}
            <div className="flex-1 min-h-[280px] relative flex flex-col items-center justify-center py-6">
              
              {/* Floating ambient circular indicators representing Dome bounds */}
              <div className="absolute w-72 h-44 rounded-t-full border border-white/[0.03] border-b-transparent transform translate-y-3" />
              <div className="absolute w-[360px] h-56 rounded-t-full border border-white/[0.015] border-b-transparent transform translate-y-1" />

              <div className="space-y-4 text-center z-10">
                
                {/* SVG representing flower state changing dynamically based on clicks */}
                <div className="h-36 flex items-end justify-center relative">
                  
                  {isWatering && (
                    <div className="absolute inset-x-0 -top-4 flex justify-center gap-1">
                      {[1,2,3,4,5].map((d) => (
                        <motion.span 
                          key={d}
                          initial={{ y: -10, opacity: 1 }}
                          animate={{ y: 50, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.1, delay: d * 0.15 }}
                          className="w-1 h-3 bg-purple-400 rounded-full block"
                        />
                      ))}
                    </div>
                  )}

                  <svg className="w-28 h-28 text-indigo-400" viewBox="0 0 100 100">
                    <line x1="50" y1="90" x2="50" y2="40" stroke="#a78bfa" strokeWidth="3" />
                    {/* Stem Leaves */}
                    <path d="M50 70 Q30 60 40 50" fill="none" stroke="#818cf8" strokeWidth="2.5" />
                    <path d="M50 55 Q70 45 60 35" fill="none" stroke="#818cf8" strokeWidth="2.5" />
                    
                    {/* Bloom stages */}
                    {bloomStage === 1 && (
                      <circle cx="50" cy="40" r="6" fill="#f43f5e" className="animate-pulse" />
                    )}
                    {bloomStage === 2 && (
                      <g>
                        <circle cx="50" cy="40" r="10" fill="#f43f5e" />
                        <path d="M44 34 Q50 25 56 34" fill="none" stroke="#fda4af" strokeWidth="2" />
                      </g>
                    )}
                    {bloomStage === 3 && (
                      <g className="animate-[scaleUp_0.8s_ease-out]">
                        <circle cx="50" cy="40" r="10" fill="#f43f5e" />
                        {[0, 60, 120, 180, 240, 300].map((rot) => (
                          <ellipse 
                            key={rot} 
                            cx="50" 
                            cy="28" 
                            rx="7" 
                            ry="12" 
                            fill="#fda4af" 
                            transform={`rotate(${rot} 50 40)`} 
                            opacity="0.85" 
                          />
                        ))}
                        <circle cx="50" cy="40" r="5" fill="#f59e0b" />
                      </g>
                    )}
                  </svg>
                </div>

                <div className="space-y-1">
                  <div className="text-xs uppercase font-mono tracking-widest text-[#9ca3af]">
                    Current Bloom Level:{' '}
                    <span className="text-indigo-400 font-bold">
                      {bloomStage === 1 ? 'Fresh Sprout' : bloomStage === 2 ? 'Active Bud' : 'Flowering Bloom!'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 max-w-sm mx-auto font-mono">
                    Water levels: {domeHydration}% | Dome warmth: {domeWarmth}°C | Greenhouse roof vents: {domeVentOpen ? 'Open, clean breezes flowing' : 'Closed, holding warmth'}
                  </p>
                </div>

              </div>

            </div>

            {/* Interaction console triggers for the Greenhouse */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5 relative z-10">
              <button 
                onClick={handleWaterDome}
                disabled={isWatering}
                className="px-3 py-2.5 bg-[#0a0a0a] hover:bg-purple-950/20 border border-purple-500/20 text-purple-400 rounded-xl text-[10px] font-mono tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Droplets size={11} className={isWatering ? 'animate-spin' : ''} />
                <span>{isWatering ? 'WATERING...' : 'WATER SOIL'}</span>
              </button>

              <button 
                onClick={() => {
                  setDomeVentOpen(!domeVentOpen);
                  setAirPurity(domeVentOpen ? 80 : 96);
                  setDomeWarmth(domeVentOpen ? 26 : 21);
                }}
                className={`px-3 py-2.5 bg-[#0a0a0a] border text-[10px] font-mono tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  domeVentOpen 
                    ? 'border-indigo-500/40 text-indigo-400' 
                    : 'border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                }`}
              >
                <Compass size={11} className={domeVentOpen ? 'animate-spin' : ''} />
                <span>{domeVentOpen ? 'CLOSE AIR VENT' : 'VENT DOME'}</span>
              </button>

              <button 
                onClick={() => {
                  setDomeWarmth(prev => Math.min(35, prev + 2));
                  setBloomStage(prev => (prev < 3 ? prev + 1 : 3));
                }}
                className="px-3 py-2.5 bg-[#0a0a0a] hover:bg-orange-950/20 border border-orange-500/20 text-orange-400 rounded-xl text-[10px] font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sun size={11} />
                <span>WARM FROM STONE</span>
              </button>
            </div>

            <div className="text-[9px] font-mono text-gray-550 border-t border-white/5 pt-3.5 flex justify-between">
              <span>VENTILATOR UNIT REF: CO-2</span>
              <span>100% OFF-GRID ORGANIC CYCLES</span>
            </div>

          </div>

          {/* LEFT: Symmetrical shift of the text */}
          <div className="lg:col-span-5 space-y-6 text-left ltr xl:pl-8">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block bg-indigo-950/40 border border-indigo-500/20 w-fit px-3 py-1 rounded-full">
              SECURED FOOD SECURITY
            </span>
            <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
              An Organic Dome <br />
              <span className="font-semibold text-transparent bg-gradient-to-r from-indigo-400 to-pink-300 bg-clip-text">
                Growing Home Salads
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
              Enjoy fresh ripe greenhouse greens throughout winter storms without depending on city markets or shipping trucks. Click the interactive panel on the left to water the soil, open moss vents, or direct limestone warm floor air to watch the flower sprout and bloom right on your screen.
            </p>
            
            <div className="p-4 bg-indigo-500/[0.01] border border-indigo-500/10 rounded-2xl">
              <p className="text-xs text-indigo-400 font-mono tracking-tight font-semibold flex items-center gap-2">
                <CheckCircle2 size={13} className="text-indigo-400" />
                <span>Zero complex technical codes. Elegant, simple, off-grid garden dome logic.</span>
              </p>
            </div>

            <div className="flex justify-between items-center bg-[#070707] border border-white/5 p-4 rounded-xl text-left">
              <div>
                <span className="text-[9px] font-mono text-gray-500 block uppercase font-bold">Soil Hydration Status</span>
                <span className="text-xs font-semibold text-white uppercase">{domeHydration}% Moist</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-gray-500 block uppercase font-bold">Ambient Garden Heat</span>
                <span className="text-xs font-semibold text-white uppercase">{domeWarmth}°C Steady</span>
              </div>
              <button 
                onClick={() => {
                  setDomeHydration(60); 
                  setDomeWarmth(24); 
                  setBloomStage(1);
                }} 
                className="text-[9px] font-mono text-indigo-450 hover:text-white transition-colors cursor-pointer"
              >
                // RESTART GARDEN
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. ADVANCED SVG DRAWN PIPELINE LINE CONNECTION (SCROLL) */}
      {/* ======================================================== */}
      <section className="py-2 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden relative min-h-[140px] flex items-center justify-center pointer-events-none">
        
        {/* Animated dynamic line connector */}
        <div className="w-full max-w-3xl h-full flex flex-col items-center">
          <svg className="w-full h-32 text-indigo-500/30" viewBox="0 0 600 120" fill="none">
            <motion.path 
              d="M30 10 Q150 110, 300 60 T570 110" 
              stroke="url(#lineGlow)" 
              strokeWidth="2" 
              strokeDasharray="1000"
              style={{ strokeDashoffset: drawLinePathOffset }}
            />
            <circle cx="300" cy="60" r="4" fill="#a78bfa" className="animate-ping" />
            <defs>
              <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-[8px] font-mono text-gray-600 tracking-[0.25em] uppercase">
            // AUTONOMOUS SPRING FEED VECTOR //
          </span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. ASYMMETRICAL EDITORIAL THE SEVEN HARMONIES (NARRATIVE) */}
      {/* ======================================================== */}
      <section 
        id="structural-asymmetry" 
        className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto relative bg-[#030303]"
      >
        <div className="mb-20 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono text-purple-400 tracking-[0.25em] uppercase block">// NATURE IS COOP DESIGN</span>
          <h2 className="text-4xl md:text-6.5xl font-light text-white tracking-tight leading-tight">
            How Simple Systems Interconnect <br />
            <span className="font-semibold text-transparent bg-gradient-to-r from-indigo-400 via-pink-300 to-purple-300 bg-clip-text">
              For Perfect Comfort
            </span>
          </h2>
          <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We avoid cold, confusing code charts. Real long-term security is built on delicious gravity springs, warm limestone step plates, cool battery caves, and kind nearby helpers. Rest. It is completely safe.
          </p>
        </div>

        {/* Deep, highly-detailed scattered editorial plates with asymmetric offsets */}
        <div className="space-y-36">
          
          {/* Harmony Plate 1: Siphon spring water */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            <div className="lg:col-span-6 space-y-6 text-left lg:pr-8 relative z-10">
              <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block bg-pink-950/40 border border-pink-500/25 w-fit px-3.5 py-1 rounded-full">
                CHAPTER ONE: CRITICAL FRESH WATER AUTONOMY
              </span>
              <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
                Pure, Crisp Gravity Spring Siphon <span className="font-semibold text-pink-300">Flowing Day and Night</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-450 leading-relaxed font-sans">
                Each safe living sanctuary is siphoned into natural, high-elevation alpine rock cracks containing crystal fresh water springs. The pure liquid flows downward entirely pushed by mountain gravity. No complex electrical pumps, zero high mechanical pressure risks. Even when regional cities run completely dry, your kitchen sinks will hold cool, ready-to-drink mineral-rich springs.
              </p>
              
              <ul className="space-y-3 text-xs text-gray-300 font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-indigo-400" />
                  <span>Always dynamic on absolute zero electric grid limits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-indigo-400" />
                  <span>Insulated timber storage keeps source fresh across winter storms</span>
                </li>
              </ul>
            </div>

            {/* Graphic vector placeholder plate with sideways label */}
            <div className="lg:col-span-6 flex justify-center w-full max-w-md lg:ml-auto relative">
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 transform -rotate-90 origin-center text-[8px] font-mono text-pink-400 tracking-[0.3em] uppercase opacity-75 hidden md:block">
                // ALPINE FLOW TERMINAL V-12 //
              </div>
              
              <div className="w-full liquid-glass border border-pink-500/20 p-6 rounded-[2.5rem] bg-gradient-to-b from-[#080808] to-[#040404] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/[0.02] rounded-full blur-2xl" />
                
                <div className="h-44 flex flex-col items-center justify-center relative">
                  <svg className="w-24 h-24 text-pink-400 animate-pulse" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4" />
                    <motion.path 
                      d="M50 22 Q40 55 50 82 Q60 55 50 22 C25 55 75 55 50 22" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                    />
                  </svg>
                  <span className="text-[8px] font-mono text-purple-400 mt-4 tracking-widest uppercase animate-pulse">GRAVITY SIPHON PIPING: ACTIVE Flowing</span>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between text-[9px] font-mono text-gray-500">
                  <span>99.998% HYDRATION RATING</span>
                  <span>STONE TUBE LINK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Harmony Plate 2: Crystalline sun storage caverns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            <div className="lg:col-span-6 lg:order-last space-y-6 text-left lg:pl-8 relative z-10">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block bg-amber-950/40 border border-amber-500/25 w-fit px-3.5 py-1 rounded-full">
                CHAPTER TWO: PROTECTED ENERGY ACCUMULATOR
              </span>
              <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
                Crystalline Granite Vaults <span className="font-semibold text-amber-300">Shielding Pure Stored Sun</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-450 leading-relaxed font-sans">
                True energy shelter does not require noisy coal generators or toxic gas fuels. Our off-grid crystal panels collect generous rays during brief daylight hours. Heat and power flow down directly into cool granite rock batteries inside subterranean caverns. Kept protected from freezing valleys, your heaters and warm boilers will stay safe through any snow season effortlessly.
              </p>
              
              <ul className="space-y-3 text-xs text-gray-300 font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-indigo-400" />
                  <span>Silent crystalline panels requiring zero complex maintenance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-indigo-400" />
                  <span>Secure rock containment prevents winter battery wear</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 flex justify-center w-full max-w-md relative">
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 transform rotate-90 origin-center text-[8px] font-mono text-amber-400 tracking-[0.3em] uppercase opacity-75 hidden md:block">
                // ENERGY CORE ENCLAVE E-4 //
              </div>
              
              <div className="w-full liquid-glass border border-amber-500/20 p-6 rounded-[2.5rem] bg-gradient-to-b from-[#080808] to-[#040404] relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-2xl" />
                
                <div className="h-44 flex flex-col items-center justify-center relative">
                  <svg className="w-24 h-24 text-amber-400 animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3" />
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                      <line 
                        key={deg} 
                        x1="50" 
                        y1="15" 
                        x2="50" 
                        y2="25" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        transform={`rotate(${deg} 50 50)`} 
                      />
                    ))}
                  </svg>
                  <span className="text-[8px] font-mono text-amber-400 mt-4 tracking-widest uppercase animate-pulse">SUN RESERVE CAPACITY: EXTREMELY HIGH</span>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between text-[9px] font-mono text-gray-500">
                  <span>90-DAY ENERGY SAFE INTACT</span>
                  <span>STONE VAULT MODULE</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. SCROLL TEXT HIGHLIGHT CONDUIT SYSTEM (EXPRESS DESIGN) */}
      {/* ======================================================== */}
      <section className="py-28 px-6 md:px-12 lg:px-16 bg-[#040404] border-y border-white/5 relative overflow-hidden">
        <div className="absolute right-[-10%] top-1/4 w-[500px] h-[500px] bg-indigo-500/[0.01] rounded-full blur-[110px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-6 text-left relative">
          <span className="text-xs font-mono text-indigo-400 tracking-[0.2em] block uppercase">
            // POETIC COEXISTENCE PHRASE REVEAL
          </span>
          <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">// SLOWLY SCROLL DOWN TO BRIGHTEN COMFORT CREDO //</h4>
          
          <motion.div 
            style={{ opacity: textOpacityProgress }}
            className="text-3xl sm:text-5xl font-extralight tracking-tight text-white leading-snug space-y-4"
          >
            <p className="border-l-2 border-indigo-500 pl-6 leading-relaxed">
              "We choose to bypass fragile regional central grids. True mountain security resides in warm limestone floors, clear spring waters siphoning continuously, and honest neighbors coexisting in real, absolute trust."
            </p>
          </motion.div>
          
          <div className="flex gap-4 pt-4 text-xs font-mono text-gray-550">
            <span>Sovereign Enclave Credo 01</span>
            <span>✦</span>
            <span>100% Gravity Power Buffer</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. PORTABILITY METRICS & CALCULATOR (ZERO EMPTY SPACE)   */}
      {/* ======================================================== */}
      <section 
        id="interactive-calculators"
        className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto relative bg-[#030303]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Calculator Panel */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-xs font-mono text-purple-400 tracking-wider block uppercase">
              // METER OF INDEPENDENCE
            </span>
            <h3 className="text-3xl md:text-5.5xl font-light text-white leading-tight">
              Test Your Home <br />
              <span className="font-semibold text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300 bg-clip-text">
                Autonomy Weeks
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
              Tweak indicators like household family members, active water sources, and average regional sunshine hours to check how many weeks of autonomy your home holds. Pure, simple, organic results.
            </p>

            <div className="p-5 bg-[#050505] border border-white/10 rounded-3xl space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex justify-between">
                  <span>Household Size (Persons)</span>
                  <span className="text-indigo-400 font-bold">{householdSize} Family Members</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={householdSize} 
                  onChange={(e) => setHouseholdSize(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex justify-between">
                  <span>Average Sunshine Rate (Hours)</span>
                  <span className="text-amber-400 font-bold">{sunlightHours} Sun Daylight Hours</span>
                </label>
                <input 
                  type="range" 
                  min="2" 
                  max="12" 
                  value={sunlightHours} 
                  onChange={(e) => setSunlightHours(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Primary Water Feed</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['spring', 'well', 'rain'] as const).map((src) => (
                    <button
                      key={src}
                      onClick={() => setActiveWaterSource(src)}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        activeWaterSource === src 
                          ? 'bg-white text-black font-semibold border-white' 
                          : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {src === 'spring' ? 'Gravity Spring' : src === 'well' ? 'Deep Well' : 'Rain Cache'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Results Widget Area */}
          <div className="lg:col-span-7 bg-[#050505] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden text-center flex flex-col justify-between min-h-[360px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/[0.015] rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 border-b border-white/5 pb-4">
              <span>REAL-TIME ESTIMATED HARMONY</span>
              <span className="text-indigo-400 font-bold animate-pulse">// ACTIVE RESULTS</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center py-6 space-y-4">
              <span className="text-[10px] font-mono text-[#8b5cf6] tracking-[0.25em] uppercase block bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-full">
                ESTIMATED AUTONOMY TIMELINE
              </span>
              
              <div className="space-y-1">
                <div className="text-6xl sm:text-7xl font-extrabold text-transparent bg-gradient-to-r from-indigo-400 via-pink-300 to-purple-300 bg-clip-text font-mono">
                  {calculateAutonomyWeeks()} Weeks
                </div>
                <div className="text-[11px] font-mono text-[#9ca3af] uppercase tracking-wider">
                  Sustained family living off-grid completely!
                </div>
              </div>

              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed font-sans">
                {Number(calculateAutonomyWeeks()) > 3 ? (
                  <span className="text-indigo-400 font-semibold">• EXCELLENT STATUS: Your siphons and sunshine vaults yield immense surplus buffers. Share heat cells to support your cozy local valley network.</span>
                ) : (
                  <span className="text-amber-400 font-semibold">• MODERATE BUFFERS: Gravity pressure works beautifully, but consider scaling panels or adding deep well buffers to expand weeks.</span>
                )}
              </p>
            </div>

            <div className="text-[9px] font-mono text-gray-550 border-t border-white/5 pt-4 flex justify-between">
              <span>SANCTUARY EQUIVALENCE INDEX</span>
              <span>100% REGENERATIVE RATING</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. NEIGHBORHOOD COOPERATIVE NOTEBOARD (ZERO EMPTY SPACE)*/}
      {/* ======================================================== */}
      <section 
        id="community-logs"
        className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto border-t border-white/5 relative bg-[#040404]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Board Content */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-36 text-left">
            <span className="text-xs font-mono text-purple-400 tracking-[0.2em] block uppercase">
              // COOPERATIVE SOCIAL HEARTH
            </span>
            <h3 className="text-3xl md:text-5.5xl font-light text-white leading-tight">
              Share Surplus <br />
              <span className="font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text">
                With Kind Neighbors
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
              Living safely doesn't mean hiding away. Real resilience comes from kind neighbors. Write a cozy community notice or check what fresh harvests Lucas has shared with the shared mountain cold room!
            </p>

            {/* Inward Interactive Form */}
            <form onSubmit={handlePostNote} className="p-5 bg-[#050505] border border-white/10 rounded-3xl space-y-3">
              <span className="text-[10px] font-mono text-[#8b5cf6] uppercase tracking-widest block font-bold">Write a Neighbor Message</span>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Your Name (e.g., Clara)" 
                  value={newNoteAuthor} 
                  onChange={(e) => setNewNoteAuthor(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50"
                  required
                />
                <textarea 
                  placeholder="What surplus spring water or garden vegetables can you offer nearby neighbors?" 
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 resize-none"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-purple-650 hover:bg-purple-700 text-white font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Publish Local Note</span>
                <Heart size={11} className="text-pink-300 animate-pulse" />
              </button>
            </form>
          </div>

          {/* Right Board Feeds */}
          <div className="lg:col-span-7 bg-[#050505] border border-white/10 p-7 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between min-h-[460px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/[0.015] rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 border-b border-white/5 pb-4">
              <span>ACTIVE CO-OP BULLETIN MESSAGE BOARD</span>
              <span className="text-purple-400 font-bold animate-pulse font-mono">// NESTS ONLINE</span>
            </div>

            {/* List notes */}
            <div className="flex-1 py-4 space-y-4 overflow-y-auto max-h-[300px] mt-2 mb-2 pr-1">
              {communityNotes.map((note) => (
                <div key={note.id} className="p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-2xl text-left space-y-2 transition-all">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-purple-400 font-bold">{note.author}</span>
                    <span className="text-gray-500">{note.age}</span>
                  </div>
                  <p className="text-xs text-gray-200 font-sans leading-relaxed">
                    "{note.content}"
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/[0.03] text-[9px] font-mono text-gray-500">
                    <span>SECTOR BOARD NOTICE</span>
                    <button 
                      onClick={() => upvoteNote(note.id)}
                      className="text-pink-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer bg-[#0c0c0c] px-2 py-1 rounded-md border border-white/5"
                    >
                      <Heart size={10} className="fill-current text-pink-400" />
                      <span>{note.thumbs} Thanks</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-mono text-gray-550 border-t border-white/5 pt-3 flex justify-between">
              <span>LOCAL LATTICE INDEX: 900-SECTOR</span>
              <span>100% SECURED FAMILY RECONCILIATION</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 11. TRUSTED COEXISTING LIFESTYLE HEARTH REVIEWS          */}
      {/* ======================================================== */}
      <section className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase block">// LOVED HOME EXPERIENCES</span>
          <h2 className="text-3xl md:text-5.5xl font-light text-white tracking-tight">
            How Simple Element Comfort <span className="font-semibold text-transparent bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text">Brings Beautiful Joy</span>
          </h2>
          <p className="text-xs text-gray-400 font-mono">
            Read pure notes from families who bypassed urban grid noise for reliable, cozy off-grid safety.
          </p>
        </div>

        {/* Dynamic cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left pt-4">
          {[
            {
              author: "Lucas & Clara Bernard",
              role: "Alpine Highland Nest Owner",
              desc: "Our family spent six weeks in complete comfort during the heavy winter valley grid drops last December. The children notes: the limestone heaters kept beds perfectly warm. Gravity water flowed endless."
            },
            {
              author: "Elizabeth Vance",
              role: "Former Urban Housing Strategist",
              desc: "Removing chemical municipal feeds and sleeping in zero electric mesh background noise holds amazing physical health gains. I sleep completely recovered on our mountain shift."
            },
            {
              author: "Marcus Keller",
              role: "Surplus Cohousing Node Lead",
              desc: "Sharing solar buffer electricity feels so beautiful. The elders around us hold complete heating buffers during winter frost storms, exchanging fresh garden wood in return."
            }
          ].map((item, id) => (
            <div key={id} className="liquid-glass border border-white/10 p-7 rounded-[2rem] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/[0.015] rounded-full blur-xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex gap-1 text-indigo-400">
                  {[1,2,3,4,5].map((s) => <Sparkles key={s} size={10} className="fill-current text-indigo-400" />)}
                </div>
                <p className="text-xs md:text-sm text-gray-300 font-sans leading-relaxed italic">
                  "{item.desc}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
                <div className="w-8 h-8 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  {item.author[0]}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{item.author}</div>
                  <div className="text-[9px] text-gray-500 font-mono uppercase">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11.5 COLOSSAL SCATTERED DESIGN MEGA SECTION (NO EMPTY SPACES) */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden bg-[#020202] py-40 border-y border-white/5 space-y-32">
        {/* Dynamic Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.02)_0%,transparent_80%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[800px] h-[800px] bg-purple-500/[0.015] rounded-full blur-[150px] pointer-events-none" />
        
        {/* Animated SVG connecting lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M 100,0 Q 300,500 100,1000 T 500,2000" 
              fill="none" 
              stroke="url(#grad1)" 
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
            <motion.path 
              d="M 900,0 Q 600,800 800,1500 T 200,2500" 
              fill="none" 
              stroke="url(#grad1)" 
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 5, ease: "easeInOut", delay: 0.5 }}
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Scattered Typography Title Area */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 min-h-[500px] flex items-center">
          <div className="w-full relative">
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-0 left-0 text-left max-w-sm"
            >
              <span className="text-[10px] font-mono text-indigo-400 tracking-widest uppercase mb-2 block">
                Deep Calm Everywhere
              </span>
              <p className="text-xl font-light text-white leading-relaxed">
                Feel the gentle warmth filling every corner of your room, keeping you totally safe.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="absolute -top-16 right-10 text-right max-w-md hidden md:block"
            >
              <span className="text-[9px] font-mono text-purple-400 tracking-[0.2em] uppercase mb-4 block">
                Pure Natural Flow
              </span>
              <p className="text-sm font-sans text-gray-400 leading-relaxed italic">
                No loud machines. No sudden stops. Just constant, quiet life support that runs automatically day and night.
              </p>
            </motion.div>

            <div className="pt-40 text-center w-full">
              <motion.h2 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tighter text-white"
              >
                Immense <br />
                <span className="font-semibold text-transparent bg-gradient-to-r from-indigo-400 via-pink-300 to-purple-400 bg-clip-text">
                  Tranquility
                </span>
              </motion.h2>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute -bottom-20 right-0 text-right max-w-xs"
            >
              <span className="text-[10px] font-mono text-amber-400 tracking-widest uppercase mb-2 block">
                Endless Sunshine
              </span>
              <p className="text-lg font-light text-white leading-snug">
                Golden light stored safely to protect your evenings.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="absolute -bottom-40 left-10 text-left max-w-xs hidden md:block"
            >
              <p className="text-xs font-mono text-gray-500 leading-relaxed uppercase tracking-wider">
                We designed every single detail so perfectly that you never have to think about it. It just works, beautifully and simply.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Scroll Text Highlighting Section */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 py-32">
          <div className="flex flex-col items-center justify-center space-y-12 text-center">
            <span className="p-3 bg-indigo-950/30 rounded-full border border-indigo-500/20 text-indigo-400 mb-6">
              <Anchor size={24} className="animate-pulse" />
            </span>
            <motion.p 
              style={{ opacity: textOpacityProgress }}
              className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight font-sans tracking-tight"
            >
              You are completely surrounded by fresh mountain air, pure gravity-fed water, and deep stone heat. <br />
              <span className="text-gray-600">Everything is designed to make you feel totally secure, deeply relaxed, and perfectly at home without needing anything else.</span>
            </motion.p>
          </div>
        </div>

        {/* Scattered Image / Media Placeholder Grid (Filling Spaces) */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 h-[400px] rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 relative overflow-hidden flex items-end p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1)_0%,transparent_60%)]" />
              <div className="absolute top-5 right-5 text-indigo-400/20">
                <Shield size={120} />
              </div>
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 tracking-widest uppercase">Unbreakable Shield</span>
                <h3 className="text-2xl font-light text-white">Thick Stone Walls Protect You</h3>
                <p className="text-sm font-sans text-gray-400 max-w-sm">No storms or wind can break this peaceful quiet. You sleep soundly while the world outside spins.</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="h-[400px] rounded-3xl bg-gradient-to-t from-[#0a0a0a] to-[#040404] border border-white/5 relative overflow-hidden flex items-end p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.1)_0%,transparent_60%)]" />
              <div className="absolute top-5 left-5 text-purple-400/20">
                <Droplets size={100} />
              </div>
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase">Crystal Clear</span>
                <h3 className="text-xl font-light text-white">Endless Fresh Drops</h3>
                <p className="text-xs font-sans text-gray-400">Sweet drinking water flows straight to your glass.</p>
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="md:col-span-1 h-[300px] rounded-3xl bg-[#080808] border border-white/5 relative overflow-hidden flex flex-col justify-between p-6"
            >
              <Sun size={24} className="text-amber-400" />
              <div className="space-y-1 mt-auto">
                <h4 className="text-lg text-white">Warm Morning</h4>
                <p className="text-xs text-gray-500 font-mono">Sunlight trapped for night time.</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-3 h-[300px] rounded-3xl bg-gradient-to-r from-indigo-950/20 to-pink-950/10 border border-white/5 relative overflow-hidden flex items-center justify-center p-8"
            >
              <div className="w-full flex justify-between items-center text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-light text-indigo-400">100%</div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gray-500">Natural Joy</div>
                </div>
                <div className="hidden sm:block h-20 w-px bg-white/10" />
                <div className="space-y-2">
                  <div className="text-4xl font-light text-pink-400">0%</div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gray-500">Fake Chemicals</div>
                </div>
                <div className="hidden sm:block h-20 w-px bg-white/10" />
                <div className="space-y-2">
                  <div className="text-4xl font-light text-purple-400">24/7</div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gray-500">Absolute Calm</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Forward-Reverse Monumental Marquee */}
        <div className="pt-20">
          <div className="flex whitespace-nowrap overflow-hidden py-4 border-y border-white/5 bg-[#010101]">
            <motion.div 
              style={{ x: marqueeReverseX }}
              className="flex items-center gap-16 text-4xl sm:text-7xl font-extralight text-gray-800 uppercase tracking-tighter"
            >
              {[1, 2, 3, 4, 5].map((_, i) => (
                <span key={i} className="flex items-center gap-8 hover:text-gray-600 transition-colors">
                  <span>Beautifully Simple Living</span>
                  <span className="text-indigo-500/30">❋</span>
                  <span>No Confusing Details</span>
                  <span className="text-purple-500/30">❋</span>
                </span>
              ))}
            </motion.div>
          </div>
          <div className="flex whitespace-nowrap overflow-hidden py-4 border-b border-white/5 bg-[#020202]">
            <motion.div 
              style={{ x: marqueeForwardX }}
              className="flex items-center gap-16 text-3xl sm:text-6xl font-light text-white/5 uppercase tracking-wide italic"
            >
              {[1, 2, 3, 4, 5].map((_, i) => (
                <span key={i} className="flex items-center gap-8">
                  <span>Just You, Family, And Peace</span>
                  <span className="text-pink-500/20">—</span>
                  <span>Pure Organic Comfort</span>
                  <span className="text-amber-500/20">—</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Massive scattered text floating up and down */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 h-[600px] flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-10 left-0 max-w-sm text-left p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm"
          >
            <Compass size={32} className="text-pink-400 mb-4" />
            <h5 className="text-lg text-white font-light">Fresh Air Breezes</h5>
            <p className="text-xs text-gray-400 mt-2 font-sans">
              Breathe deeply. The air inside is cleaner than a mountain top. We made sure every single breath restores your energy.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="absolute bottom-10 right-0 max-w-sm text-right p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm"
          >
            <Activity size={32} className="text-pink-400 mb-4 ml-auto" />
            <h5 className="text-lg text-white font-light">Heartbeat Rhythm</h5>
            <p className="text-xs text-gray-400 mt-2 font-sans">
              The house lives with you. It warms up when it gets cold outside, completely naturally. You don't have to push any buttons.
            </p>
          </motion.div>

          <div className="text-center max-w-2xl">
            <span className="text-indigo-400 text-sm font-mono tracking-[0.3em] uppercase block mb-6">
              The Ultimate Sanctuary
            </span>
            <p className="text-lg sm:text-2xl font-light text-gray-300 leading-relaxed font-sans">
              "We took away all the complicated noisy machines, all the messy wires, and all the stress. What is left is simply the most beautiful, organic, warm space for you to live in forever."
            </p>
          </div>
        </div>

        {/* Fully Filled Media / Color Spaces */}
        <div className="w-full flex space-x-1 sm:space-x-4 px-2 sm:px-6">
          <div className="h-40 w-1/4 bg-indigo-900/40 rounded-[2rem] hover:bg-indigo-800/60 transition-colors duration-700" />
          <div className="h-40 w-2/4 bg-pink-900/30 rounded-[2rem] hover:bg-pink-800/50 transition-colors duration-700" />
          <div className="h-40 w-1/4 bg-purple-900/40 rounded-[2rem] hover:bg-purple-800/60 transition-colors duration-700" />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 12. IMMERSIVE PLATFORM DECK SIGNUP (CTA - ZERO SPACE)     */}
      {/* ======================================================== */}
      <section id="cta-setup-sanctuary" className="pb-32 pt-8 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="liquid-glass border border-white/20 p-8 md:p-14 rounded-[2.5rem] relative overflow-hidden text-center space-y-8 bg-gradient-to-b from-[#080808] to-[#040404]">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/10 via-slate-950/20 to-purple-950/10 opacity-70" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/[0.02] rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/[0.02] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="text-[9px] font-mono text-indigo-400 tracking-[0.25em] uppercase block bg-indigo-950/60 border border-indigo-500/20 w-fit mx-auto px-4 py-1.5 rounded-full font-bold">
              ESTABLISH YOUR AUTONOMOUS COZY OUTBOUND CORRIDOR
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6.5xl font-light text-white tracking-tight leading-none">
              Bypass Brittle Grids <br />
              <span className="font-semibold text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text">
                Secure Calm Comfort Now
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-2xl mx-auto leading-relaxed">
              Register or login to your independent platform account node in simple easy words today. Explore mountain spring tubes, track solar collection, and trade warm heating blocks with neighbors.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto pt-4">
            <button
              onClick={() => onNavigate('signup')}
              className="group w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-black font-semibold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Setup Your Account Node</span>
              <Sparkles size={11} className="text-indigo-500 animate-pulse" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-4 bg-black/60 hover:bg-white/[0.03] border border-white/10 hover:border-white/25 text-white font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Consult Living Architects
            </button>
          </div>

          <div className="relative z-10 pt-4 flex flex-wrap justify-center items-center gap-6 text-[10px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-indigo-400" /> Gravity Pressed Spring Water</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-indigo-400" /> Zero backgrounds electrical waves</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-indigo-400" /> Absolute, cozy insulation warmth</span>
          </div>
        </div>
      </section>

    </div>
  );
}
