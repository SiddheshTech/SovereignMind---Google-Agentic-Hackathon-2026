import { useState, useRef, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { 
  Shield, 
  Landmark, 
  Globe, 
  Check, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Cpu, 
  Lock, 
  Sliders, 
  Zap, 
  CheckCircle2, 
  Info,
  DollarSign,
  ChevronRight,
  RefreshCw,
  Fingerprint
} from 'lucide-react';
import { SpaceImmersionCanvas } from './SpaceImmersionCanvas';

interface PricingPageProps {
  onNavigate: (tab: 'home' | 'platform' | 'solutions' | 'company' | 'pricing' | 'contact' | 'signin' | 'signup') => void;
}

interface PricingTier {
  id: string;
  name: string;
  badge: string;
  icon: any;
  annualMonthly: number;
  biennialMonthly: number;
  description: string;
  features: string[];
  ctaText: string;
  colorTheme: string; // Tailwind class
  glowColor: string;  // Tailwind gradient/glow class
}

const PLANS: PricingTier[] = [
  {
    id: 'tier-inst',
    name: 'Institutional Foresight Plan',
    badge: 'Regional Resilience',
    icon: Shield,
    annualMonthly: 12500,
    biennialMonthly: 10500,
    description: 'Perfect for sub-national agencies, regional utility boards, and municipal asset management committees requiring local foresight.',
    features: [
      'Access to regional physical logistic vulnerability models',
      'Continuous algorithmic polarization monitoring alerts',
      'Alternative localized sea-land transit pathfinders',
      'Daily sub-channel utility grid buffer analysis reports',
      '14-day pre-emptive scenario projections buffer'
    ],
    ctaText: 'Establish Regional Foresight',
    colorTheme: 'from-indigo-500/10 via-indigo-950/5 to-transparent',
    glowColor: 'group-hover:shadow-[0_0_35px_rgba(16,185,129,0.15)]'
  },
  {
    id: 'tier-state',
    name: 'Sovereign State Plan',
    badge: 'National Security Core',
    icon: Landmark,
    annualMonthly: 45000,
    biennialMonthly: 38000,
    description: 'Enterprise-grade national resilience infrastructure built for central ministries of defense, strategic food boards, and central bank frameworks.',
    features: [
      'Full trans-continental physical distribution flow mapping',
      'Integrated physical buffer management simulation triggers',
      'Cryptographic information trust metadata signatures api',
      'Real-time automated resource relocation treaty alerts',
      '180-day pre-emptive scenario projections horizon',
      'Direct secure coordination node with geneva cluster core',
      'Dedicated local installation and 24/7 strategic support'
    ],
    ctaText: 'Access Sovereign Autopilot',
    colorTheme: 'from-pink-500/15 via-pink-950/10 to-transparent',
    glowColor: 'group-hover:shadow-[0_0_50px_rgba(20,184,166,0.25)]'
  },
  {
    id: 'tier-con',
    name: 'Global Consortium Alliance Plan',
    badge: 'Multi-lateral Coordination',
    icon: Globe,
    annualMonthly: 95000,
    biennialMonthly: 80000,
    description: 'Designed for global inter-governmental alliances, maritime corridors councils, and trans-continental energy stabilization foundations.',
    features: [
      'Multi-lateral regional coordination mapping interfaces',
      'Sovereign-to-Sovereign emergency credit ledgers integration',
      'Coordinating network links to London, Geneva, and Tokyo clusters',
      'Unlimited scenario simulation test allocations',
      'Customized planetary thermal climate impact predictions',
      'Direct strategic coordination with the board of directors',
      'Advisory consulting and executive policy auditing'
    ],
    ctaText: 'Form Strategic Alliance',
    colorTheme: 'from-purple-500/10 via-purple-950/5 to-transparent',
    glowColor: 'group-hover:shadow-[0_0_35px_rgba(6,182,212,0.15)]'
  }
];

export function PricingPage({ onNavigate }: PricingPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'biennial'>('annual');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Dynamic resilience customizer states
  const [popCoverage, setPopCoverage] = useState<number>(150); // in thousands
  const [daysHorizon, setDaysHorizon] = useState<number>(90); // reserve days
  const [vaultLevel, setVaultLevel] = useState<'tier-1' | 'tier-2' | 'tier-3'>('tier-2');
  const [estimatedBudget, setEstimatedBudget] = useState<number>(24500);

  // Parallax scroll elements
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroOuterScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(heroOuterScroll, [0, 1], [0, 280]);
  const heroOpacity = useTransform(heroOuterScroll, [0, 0.75], [1, 0]);
  const heroScale = useTransform(heroOuterScroll, [0, 1], [1, 0.95]);

  // Mouse tilt tracking for hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(useTransform(mouseX, [-250, 250], [-12, 12]), { damping: 25, stiffness: 150 });
  const springY = useSpring(useTransform(mouseY, [-250, 250], [-12, 12]), { damping: 25, stiffness: 150 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Recalculate dynamic budget on slider/level modifications
  useEffect(() => {
    let basePrice = 5000;
    // population variable weight
    basePrice += popCoverage * 45;
    // days of reserve projection weight
    basePrice += daysHorizon * 85;
    // vault location base modifiers
    if (vaultLevel === 'tier-1') {
      basePrice += 4000;
    } else if (vaultLevel === 'tier-2') {
      basePrice += 12000;
    } else {
      basePrice += 34000;
    }

    // Applying loyalty discount based on timeline structure scale
    if (billingPeriod === 'biennial') {
      basePrice = basePrice * 0.8;
    }

    // Introduce a quick animation step or visual count-up simulation
    setEstimatedBudget(Math.round(basePrice));
  }, [popCoverage, daysHorizon, vaultLevel, billingPeriod]);

  const faqs = [
    {
      q: "How are Sovereign Mind licenses compiled and validated?",
      a: "Sovereign Mind licenses are issued under the laws of the Canton of Geneva as localized cryptographic assets, locked to specific physical hardware signatures setup inside your district core. There are zero general cloud tracking databases."
    },
    {
      q: "Can agricultural networks merge with municipal grids in a single plan?",
      a: "Yes, our Sovereign State Plan supports multi-agency cooperative mapping. Agricultural routes, fertilizer storage, and drinking water basins can be bound under hierarchical clearance protocols."
    },
    {
      q: "What physical isolation measures secure Alpine Server Clocks?",
      a: "All state-level projection templates run on physical server cabinets fitted inside air-gapped decommissioned military bunkers. These shelters feature high-performance filters, self-sufficient backup generators, EMP protection, and double-gate secure entries."
    },
    {
      q: "Can the estimates from the Interactive Customizer be locked in?",
      a: "The calculations represent standard technical allocations. To establish a legally binding national alignment program, you must submit a briefing request so our Swiss Council engineers can audit the geological topography of the site."
    }
  ];

  return (
    <div ref={containerRef} className="w-full bg-[#030303] text-white overflow-hidden relative font-sans leading-relaxed">
      
      <button 
        onClick={() => {
          if (window.history.length > 2) {
            window.history.back();
            // Since this is a react SPA without react-router, we also trigger the manual fallback
            onNavigate('signin');
          } else {
            onNavigate('signin');
          }
        }}
        className="fixed top-8 left-8 sm:top-12 sm:left-12 z-50 flex items-center gap-2 px-4 py-2 bg-[#0a0a0a]/80 border border-white/10 text-white text-xs font-bold rounded-xl transition-all cursor-pointer hover:bg-white/10 backdrop-blur-md shadow-2xl"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Background Vector Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Immersive Floating Spheres */}
      <div className="absolute top-[10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45rem] h-[45rem] bg-pink-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[35rem] h-[35rem] bg-purple-500/[0.03] rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* ======================================================== */}
      {/* CINEMATIC ASYMMETRICAL CONTROLS HERO SECTION            */}
      {/* ======================================================== */}
      <section 
        id="pricing-hero"
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-16 px-6 md:px-12 lg:px-16"
      >
        {/* Subtle exclusive network matrix overlay */}
        <div className="absolute inset-0 bg-radial-gradient-mesh opacity-20 pointer-events-none" />
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto w-full z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center text-left"
        >
          {/* LEFT COLUMN: Deep Editorial Typography Reveal */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
            
            {/* Top Security Registry Badge with localized state indicator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/20 border border-indigo-500/20 text-indigo-400 rounded-full w-fit backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              <span className="text-[9px] font-mono uppercase tracking-widest font-extrabold">
                ALLOCATION-DESK SPEC CH-403
              </span>
            </motion.div>

            {/* Futuristic split kinetic header with dual highlights */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-4xl sm:text-6xl md:text-7.5xl lg:text-8xl font-extralight tracking-tight text-white leading-none"
              >
                Defense <br className="hidden sm:inline" />
                <span className="font-semibold bg-gradient-to-r from-indigo-400 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Is Deterministic.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="text-xs sm:text-sm text-gray-400 max-w-2xl font-light leading-relaxed font-sans"
              >
                We do not deal in speculative sentiment indices. Sovereign Mind compiles localized grid, maritime channel, and energy corridor buffers to preserve continuous socio-technical survival. Explore our strict Swiss-compliant plans or configure your custom sector specs below.
              </motion.p>
            </div>

            {/* Beautiful indicators grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              {[
                { title: "Physical Isolation", desc: "Alpine granite enclaves" },
                { title: "Zero Speculation", desc: "Empirical physical values only" },
                { title: "Sovereign Legality", desc: "Geneva registry protected" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-left">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">
                    // 0{idx + 1} MODULE
                  </span>
                  <h4 className="text-xs font-semibold text-white uppercase">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 font-sans">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Quick interactive links */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  const s = document.getElementById('pricing-tiers');
                  s?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group px-6 py-3.5 bg-white text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all cursor-pointer flex items-center gap-2 shadow-[0_4px_25px_rgba(255,255,255,0.05)]"
              >
                <span>Navigate to Tiers</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const sect = document.getElementById('custom-estimator');
                  sect?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-white font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Jump to Simulator
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: The Interactive Tactical Control Simulation Card */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <motion.div
              style={{ rotateX: springY, rotateY: springX }}
              className="w-full max-w-md liquid-glass border border-indigo-400/20 bg-[#060606]/95 p-6 rounded-[2.5rem] relative overflow-hidden shadow-[0_15px_50px_rgba(16,185,129,0.05)] space-y-6"
            >
              {/* Internal scanner lines and accent glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-pink-900/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-gray-405 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span>TACTICAL ALLOCATION DECKS</span>
                </div>
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-500/10">
                  LIVE INTERACTIVE
                </span>
              </div>

              {/* Spectacular concentric SVG Radar Scanner Graphic */}
              <div className="relative h-44 flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90 select-none pointer-events-none" viewBox="0 0 100 100">
                  {/* Concentric grid lines */}
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  
                  {/* Outer sweeping radar glow with arbitrary Tailwind animation loop */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="url(#radarSweepGlow)" 
                    strokeWidth="2" 
                    strokeDasharray="251.2" 
                    className="origin-center animate-[spin_6s_linear_infinite]"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="radarSweepGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#c084fc" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Dynamic connection points */}
                  <circle cx="50" cy="10" r="1.5" fill="#818cf8" />
                  <circle cx="85" cy="50" r="1.5" fill="#c084fc" />
                  <circle cx="15" cy="40" r="2" fill="#c084fc" className="animate-pulse" />
                </svg>

                {/* Center visual: Secure core key metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-full backdrop-blur-md">
                    <Fingerprint className="text-indigo-400 w-5 h-5 animate-pulse" />
                  </div>
                  <div className="font-mono text-[9px] text-gray-400 mt-1 uppercase tracking-widest">
                    SYSTEM SECURE
                  </div>
                </div>
              </div>

              {/* Dynamic control inputs directly on the Hero to alter custom budget */}
              <div className="space-y-4">
                
                {/* Billing period quick toggles with actual state bonding */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] font-mono text-gray-550 uppercase tracking-wider block font-bold">
                    SELECT BILLING TERM
                  </span>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
                    <button
                      onClick={() => setBillingPeriod('annual')}
                      className={`py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        billingPeriod === 'annual'
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.02] border border-transparent'
                      }`}
                    >
                      Annual (-20%)
                    </button>
                    <button
                      onClick={() => setBillingPeriod('biennial')}
                      className={`py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        billingPeriod === 'biennial'
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.02] border border-transparent'
                      }`}
                    >
                      Biennial (-35%)
                    </button>
                  </div>
                </div>

                {/* Estimated real-time price count inside the Hero Decks */}
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center text-left">
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                      Calculated Security Allocation
                    </span>
                    <span className="text-xl md:text-2xl font-mono text-indigo-300 tracking-tight font-semibold mt-0.5 block">
                      ${estimatedBudget.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">/mo</span>
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      const estim = document.getElementById('custom-estimator');
                      estim?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2.5 bg-white text-black hover:bg-gray-150 rounded-xl transition-all cursor-pointer shadow-md shrink-0 flex items-center justify-center font-mono"
                    title="Customize details"
                  >
                    <Sliders size={13} />
                  </button>
                </div>

              </div>

              <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  99.999% DURABILITY
                </span>
                <span>CH-GENEVA EXPOSURE ZONE</span>
              </div>

            </motion.div>
          </div>

        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* ASYMMETRICAL EDITORIAL PRICING PLANS                     */}
      {/* ======================================================== */}
      <section id="pricing-tiers" className="py-20 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-6">
          {PLANS.map((tier, index) => {
            const Icon = tier.icon;
            const rate = billingPeriod === 'annual' ? tier.annualMonthly : tier.biennialMonthly;
            const isFeatured = tier.id === 'tier-state';

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                className={`group liquid-glass border rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-8 relative overflow-hidden transition-all duration-500 ${
                  isFeatured
                    ? 'border-indigo-400/40 bg-zinc-950/40 shadow-[0_0_50px_rgba(16,185,129,0.06)] lg:scale-105 z-10'
                    : 'border-white/10 bg-white/[0.01]'
                } ${tier.glowColor}`}
              >
                {/* Gradient Inner Layer and Accent Ring */}
                <div className={`absolute inset-0 bg-gradient-to-b ${tier.colorTheme} opacity-40 transition-opacity duration-500 group-hover:opacity-75 pointer-events-none`} />

                {isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-400 to-pink-400 text-black font-mono font-bold text-[9px] tracking-widest px-4 py-1.5 rounded-full uppercase shadow-md select-none">
                    Swiss Command Recommended
                  </span>
                )}

                <div className="space-y-4 relative z-10 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-0.5 rounded-md">
                      {tier.badge}
                    </span>
                    <Icon size={18} className="text-gray-400 group-hover:text-indigo-400 transition-colors" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-light text-white leading-tight group-hover:text-indigo-300 transition-colors">
                    {tier.name}
                  </h3>

                  <div className="pt-4 border-t border-white/5 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-mono font-extralight text-white tracking-tight">
                      ${rate.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-gray-500">/mo</span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    {tier.description}
                  </p>
                </div>

                {/* Separator / Divider */}
                <div className="border-t border-white/5 relative z-10 text-left pt-4 flex-1 space-y-4">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                    System Safeguards Included
                  </span>
                  
                  <ul className="space-y-3">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 leading-normal">
                        <Check size={13} className="text-indigo-400 mt-1 shrink-0" />
                        <span className="font-sans font-light">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Button */}
                <button
                  onClick={() => onNavigate('contact')}
                  className={`w-full py-4 rounded-xl text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer relative z-10 flex items-center justify-center gap-1.5 ${
                    isFeatured
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* INTERACTIVE DEMO: DYNAMIC RESILIENCE REGIONAL CUSTOMIZER */}
      {/* ======================================================== */}
      <section id="custom-estimator" className="py-20 px-6 md:px-12 lg:px-16 bg-black/40 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          
          {/* Column Header Intro */}
          <div className="mb-12 max-w-2xl text-left space-y-3">
            <span className="text-xs font-mono text-indigo-400 tracking-wider block uppercase">// INTERACTIVE SYSTEM CUSTOMIZER</span>
            <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
              Calibrate Your Regional Resilience Matrix
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-sans">
              Adjust parameters below to simulate municipal ledger capacity, security redundancy layers, and generate a dynamic budget allocation index.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Range Controls Column */}
            <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 p-6 md:p-8 rounded-3xl space-y-8 text-left">
              
              {/* Slider 1: Population */}
              <div className="space-y-3">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">1. Municipal Population Size</span>
                  <span className="text-pink-400 text-sm font-semibold">{(popCoverage * 1000).toLocaleString()} residents</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  value={popCoverage}
                  onChange={(e) => setPopCoverage(Number(e.target.value))}
                  className="w-full accent-indigo-400 bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>10,000 RESIDENTS</span>
                  <span>1,000,000 RESIDENTS</span>
                </div>
              </div>

              {/* Slider 2: Reserve Days */}
              <div className="space-y-3">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">2. Defensive Reserve Horizon</span>
                  <span className="text-pink-400 text-sm font-semibold">{daysHorizon} Days Shield</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="365" 
                  value={daysHorizon}
                  onChange={(e) => setDaysHorizon(Number(e.target.value))}
                  className="w-full accent-indigo-400 bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>30-DAY EMERGENCY SPAN</span>
                  <span>365-DAY YEARLY ISOLATION</span>
                </div>
              </div>

              {/* Selector 3: Bunker Grade */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold block">
                  3. Physical Infrastructure Grade
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'tier-1', name: 'Tier 1 Local Station', desc: 'Secure decentralized micro servers with physical line encryption.', delay: 0.1 },
                    { id: 'tier-2', name: 'Tier 2 Alpine Vault', desc: 'Sovereign hardware inside military-grade Swiss granite tunnels.', delay: 0.2 },
                    { id: 'tier-3', name: 'Tier 3 Global Consortium', desc: 'Empirical multi-satellite mirrors across global sanctuary vaults.', delay: 0.3 }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setVaultLevel(lvl.id as any)}
                      className={`p-4 border rounded-2xl text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                        vaultLevel === lvl.id 
                          ? 'border-indigo-400/50 bg-indigo-950/20 text-white' 
                          : 'border-white/5 bg-black/20 hover:border-white/10'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 font-bold block">LEVEL {lvl.id.slice(-1)}</span>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white mt-1">{lvl.name}</h4>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-normal font-sans">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Calculations and Dispatch Result Column */}
            <div className="lg:col-span-5 bg-[#050505] border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold block pb-3 border-b border-white/5">
                  ESTIMATED SYSTEM ALLOCATION QUOTE
                </span>

                <div className="py-4">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-medium">Monthly Assessment Rate</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl md:text-5xl font-mono text-indigo-400 font-semibold tracking-tight">
                      ${estimatedBudget.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-gray-500">USD</span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 block mt-1">
                    {billingPeriod === 'annual' ? '*Billed Annually' : '*Billed Biennially (-35% Allied multiplier active)'}
                  </span>
                </div>

                {/* Spec breakdown values */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-gray-500">MUNICIPAL SPECS:</span>
                    <span className="text-white">{popCoverage}K RESIDENTS</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-gray-500">PROJECTED RESIDUAL TIME:</span>
                    <span className="text-white">{daysHorizon} DAYS COOLDOWN</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-gray-500">HARDWARE ENCLAVE TIER:</span>
                    <span className="text-white uppercase">{vaultLevel.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 mt-6 relative z-10 space-y-3">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-4 bg-white hover:bg-gray-200 text-black font-semibold text-xs font-mono uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Dispatch Quote Request</span>
                  <Fingerprint size={14} className="text-indigo-500 animate-pulse" />
                </button>
                <div className="text-[9px] font-mono text-gray-550 text-center uppercase">
                  All quote documents complied under Swiss constitutional Neutrality bounds
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION: SYSTEM COMPARISON MATRIX                        */}
      {/* ======================================================== */}
      <section id="comparison-matrix" className="py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase block">// ARCHITECTURAL MATRIX</span>
            <h3 className="text-2xl md:text-4xl font-light text-white">How Sovereign Mind Secures Local Autonomy</h3>
          </div>

          <div className="liquid-glass border border-white/10 rounded-3xl overflow-hidden max-w-5xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-sans">
                
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-5 font-mono text-[10px] text-gray-400 uppercase tracking-wider font-bold">SECURITY FEATURE</th>
                    <th className="p-5 font-mono text-[10px] text-gray-400 uppercase tracking-wider font-bold">LEGACY PUBLIC CLOUDS</th>
                    <th className="p-5 font-mono text-[10px] text-indigo-400 uppercase tracking-wider font-bold">SOVEREIGN MIND SYSTEM AG</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {[
                    { 
                      feat: 'Physical Infrastructure Air-Gap', 
                      legacy: 'None. Virtual machines run hosted sharing same servers.', 
                      sovereign: 'Complete physical isolation inside decommissioned granite Swiss military bunkers.' 
                    },
                    { 
                      feat: 'Jurisdiction Protection Boundary',
                      legacy: 'Governed by broad commercial policies, sensitive to foreign intelligence requests.', 
                      sovereign: 'Fully protected under historic Swiss banking secrets & non-disclosure guidelines.' 
                    },
                    { 
                      feat: 'Speculative Dynamic Analysis', 
                      legacy: 'Heavy profiling of population sentiments, commercial patterns.', 
                      sovereign: 'Zero-knowledge tracking. Only inputs real physical flow variables (water, power, crops).' 
                    },
                    { 
                      feat: 'Fiber Backup Failure Protocol', 
                      legacy: 'Complete regional downtime or cloud route blackouts.', 
                      sovereign: 'Automated satellite mesh routing and offline local memory recovery.' 
                    }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-5 font-medium text-white">{row.feat}</td>
                      <td className="p-5 text-gray-400">{row.legacy}</td>
                      <td className="p-5 text-indigo-300 font-medium bg-indigo-950/5">{row.sovereign}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SEAMLESS INTEL FAQ DIRECTIVE (ACCORDION SECTION)         */}
      {/* ======================================================== */}
      <section id="pricing-faq" className="py-20 px-6 md:px-12 lg:px-16 max-w-4xl mx-auto border-t border-white/5">
        <div className="space-y-12">
          
          <div className="text-left space-y-2">
            <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase block">// SYSTEM SUPPORT PROTOCOLS</span>
            <h3 className="text-2xl md:text-3xl font-light text-white">Frequently Audited Guidelines</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="border border-white/5 bg-white/[0.01] rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 flex justify-between items-center text-left hover:bg-white/[0.02] cursor-pointer"
                  >
                    <span className="font-medium text-sm text-white pr-4">{faq.q}</span>
                    <span className={`text-indigo-400 font-mono transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                      <ChevronRight size={16} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="p-5 pt-0 text-xs text-gray-400 leading-relaxed font-sans border-t border-white/5 bg-black/10">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SWISS SANCTUARY FOOTER CREDENTIAL CARD                   */}
      {/* ======================================================== */}
      <section className="pb-24 pt-10 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="liquid-glass border border-white/10 p-8 md:p-14 rounded-[2.5rem] text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
            <h4 className="text-xl md:text-2xl font-light text-white uppercase tracking-tight">
              Begin Your Enclave Protection Blueprint Today
            </h4>
            <p className="text-xs text-gray-400 font-sans max-w-lg mx-auto">
              Sovereign Mind security structures are fully audit-compliant and available for immediate deployment inside Swiss and European sovereign sectors.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto pt-4">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-gray-200 text-black font-semibold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Consult Alpine Advisor</span>
              <Sparkles size={11} className="text-indigo-500 animate-pulse" />
            </button>
            <button
              onClick={() => {
                const sect = document.getElementById('custom-estimator');
                sect?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-black/40 hover:bg-white/[0.04] border border-white/10 text-white font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Simulate Resource Grid
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
