import React from 'react';
import { ArrowLeft, Cpu, Activity, ChevronRight } from 'lucide-react';

const PALETTE = {
  purple: '#7F22FE',
  orange: '#FF6900',
  deepTeal: '#073F4D',
};

export function ScenarioMode({ onNavigate }: { onNavigate?: (id: string) => void }) {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-24 text-gray-200 font-sans">
      <button 
        onClick={() => onNavigate?.('dashboard')}
        className="text-xs font-mono font-bold text-gray-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} /> BACK TO COMMAND CENTER
      </button>

      <div className="bg-[#030712] border rounded-3xl p-8 relative overflow-hidden" style={{ borderColor: `${PALETTE.deepTeal}80` }}>
        <div className="absolute top-0 right-0 w-96 h-96 blur-[100px] rounded-full pointer-events-none opacity-20 bg-orange-500" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Scenario Mode</h2>
            <p className="text-sm text-gray-400">Run simulations against the theoretical civilization framework.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mt-8">
          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors cursor-pointer group" onClick={() => onNavigate?.('scenario-builder')}>
             <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">Launch Sandbox <ChevronRight size={16} className="text-gray-500 group-hover:text-white" /></h3>
             <p className="text-xs text-gray-400">Open the full Sandbox to configure custom variables for pandemic, conflict, or economic crashes.</p>
          </div>
          
          <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors cursor-pointer group" onClick={() => onNavigate?.('simulations')}>
             <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">Active Simulations <ChevronRight size={16} className="text-gray-500 group-hover:text-white" /></h3>
             <p className="text-xs text-gray-400">View real-time synthetic runs and analyze cascade damage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
