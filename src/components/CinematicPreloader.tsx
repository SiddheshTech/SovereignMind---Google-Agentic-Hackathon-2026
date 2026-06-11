import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, Database, Network, Globe } from 'lucide-react';

interface CinematicPreloaderProps {
  onComplete: () => void;
}

export function CinematicPreloader({ onComplete }: CinematicPreloaderProps) {
  const [percent, setPercent] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const bootSteps = [
    { text: 'ESTABLISHING SECURE CRYPTOGRAPHIC TUNNEL (CH-SWISS)', icon: ShieldCheck },
    { text: 'MOUNTING DETERMINISTIC PROJECTION MATRIX', icon: Cpu },
    { text: 'SYNCING ALPS FRESHWATER BASIN WATER SIGS', icon: Database },
    { text: 'CONNECTING INTEGRATED LOGISTICS AND CORRIDOR LATTICE', icon: Network },
    { text: 'SOVEREIGNMIND SYSTEM CHANNELS: 100% SECURE', icon: Globe },
  ];

  useEffect(() => {
    // Elegant fast tick-up simulation that feels highly realistic and responsive
    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setPercent(progress);
      
      // Gradually step through message diagnostics
      const stepIndex = Math.min(
        bootSteps.length - 1,
        Math.floor((progress / 100) * bootSteps.length)
      );
      setCurrentStep(stepIndex);

      if (elapsed >= duration) {
        clearInterval(timer);
        // Add a micro-delay of complete satisfaction before fading
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: '-100vh', 
        opacity: 0,
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 bg-[#000000] z-[9999] flex flex-col justify-between p-8 md:p-12 overflow-hidden select-none select-none select-none text-white font-mono"
    >
      {/* Top Margin Decor */}
      <div className="flex justify-between items-center text-[10px] text-gray-500 tracking-widest leading-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
          <span>SYS STATE // INITIATING SEALS</span>
        </div>
        <span>LOCATION: ALPS SECURE REGISTRY</span>
        <span>PORT: 3000 SECURE</span>
      </div>

      {/* Main Core Central Graphics and Logging */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-xl mx-auto w-full space-y-10 my-8">
        {/* Advanced Hexagon Spinning Logo */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer circle */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
            className="absolute inset-0 border border-pink-500/20 rounded-full border-dashed"
          />
          {/* Middle Hexagon or Ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="absolute inset-2 border-2 border-pink-400/40 rounded-full border-t-transparent border-b-transparent"
          />
          {/* Core Symbol */}
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-16 h-16 bg-gradient-to-br from-pink-950/40 to-purple-950/40 border-2 border-pink-400/80 rounded-2xl flex items-center justify-center text-pink-400 shadow-[0_0_25px_rgba(45,212,191,0.2)]"
          >
            {(() => {
              const IconComp = bootSteps[currentStep].icon;
              return <IconComp size={28} className="animate-pulse" />;
            })()}
          </motion.div>
        </div>

        {/* Dynamic Percentage text inside luxury display size */}
        <div className="text-center space-y-2 w-full">
          <div className="text-5xl md:text-6xl font-light font-sans tracking-tighter text-white flex items-center justify-center gap-1">
            <span className="text-pink-400 font-normal">{percent}</span>
            <span className="text-lg font-mono text-gray-500 font-extralight">%</span>
          </div>
          
          <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 to-purple-400 shadow-[0_0_12px_#f472b6]"
              style={{ width: `${percent}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Scrolling Logging Simulator */}
        <div className="w-full bg-[#050505] border border-white/5 p-4 rounded-xl space-y-2 h-32 overflow-hidden flex flex-col justify-end text-left text-[11px]">
          <div className="text-gray-600 block border-b border-white/5 pb-1 mb-1 font-bold select-none text-[9px] uppercase tracking-wider">
            BOOT REGISTRY TELEMETRY LOGS
          </div>
          
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex items-start gap-2 text-pink-300 font-mono"
            >
              <span className="text-pink-500 font-bold shrink-0">&gt;&gt;</span>
              <p className="leading-relaxed whitespace-pre-wrap">{bootSteps[currentStep].text}</p>
            </motion.div>
          </AnimatePresence>

          {currentStep > 0 && (
            <div className="text-gray-500 flex items-start gap-2 opacity-50 select-none">
              <span>&gt;&gt;</span>
              <span>{bootSteps[currentStep - 1].text}</span>
            </div>
          )}
          {currentStep > 1 && (
            <div className="text-gray-600 flex items-start gap-2 opacity-25 select-none hidden sm:flex">
              <span>&gt;&gt;</span>
              <span>{bootSteps[currentStep - 2].text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-[9px] text-gray-550 gap-3 border-t border-white/5 pt-4">
        <span>SECURITY PROTOCOL: LAYER LATTICE ENCRYPTION ENFORCED</span>
        <span className="text-pink-500 font-semibold uppercase tracking-widest animate-pulse">
          SovereignMind AG © 2026 Virtual Network Standard
        </span>
        <span className="hidden sm:inline">SWISS HQ // CONFIDENTIAL FEED</span>
      </div>
    </motion.div>
  );
}
