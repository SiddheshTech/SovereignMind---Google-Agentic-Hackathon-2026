import { useEffect, useState, RefObject } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Activity } from 'lucide-react';

interface ResilienceWorkflowLineProps {
  containerRef: RefObject<HTMLDivElement | null>;
  stages?: WorkflowStage[];
}

interface WorkflowStage {
  id: string;
  label: string;
  code: string;
  desc: string;
}

const DEFAULT_STAGES: WorkflowStage[] = [
  { id: 'platform', label: 'GLOBAL INTEL', code: 'STG-01', desc: 'Active Network Clusters' },
  { id: 'solutions', label: 'THREAT RADAR', code: 'STG-02', desc: 'Horizon Event Monitoring' },
  { id: 'simulation', label: '4D SIMULATE', code: 'STG-03', desc: 'Predictive Pathing Pipeline' },
  { id: 'bento', label: 'BENTO DEFENSE', code: 'STG-04', desc: 'Modular Safe-guards' },
  { id: 'calculator', label: 'RESOURCE PLAN', code: 'STG-05', desc: 'Resilience Allocation' },
  { id: 'pricing', label: 'SECURE ENCLAVE', code: 'STG-06', desc: 'Deployment Subscriptions' },
  { id: 'contact', label: 'BRIEF INITIATION', code: 'STG-07', desc: 'Sovereign Dispatch Protocol' },
];

export function ResilienceWorkflowLine({ containerRef, stages = DEFAULT_STAGES }: ResilienceWorkflowLineProps) {
  const [offsets, setOffsets] = useState<number[]>([]);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [percent, setPercent] = useState(0);

  // Measure section scroll offsets relative to container root
  useEffect(() => {
    const calculateOffsets = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newOffsets = stages.map((stage) => {
        const el = document.getElementById(stage.id);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        // Calculate the center height or top height offset relative to container
        return rect.top - containerRect.top + 60; // offset slightly downward to start line beautiful
      });

      setOffsets(newOffsets);
    };

    // Calculate initial
    calculateOffsets();

    // Adding delayed calculation for dynamic assets loading settlement
    const timer = setTimeout(calculateOffsets, 800);

    window.addEventListener('resize', calculateOffsets);
    window.addEventListener('scroll', calculateOffsets);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateOffsets);
      window.removeEventListener('scroll', calculateOffsets);
    };
  }, [containerRef, stages]);

  // Framer Motion useScroll hook on the workflow container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // Smooth out the scroll animation for premium liquid feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 24,
    restDelta: 0.001,
  });

  // Track active stage based on scroll scrollYProgress
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latestValue) => {
      // Dynamic telemetry percentage
      setPercent(Math.round(latestValue * 100));

      // Divide progress into stages and find corresponding index
      const index = Math.min(
        Math.floor(latestValue * stages.length),
        stages.length - 1
      );
      if (index >= 0 && index < stages.length && index !== activeStageIndex) {
        setActiveStageIndex(index);
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, activeStageIndex, stages.length]);

  // Floating progress coordinate mapping covering the distance from the first stage (60px offset) to the last
  const floatingY = useTransform(smoothProgress, (val: number) => {
    if (offsets.length < stages.length || offsets.some(v => v === 0)) {
      return 60;
    }
    const startY = offsets[0];
    const endY = offsets[offsets.length - 1];
    const totalHeight = endY - startY + 120;
    return 60 + val * (totalHeight - 120);
  });

  if (offsets.length < stages.length || offsets.some(val => val === 0)) {
    return null; // Don't render until coordinates are accurately measured
  }

  const startY = offsets[0];
  const endY = offsets[offsets.length - 1];
  const totalHeight = endY - startY + 120; // safe breathing space

  // Create customized cybernetic trace SVG path that detours around each node
  let svgPathD = `M 16,${startY}`;
  for (let i = 1; i < offsets.length; i++) {
    const prevY = offsets[i - 1];
    const currY = offsets[i];
    const midY = (prevY + currY) / 2;

    // Draw cybernetic offset bends in the middle of each connecting section
    svgPathD += ` L 16,${midY - 40} L 26,${midY - 20} L 26,${midY + 20} L 16,${midY + 40} L 16,${currY}`;
  }

  return (
    <div
      id="resilience-workflow-timeline-rail"
      className="absolute top-0 bottom-0 left-6 md:left-12 lg:left-16 w-48 pointer-events-none hidden xl:flex flex-col z-30"
      style={{ height: `${totalHeight}px`, top: `${startY - 60}px` }}
    >
      {/* Background Track Panel */}
      <div className="absolute inset-y-0 left-[15px] w-[2px] bg-white/[0.04]" />

      {/* Main SVG Pipeline */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox={`0 0 120 ${totalHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="neon-glow-laser" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#f472b6" stopOpacity="1" />
            <stop offset="70%" stopColor="#a5f3fc" stopOpacity="1" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Inert Cybernetic Backdrop Tube */}
        <path
          d={svgPathD}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Active Laser drawing line bound to scroll progress */}
        <motion.path
          d={svgPathD}
          stroke="url(#neon-glow-laser)"
          strokeWidth="2"
          fill="none"
          style={{ pathLength: smoothProgress }}
          strokeLinecap="round"
        />
      </svg>

      {/* Floating Laser Progress Cursor Indicator */}
      <motion.div
        className="absolute left-[16px] z-40 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center"
        style={{ y: floatingY }}
        id="workflow-laser-cursor-pill"
      >
        {/* Ring target scanner */}
        <div className="relative flex items-center justify-center w-6 h-6">
          <div className="absolute w-3.5 h-3.5 bg-pink-400/20 rounded-full border border-pink-500/50 shadow-[0_0_10px_rgba(45,212,191,0.4)] animate-ping" />
          <div className="absolute w-2 h-2 bg-pink-400 rounded-full border border-white/60 shadow-[0_0_6px_#f472b6]" />
        </div>

        {/* Floating live HUD tracking tag */}
        <div 
          className="ml-3 flex items-center gap-1.5 bg-[#030303]/95 border border-pink-500/30 px-2 py-0.5 rounded-md font-mono text-[8px] text-pink-400 shadow-[0_0_10px_rgba(45,212,191,0.15)] backdrop-blur-sm whitespace-nowrap"
        >
          <Activity size={9} className="text-pink-400 animate-pulse shrink-0" />
          <span className="font-semibold tracking-wider">{percent}%</span>
          <span className="text-pink-600">/</span>
          <span className="text-[7.5px] uppercase tracking-widest text-pink-300 opacity-80">STRETCH</span>
        </div>
      </motion.div>

      {/* Section Indicator Nodes & Mini HUD panels placed precisely at vertical offsets */}
      {stages.map((stage, i) => {
        const nodeY = offsets[i] - startY + 60;
        const isPassed = activeStageIndex >= i;
        const isActive = activeStageIndex === i;

        return (
          <div
            key={stage.id}
            id={`hud-stage-node-${stage.id}`}
            className="absolute left-0 flex items-center transition-all duration-300"
            style={{ top: `${nodeY}px`, transform: 'translateY(-50%)' }}
          >
            {/* Pulsing Outer Neon Circle */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-black border border-white/10">
              {/* Core light indicator */}
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  isActive
                    ? 'bg-pink-400 shadow-[0_0_12px_#f472b6]'
                    : isPassed
                    ? 'bg-pink-900 border border-pink-500/30'
                    : 'bg-white/10'
                }`}
              />

              {/* Dynamic Aura Ring for Active module */}
              {isActive && (
                <motion.div
                  className="absolute -inset-1.5 rounded-full border border-pink-400/30"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                />
              )}
            </div>

            {/* Tiny HUD textual overlay next to connection node */}
            <div
              className={`ml-3.5 flex flex-col font-mono text-[9px] transition-all duration-300 ${
                isActive ? 'text-pink-400 opacity-100' : isPassed ? 'text-white/60' : 'text-white/20'
              }`}
            >
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-semibold tracking-wider text-[8px] opacity-70">
                  {stage.code}
                </span>
                <span className="font-sans font-medium uppercase tracking-widest text-[10px]">
                  {stage.label}
                </span>
              </div>
              <span className="text-[8px] opacity-60 leading-normal hidden xl:block">
                {stage.desc}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
