import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, ShieldCheck, GitBranch, AlertTriangle, Play, Database,
  Search, GitCommit, Target, Zap, Activity, Clock, BarChart2, Users
} from 'lucide-react';

interface SovereigntyGenomeEngineProps {
  initialTab?: 'dna-explorer' | 'resilience-genes' | 'collapse-atlas' | string;
}

export function SovereigntyGenomeEngine({ initialTab = 'dna-explorer' }: SovereigntyGenomeEngineProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 pb-16 font-sans text-white">
      
      {/* Engine Header */}
      <div className="relative overflow-hidden rounded-3xl border p-6 md:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-[#030616] shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-[#818cf8]/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-pink-500/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#818cf8]/15 border border-[#818cf8]/30 text-xs font-mono font-semibold tracking-wider text-[#818cf8] uppercase">
                Module 02
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                <Database size={12} /> Institutional Genetics
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Sovereignty Genome Engine <Activity className="text-[#818cf8]" size={26} />
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
              Decode the structural DNA of nations. Analyze resilience genes, detect fragility signatures, map civilization comparisons, and benchmark against the Historical Collapse Atlas.
            </p>
          </div>
        </div>
      </div>

      {/* Local Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        <TabButton id="dna-explorer" active={activeTab === 'dna-explorer'} icon={Compass} label="Civilization DNA Explorer" onClick={() => setActiveTab('dna-explorer')} />
        <TabButton id="resilience-genes" active={activeTab === 'resilience-genes'} icon={ShieldCheck} label="Resilience Gene Analysis" onClick={() => setActiveTab('resilience-genes')} />
        <TabButton id="fragility-detection" active={activeTab === 'fragility-detection'} icon={AlertTriangle} label="Fragility Signatures" onClick={() => setActiveTab('fragility-detection')} />
        <TabButton id="recovery-patterns" active={activeTab === 'recovery-patterns'} icon={Activity} label="Recovery Pattern Library" onClick={() => setActiveTab('recovery-patterns')} />
        <TabButton id="comparisons" active={activeTab === 'comparisons'} icon={Target} label="Civilization Comparisons" onClick={() => setActiveTab('comparisons')} />
        <TabButton id="collapse-atlas" active={activeTab === 'collapse-atlas'} icon={GitBranch} label="Historical Collapse Atlas" onClick={() => setActiveTab('collapse-atlas')} />
        <TabButton id="benchmarking" active={activeTab === 'benchmarking'} icon={BarChart2} label="Genome Benchmarking" onClick={() => setActiveTab('benchmarking')} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -15 }}
           transition={{ duration: 0.2 }}
           className="min-h-[400px]"
        >
          {activeTab === 'dna-explorer' && <CivilizationDNAExplorer />}
          {activeTab === 'resilience-genes' && <ResilienceAnalysis />}
          {activeTab === 'fragility-detection' && <FragilityDetection />}
          {activeTab === 'collapse-atlas' && <HistoricalCollapseAtlas />}
          
          {/* Simple Placeholders for others showing unified layout */}
          {(activeTab === 'recovery-patterns' || activeTab === 'comparisons' || activeTab === 'benchmarking') && (
            <div className="bg-[#030712] border border-[#818cf8]/20 rounded-3xl p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
               <Activity className="text-[#818cf8]/50 mb-4" size={48} />
               <h3 className="text-xl font-bold uppercase tracking-widest font-mono text-white mb-2">{activeTab.replace('-', ' ')}</h3>
               <p className="text-gray-400 text-sm max-w-md">Module under synthesis processing. Genomic algorithms mapping historical analogues...</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, icon: Icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-[11px] font-mono tracking-wider transition-colors whitespace-nowrap border-b-2 ${
        active 
          ? 'bg-white/5 text-[#818cf8] border-[#818cf8]' 
          : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02] border-transparent'
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  );
}

function CivilizationDNAExplorer() {
  const [selectedGene, setSelectedGene] = useState<{ category: string, item: string } | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');

  const handleScan = () => {
    setScanStatus('scanning');
    setTimeout(() => setScanStatus('complete'), 2000);
    setTimeout(() => setScanStatus('idle'), 5000);
  };

  const GENE_CATEGORIES = [
    {
      title: 'Governance Genes',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500',
      border: 'border-purple-500/20',
      items: ['Leadership Continuity', 'Institutional Strength', 'Policy Stability', 'Bureaucratic Efficiency']
    },
    {
      title: 'Economic Genes',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500',
      border: 'border-indigo-500/20',
      items: ['Fiscal Resilience', 'Trade Diversity', 'Inflation Resistance', 'Labor Adaptability']
    },
    {
      title: 'Social Genes',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500',
      border: 'border-amber-500/20',
      items: ['Social Trust', 'Community Resilience', 'Education Quality', 'Cultural Cohesion']
    },
    {
      title: 'Infrastructure Genes',
      color: 'text-sky-400',
      bgColor: 'bg-sky-500',
      border: 'border-sky-500/20',
      items: ['Energy Security', 'Transport Reliability', 'Digital Connectivity', 'Healthcare Capacity']
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
      {selectedGene && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-700 shadow-2xl p-6 z-50 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-[10px] font-mono font-bold text-gray-500 uppercase">{selectedGene.category}</div>
              <h3 className="text-lg font-bold text-white">{selectedGene.item}</h3>
            </div>
            <button onClick={() => setSelectedGene(null)} className="text-gray-500 hover:text-white"><Activity size={18} className="rotate-45" /></button>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">This gene represents the civilization's inherent capacity to maintain structure and operational integrity within this domain during high-stress volatility events.</p>
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
               <div className="text-[10px] font-mono text-gray-500 mb-1">CURRENT EXPRESSION</div>
               <div className="text-2xl font-bold text-indigo-400">High</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
               <div className="text-[10px] font-mono text-gray-500 mb-2">VULNERABILITY VECTORS</div>
               <ul className="text-xs text-gray-300 space-y-2 list-disc pl-4">
                 <li>Rapid demographic shifts</li>
                 <li>Resource constraint cascades</li>
               </ul>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
               <div className="text-[10px] font-mono text-gray-500 mb-2">COMPARATIVE ANALOGUES</div>
               <div className="flex flex-col gap-2">
                 <div className="flex justify-between text-xs text-gray-300"><span>Singapore</span> <span className="text-indigo-400">92%</span></div>
                 <div className="flex justify-between text-xs text-gray-300"><span>Switzerland</span> <span className="text-indigo-400">88%</span></div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Genome Profile Section */}
      <div className="lg:col-span-8 border border-white/10 bg-[#030712] rounded-3xl p-6 md:p-8">
         <div className="mb-8">
           <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
             <Database className="text-[#818cf8]" size={20} /> Civilization Genome Profile
           </h3>
           <p className="text-sm text-gray-400 mt-1">Visual DNA structure sequencing baseline resilience indicators.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
           {GENE_CATEGORIES.map((cat, idx) => (
             <div key={idx} className={`p-5 rounded-2xl border bg-slate-950/40 ${cat.border}`}>
               <h4 className={`text-[10px] font-mono tracking-widest uppercase font-bold mb-4 ${cat.color}`}>{cat.title}</h4>
               <ul className="space-y-3">
                 {cat.items.map(item => (
                   <li key={item} onClick={() => setSelectedGene({ category: cat.title, item })} className="flex justify-between items-center group cursor-pointer p-1 -mx-1 rounded hover:bg-white/5 transition-colors">
                     <span className="text-xs text-gray-300 group-hover:text-white transition-colors">{item}</span>
                     <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <div className={`h-full ${cat.bgColor} rounded-full`} style={{ width: `${Math.random() * 50 + 40}%` }} />
                     </div>
                   </li>
                 ))}
               </ul>
             </div>
           ))}
         </div>
      </div>
      
      {/* Similarity Engine Section */}
      <div className="lg:col-span-4 space-y-6">
        <div className="border border-[#818cf8]/30 bg-[#030712] rounded-3xl p-6 h-full flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <Target size={120} className="text-[#818cf8]" />
           </div>
           
           <div className="relative z-10">
             <h3 className="text-[11px] font-mono font-bold tracking-widest text-[#818cf8] uppercase mb-1">Similarity Engine</h3>
             <p className="text-xs text-gray-400 mb-6">Comparative intelligence matching.</p>
             
             <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl mb-6">
               <p className="text-sm text-white font-mono leading-relaxed">
                 <span className="text-[#818cf8] font-bold">India</span> shares <span className="font-bold text-amber-400">78%</span> governance resilience traits with:
               </p>
             </div>

             <div className="space-y-3">
               {[
                 { nation: 'Japan', match: 81, color: 'text-indigo-400' },
                 { nation: 'South Korea', match: 76, color: 'text-indigo-400' },
                 { nation: 'Singapore', match: 72, color: 'text-amber-400' }
               ].map((sim) => (
                 <div key={sim.nation} className="flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-white/20 bg-slate-900/50 transition-colors cursor-pointer" onClick={() => setSelectedGene({ category: 'Comparative Details', item: sim.nation })}>
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#818cf8]" />
                     <span className="text-xs font-bold text-gray-200">{sim.nation}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className={`text-xs font-mono font-bold ${sim.color}`}>{sim.match}%</span>
                     <Compass size={14} className="text-gray-500" />
                   </div>
                 </div>
               ))}
             </div>
             
             <button onClick={handleScan} disabled={scanStatus === 'scanning'} className="w-full mt-8 py-3 rounded-xl border border-[#818cf8]/30 text-[#818cf8] hover:bg-[#818cf8]/10 text-xs font-mono font-bold transition-all uppercase tracking-wider flex justify-center items-center gap-2 disabled:opacity-50">
               {scanStatus === 'scanning' ? <Activity size={14} className="animate-spin" /> : <Search size={14} />}
               {scanStatus === 'scanning' ? 'Scanning Global Database...' : scanStatus === 'complete' ? 'Scan Generated' : 'Run Global Genomic Scan'}
             </button>
             {scanStatus === 'complete' && <div className="mt-2 text-center text-xs text-indigo-400">Genomic Baseline Sequence Generated.</div>}
           </div>
        </div>
      </div>
    </div>
  );
}

function ResilienceAnalysis() {
  return (
    <div className="border border-[#818cf8]/20 bg-[#030712] rounded-3xl p-8">
       <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
         <div>
           <h3 className="text-xl font-bold font-mono tracking-widest text-[#818cf8] uppercase mb-1">Resilience Gene Analysis</h3>
           <p className="text-xs text-gray-400">Identifying core structural antibodies preventing societal collapse.</p>
         </div>
         <span className="text-sm font-bold font-mono text-white bg-[#818cf8]/20 border border-[#818cf8]/40 px-3 py-1 rounded">Overall Index: 88.4 / 100</span>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { name: 'Redundant Power Grids', val: 94, c: 'text-indigo-400' },
           { name: 'Civic Trust Bonds', val: 62, c: 'text-amber-400' },
           { name: 'Fiscal Reserves', val: 41, c: 'text-red-400' },
           { name: 'Food Supply Autonomy', val: 89, c: 'text-indigo-400' }
         ].map(gene => (
           <div key={gene.name} className="bg-slate-950 border border-white/5 rounded-2xl p-5">
              <span className="block text-[10px] text-gray-500 font-mono tracking-wider uppercase mb-3">{gene.name}</span>
              <span className={`block text-3xl font-black font-mono mb-2 ${gene.c}`}>{gene.val}</span>
              <div className="h-1 bg-slate-900 rounded-full w-full overflow-hidden">
                 <div className={`h-full rounded-full ${gene.val > 80 ? 'bg-indigo-500' : gene.val > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${gene.val}%` }} />
              </div>
           </div>
         ))}
       </div>
    </div>
  );
}

function FragilityDetection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-red-500/20 bg-slate-950 rounded-3xl p-6">
        <h3 className="text-sm font-bold font-mono text-red-500 tracking-widest uppercase mb-4 flex items-center gap-2">
          <AlertTriangle size={16} /> Active Fragility Signatures
        </h3>
        <p className="text-[11px] text-gray-400 mb-6">Algorithm tracks patterns correlated with historical system breakdowns.</p>
        
        <ul className="space-y-3">
          <li className="bg-red-950/20 border border-red-500/10 p-4 rounded-xl flex gap-4">
             <div className="text-red-500 mt-1"><Zap size={16} /></div>
             <div>
               <span className="text-xs font-bold text-gray-200 block mb-1">Hyper-Centralization of Energy Infrastructure</span>
               <span className="text-[10px] text-red-400/70 block">Identified dependency choke points in coastal grid architecture resulting in 99% systemic failure rate during severe natural events.</span>
             </div>
          </li>
          <li className="bg-amber-950/20 border border-amber-500/10 p-4 rounded-xl flex gap-4">
             <div className="text-amber-500 mt-1"><Users size={16} /></div>
             <div>
               <span className="text-xs font-bold text-gray-200 block mb-1">Erosion of Institutional Trust Vectors</span>
               <span className="text-[10px] text-amber-400/70 block">Genetic civic signature indicates increasing polarization thresholds. Close to 1914 divergence benchmarks.</span>
             </div>
          </li>
        </ul>
      </div>
      
      <div className="border border-white/5 bg-slate-950 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[300px]">
         <Target size={40} className="text-gray-600 mb-4 opacity-50" />
         <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Threat Vector Simulation Matrix Offline</span>
      </div>
    </div>
  );
}

function HistoricalCollapseAtlas() {
  const [selectedCollapse, setSelectedCollapse] = useState<any>(null);

  const COLLAPSES = [
    {
      name: 'Roman Empire (Western)',
      era: '395 - 476 AD',
      indicators: 'Fiscal debasement, hyper-extended borders, political fragmentation, migration shock.',
      recovery: 'Transition to fragmented localized feudal stability (slow).',
      similarity: 62,
      color: 'text-amber-500',
      bg: 'bg-amber-500'
    },
    {
      name: 'Soviet Union',
      era: '1989 - 1991',
      indicators: 'Economic stagnation, ideological exhaustion, center-periphery tension, military overextension.',
      recovery: 'Oligarchic privatization, sharp mortality rate increase, rapid systemic restructuring.',
      similarity: 41,
      color: 'text-sky-500',
      bg: 'bg-sky-500'
    },
    {
      name: 'Weimar Germany',
      era: '1918 - 1933',
      indicators: 'Hyperinflation, institutional illegitimacy, political polarization, paramilitary violence.',
      recovery: 'Authoritarian consolidation leading to total systemic destruction.',
      similarity: 86,
      color: 'text-red-500',
      bg: 'bg-red-500'
    },
    {
      name: 'Yugoslavia',
      era: '1991 - 1992',
      indicators: 'Ethno-nationalist resurgence, constitutional paralysis, economic disparity between republics.',
      recovery: 'Balkanization, violent uncoupling, eventual piecemeal global integration.',
      similarity: 74,
      color: 'text-orange-500',
      bg: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
       {selectedCollapse && (
         <div className="absolute top-0 right-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800 shadow-2xl p-6 z-50 flex flex-col overflow-y-auto">
           <div className="flex justify-between items-start mb-6">
             <div>
               <h3 className="text-xl font-bold text-white mb-2">{selectedCollapse.name}</h3>
               <p className="text-sm font-mono text-gray-500 tracking-wider">ERA: {selectedCollapse.era}</p>
             </div>
             <button onClick={() => setSelectedCollapse(null)} className="text-gray-500 hover:text-white"><Activity size={18} className="rotate-45" /></button>
           </div>
           
           <div className="space-y-6">
             <div className="border border-slate-800 rounded-xl p-4 bg-slate-950">
               <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">Genomic Similarity Match</div>
               <div className={`text-3xl font-bold ${selectedCollapse.color}`}>{selectedCollapse.similarity}%</div>
             </div>
             
             <div>
               <div className="text-[10px] font-mono text-rose-500 uppercase mb-2 font-bold flex items-center gap-2"><AlertTriangle size={12}/> Collapse Indicators</div>
               <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-rose-500 pl-3">{selectedCollapse.indicators}</p>
             </div>
             
             <div>
               <div className="text-[10px] font-mono text-indigo-500 uppercase mb-2 font-bold flex items-center gap-2"><Activity size={12}/> Recovery Path</div>
               <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-indigo-500 pl-3">{selectedCollapse.recovery}</p>
             </div>
           </div>
         </div>
       )}

       <div className="lg:col-span-8 border border-[#818cf8]/20 bg-[#030712] rounded-3xl p-6 md:p-8">
         <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-4">
           <div>
             <h3 className="text-xl font-bold font-mono tracking-widest uppercase text-white flex items-center gap-2">
               <GitBranch className="text-[#818cf8]" /> Collapse Pattern Library
             </h3>
             <p className="text-xs text-gray-400 mt-2 max-w-sm">AI-driven search mapping current systemic markers against historical civilization failure points.</p>
           </div>
           
           <div className="bg-slate-900 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
             <Search size={14} className="text-gray-500" />
             <span className="text-xs font-mono text-gray-300">Searching global genome...</span>
           </div>
         </div>

         <div className="space-y-6">
           {COLLAPSES.map(col => (
             <div key={col.name} onClick={() => setSelectedCollapse(col)} className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 border-b border-white/5 pb-4">
                 <div>
                   <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{col.name}</h4>
                   <span className="text-[10px] text-gray-500 font-mono tracking-wider">{col.era}</span>
                 </div>
                 
                 <div className="flex items-center gap-2 bg-[#030712] px-3 py-1.5 rounded-lg border border-white/5">
                   <span className="text-[10px] text-gray-400 font-mono uppercase">Similarity</span>
                   <span className={`text-sm font-bold font-mono ${col.color}`}>{col.similarity}%</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 border-l-2" style={{ borderLeftColor: '#EF4444' }}>
                   <span className="block text-[10px] uppercase font-mono tracking-widest text-[#EF4444] mb-2 font-bold flex items-center gap-1.5"><AlertTriangle size={12}/> Collapse Indicators</span>
                   <p className="text-xs text-gray-300 leading-relaxed font-sans">{col.indicators}</p>
                 </div>
                 <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 border-l-2" style={{ borderLeftColor: '#818cf8' }}>
                   <span className="block text-[10px] uppercase font-mono tracking-widest text-[#818cf8] mb-2 font-bold flex items-center gap-1.5"><Activity size={12} /> Recovery Indicators</span>
                   <p className="text-xs text-gray-300 leading-relaxed font-sans">{col.recovery}</p>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>

       <div className="lg:col-span-4 space-y-6">
         <div className="bg-[#030712] border border-[#818cf8]/20 rounded-3xl p-6">
           <h3 className="text-xs font-mono text-white font-bold tracking-widest uppercase mb-4 border-b border-white/5 pb-2">Pattern Alignment</h3>
           <p className="text-[11px] text-gray-400 mb-6 font-sans leading-relaxed">
             The engine currently detects a high overlap with <span className="text-white font-bold">Weimar Germany</span> due to institutional illegitimacy markers intersecting with rapid inflation.
           </p>

           <div className="space-y-4">
              <div className="bg-slate-950 border border-red-500/20 p-4 rounded-xl">
                 <div className="flex justify-between text-xs mb-2">
                   <span className="font-mono text-red-400">Institutional Illegitimacy</span>
                   <span className="font-bold text-red-500">92%</span>
                 </div>
                 <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                   <div className="bg-red-500 h-full w-[92%]" />
                 </div>
              </div>
              <div className="bg-slate-950 border border-amber-500/20 p-4 rounded-xl">
                 <div className="flex justify-between text-xs mb-2">
                   <span className="font-mono text-amber-400">Inflation Exhaustion</span>
                   <span className="font-bold text-amber-500">84%</span>
                 </div>
                 <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                   <div className="bg-amber-500 h-full w-[84%]" />
                 </div>
              </div>
              <div className="bg-slate-950 border border-sky-500/20 p-4 rounded-xl">
                 <div className="flex justify-between text-xs mb-2">
                   <span className="font-mono text-sky-400">Military Overextension</span>
                   <span className="font-bold text-sky-500">41%</span>
                 </div>
                 <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                   <div className="bg-sky-500 h-full w-[41%]" />
                 </div>
              </div>
           </div>

           <button className="w-full text-[10px] font-mono tracking-widest uppercase text-white bg-[#818cf8]/20 hover:bg-[#818cf8]/30 border border-[#818cf8]/40 py-3 rounded-xl mt-6 transition-colors">
              Generate Defensive Policies
           </button>
         </div>
       </div>
    </div>
  );
}
