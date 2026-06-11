import React, { useState } from 'react';
import { Globe, Clock, Cpu, LayoutDashboard, Plus, FileSpreadsheet, Sparkles, Navigation, Layers, CheckCircle2, ChevronRight, Activity, Calendar, Shield, Users, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PALETTE = {
  purple: '#7F22FE',     
  orange: '#FF6900',     
  sky: '#00B8DB',        
  deepTeal: '#073F4D',    
  slateBg: '#020617',    
};

interface LaunchSimulationCenterProps {
  onNavigate: (tab: 'scenario-builder' | 'simulations' | 'recovery-explorer') => void;
}

export function LaunchSimulationCenter({ onNavigate }: LaunchSimulationCenterProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [simConfig, setSimConfig] = useState({
    type: 'National',
    horizon: '5 Years',
    complexity: 'Advanced',
    nation: 'United States',
    crises: [] as string[],
    variables: 'Standard Mode'
  });

  const SIM_TYPES = [
    { id: 'National', icon: Shield, desc: 'Sovereign boundaries' },
    { id: 'Regional', icon: Layers, desc: 'Multi-state grids' },
    { id: 'City', icon: Navigation, desc: 'Urban density nodes' },
    { id: 'Global', icon: Globe, desc: 'Interconnected systems' }
  ];

  const HORIZONS = [
    '30 Days', '6 Months', '1 Year', '5 Years', '10 Years', '25 Years'
  ];

  const COMPLEXITIES = [
    { id: 'Basic', label: 'Basic', desc: 'Core macro-indicators only' },
    { id: 'Advanced', label: 'Advanced', desc: 'Socio-economic multi-agent mapping' },
    { id: 'Expert', label: 'Expert', desc: 'Granular infrastructural dependencies' },
    { id: 'Civilization Scale', label: 'Civilization', desc: 'Total systemic neural sync' }
  ];

  if (!showWizard) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1 lg:col-span-4 flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="text-[#00B8DB]" size={20} />
              Simulation Initialization
            </h2>
          </div>
          
          <button 
            onClick={() => setShowWizard(true)}
            className="group relative h-40 rounded-3xl border bg-slate-950/40 p-6 flex flex-col justify-between hover:bg-slate-900/60 overflow-hidden cursor-pointer transition-all duration-300"
            style={{ borderColor: `${PALETTE.deepTeal}40` }}
          >
            <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-40 transition-opacity">
              <Plus size={100} style={{ color: PALETTE.purple }} />
            </div>
            <div className="text-[#7F22FE] p-2 rounded-xl bg-[#7F22FE]/10 w-max border border-[#7F22FE]/20">
              <Plus size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-base">Create New Simulation</h3>
              <p className="text-xs text-gray-400 mt-1">Configure fresh catastrophic environment</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('simulations')}
            className="group relative h-40 rounded-3xl border bg-slate-950/40 p-6 flex flex-col justify-between hover:bg-slate-900/60 overflow-hidden cursor-pointer transition-all duration-300"
            style={{ borderColor: `${PALETTE.deepTeal}40` }}
          >
            <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-40 transition-opacity">
              <Folder size={100} style={{ color: PALETTE.sky }} />
            </div>
            <div className="text-[#00B8DB] p-2 rounded-xl bg-[#00B8DB]/10 w-max border border-[#00B8DB]/20">
              <Activity size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-base">Load Existing</h3>
              <p className="text-xs text-gray-400 mt-1">Access saved structural profiles</p>
            </div>
          </button>

          <button className="group relative h-40 rounded-3xl border bg-slate-950/40 p-6 flex flex-col justify-between hover:bg-slate-900/60 overflow-hidden cursor-pointer transition-all duration-300"
            style={{ borderColor: `${PALETTE.deepTeal}40` }}>
            <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-40 transition-opacity">
              <Cpu size={100} style={{ color: '#10B981' }} />
            </div>
            <div className="text-[#10B981] p-2 rounded-xl bg-[#10B981]/10 w-max border border-[#10B981]/20">
              <Cpu size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-base">Import Digital Twin</h3>
              <p className="text-xs text-gray-400 mt-1">Sync live national architecture</p>
            </div>
          </button>

          <button className="group relative h-40 rounded-3xl border bg-slate-950/40 p-6 flex flex-col justify-between hover:bg-slate-900/60 overflow-hidden cursor-pointer transition-all duration-300"
            style={{ borderColor: `${PALETTE.deepTeal}40` }}>
            <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-40 transition-opacity">
              <Sparkles size={100} style={{ color: PALETTE.orange }} />
            </div>
            <div className="text-[#FF6900] p-2 rounded-xl bg-[#FF6900]/10 w-max border border-[#FF6900]/20">
              <Sparkles size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-base">AI Generated Scenario</h3>
              <p className="text-xs text-gray-400 mt-1">Randomized synthetic threat models</p>
            </div>
          </button>
        </div>

        <div className="bg-[#030712] border rounded-3xl p-8 mt-8 space-y-6" style={{ borderColor: `${PALETTE.deepTeal}50` }}>
          <h3 className="text-lg font-bold text-white pb-3 border-b border-white/5 uppercase font-mono tracking-wider text-sm flex items-center gap-2">
             Configuration Presets
          </h3>
          
          <div className="space-y-6">
             <div className="space-y-2">
               <label className="text-[10px] text-gray-500 uppercase font-mono tracking-widest font-bold">1. Target Scope</label>
               <div className="flex flex-wrap gap-2">
                 {SIM_TYPES.map(t => (
                   <button 
                     key={t.id} 
                     onClick={() => setSimConfig({...simConfig, type: t.id})}
                     className={`flex flex-col items-start p-3 rounded-xl border transition-colors ${simConfig.type === t.id ? 'bg-[#7F22FE]/20 border-[#7F22FE]/40' : 'bg-slate-950/50 border-white/5 hover:border-white/10'}`}
                   >
                     <div className="flex items-center gap-1.5 font-bold text-sm text-gray-200">
                       <t.icon size={14} className={simConfig.type === t.id ? 'text-[#7F22FE]' : 'text-gray-500'} /> {t.id}
                     </div>
                     <span className="text-[10px] text-gray-500 mt-1">{t.desc}</span>
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] text-gray-500 uppercase font-mono tracking-widest font-bold">2. Prediction Horizon</label>
               <div className="flex flex-wrap gap-2">
                 {HORIZONS.map(h => (
                   <button 
                     key={h}
                     onClick={() => setSimConfig({...simConfig, horizon: h})}
                     className={`px-4 py-2 rounded-full text-xs font-mono font-bold border transition-colors ${simConfig.horizon === h ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-950/50 text-gray-400 border-white/5 hover:text-white'}`}
                   >
                     {h}
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] text-gray-500 uppercase font-mono tracking-widest font-bold">3. Engine Complexity</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                 {COMPLEXITIES.map(c => (
                   <button 
                     key={c.id}
                     onClick={() => setSimConfig({...simConfig, complexity: c.id})}
                     className={`p-3 rounded-xl border text-left transition-colors ${simConfig.complexity === c.id ? 'bg-[#00B8DB]/10 border-[#00B8DB]/30' : 'bg-slate-950/50 border-white/5 hover:border-white/10'}`}
                   >
                     <div className={`font-bold text-sm ${simConfig.complexity === c.id ? 'text-[#00B8DB]' : 'text-gray-300'}`}>{c.label}</div>
                     <div className="text-[10px] text-gray-500 mt-1">{c.desc}</div>
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
       <div className="flex flex-col items-center mb-10 text-center">
         <span className="text-[10px] font-mono tracking-widest uppercase text-[#7F22FE] font-bold mb-2 block">Environment Initialization Protocol</span>
         <h2 className="text-3xl font-light text-white tracking-tight">Simulation Setup Wizard</h2>
       </div>

       {/* Wizard Progress */}
       <div className="flex justify-between items-center mb-8 relative">
         <div className="absolute left-0 top-1/2 w-full h-[1px] bg-white/10 -z-10" />
         {[1, 2, 3, 4, 5].map(step => (
           <div key={step} className="flex flex-col items-center gap-2">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-colors ${wizardStep === step ? 'bg-[#7F22FE] text-white shadow-[0_0_15px_rgba(127,34,254,0.4)]' : wizardStep > step ? 'bg-emerald-500 text-white' : 'bg-slate-900 border border-white/10 text-gray-500'}`}>
               {wizardStep > step ? <CheckCircle2 size={16} /> : step}
             </div>
             <span className={`text-[9px] font-mono uppercase tracking-wider ${wizardStep >= step ? 'text-gray-300' : 'text-gray-600'}`}>
               {step === 1 ? 'Profile' : step === 2 ? 'Horizon' : step === 3 ? 'Triggers' : step === 4 ? 'Variables' : 'Launch'}
             </span>
           </div>
         ))}
       </div>

       {/* Wizard Steps */}
       <div className="bg-[#030712] border rounded-3xl p-8 min-h-[300px] flex flex-col justify-between" style={{ borderColor: `${PALETTE.deepTeal}40` }}>
          
          <AnimatePresence mode="wait">
            {wizardStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Select National Blueprint</h3>
                <p className="text-xs text-gray-400 mb-6">Import structural demographics, existing infrastructure webs, and governance matrices.</p>
                <div className="grid grid-cols-2 gap-3">
                  {['United States', 'Singapore', 'European Union', 'Japan', 'India', 'Custom Sovereign Model'].map(n => (
                    <button key={n} onClick={() => setSimConfig({...simConfig, nation: n})} className={`p-4 rounded-xl border text-left font-mono text-sm transition-colors ${simConfig.nation === n ? 'bg-purple-900/20 border-purple-500/50 text-white font-bold' : 'bg-slate-950/50 border-white/5 text-gray-400 hover:text-white'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {wizardStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Set Temporal Horizon</h3>
                <p className="text-xs text-gray-400 mb-6">Determine the prediction limits of the artificial environment.</p>
                <div className="grid grid-cols-3 gap-3">
                  {HORIZONS.map(h => (
                    <button key={h} onClick={() => setSimConfig({...simConfig, horizon: h})} className={`p-4 rounded-xl border text-center font-mono text-sm transition-colors flex flex-col items-center justify-center gap-2 ${simConfig.horizon === h ? 'bg-emerald-900/20 border-emerald-500/50 text-white font-bold' : 'bg-slate-950/50 border-white/5 text-gray-400 hover:text-white'}`}>
                      <Calendar size={18} className={simConfig.horizon === h ? 'text-emerald-400' : 'text-gray-600'} />
                      <span>{h}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {wizardStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Inject Crisis Modifiers</h3>
                <p className="text-xs text-gray-400 mb-6">Select primary stress events. (These will be passed to Scenario Builder)</p>
                <div className="space-y-2">
                  {['Cyberattack (Grid Down)', 'Pandemic (Class 5)', 'Economic Shock (Recession)', 'Mass Migration (Climate)', 'Civil Unrest (High)'].map(c => {
                    const isSelected = simConfig.crises.includes(c);
                    return (
                      <button 
                        key={c}
                        onClick={() => {
                          if (isSelected) setSimConfig({...simConfig, crises: simConfig.crises.filter(x => x !== c)});
                          else setSimConfig({...simConfig, crises: [...simConfig.crises, c]});
                        }}
                        className={`w-full p-4 rounded-xl border text-left font-mono text-sm transition-colors flex items-center justify-between ${isSelected ? 'bg-[#FF6900]/10 border-[#FF6900]/40 text-white font-bold' : 'bg-slate-950/50 border-white/5 text-gray-400 hover:bg-slate-900'}`}
                      >
                        <span>{c}</span>
                        <div className={`w-4 h-4 rounded-sm border ${isSelected ? 'bg-[#FF6900] border-[#FF6900]' : 'border-gray-600'}`} />
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {wizardStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Tune System Variables</h3>
                <p className="text-xs text-gray-400 mb-6">Adjust internal algorithmic parameters for the digital twin engine.</p>
                <div className="grid grid-cols-2 gap-4">
                   {['Standard Behavior', 'High Panic Volatility', 'Resilient Infrastructure', 'Fragile Supply Chains'].map(v => (
                      <div key={v} onClick={() => setSimConfig({...simConfig, variables: v})} className={`p-4 rounded-xl border cursor-pointer font-mono text-xs transition-colors ${simConfig.variables === v ? 'bg-[#00B8DB]/10 border-[#00B8DB]/40 text-white font-bold' : 'bg-slate-950/50 border-white/5 text-gray-400 hover:text-white'}`}>
                        {v}
                      </div>
                   ))}
                </div>
              </motion.div>
            )}

            {wizardStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-6">
                <Sparkles size={40} className="text-[#00B8DB] mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold text-white mb-2">Ready for Genesis</h3>
                <p className="text-sm text-gray-400 max-w-md border border-white/5 p-4 rounded-xl bg-slate-950/60 leading-relaxed font-mono">
                  Initializing <span className="text-white">{simConfig.type}</span> simulation for <span className="text-emerald-400">{simConfig.nation}</span> spanning <span className="text-white">{simConfig.horizon}</span>. Deep-learning engines active at <span className="text-purple-400">{simConfig.complexity}</span> level.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-10 pt-4 border-t border-white/10">
             <button 
               onClick={() => {
                 if(wizardStep > 1) setWizardStep(wizardStep - 1);
                 else setShowWizard(false);
               }}
               className="px-6 py-2.5 rounded-xl text-xs font-mono text-gray-400 hover:text-white transition-colors"
             >
               {wizardStep === 1 ? 'Cancel' : 'Back'}
             </button>

             <button 
               onClick={() => {
                 if (wizardStep < 5) setWizardStep(wizardStep + 1);
                 else onNavigate('scenario-builder');
               }}
               className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-mono font-bold text-white transition-all bg-[#7F22FE] hover:opacity-90 shadow-[0_0_20px_rgba(127,34,254,0.3)]"
             >
               {wizardStep === 5 ? 'Initiate Sandbox Sequence' : 'Next Step'} <ChevronRight size={14} />
             </button>
          </div>
       </div>
    </div>
  );
}
