import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Anchor, 
  Compass,
  Heart,
  Eye,
  Shield,
  Activity,
  User,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';
import { SpaceImmersionCanvas } from './SpaceImmersionCanvas';

interface CompanyPageProps {
  onNavigate: (tab: 'home' | 'platform' | 'solutions' | 'company' | 'pricing' | 'contact' | 'signin' | 'signup') => void;
}

export function CompanyPage({ onNavigate }: CompanyPageProps) {
  // Reveal tracking
  const [isRevealed, setIsRevealed] = useState(false);

  // Core Scroll Hooks
  const { scrollYProgress } = useScroll();

  // Marquees
  const marqueeForwardX = useTransform(scrollYProgress, [0, 1], [-300, 300]);
  const marqueeReverseX = useTransform(scrollYProgress, [0, 1], [300, -300]);
  const fastMarqueeX = useTransform(scrollYProgress, [0, 1], [400, -400]);

  // Spatial backgrounds
  const slowFloatY = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const fastFloatY = useTransform(scrollYProgress, [0, 1], [0, 1000]);

  // Reveal texts
  const textOpacityA = useTransform(scrollYProgress, [0.15, 0.3], [0.1, 1]);
  const textOpacityB = useTransform(scrollYProgress, [0.4, 0.55], [0.1, 1]);
  const textOpacityC = useTransform(scrollYProgress, [0.65, 0.8], [0.1, 1]);

  useEffect(() => {
    // Initial reveal
    setTimeout(() => setIsRevealed(true), 100);
  }, []);

  return (
    <div className="w-full bg-[#020202] text-white overflow-hidden relative font-sans leading-relaxed selection:bg-pink-500 selection:text-white">
      
      {/* Absolute backgrounds drifting with scroll */}
      <motion.div style={{ y: slowFloatY }} className="absolute -top-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <motion.div style={{ y: fastFloatY }} className="absolute top-1/4 -right-20 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none z-0 animate-[pulse_6s_ease-in-out_infinite]" />

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-30" />

      {/* ======================================================== */}
      {/* 1. OMNIPRESENT MASSIVE HERO SECTION WITH NO EMPTY SPACE    */}
      {/* ======================================================== */}
      <section className="relative min-h-[120vh] pt-32 pb-24 px-6 md:px-12 flex flex-col justify-center overflow-hidden">
        <SpaceImmersionCanvas />

        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0">
           <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M 100,0 Q 400,800 200,1200 T 800,2000" 
              fill="none" 
              stroke="url(#grad2)" 
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={isRevealed ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col h-full space-y-16">
          
          <div className="w-full flex justify-between items-start">
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1.2, delay: 0.2 }}
               className="p-4 bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/10 max-w-sm"
             >
               <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block mb-2 font-bold">Who We Are</span>
               <p className="text-sm font-sans text-gray-300 leading-relaxed italic">
                 "We started with one simple idea. People just want to feel happy, safe, and comfortable at home without fixing things all the time."
               </p>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, delay: 0.5 }}
               className="hidden py-1 px-4 lg:flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 rounded-full"
             >
                <Heart size={14} className="text-pink-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-pink-300">Our Big Family</span>
             </motion.div>
          </div>

          <div className="w-full text-center py-20 relative">
             <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} 
                className="absolute inset-0 flex items-center justify-center -z-10 text-[10vw] font-bold text-white/[0.02] uppercase select-none tracking-tighter"
             >
               PEACEMAKERS
             </motion.div>

             <motion.h1
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2, delay: 0.3 }}
               className="text-6xl sm:text-8xl md:text-[8rem] font-extralight tracking-tighter text-white leading-[0.9]"
             >
               The People <br /> 
               <span className="font-medium bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 text-transparent bg-clip-text italic">
                Behind The Magic
               </span>
             </motion.h1>
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="mt-8 mx-auto w-px h-24 bg-gradient-to-b from-purple-400 to-transparent"
             />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.7 }}
               className="bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 -rotate-2 hover:rotate-0 transition-transform"
            >
              <div className="text-pink-400 mb-6 p-4 rounded-full bg-pink-950/30 inline-block border border-pink-500/20">
                <Sun size={32} />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">Warm Hearts</h3>
              <p className="text-sm font-sans text-gray-400 leading-relaxed">
                We are just regular people who love cozy mornings and warm sunlight. We built this company to share that exact same feeling with you every single day.
              </p>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.9 }}
               className="bg-gradient-to-br from-[#0a0a0a] to-[#040404] backdrop-blur-xl border border-indigo-500/20 rounded-[2rem] p-8 rotate-1 hover:rotate-0 transition-transform md:translate-y-12"
            >
               <div className="text-indigo-400 mb-6 p-4 rounded-full bg-indigo-950/30 inline-block border border-indigo-500/20">
                <Eye size={32} />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">Clear Vision</h3>
              <p className="text-sm font-sans text-gray-400 leading-relaxed">
                We saw that normal houses were getting too complicated and stressful. We decided to completely change everything and make living beautifully simple.
              </p>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 1.1 }}
               className="bg-purple-950/10 backdrop-blur-xl border border-purple-500/20 rounded-[2rem] p-8 -rotate-1 hover:rotate-0 transition-transform"
            >
               <div className="text-purple-400 mb-6 p-4 rounded-full bg-purple-950/30 inline-block border border-purple-500/20">
                <Coffee size={32} />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">Everyday Joy</h3>
              <p className="text-sm font-sans text-gray-400 leading-relaxed">
                Drinking hot coffee while watching the rain perfectly safe inside. That is the feeling we package and build into the very walls of your home.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. FORWARD-REVERSE SCROLLING MARQUEE BLOCKS                */}
      {/* ======================================================== */}
      <section className="py-20 bg-[#000000] border-y border-white/5 overflow-hidden flex flex-col gap-10">
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div style={{ x: marqueeForwardX }} className="flex items-center gap-16 text-4xl sm:text-7xl font-extralight text-gray-700 uppercase tracking-tighter">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-16">
                <span>The Greatest Gift Is Peace Of Mind</span>
                <span className="text-pink-500/20">✿</span>
              </span>
            ))}
          </motion.div>
        </div>
        
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div style={{ x: marqueeReverseX }} className="flex items-center gap-12 text-3xl sm:text-6xl font-light text-white/10 uppercase tracking-widest italic">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-12">
                <span>Built With Deep Love</span>
                <span className="text-indigo-500/20">✦</span>
              </span>
            ))}
          </motion.div>
        </div>

        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div style={{ x: fastMarqueeX }} className="flex items-center gap-24 text-2xl sm:text-5xl font-mono text-purple-400/20 uppercase font-bold tracking-[0.2em]">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-24">
                <span>Total Comfort</span>
                <span>Complete Security</span>
                <span>Absolute Happiness</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. COLOSSAL FILL-SCATTERED ABOUT SCROLL REVEAL             */}
      {/* ======================================================== */}
      <section className="py-40 px-6 md:px-12 max-w-[100rem] mx-auto min-h-[200vh] relative">
         {/* Center large scrolling text revealed block */}
         <div className="sticky top-1/3 left-0 w-full flex justify-center text-center z-10 pointer-events-none px-4">
             <div className="text-3xl md:text-5xl lg:text-7xl font-light text-white max-w-5xl leading-tight tracking-tight">
               <motion.span style={{ opacity: textOpacityA }} className="block">
                 We started our journey because we were tired of things breaking.
               </motion.span>
               <motion.span style={{ opacity: textOpacityB }} className="block text-pink-300 italic my-4">
                 We wanted a place where nothing ever goes wrong.
               </motion.span>
               <motion.span style={{ opacity: textOpacityC }} className="block">
                 So we created a company that builds perfect peace.
               </motion.span>
             </div>
         </div>

         {/* Floating colored chunks to fill the space everywhere */}
         <div className="absolute top-20 left-10 md:left-40 w-64 h-80 bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 -rotate-6 hover:rotate-2 transition-transform duration-500 backdrop-blur-md">
            <User size={32} className="text-purple-400 mb-4" />
            <span className="text-[10px] font-mono uppercase text-gray-500 tracking-widest block font-bold mb-2">Our Founder</span>
            <p className="text-sm font-light text-white">"I just wanted to make people smile every time they walk through their front door."</p>
         </div>

         <div className="absolute top-80 right-5 md:right-20 w-72 h-64 bg-indigo-950/20 border border-indigo-500/20 rounded-[2rem] p-8 rotate-3 hover:translate-y-4 transition-all duration-700 backdrop-blur-md text-right">
             <Compass size={24} className="text-indigo-400 ml-auto mb-4" />
             <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest block font-bold mb-2">Our Journey</span>
             <p className="text-sm font-sans text-gray-300">We searched the whole world to find the absolute purest, highest quality materials for you.</p>
         </div>

         <div className="absolute bottom-[40%] left-5 md:left-20 w-80 h-72 bg-gradient-to-tr from-pink-950/30 to-rose-950/10 border border-pink-500/20 rounded-[3rem] p-8 backdrop-blur-md">
             <div className="h-full flex flex-col justify-end">
               <h4 className="text-3xl text-pink-300 font-extralight mb-2">1,000+</h4>
               <p className="text-sm font-mono text-gray-400 uppercase tracking-wider">Happy Families completely protected by our systems.</p>
             </div>
         </div>

         <div className="absolute bottom-[20%] right-10 md:right-32 w-64 h-96 bg-white/[0.02] border border-white/10 rounded-full p-10 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-700 backdrop-blur-md">
             <Moon size={48} className="text-purple-400 mb-6 font-extralight" strokeWidth={1} />
             <h4 className="text-2xl font-light text-white mb-2">Safe Nights</h4>
             <p className="text-xs text-gray-400 font-sans">Knowing your family is 100% secure.</p>
         </div>
      </section>

      {/* ======================================================== */}
      {/* 4. MEGA FOOTER-CTA (EVERYTHING FILLED, VERY BIG)           */}
      {/* ======================================================== */}
      <section className="bg-[#050505] pt-32 pb-40 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.15)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
          
          <div className="space-y-6 max-w-4xl">
            <span className="px-6 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs font-mono uppercase tracking-[0.3em] font-bold inline-block">
              Welcome To The Family
            </span>
            <h2 className="text-5xl md:text-8xl font-extralight text-white tracking-tighter leading-none">
              Come Say Hello.
            </h2>
            <p className="text-lg md:text-2xl text-gray-400 font-light max-w-3xl mx-auto font-sans leading-relaxed">
              We are so excited to meet you. We promise to make your life incredibly easy, completely safe, and wonderfully comfortable forever.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl pt-8">
            <button 
              onClick={() => onNavigate('contact')}
              className="w-full bg-white text-black py-6 rounded-3xl text-sm uppercase tracking-widest font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(255,255,255,0.15)]"
            >
              <span>Meet Us Today</span>
              <ArrowRight size={18} />
            </button>
            <button 
               onClick={() => onNavigate('solutions')}
               className="w-full bg-transparent border border-white/20 text-white py-6 rounded-3xl text-sm uppercase tracking-widest font-mono hover:bg-white/5 transition-all duration-300"
            >
              Read More Stories
            </button>
          </div>

          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-4 mt-20">
             <div className="h-40 bg-pink-900/20 rounded-[2rem] border border-pink-500/10 hover:bg-pink-900/40 transition-colors" />
             <div className="h-40 md:col-span-2 bg-purple-900/20 rounded-[2rem] border border-purple-500/10 hover:bg-purple-900/40 transition-colors flex items-center justify-center">
                <span className="text-white/20 font-bold tracking-widest uppercase text-xl">Love</span>
             </div>
             <div className="h-40 bg-indigo-900/20 rounded-[2rem] border border-indigo-500/10 hover:bg-indigo-900/40 transition-colors" />
          </div>

        </div>
      </section>

    </div>
  );
}

