import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Lock, 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  MousePointer,
  Sun,
  Droplet,
  Heart,
  Eye,
  Shield,
  Anchor,
  Wind
} from 'lucide-react';
import { SpaceImmersionCanvas } from './SpaceImmersionCanvas';

interface SolutionsPageProps {
  onNavigate: (tab: 'home' | 'platform' | 'solutions' | 'company' | 'pricing' | 'contact' | 'signin' | 'signup') => void;
}

export function SolutionsPage({ onNavigate }: SolutionsPageProps) {
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Parallax / Scroll hooks
  const { scrollYProgress } = useScroll();

  // Marquee Transforms
  const marqueeForwardX = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const marqueeReverseX = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const fastMarqueeForwardX = useTransform(scrollYProgress, [0, 1], [-400, 400]);

  // Scroll text highlighting
  const textOpacityA = useTransform(scrollYProgress, [0.3, 0.45], [0.1, 1]);
  const textOpacityB = useTransform(scrollYProgress, [0.55, 0.7], [0.1, 1]);
  
  // Floating parallax items
  const floatBgY = useTransform(scrollYProgress, [0, 1], [0, 600]);
  const slowFloatY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // Mouse tilt variables
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-250, 250], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-250, 250], [-15, 15]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  useEffect(() => {
    // Simulator loader
    const interval = setInterval(() => {
      setLoaderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsRevealed(true), 200);
          return 100;
        }
        return prev + 4;
      });
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#020202] text-white overflow-hidden relative font-sans leading-relaxed selection:bg-indigo-500 selection:text-white">
      
      {/* -------------------------------------------------------- */}
      {/* 1. CINEMATIC MULTI-LAYER PRELOADER PANEL                 */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div 
            id="solutions-preloader"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center p-6 space-y-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0%,transparent_65%)] pointer-events-none" />
            
            <div className="space-y-6 text-center relative z-10 max-w-lg">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-t-2 border-l-2 border-indigo-400/90 border-r border-r-purple-400/35 rounded-full mx-auto flex items-center justify-center p-2 mb-4"
              >
                <div className="w-14 h-14 border-b-2 border-purple-400 rounded-full animate-spin duration-3000" />
              </motion.div>
              
              <span className="text-[10px] font-mono tracking-[0.3em] text-indigo-400 uppercase block">
                Loading Perfect Comfort
              </span>
              <h2 className="text-4xl font-extralight tracking-tight text-white leading-none">
                Absolute <span className="font-semibold text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text">Peace</span>
              </h2>
            </div>
            <div className="w-72 h-[3px] bg-white/[0.04] rounded-full overflow-hidden relative z-10 p-[1px] border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 rounded-full" 
                style={{ width: `${loaderProgress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Grid Overlay drifting with scroll */}
      <motion.div 
        style={{ y: slowFloatY }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#11182705_1px,transparent_1px),linear-gradient(to_bottom,#11182705_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-50 z-0" 
      />

      {/* Atmospheric Spatial Nebula */}
      <div className="absolute top-0 right-12 w-[45rem] h-[45rem] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <motion.div style={{ y: floatBgY }} className="absolute top-1/3 left-12 w-[30rem] h-[30rem] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Sticky top mini-bar */}
      <div className="sticky top-0 left-0 right-0 z-40 bg-[#020202]/85 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">
            Surroundings: <span className="text-indigo-400 font-bold">Absolutely Calm</span>
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ENHANCED HERO SECTION WITH ALL THE DETAILS (NO EMPTY SPACE) */}
      {/* ======================================================== */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[115vh] flex items-center justify-center pt-24 pb-16 px-6 md:px-12 overflow-hidden"
      >
        <SpaceImmersionCanvas />

        <div className="relative max-w-7xl mx-auto w-full z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Scatter Text Hero Left */}
          <div className="lg:col-span-7 space-y-12 text-left relative z-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border border-indigo-400/20 rounded-full"
            >
              <Heart size={12} className="animate-pulse text-indigo-400" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold text-indigo-300">
                Total Family Protection
              </span>
            </motion.div>

            <div className="relative space-y-6">
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl md:text-8xl font-extralight tracking-tight text-white leading-[1.1] relative"
              >
                Everything <br />
                <span className="font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-300 bg-clip-text text-transparent italic">
                  Taken Care Of.
                </span>
              </motion.h1>

              {/* Scattered little absolute label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }} 
                className="absolute right-0 md:-right-20 top-20 border-l border-indigo-500/30 pl-3 max-w-[150px] hidden md:block"
              >
                <p className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest leading-relaxed">
                  We handle the weather, the water, the outside world.
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="text-base md:text-xl text-gray-300 font-sans max-w-xl leading-relaxed font-light mt-6"
              >
                You don't need to worry about power going out or water stopping. Our beautiful homes automatically protect you and keep everything running smoothly and quietly. You just get to live comfortably.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-white/5"
            >
              {[
                { title: "Always Warm", desc: "Cozy nights", c: "text-orange-400" },
                { title: "Always Fresh", desc: "Clean water", c: "text-pink-400" },
                { title: "Always Bright", desc: "Endless light", c: "text-amber-400" },
              ].map((item, i) => (
                <div key={i} className={`p-4 bg-white/[0.015] border border-white/5 rounded-2xl ${i%2===1?'translate-y-2':''}`}>
                  <div className={`text-sm font-light ${item.c}`}>{item.title}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-mono">{item.desc}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <button onClick={() => onNavigate('contact')} className="px-8 py-4 bg-white text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-[0_5px_30px_rgba(255,255,255,0.1)]">
                <span>See Your Safe Home</span>
                <ArrowRight size={14} className="text-indigo-500" />
              </button>
            </motion.div>
          </div>

          {/* Interactive Tilt Card Right Side */}
          <div className="lg:col-span-5 w-full flex justify-center relative">
            <div className="absolute top-0 right-10 w-52 h-52 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none animate-[pulse_4s_linear_infinite]" />
            <motion.div
              style={{ rotateX, rotateY }}
              className="w-full max-w-md liquid-glass border border-indigo-500/20 bg-[#050505]/95 p-8 rounded-[3rem] relative overflow-hidden shadow-[0_20px_50px_rgba(99,102,241,0.1)] space-y-6"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-400" />
                  <span className="text-xs font-light text-white">Your Sanctuary</span>
                </div>
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase">
                  100% Protected
                </span>
              </div>

              <div className="space-y-6 pt-4 text-center">
                <div className="flex justify-center">
                   <Shield size={64} className="text-indigo-400 font-extralight" strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-xl font-light text-white mb-2">Unbreakable Peace</h4>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Storms outside mean nothing inside. We built a bubble of pure comfort that never breaks, never stops glowing, and never runs out of fresh water.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-950/20 rounded-2xl border border-indigo-500/15">
                <div className="flex items-center justify-between text-xs font-mono text-gray-300">
                  <span>Current Weather</span>
                  <span className="text-red-400">Harsh Storms</span>
                </div>
                <div className="h-px w-full bg-white/5 my-2" />
                <div className="flex items-center justify-between text-xs font-mono text-gray-300">
                  <span>Inside Your House</span>
                  <span className="text-emerald-400 font-bold">Perfectly Warm</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50 text-[9px] tracking-[0.2em] font-mono text-gray-400">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Anchor size={14} className="text-indigo-400" />
          </motion.div>
          <span>SCROLL TO DISCOVER AMAZING CALM</span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. MULTI-DIRECTIONAL FULL WIDTH MARQUEES                   */}
      {/* ======================================================== */}
      <section className="py-16 bg-[#010101] border-y border-white/5 overflow-hidden flex flex-col gap-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div style={{ x: marqueeForwardX }} className="flex items-center gap-12 text-2xl md:text-5xl font-light text-gray-500/30 uppercase tracking-tighter">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-8">
                <span>Totally Stress Free Lifestyle</span>
                <span className="text-indigo-500/30">❋</span>
                <span>You Do Nothing, We Do Everything</span>
                <span className="text-purple-500/30">❋</span>
              </span>
            ))}
          </motion.div>
        </div>

        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div style={{ x: marqueeReverseX }} className="flex items-center gap-16 text-3xl md:text-6xl font-extralight text-white/5 uppercase tracking-wide italic">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-8">
                <span>Incredible Comfort</span>
                <span className="text-pink-500/20">—</span>
                <span>Always Safe and Warm</span>
                <span className="text-amber-500/20">—</span>
              </span>
            ))}
          </motion.div>
        </div>

        <div className="flex whitespace-nowrap overflow-hidden pt-4 border-t border-white/[0.02]">
          <motion.div style={{ x: fastMarqueeForwardX }} className="flex items-center gap-12 text-sm font-mono text-indigo-300/40 uppercase tracking-[0.3em]">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="flex items-center gap-12">
                <span>No Complicated Menus</span>
                <span>No Technical Settings</span>
                <span>Just Pure Relaxation</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. ASYMMETRICAL STORY BLOCKS (NO EMPTY SPACES)             */}
      {/* ======================================================== */}
      <section className="py-32 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto relative bg-[#020202]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
          
          <div className="lg:col-span-4 space-y-8 sticky top-32 z-20">
            <span className="text-[10px] font-mono text-purple-400 tracking-[0.2em] block uppercase border border-purple-500/20 px-3 py-1 rounded-full w-fit">
              Simple Solutions
            </span>
            <h3 className="text-4xl md:text-6xl font-light text-white leading-none tracking-tight">
              We Solved <br />
              <span className="font-semibold text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text">
                Every Problem.
              </span>
            </h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed pt-2">
              You should not have to think about how your house stays warm or where the water comes from. We made it all completely invisible and totally automatic. It just surrounds you with comfort.
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Massive block 1 */}
            <motion.div whileHover={{ scale: 1.01 }} className="liquid-glass border border-white/5 bg-[#050505] p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] group-hover:scale-150 transition-all duration-700" />
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="p-5 rounded-3xl bg-indigo-950/30 text-indigo-400 border border-indigo-500/15">
                  <Wind size={40} className="font-extralight" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl md:text-3xl font-light text-white">Breathing Freshness</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-sans max-w-md">
                    The air inside is constantly replaced with crisp, totally clean forest air. It smells like a gentle mountain morning, all day, every day. You don't plug anything in.
                  </p>
                  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 inline-block">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Result: You feel amazing.</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Massive block 2 */}
            <motion.div whileHover={{ scale: 1.01 }} className="liquid-glass border border-white/5 bg-[#050505] p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group ml-0 md:ml-12">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] group-hover:scale-150 transition-all duration-700" />
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="p-5 rounded-3xl bg-cyan-950/30 text-cyan-400 border border-cyan-500/15">
                  <Droplet size={40} className="font-extralight" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl md:text-3xl font-light text-white">Endless Sweet Water</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-sans max-w-md">
                    No pipes from the city. Pure, sweet, healthy water flows straight from untouched nature directly to your kitchen. Drink as much as you want forever.
                  </p>
                  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 inline-block">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Result: Pure hydration.</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Massive block 3 */}
            <motion.div whileHover={{ scale: 1.01 }} className="liquid-glass border border-white/5 bg-gradient-to-br from-[#0a0a0a] to-[#040404] p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group mt-4">
              <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left justify-between w-full relative z-10">
                <div className="space-y-4 text-center w-full">
                  <h4 className="text-3xl md:text-5xl font-extralight text-white border-b border-white/5 pb-6">
                    A beautiful, <span className="text-purple-400 italic font-light">perfectly simple</span> life.
                  </h4>
                  <p className="text-lg text-gray-400 font-sans mx-auto pt-2">
                    Our entire solution is making sure you never experience a single minor inconvenience in your wonderful home.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. COLOSSAL SCATTERED DESIGN MEGA SECTION                  */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden bg-[#000000] py-40 border-y border-white/5 space-y-40">
        
        {/* Animated SVG connecting lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 2000" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M 0,200 Q 400,600 200,1000 T 800,1800" 
              fill="none" 
              stroke="url(#gradLine)" 
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
            <motion.path 
              d="M 1000,500 Q 600,1000 900,1400 T 100,1900" 
              fill="none" 
              stroke="url(#gradLine2)" 
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 5, ease: "easeInOut", delay: 0.5 }}
            />
            <defs>
              <linearGradient id="gradLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="gradLine2" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Scattered Typography & Absolute Floating Elements */}
        <div className="max-w-7xl mx-auto px-6 relative z-10 min-h-[600px] flex items-center justify-center">
          <div className="w-full relative h-[600px]">
            
            {/* Top Left Float */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}
              className="absolute top-0 left-0 md:left-10 text-left max-w-[280px]"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400">
                <Sun size={20} />
              </div>
              <p className="text-xl font-light text-white leading-relaxed">
                Golden sunshine warms your floors gently giving you perfect evening comfort.
              </p>
            </motion.div>

            {/* Top Right Float */}
            <motion.div 
              initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}
              className="absolute top-20 right-0 text-right max-w-[280px] hidden md:block"
            >
              <span className="text-[10px] font-mono text-purple-400 tracking-[0.2em] uppercase mb-4 block">
                Never Think About It
              </span>
              <p className="text-sm font-sans text-gray-400 leading-relaxed italic border-r border-purple-500/30 pr-4">
                You never have to check a screen or push a dial. It handles itself.
              </p>
            </motion.div>

            {/* Super Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }}
                className="text-7xl md:text-9xl lg:text-[10rem] font-extralight tracking-tighter text-white/90"
              >
                Immense <br />
                <span className="font-semibold text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text">
                  Joy.
                </span>
              </motion.h2>
            </div>

            {/* Bottom Right Float */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}
              className="absolute bottom-10 right-0 md:right-10 text-right max-w-[250px]"
            >
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 text-pink-400 ml-auto">
                <Heart size={20} />
              </div>
              <p className="text-lg font-light text-white leading-snug">
                Your family completely safe and smiling.
              </p>
            </motion.div>

            {/* Bottom Left Float */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4 }}
              className="absolute bottom-0 left-0 md:left-20 text-left max-w-sm hidden lg:block"
            >
              <p className="text-xs font-mono text-gray-500 leading-relaxed uppercase tracking-wider bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                Every detail is so perfectly finished that it feels like magic, but it is just wonderfully brilliant design.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Scroll Text Revealer Section */}
        <div className="max-w-6xl mx-auto px-6 relative z-10 py-10 md:py-20 text-center">
          <motion.p style={{ opacity: textOpacityA }} className="text-3xl md:text-5xl lg:text-7xl font-light text-white leading-[1.2] tracking-tight mb-8">
            You wake up feeling totally refreshed, energized, and deeply relaxed.
          </motion.p>
          <motion.p style={{ opacity: textOpacityB }} className="text-2xl md:text-4xl lg:text-5xl font-light text-gray-600 leading-[1.3] tracking-tight">
            Our incredible solution is giving you the best, most beautiful calm life possible without you having to lift a finger.
          </motion.p>
        </div>

        {/* Massive Space-Filling Asset Grid */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          
          <motion.div whileHover={{ scale: 1.02 }} className="md:col-span-8 h-[450px] rounded-[3rem] bg-gradient-to-br from-[#101010] to-[#050505] border border-white/10 relative overflow-hidden flex flex-col justify-end p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15)_0%,transparent_60%)]" />
            <Shield size={180} strokeWidth={1} className="absolute right-0 top-10 text-indigo-500/10 pointer-events-none" />
            <div className="relative z-10 space-y-4 max-w-lg">
              <span className="text-[11px] font-mono text-indigo-400 tracking-widest uppercase bg-indigo-950/40 px-3 py-1 rounded-full w-fit">Total Security</span>
              <h3 className="text-4xl font-light text-white leading-tight">Like a fortress, but feels like a soft cloud.</h3>
              <p className="text-sm font-sans text-gray-400">We used the thickest, most beautiful natural stone to wrap the walls. It blocks out every single bad thing.</p>
            </div>
          </motion.div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <motion.div whileHover={{ scale: 1.05 }} className="h-[213px] rounded-[2.5rem] bg-[#080808] border border-white/5 p-8 flex flex-col justify-center items-center text-center">
               <span className="text-5xl font-light text-white">100%</span>
               <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-2">Pure Clean Flow</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="h-[213px] rounded-[2.5rem] bg-indigo-950/20 border border-indigo-500/10 p-8 flex flex-col justify-center items-center text-center">
               <Heart size={40} className="text-pink-400 mb-2 font-extralight" strokeWidth={1} />
               <span className="text-sm text-pink-300">Beautifully Warm</span>
            </motion.div>
          </div>
          
        </div>

        {/* Dense Color Accent Ribbons */}
        <div className="flex w-full h-48 opacity-80 mt-20">
          <div className="flex-1 bg-indigo-900/20 hover:bg-indigo-900/50 transition-colors duration-1000 rounded-tr-[5rem]" />
          <div className="flex-1 bg-purple-900/10 hover:bg-purple-900/40 transition-colors duration-1000" />
          <div className="flex-1 bg-pink-900/20 hover:bg-pink-900/50 transition-colors duration-1000 rounded-tl-[5rem]" />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. IMMERSIVE CTA - CLOSING SCENE (NO EMPTY SPACES)         */}
      {/* ======================================================== */}
      <section className="pb-32 pt-20 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto bg-[#020202]">
        <div className="liquid-glass border border-white/20 p-10 md:p-20 rounded-[3rem] relative overflow-hidden text-center space-y-10 group hover:border-indigo-500/30 transition-colors duration-700">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/30 via-slate-950/50 to-purple-950/20 opacity-80 pointer-events-none" />
          
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-all duration-1000" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-all duration-1000" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <span className="text-[12px] font-mono text-indigo-300 tracking-[0.3em] uppercase block font-bold">
              Ready For The Best Life?
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-tight">
              Step Into Your <br />
              <span className="italic text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text font-normal">
                Perfect Sanctuary.
              </span>
            </h2>
            <p className="text-lg md:text-2xl text-gray-400 font-sans font-light leading-relaxed max-w-3xl mx-auto">
              It is incredibly easy to make this yours. You tell us what you want, and we make the magic happen perfectly. No stress.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 w-full max-w-xl mx-auto">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-gray-200 text-black font-semibold text-sm uppercase tracking-widest rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(255,255,255,0.15)] hover:scale-105"
            >
              <span>Get Your Home</span>
              <Sparkles size={16} className="text-indigo-600 animate-pulse" />
            </button>
            <button
              onClick={() => onNavigate('platform')}
              className="w-full sm:w-auto px-10 py-5 bg-[#0a0a0a]/80 hover:bg-white/[0.05] border border-white/20 hover:border-white/40 text-white font-mono text-[12px] uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-lg"
            >
              See beautiful pictures
            </button>
          </div>
          
          <div className="relative z-10 pt-10 flex flex-wrap justify-center items-center gap-8 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
             <span>❋ Always Perfect</span>
             <span>❋ Zero Effort</span>
             <span>❋ Total Happiness</span>
          </div>
        </div>
      </section>

    </div>
  );
}

