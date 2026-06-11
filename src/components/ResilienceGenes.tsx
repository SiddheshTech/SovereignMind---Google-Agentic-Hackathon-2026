import React, { useState } from 'react';
import { ShieldCheck, Activity, Brain, Server, Power, Thermometer } from 'lucide-react';

const PALETTE = {
  purple: '#7F22FE',     // Primary High-Tech accent
  orange: '#FF6900',     // Warning / Critical Action accent
  sky: '#00B8DB',        // Strategic indicators, safe state labels
  deepTeal: '#073F4D',   // Deep framing lines, background panels
};

export function ResilienceGenes() {
  const [selectedSystem, setSelectedSystem] = useState('Grid Stability');

  const systems = [
    { title: 'Grid Stability', icon: Power, status: 'Optimal', score: '98.5%' },
    { title: 'Water Tables', icon: WavesLine, status: 'Warning', score: '72.1%' },
    { title: 'Data Comm', icon: Server, status: 'Optimal', score: '99.9%' },
    { title: 'Biosafety', icon: Thermometer, status: 'Critical', score: '54.2%' },
    { title: 'Cognitive Trust', icon: Brain, status: 'Warning', score: '61.7%' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <ShieldCheck size={16} />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">Resilience Genes</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Systemic Endurance Scans</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Real-time biometric and systemic baseline scanning. Identifies structural breaking points
            before cascade failures occur within sovereign parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          {systems.map((sys) => {
            const isSelected = selectedSystem === sys.title;
            const Icon = sys.icon;
            return (
              <div 
                key={sys.title}
                onClick={() => setSelectedSystem(sys.title)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'bg-slate-900 border-white/20' : 'bg-[#030712] hover:bg-slate-900/50'}`}
                style={{ borderColor: isSelected ? undefined : `${PALETTE.deepTeal}30` }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 rounded-lg">
                      <Icon size={16} className={sys.status === 'Optimal' ? 'text-emerald-400' : sys.status === 'Warning' ? 'text-[#FF6900]' : 'text-red-500'} />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{sys.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono">{sys.score}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-8 bg-[#030712] border rounded-3xl p-8 relative overflow-hidden" style={{ borderColor: `${PALETTE.deepTeal}30` }}>
           <h3 className="text-xl font-bold text-white mb-6">Gene Sequence Analysis: {selectedSystem}</h3>
           
           <div className="flex items-center justify-center h-[300px] border border-slate-800 rounded-xl bg-slate-950/50">
             <div className="text-center text-gray-500 font-mono text-sm space-y-4">
                <Activity size={32} className="mx-auto text-emerald-500 opacity-50" />
                <p>Streaming real-time resilience metrics...</p>
                <div className="h-1 w-48 bg-slate-800 mx-auto rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-1/3 animate-pulse rounded-full" />
                </div>
             </div>
           </div>
           
           <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                 <h4 className="text-xs font-mono text-gray-500 mb-2 uppercase">Load Tolerance</h4>
                 <div className="text-lg font-bold text-white">41.8 Terajoules</div>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                 <h4 className="text-xs font-mono text-gray-500 mb-2 uppercase">Recovery Latency</h4>
                 <div className="text-lg font-bold text-emerald-400">0.05ms</div>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                 <h4 className="text-xs font-mono text-gray-500 mb-2 uppercase">Structural Decay</h4>
                 <div className="text-lg font-bold text-[#FF6900]">-1.2% / yr</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function WavesLine(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size||24} height={props.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12h4l3-9 5 18 3-9h5" />
    </svg>
  );
}
