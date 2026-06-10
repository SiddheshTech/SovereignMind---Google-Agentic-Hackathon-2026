import { useState, useMemo } from 'react';
import { Sliders, HelpCircle, HardHat, TrendingUp, AlertTriangle } from 'lucide-react';

export function ForesightCalculator() {
  const [cargoReserve, setCargoReserve] = useState<number>(60);
  const [infraRedundancy, setInfraRedundancy] = useState<number>(40);
  const [mediaIntegrity, setMediaIntegrity] = useState<number>(70);

  const evaluation = useMemo(() => {
    // Score computations
    const score = Math.round((cargoReserve * 0.35) + (infraRedundancy * 0.35) + (mediaIntegrity * 0.3));

    // Advice categories
    let evaluationGroup = "";
    let systemAdvice = "";
    let systemWarning = "";
    let indicatorColor = "bg-pink-400";
    let textColor = "text-pink-400";
    let borderColor = "border-pink-500/20";
    let bgBadge = "bg-pink-950/20";

    if (score < 45) {
      evaluationGroup = "Critical Structural Vulnerability State";
      systemAdvice = "System lacks basic baseline resilience. A single localized disruption (shipment delay or coordinated polarizing wave) carries a 92% containment failure probability. Urgently dispatch secondary grid duplication and establish physical state reserves.";
      systemWarning = "Systemic Failure Hazard Elevated";
      indicatorColor = "bg-rose-500";
      textColor = "text-rose-400";
      borderColor = "border-rose-500/30";
      bgBadge = "bg-rose-950/30";
    } else if (score < 75) {
      evaluationGroup = "Moderate Coexistence Transition Buffer";
      systemAdvice = "System holds stable defensive margins under normal cyclic stresses. However, continuous cascading vectors (e.g. combined energy grid surges matched with informational disruption) will deplete buffers within 18 days. Consider increasing redundant utility grid replication.";
      systemWarning = "Moderate Transition Pressure Detected";
      indicatorColor = "bg-amber-500";
      textColor = "text-amber-400";
      borderColor = "border-amber-500/30";
      bgBadge = "bg-amber-950/30";
    } else {
      evaluationGroup = "Optimized Resilient Sovereign Status";
      systemAdvice = "Outstanding systemic hardening. Robust physical cargo backup buffers combined with dense utility redundancy allow the sovereign framework to absorb major Black Swan interference patterns continuously. Localized trust scores remain anchored.";
      systemWarning = "Optimal System Resilience Confirmed";
      indicatorColor = "bg-pink-400 animate-pulse";
      textColor = "text-pink-400";
      borderColor = "border-pink-500/20";
      bgBadge = "bg-pink-950/20";
    }

    return {
      score,
      evaluationGroup,
      systemAdvice,
      systemWarning,
      indicatorColor,
      textColor,
      borderColor,
      bgBadge,
    };
  }, [cargoReserve, infraRedundancy, mediaIntegrity]);

  return (
    <div className="w-full liquid-glass border border-white/20 rounded-3xl p-6 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Sliders Input Panel Column */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-mono text-gray-400 tracking-wider uppercase block">Resilience Stress Modeler</span>
            <h4 className="text-2xl font-normal text-white mt-1">Sovereign Balance Simulator</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Strategic planners can optimize state investment allocations by varying safety reserves, utility routing duplication, and media cryptographic verification. Observe the impact index updates in real time.
            </p>
          </div>

          <hr className="border-white/10" />

          {/* Inputs */}
          <div className="space-y-6">
            {/* Input Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-1.5 font-sans">
                  <Sliders size={12} className="text-gray-400" /> Logistic Cargo Stockpiles
                </span>
                <span className="font-mono text-white text-sm">{cargoReserve}% Buffer</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={cargoReserve}
                onChange={(e) => setCargoReserve(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-ew-resize accent-white"
              />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Emergency grain storage, fluid resource pipelines, and alternative land corridor pre-commitments.
              </p>
            </div>

            {/* Input Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-1.5 font-sans">
                  <HardHat size={12} className="text-gray-400" /> Critical Utility Redundancy
                </span>
                <span className="font-mono text-white text-sm">{infraRedundancy}% Copy</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={infraRedundancy}
                onChange={(e) => setInfraRedundancy(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-ew-resize accent-white"
              />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Overlapping regional energy grids, decentralized water extraction loops, and auxiliary battery node networks.
              </p>
            </div>

            {/* Input Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-1.5 font-sans">
                  <TrendingUp size={12} className="text-gray-400" /> Information Trust Signatures
                </span>
                <span className="font-mono text-white text-sm">{mediaIntegrity}% Depth</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={mediaIntegrity}
                onChange={(e) => setMediaIntegrity(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-ew-resize accent-white"
              />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Adoption of decentralized cryptographic verification tags across sub-national digital information channels.
              </p>
            </div>
          </div>
        </div>

        {/* Calculation Advice Column */}
        <div className="lg:col-span-6 bg-black/40 border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase">Durability Score Matrix</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${evaluation.indicatorColor}`} />
              <span className="text-xs font-mono text-white font-medium">REALTIME RUN</span>
            </div>
          </div>

          <div className="my-auto py-4 flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center border-2 border-white/10 rounded-full bg-white/[0.01]">
              <span className="text-4xl font-light text-white tracking-tight">{evaluation.score}</span>
              <span className="absolute bottom-1.5 text-[8px] font-mono text-gray-500 uppercase tracking-wider">SM-RES</span>
            </div>

            <div className="space-y-1">
              <span className={`text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded ${evaluation.bgBadge} ${evaluation.textColor} border ${evaluation.borderColor} inline-block`}>
                {evaluation.systemWarning}
              </span>
              <h4 className="text-lg font-medium text-white tracking-tight leading-snug mt-1.5">
                {evaluation.evaluationGroup}
              </h4>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Detailed analysis summary */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-amber-400" /> Strategic Policy Directives
            </h5>
            <p className="text-xs text-gray-300 leading-relaxed bg-white/[0.02] border border-white/5 p-4 rounded-xl font-sans font-light">
              {evaluation.systemAdvice}
            </p>
          </div>

          {/* Quick Help Tip */}
          <div className="flex gap-2 text-[10px] text-gray-400 leading-relaxed pt-2 border-t border-white/5">
            <HelpCircle size={14} className="text-gray-500 shrink-0 mt-0.5" />
            <span>Optimal balance relies heavily on physical cargo storage buffers (grain, liquid fuel) which offset cognitive disruption timelines by assuring basic sub-national stability.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
